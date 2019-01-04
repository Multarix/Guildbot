exports.run = async (client, message, args, level) => {
	message.delete();
	message.channel.send(args.join(" "));
};

exports.conf = {
	enabled: true,
	guildOnly: false,
	aliases: [],
	permLevel: 1,
};

exports.help = {
	name: "echo",
	category: "Misc",
	description: "Repeats what you say",
	usage: "echo](<..variable>)",
};
