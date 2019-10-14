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
	name: "vcmove",
	category: "Moderation",
	description: "Moves a user to a specific voice channel",
	usage: "<..user> <..channel-name>",
};
