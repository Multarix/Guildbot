const fancyKey = require("../objects/fancyKey.json");
exports.run = (client, message, args) => {

	const joinargs = args.join(" ");
	if(!joinargs) return message.channel.send("Usage: [fancy](<..text>)", { code: "markdown" });

	const s = joinargs.split("");

	let newStr = "";
	s.forEach(letter => {
		newStr += (fancyKey[letter]) ? fancyKey[letter] : letter;
	});
	message.channel.send(newStr, { code: "markdown" });
};

exports.conf = {
	enabled: true,
	allowDM: true,
	aliases: [],
	permLevel: 1
};

exports.help = {
	name: "fancy",
	category: "Misc",
	description: "Converts words into fancy text",
	usage: "text"
};
