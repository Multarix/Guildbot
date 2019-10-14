exports.run = async (client, message, args) => {

	await message.channel.send(`Are you sure you want to reset everybody in the server to \`0\` points?\n \`Y\`/\`N\``);
	const filter = m => m.author.id === message.author.id && m.content.toLowerCase() === "yes" || m.author.id === message.author.id && m.content.toLowerCase() === "y" || m.author.id === message.author.id && m.content.toLowerCase() === "no" || m.author.id === message.author.id && m.content.toLowerCase() === "n";
	const collected = await message.channel.awaitMessages(filter, { max: 1, time: 15000, errors: ['time'] }).catch(() => { message.channel.send("Command Canceled."); return undefined; });
	if(!collected) return;

	const msg = collected.first().content;
	if(msg.toLowerCase() === "yes" || msg.toLowerCase() === "y"){
		await message.channel.send("Working...");
		wait(1000);
		const data = await sql.run(`UPDATE pointTable SET points = 0 WHERE guildID = "${message.guild.id}"`);
		client.log(`Reset all users points in the "${message.guild.name}" (${message.guild.id}) server`, "SQL");
		return await msg.edit(`Points updated. \`${data.changes}\` users now have \`0\` points.`);
	}

	if(msg.toLowerCase() === "no" || msg.toLowerCase() === "n"){
		return message.channel.send("Command Canceled.");
	}
};

exports.conf = {
	enabled: true,
	allowDM: false,
	aliases: ["pointreset", "pointsreset", "resetpoints", "resetpoint", "rp"],
	permLevel: 10,
};

exports.help = {
	name: "pr",
	category: "Moderation",
	description: "Reset the amount of points all users on a server has",
	usage: "..",
};
