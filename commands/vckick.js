exports.run = (client, message, args) => {
	return;
};

exports.conf = {
	enabled: false,
	allowDM: false,
	aliases: ["discord"],
	permLevel: 0,
};

exports.help = {
	name: "vckick",
	category: "Moderation",
	description: "Kicks a user from voice",
	usage: "vckick](<..user>)",
};
