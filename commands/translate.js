const translate = require("@vitalets/google-translate-api");

exports.run = async (client, message, args) => {
	const lang = args.shift();
	const str = args.join(" ");
	if(!lang) return message.channel.send("Language not specified");
	if(!str) return message.channel.send("Cannot translate what doesn't exist.");
	let res;
	try {
		res = await translate(str, { from: "auto", to: lang });
		return message.channel.send(`${res.text}`);
	} catch(err) { return message.channel.send(err.message); }
};

exports.conf = {
	enabled: true,
	guildOnly: false,
	aliases: ["trans"],
	permLevel: 0,
};

exports.help = {
	name: "translate",
	category: "Misc",
	description: "Translate stuff. For a list of the language iso's, check here:\nhttps://www.sitepoint.com/iso-2-letter-language-codes/",
	usage: "language text",
};
