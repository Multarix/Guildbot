const sql = require("sqlite");
const Discord = require("discord.js");
const delMsg = require("./delMsg.js");
exports.edit = async (client, message, args, data) => {
	const channelMention = grabChannel(args[2]);
	let channel = message.channel;
	if(channelMention) channel = channelMention;

	if(channel.id === data.starboard) return message.channel.send(`The channel is already set as the starboard.\n\nYou can delete this setting by doing:\n\`\`\`md\n[config](delete) starboard\n\`\`\``);
	sqlRun(`UPDATE settings SET starboard = ? WHERE guild = ?`, channel.id, message.guild.id);
	client.log(`"${message.guild.name}" set their Starboard to "${channel.name}" (${channel.id})`, `SQL`);
	message.channel.send(`The \`${channel.name}\` channel will be used as the starboard.\n\nYou can delete this setting by doing:\n\`\`\`md\n[config](delete) starboard\n\`\`\``);
};

exports.delete = async (client, message, args, data) => {
	if(!data.starboard) return message.channel.send("The Starboard is not currently set and therefore cannot be removed.");
	sqlRun(`UPDATE settings SET starboard = null WHERE guild = ?`, message.guild.id);
	const m = await message.channel.send("The Starboard has been removed.");
	return await delMsg(client, message, m);
};
