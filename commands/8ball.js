const predict = require("../objects/8ball.json");
const Discord = require("discord.js");
exports.run = async (client, message, args) => {

	const joinargs = args.join(" ");
	if(!joinargs) return message.channel.send("Usage: [8ball](<..question)", { code: "markdown" });
	const reply = Math.floor(Math.random() * predict.length);
	const embed = new Discord.MessageEmbed()
		.setDescription(`**Question:** ${joinargs}`)
		.setColor(1)
		.addField("Magic 8-Ball Reponse \:8ball:", predict[reply], false);	//	eslint-disable-line no-useless-escape
	return message.channel.send({ embed });
};

exports.conf = {
	enabled: true,
	allowDM: true,
	aliases: ["8-ball", "predict", "ball"],
	permLevel: 0
};

exports.help = {
	name: "8ball",
	category: "Fun",
	description: "Consult the magic 8-ball for advice.",
	usage: "question"
};
