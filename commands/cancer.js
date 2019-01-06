exports.run = (client, message, args, level) => {

	const s = args.join(" ").toLowerCase().split("");
	let newStr = "";
	let i;
	for(i = 0;i < s.length; i++){
		if(Math.random() >= 0.5){
			const upperStr = s[i].toUpperCase();
			newStr += upperStr;
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
	permLevel: 0,
};

exports.help = {
	name: "cancer",
	category: "Misc",
	description: "lIteRal CaNcEr",
	usage: "cancer](<..words>)",
};
