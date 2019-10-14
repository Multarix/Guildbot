const leetKey = require("../objects/1337Key.json");
exports.run = (client, message, args) => {

	const joinargs = args.join(" ");
	if(!joinargs) return message.channel.send("Usage: [leet](<..text>)", { code: "markdown" });

	const s = joinargs.split("");

	let newStr = "";
	s.forEach(letter => {
		newStr += (leetKey[letter]) ? leetKey[letter] : letter;
	});
	message.channel.send(newStr, { code: "markdown" });
};

exports.conf = {
	enabled: true,
	allowDM: true,
	aliases: ["1337", "l33t"],
	permLevel: 1,
};

exports.help = {
	name: "leet",
	category: "Misc",
	description: "1337 5pe4k 47 17'5 f1ne57",
	usage: "text",
};
