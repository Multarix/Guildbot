exports.run = (client, message, args) => {
	message.channel.send("https://status.discordapp.com/");
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: ["discord"],
	permLevel: 0,
};

exports.help = {
	name: "server",
	category: "Misc",
	description: "Posts the discord server link page",
	usage: "..",
};
