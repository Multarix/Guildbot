const Discord = require("discord.js");
const delMsg = require("./delMsg.js");
exports.edit = async (client, message, args, data) => {
	const joinMsg = args.slice(2).join(" ").replace(/\u200b/g, "\n");
	if(!joinMsg){
		const str = `Usage: [config](set) joinmessage < message you want >\n
		Handy Tips:
		-----------
		If you put '<@user>' anywhere in the message, it will be converted to a mention of that user.
		If you put '<user>' anywhere in the message, it will be converted to that users username.`;
		return message.channel.send(str.replace(/\n(\t+)/g, ""), { code: "markdown" });
	}
	sqlRun(`UPDATE settings SET joinMsg = ? WHERE guild = ?`, sanity(joinMsg), message.guild.id);
	client.log(`"${message.guild.name}" set their welcome message`, `SQL`);
	const joinExample = joinMsg.replace(/<@user>/g, client.user).replace(/<user>/g, client.user.username);
	message.channel.send(`The welcome message has been saved. An example of your message is below:\n${joinExample}`);
};

exports.delete = async (client, message, args, data) => {
	if(!data.joinMsg) return message.channel.send("The welcome message is already disabled and therefore cannot be removed.");
	sqlRun(`UPDATE settings SET joinMsg = null WHERE guild = ?`, message.guild.id);
	client.log(`"${message.guild.name}" removed their welcome message`, `SQL`);
	const m = await message.channel.send("The welcome message has been removed.");
	return await delMsg(client, message, m);
};
