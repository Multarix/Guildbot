exports.run = (client, message, args) => {

	const joinargs = args.join(" ");
	if(!joinargs) return message.channel.send("Usage: [cancer](<..text>)", { code: "markdown" });

	const s = joinargs.toLowerCase().split("");

	let newStr = "";
	s.forEach(letter => {
		newStr += (Math.random() > 0.5) ? letter.toUpperCase() : letter;
	});
	message.channel.send(newStr, { code: "markdown" });
};

exports.conf = {
	enabled: true,
	allowDM: true,
	aliases: [],
	permLevel: 1,
};

exports.help = {
	name: "cancer",
	category: "Misc",
	description: "lIteRal CaNcEr",
	usage: "text",
};
