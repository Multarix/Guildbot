const sql = require("sqlite");
const Discord = require("discord.js");
const delMsg = require("./delMsg.js");
exports.edit = async (client, message, args, data) => {
	const channelMention = grabChannel(args[2]);
	let channel = message.channel;
	if(channelMention) channel = channelMention;

	if(channel.id === data.joinChannel) return message.channel.send(`${channel} is already set as the welcome channel.\n\nYou can delete this setting by doing:\n\`\`\`md\n[config](delete) wmc\n\`\`\``);
	await sql.get(`UPDATE settings SET joinChannel = "${channel.id}" WHERE guild = "${message.guild.id}"`);
	client.log(`"${message.guild.name}" set their welcome message channel to "${channel.name}" (${channel.id})`, `SQL`);
	const m = await message.channel.send(`The welcome message channel has been set to ${channel}.\n\nYou can delete this setting by doing:\n\`\`\`md\n[config](delete) wmc\n\`\`\``);
	return await delMsg(client, message, m);
};

exports.delete = async (client, message, args, data) => {
	if(!data.joinChannel) return message.channel.send("The welcome message channel is already disabled and therefore cannot be removed.");
	await sql.get(`UPDATE settings SET joinChannel = null WHERE guild = "${message.guild.id}"`);
	client.log(`"${message.guild.name}" removed their welcome message channel`, `SQL`);
	const m = await	message.channel.send("The welcome message channel has been removed.");
	return await delMsg(client, message, m);
};
