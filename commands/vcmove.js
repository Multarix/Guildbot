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
	name: "vcmove",
	category: "Moderation",
	description: "Moves a user to a specific voice channel",
	usage: "<..user> <..channel-name>",
};
