exports.run = (client, message, args, level) => {

	const joinargs = args.join(" ");
	if(!joinargs) return message.channel.send("Usage: [cancer](<..text>)", { code: "markdown" });
	const s = joinargs.toLowerCase().split("");

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
	permLevel: 1,
};

exports.help = {
	name: "cancer",
	category: "Misc",
	description: "lIteRal CaNcEr",
	usage: "cancer](<..text>)",
};
