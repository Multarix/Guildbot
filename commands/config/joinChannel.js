const Discord = require("discord.js");
const delMsg = require("./delMsg.js");
exports.edit = async (client, message, args, data, info) => {

	const embed = new Discord.MessageEmbed()
		.setColor(info.color)
		.setTitle("Welcome Channel")
		.setFooter(client.user.tag, client.user.displayAvatarURL);

	const channelMention = grabChannel(args[2]);
	let channel = message.channel;
	if(channelMention) channel = channelMention;

	if(channel.id === data.joinChannel){
		embed.addField("Channel Already Set", `${channel} is already set as the welcome channel.
		You can delete this setting by doing:
		\`\`\`md
		${data.prefix}config delete joinchannel
		\`\`\``.removeIndents());
		return message.channel.send({ embeds: [embed] });
	}

	sqlRun(`UPDATE settings SET joinChannel = ? WHERE guild = ?`, channel.id, message.guild.id);
	client.log(`"${message.guild.name}" set their welcome message channel to "${channel.name}" (${channel.id})`, `SQL`);

	embed.addField("Setting Saved", `The welcome channel has been set to ${channel}.
	You can delete this setting by doing:
	\`\`\`md
	${data.prefix}config delete joinchannel
	\`\`\``.removeIndents());

	const m = await message.channel.send({ embeds: [embed] });
	return await delMsg(client, message, m);
};

exports.delete = async (client, message, args, data, info) => {

	const embed = new Discord.MessageEmbed()
		.setColor(info.color)
		.setTitle("Welcome Channel")
		.setFooter(client.user.tag, client.user.displayAvatarURL);

	if(!data.joinChannel){
		embed.addField("Already Disabled", "The welcome channel is already disabled and therefore cannot be removed.");
		return message.channel.send({ embeds: [embed] });
	}
	sqlRun(`UPDATE settings SET joinChannel = null WHERE guild = ?`, message.guild.id);
	client.log(`"${message.guild.name}" removed their welcome channel`, `SQL`);

	embed.addField("Deleted Setting", "The welcome channel has been removed.");
	const m = await	message.channel.send({ embeds: [embed] });
	return await delMsg(client, message, m);
};
