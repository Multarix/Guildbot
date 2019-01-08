exports.run = async (client, message, args, level) => {
	const defined = args.join("+");

	if(!defined) return message.channel.send("Usage: [define](<..word>)", { code: "markdown" });

	message.channel.send(`http://www.dictionary.com/browse/${defined}`).catch(console.error);
};

exports.conf = {
	enabled: true,
	guildOnly: false,
	aliases: [],
	permLevel: 0,
};

exports.help = {
	name: "define",
	category: "Misc",
	description: "Defines a given word from Dictionary.com",
	usage: "define](<..word>)",
};
