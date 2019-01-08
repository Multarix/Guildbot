exports.run = (client, message, args, level) => {
	const internet = args.join("+");

	if(!internet) return message.channel.send("Usage: [urban](<..word>)", { code: "markdown" });

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
	usage: "urban](<..word>)",
};
