const sql = require("sqlite");

exports.run = async (client, message, args, level) => {
	message.channel.send(`Are you sure you want to reset everybody in the server to \`0\` points?\n \`Y\`/\`N\``).then(() => {
		const filter = m => m.author.id === message.author.id && m.content.toLowerCase() === "yes" || m.author.id === message.author.id && m.content.toLowerCase() === "y" || m.author.id === message.author.id && m.content.toLowerCase() === "no" || m.author.id === message.author.id && m.content.toLowerCase() === "n";
		message.channel.awaitMessages(filter, { max: 1, time: 15000, errors: ['time'] }).then((collected) => {
			const msg = collected.first().content;
			if(msg.toLowerCase() === "yes" || msg.toLowerCase() === "y"){
				message.channel.send("Working...").then(msg => {
					wait(1000);
					sql.run(`UPDATE pointTable SET points = 0 WHERE guildID = "${message.guild.id}"`).then(data => {
						client.log(`Reset all users points in the "${message.guild.name}" (${message.guild.id}) server`, "SQL");
						msg.edit(`Points updated. \`${data.changes}\` users now have \`0\` points.`);
					});
				});
				return;
			}
			if(msg.toLowerCase() === "no" || msg.toLowerCase() === "n"){
				return message.channel.send("Command Canceled.");
			}
		}).catch(() => {
			message.channel.send("Command Canceled.");
		});
	});
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: ["pointreset", "pointsreset", "resetpoints", "resetpoint", "rp"],
	permLevel: 10,
};

exports.help = {
	name: "pr",
	category: "Moderation",
	description: "Reset the amount of points all users on a server has",
	usage: "pe](<..user>)",
};
