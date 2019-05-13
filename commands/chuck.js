const chuck = require("../objects/chuck.json");
exports.run = (client, message, args, level) => {

	const fact = Math.floor(Math.random() * chuck.length);
	message.channel.send(chuck[fact]);
};

exports.conf = {
	enabled: true,
	guildOnly: false,
	aliases: ["norris", "chucknorris", "cn"],
	permLevel: 0,
};

exports.help = {
	name: "chuck",
	category: "Misc",
	description: "Posts a random chuck norris fact",
	usage: "..",
};
