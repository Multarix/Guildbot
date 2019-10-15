const Discord = require("discord.js");
const delMsg = require("./delMsg.js");
exports.edit = async (client, message, args, data) => {
	const leaveMsg = args.slice(2).join(" ").replace(/\u200b/g, "\n");
	if(!leaveMsg){
		const str = `Usage: [config](set) leavemessage < message you want >
		Handy Tips:
		-----------
		If you put '<@user>' anywhere in the message, it will be converted to a mention of that user.
		If you put '<user>' anywhere in the message, it will be converted to that users username.`;
		return message.channel.send(str.replace(/\n(\t+)/g, ""), { code: "markdown" });
	}
	sqlRun(`UPDATE settings SET leaveMsg = ? WHERE guild = ?`, sanity(leaveMsg), message.guild.id);
	client.log(`"${message.guild.name}" set their goodbye message`, `SQL`);
	const leaveExample = leaveMsg.replace(/<@user>/g, client.user).replace(/<user>/g, client.user.username);
	message.channel.send(`The goodbye message has been saved. An example of your message is below:\n${leaveExample}`);
};

exports.delete = async (client, message, args, data) => {
	if(!data.leaveMsg) return message.channel.send("The goodbye message is already disabled and therefore cannot be removed.");
	sqlRun(`UPDATE settings SET leaveMsg = null WHERE guild = ?`, message.guild.id);
	client.log(`"${message.guild.name}" removed their goodbye message`, `SQL`);
	const m = await message.channel.send("The goodbye message has been removed.");
	return await delMsg(client, message, m);
};
