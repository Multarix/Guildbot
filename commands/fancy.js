exports.run = (client, message, args, level) => {

	const good = client.emojis.get("340357918996299778");
	const bad = client.emojis.get("340357882606256137");

	const fancyKey = require("../objects/fancyKey.json");
	const joinargs = args.join(" ");

	if(!joinargs){
		return message.react(bad);
	}
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
	message.react(good);
	message.channel.send(`\`\`\`md\n${newStr}\n\`\`\``);
};

exports.conf = {
	enabled: true,
	guildOnly: false,
	aliases: [],
	permLevel: 0,
};

exports.help = {
	name: "fancy",
	category: "Misc",
	description: "Converts words into fancy text",
	usage: "fancy](<..text>)",
};
