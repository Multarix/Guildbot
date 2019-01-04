exports.run = async (client, message, args, level) => {
	const good = client.emojis.get("340357918996299778");
	const defined = args.join("+");

	message.react(good);
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
	usage: "define](<..variable>)",
};
