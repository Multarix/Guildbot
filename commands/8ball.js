const predict = require("../objects/8ball.json");
const Discord = require("discord.js");
exports.run = async (client, message, args, level) => {

	const joinargs = args.join(" ");
	if(!joinargs) return message.channel.send("Usage: [8ball](<..question)", { code: "markdown" });
	const reply = Math.floor(Math.random() * predict.length);
	if(message.channel.memberPermissions(message.guild.me).has("EMBED_LINKS")){
		const embed = new Discord.RichEmbed()
			.setDescription(`**Question:** ${joinargs}`)
			.setColor(1)
			.addField("Magic 8-Ball Reponse \:8ball:", predict[reply], false);	//	eslint-disable-line no-useless-escape
		return message.channel.send({ embed });
	}
	message.channel.send(predict[reply]);
};

exports.conf = {
	enabled: true,
	guildOnly: false,
	aliases: ["8-ball", "predict", "ball"],
	permLevel: 0,
};

exports.help = {
	name: "8ball",
	category: "Misc",
	description: "Consult the magic 8-ball for advice.",
	usage: "8ball](<..question>)",
};
