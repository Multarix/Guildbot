const sql = require("sqlite");
const Discord = require("discord.js");
const delMsg = require("./delMsg.js");
exports.edit = async (client, message, args, data) => {
	if(!args[2]) return message.channel.send(`Usage:\n[config](set) prefix < new prefix >`, { code: "markdown" });
	if(args[2] === data.prefix) return message.channel.send(`The prefix is already set to \`${data.prefix}\``);

	sqlRun(`UPDATE settings SET prefix = ? WHERE guild = ?`, sanity(args[2]), message.guild.id);
	client.log(`"${message.guild.name}" changed their prefix to '${args[2]}'`, `SQL`);
	const m = await message.channel.send(`Prefix has been set to \`${args[2]}\`\n\nYou can delete this setting by doing:\n\`\`\`md\n[config](delete) prefix\n\`\`\``);
	return await delMsg(client, message, m);
};

exports.delete = async (client, message, args, data) => {
	if(data.prefix === client.config.prefix) return message.channel.send("Your prefix is already set to default, therefore cannot be reset.");
	sqlRun(`UPDATE settings SET prefix = ? WHERE guild = ?`, client.config.prefix, message.guild.id);
	client.log(`"${message.guild.name}" changed their prefix to "${client.config.prefix}"`, `SQL`);
	const m = await message.channel.send(`Your prefix has been reset to \`${client.config.prefix}\``);
	return await delMsg(client, message, m);
};
