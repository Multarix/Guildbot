const Discord = require("discord.js");
const delMsg = require("./delMsg.js");
exports.edit = async (client, message, args, data, info) => {

	const embed = new Discord.MessageEmbed()
		.setColor(info.color)
		.setTitle("Emoji Channel")
		.setFooter(client.user.tag, client.user.displayAvatarURL);

	const channelMention = grabChannel(args[2]);
	let channel = message.channel;
	if(channelMention) channel = channelMention;

	if(channel.id === data.emojiChannel){
		embed.addField("Channel Already Set", `New emojis are already being announced in ${channel}.
		You can delete this setting by doing:
		\`\`\`md
		${data.prefix}config delete emoji
		\`\`\``.removeIndents());
		return message.channel.send({ embed });
	}

	sqlRun(`UPDATE settings SET emojiChannel = ? WHERE guild = ?`, channel.id, message.guild.id);
	client.log(`"${message.guild.name}" set their emoji channel to "${channel.name}" (${channel.id})`, `SQL`);

	embed.addField("Setting Saved", `New emojis will be announced in ${channel}.
	You can delete this setting by doing:
	\`\`\`md
	${data.prefix}config delete emoji
	\`\`\``.removeIndents());

	const m = await	message.channel.send({ embed });
	return await delMsg(client, message, m);
};

exports.delete = async (client, message, args, data, info) => {

	const embed = new Discord.MessageEmbed()
		.setColor(info.color)
		.setTitle("Emoji Channel")
		.setFooter(client.user.tag, client.user.displayAvatarURL);

	if(!data.emojiChannel){
		embed.addField("Already Disabled", "The emoji channel is already disabled and therefore cannot be removed.");
		return message.channel.send({ embed });
	}
	sqlRun(`UPDATE settings SET emojiChannel = null WHERE guild = ?`, message.guild.id);
	client.log(`"${message.guild.name}" removed their emoji channel`, `SQL`);

	embed.addField("Deleted Setting", "The emoji announcement channel has been disabled.");
	const m = await message.channel.send({ embed });
	return await delMsg(client, message, m);
};
