const Discord = require("discord.js");
const delMsg = require("./delMsg.js");
exports.edit = async (client, message, args, data, info) => {

	const embed = new Discord.MessageEmbed()
		.setColor(info.color)
		.setTitle(`${info.sqlName.toProperCase()} Role`)
		.setFooter(client.user.tag, client.user.displayAvatarURL);

	const roleMention = grabRole(args[2], message.guild);

	if(!roleMention){
		embed.addField("No Role Mentioned", `No role was mentioned. Usage:
		\`\`\`md
		${data.prefix}config set ${info.sqlName}
		\`\`\``.removeIndents());
		return message.channel.send({ embed });
	}
	if(roleMention.id === data[info.sqlName]){
		embed.addField("Role Already Set",
			`That role is already the \`${info.sqlName.toProperCase()}\` role.
			You can delete this setting by doing:
			\`\`\`md
			${data.prefix}config set ${info.sqlName}
			\`\`\``.removeIndents());
		return message.channel.send({ embed });
	}
	sqlRun(`UPDATE settings SET ${info.sqlName} = ? WHERE guild = ?`, roleMention.id, message.guild.id);
	client.log(`"${message.guild.name}" changed their ${info.sqlName.toProperCase()} role to "@${roleMention.name}" (${roleMention.id})`, "SQL");

	embed.addField("Setting Saved", `Your permission settings have been updated.
		\`@${roleMention.name}\` is now the \`${info.sqlName.toProperCase()}\` role.
		You can delete this setting by doing:
		\`\`\`md
		${data.prefix}config delete ${info.sqlName}
		\`\`\``.removeIndents());

	const m = await message.channel.send({ embed });
	return await delMsg(client, message, m);
};

exports.delete = async (client, message, args, data, info) => {

	const embed = new Discord.MessageEmbed()
		.setColor(info.color)
		.setTitle(`${info.sqlName.toProperCase()} Role`)
		.setFooter(client.user.tag, client.user.displayAvatarURL);

	if(!data[info.sqlName]){
		embed.addField("Already Disabled", `The \`${info.sqlName.toProperCase()}\` role is already disabled and therefore cannot be removed.`);
		return message.channel.send({ embed });
	}
	sqlRun(`UPDATE settings SET ${info.sqlName} = null WHERE guild = ?`, message.guild.id);
	client.log(`"${message.guild.name}" removed their ${info.sqlName.toProperCase()} role`, "SQL");

	embed.addField("Deleted Setting",
		`Your permission settings have been updated.
		The \`${info.sqlName.toProperCase()}\` role has been removed`.removeIndents());
	const m = await message.channel.send({ embed });
	return await delMsg(client, message, m);
};
