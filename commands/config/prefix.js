const Discord = require("discord.js");
const delMsg = require("./delMsg.js");
exports.edit = async (client, message, args, data, info) => {

	const embed = new Discord.MessageEmbed()
		.setColor(info.color)
		.setTitle("Prefix")
		.setFooter(client.user.tag, client.user.displayAvatarURL);

	if(!args[2]){
		embed.addField("No Prefix Defined", `${data.prefix}config set prefix <prefix>`);
		return await message.channel.send({ embed });
	}

	if(args[2] === data.prefix){
		embed.addField("Prefix Already Set", `The prefix is already set to \`${data.prefix}\``);
		return message.channel.send({ embed });
	}

	sqlRun(`UPDATE settings SET prefix = ? WHERE guild = ?`, sanity(args[2]), message.guild.id);
	client.log(`"${message.guild.name}" changed their prefix to '${args[2]}'`, `SQL`);

	embed.addField("Setting Saved", `Prefix has been set to \`${args[2]}\`
	You can reset this setting by doing:
	\`\`\`md
	config delete prefix
	\`\`\``.removeIndents());

	const m = await message.channel.send(`Prefix has been set to \`${args[2]}\`\n\nYou can delete this setting by doing:\n\`\`\`md\n[config](delete) prefix\n\`\`\``);
	return await delMsg(client, message, m);
};

exports.delete = async (client, message, args, data, info) => {

	const embed = new Discord.MessageEmbed()
		.setColor(info.color)
		.setTitle("Prefix")
		.setFooter(client.user.tag, client.user.displayAvatarURL);

	if(data.prefix === client.config.prefix){
		embed.addField("Already Default", "Your prefix is already set to default, therefore cannot be reset.");
		return message.channel.send({ embed });
	}
	sqlRun(`UPDATE settings SET prefix = ? WHERE guild = ?`, client.config.prefix, message.guild.id);
	client.log(`"${message.guild.name}" changed their prefix to "${client.config.prefix}"`, `SQL`);

	embed.addField("Reset Setting", `Your prefix has been reset to \`${client.config.prefix}\``);
	const m = await message.channel.send({ embed });
	return await delMsg(client, message, m);
};
