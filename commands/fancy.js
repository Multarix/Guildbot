const fancyKey = require("../objects/fancyKey.json");
exports.run = (client, message, args) => {

	const joinargs = args.join(" ");
	if(!joinargs) return message.channel.send("Usage: [fancy](<..text>)", { code: "markdown" });

	const s = joinargs.split("");

	let newStr = "";
	let i;
	for(i = 0;i < s.length; i++){
		if(fancyKey[s[i]]){
			newStr += fancyKey[s[i]];
		} else {
			newStr += s[i];
		}
	}
	message.channel.send(newStr, { code: "markdown" });
};

exports.conf = {
	enabled: true,
	guildOnly: false,
	aliases: [],
	permLevel: 1,
};

exports.help = {
	name: "fancy",
	category: "Misc",
	description: "Converts words into fancy text",
	usage: "text",
};
