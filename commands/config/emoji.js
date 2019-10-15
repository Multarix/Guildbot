const Discord = require("discord.js");
const delMsg = require("./delMsg.js");
exports.edit = async (client, message, args, data) => {
	const channelMention = grabChannel(args[2]);
	let channel = message.channel;
	if(channelMention) channel = channelMention;

	if(channel.id === data.emojiChannel) return message.channel.send(`${channel} new emoji will already be announced in this channel.\n\nYou can delete this setting by doing:\n\`\`\`md\n[config](delete) emoji\n\`\`\``);
	sqlRun(`UPDATE settings SET emojiChannel = ? WHERE guild = ?`, channel.id, message.guild.id);
	client.log(`"${message.guild.name}" set their emoji channel to "${channel.name}" (${channel.id})`, `SQL`);
	const m = await	message.channel.send(`New emojis will be announced in ${channel}.\n\nYou can delete this setting by doing:\n\`\`\`md\n[config](delete) emoji\n\`\`\``);
	return await delMsg(client, message, m);
};

exports.delete = async (client, message, args, data) => {
	if(!data.emojiChannel) return message.channel.send("The emoji channel is already disabled and therefore cannot be removed.");
	sqlRun(`UPDATE settings SET emojiChannel = null WHERE guild = ?`, message.guild.id);
	client.log(`"${message.guild.name}" removed their emoji channel`, `SQL`);
	const m = await message.channel.send("The emoji announcement channel has been removed.");
	return await delMsg(client, message, m);
};
