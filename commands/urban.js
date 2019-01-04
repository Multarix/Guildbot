exports.run = (client, message, args, level) => {
	const good = client.emojis.get("340357918996299778");
	const internet = args.join("+");

	message.react(good);
	message.channel.send(`http://www.urbandictionary.com/define.php?term=${internet}`).catch(console.error);
};

exports.conf = {
	enabled: true,
	guildOnly: false,
	aliases: ["ud"],
	permLevel: 0,
};

exports.help = {
	name: "urban",
	category: "Misc",
	description: "Defines a given word from UrbanDictionary.com",
	usage: "urban](<..variable>)",
};
