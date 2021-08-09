const Discord = require("discord.js");
const delMsg = require("./delMsg.js");
exports.edit = async (client, message, args, data, info) => {

	const embed = new Discord.MessageEmbed()
		.setColor(info.color)
		.setTitle("Starboard")
		.setFooter(client.user.tag, client.user.displayAvatarURL);

	const channelMention = grabChannel(args[2]);
	let channel = message.channel;
	if(channelMention) channel = channelMention;

	if(channel.id === data.starboard){
		embed.addField("Channel Already Set", `${channel} is already set as the starboard.
		You can delete this setting by doing:
		\`\`\`md
		${data.prefix}config delete starboard
		\`\`\``.removeIndents());
		return message.channel.send({ embeds: [embed] });
	}

	sqlRun(`UPDATE settings SET starboard = ? WHERE guild = ?`, channel.id, message.guild.id);
	client.log(`"${message.guild.name}" set their Starboard to "${channel.name}" (${channel.id})`, `SQL`);

	embed.addField("Setting Saved", `The starboard has been set to ${channel}.
	You can delete this setting by doing:
	\`\`\`md
	${data.prefix}config delete starboard
	\`\`\``.removeIndents());

	const m = await message.channel.send({ embeds: [embed] });
	return await delMsg(client, message, m);
};

exports.delete = async (client, message, args, data, info) => {

	const embed = new Discord.MessageEmbed()
		.setColor(info.color)
		.setTitle("Starboard")
		.setFooter(client.user.tag, client.user.displayAvatarURL);

	if(!data.starboard){
		embed.addField("Already Disabled", "The starboard is already disabled and therefore cannot be removed.");
		return message.channel.send({ embeds: [embed] });
	}
	sqlRun(`UPDATE settings SET starboard = null WHERE guild = ?`, message.guild.id);
	client.log(`"${message.guild.name}" removed their starboard`, `SQL`);

	embed.addField("Deleted Setting", "The starboard has been removed.");
	const m = await message.channel.send({ embeds: [embed] });
	return await delMsg(client, message, m);
};
