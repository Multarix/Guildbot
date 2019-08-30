exports.run = (client, message, args, level) => {
	return;
};

exports.conf = {
	enabled: false,
	guildOnly: true,
	aliases: ["discord"],
	permLevel: 0,
};

exports.help = {
	name: "vckick",
	category: "Moderation",
	description: "Kicks a user from voice",
	usage: "vckick](<..user>)",
};
