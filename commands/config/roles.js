const sql = require("sqlite");
const Discord = require("discord.js");
const delMsg = require("./delMsg.js");
exports.edit = async (client, message, args, data, info) => {
	const roleMention = grabRole(args[2], message.guild);

	if(!roleMention) return message.channel.send(`No role was mentioned. Usage:\n[config](set) < admin/member/moderator > <@role>`, { code: "markdown" });
	if(roleMention.id === data[info.sqlName]) return message.channel.send(`That role is already the \`${info.sqlName.toProperCase()}\` role.\n\nYou can delete this setting by doing:\n\`\`\`md\n[config](delete) ${info.sqlName.toProperCase()}\`\`\``);

	sqlRun(`UPDATE settings SET ? = ? WHERE guild = ?`, info.sqlName, roleMention.id, message.guild.id);
	client.log(`"${message.guild.name}" changed their ${info.sqlName.toProperCase()} role to "@${roleMention.name}" (${roleMention.id})`, "SQL");
	const m = await message.channel.send(`Your permission settings have been updated.\n\`@${roleMention.name}\` is now the \`${info.sqlName.toProperCase()}\` role.\n\nYou can delete this setting by doing:\n\`\`\`md\n[config](delete) ${info.sqlName.toProperCase()}\`\`\``);
	return await delMsg(client, message, m);
};

exports.delete = async (client, message, args, data, info) => {
	if(!data[info.sqlName]) return message.channel.send(`The \`${info.sqlName.toProperCase()}\` role is already disabled and therefore cannot be removed.`);
	sqlRun(`UPDATE settings SET ? = null WHERE guild = ?`, info.sqlName, message.guild.id);
	client.log(`"${message.guild.name}" removed their ${info.sqlName.toProperCase()} role`, "SQL");
	const m = await message.channel.send(`Your permission settings have been updated.\nThe \`${info.sqlName.toProperCase()}\` role has been removed`);
	return await delMsg(client, message, m);
};
