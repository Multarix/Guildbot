exports.run = (client, message, args, level) => {
	const leetKey = require("../objects/1337Key.json");

	const joinargs = args.join(" ");
	if(!joinargs) return message.channel.send("Usage: [fancy](<..text>)", { code: "markdown" });

	const s = joinargs.split("");

	let newStr = "";
	let i;
	for(i = 0;i < s.length; i++){
		if(leetKey[s[i]]){

			newStr += leetKey[s[i]];
		} else {
			newStr += s[i];
		}
	}
	message.channel.send(newStr, { code: "markdown" });
};

exports.conf = {
	enabled: true,
	guildOnly: false,
	aliases: ["1337", "l33t"],
	permLevel: 0,
};

exports.help = {
	name: "leet",
	category: "Misc",
	description: "1337 5pe4k 47 17'5 f1ne57",
	usage: "leet](<..text>)",
};
