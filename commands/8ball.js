const predict = require("../objects/8ball.json");
const Discord = require("discord.js");
exports.run = async (client, message, args, level) => {
	if(!args[0]) return message.channel.send("error");
	const reply = Math.floor(Math.random() * predict.length);
	if(message.channel.memberPermissions(message.guild.me).has("EMBED_LINKS")){
		const embed = new Discord.RichEmbed()
			.setColor(1)
			.addField("\:8ball: Magic 8-Ball \:8ball:", predict[reply], false);	//	eslint-disable-line
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
	description: "Repeats what you say",
	usage: "echo](<..text>)",
};
