const sql = require("sqlite");
const Discord = require("discord.js");
const delMsg = require("./delMsg.js");
exports.edit = async (client, message, args, data) => {
	const channelMention = grabChannel(args[2]);
	let channel = message.channel;
	if(channelMention) channel = channelMention;

	if(channel.id === data.leaveChannel) return message.channel.send(`${channel} is already set as the goodbye channel.\n\nYou can delete this setting by doing:\n\`\`\`md\n[config](delete) lmc\n\`\`\``);
	sqlRun(`UPDATE settings SET leaveChannel = ? WHERE guild = ?`, channel.id, message.guild.id);
	client.log(`"${message.guild.name}" set their goodbye channel to "${channel.name}" (${channel.id})`, `SQL`);
	const m = await	message.channel.send(`The goodbye channel has been set to ${channel}.\n\nYou can delete this setting by doing:\n\`\`\`md\n[config](delete) lmc\n\`\`\``);
	return await delMsg(client, message, m);
};

exports.delete = async (client, message, args, data) => {
	if(!data.leaveChannel) return message.channel.send("The goodbye channel is already disabled and therefore cannot be removed.");
	sqlRun(`UPDATE settings SET leaveChannel = null WHERE guild = ?`, message.guild.id);
	client.log(`"${message.guild.name}" removed their goodbye channel`, `SQL`);
	const m = await message.channel.send("The goodbye channel has been removed.");
	return await delMsg(client, message, m);
};
