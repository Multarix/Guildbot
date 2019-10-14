const cats = require("cats-js");
const Discord = require("discord.js");
exports.run = async (client, message, args) => {

	const cat = new cats();
	const pic = await cat.get();

	if(!pic) return message.channel.send("Uh oh, it seems that something broke \:("); // eslint-disable-line no-useless-escape

	const embed = new Discord.MessageEmbed()
		.setImage(pic.images.image.url);

	return message.channel.send({ embed });
};

exports.conf = {
	enabled: true,
	allowDM: true,
	aliases: ["cats", "neko"],
	permLevel: 0,
};

exports.help = {
	name: "cat",
	category: "Misc",
	description: "Posts a random cat picture or gif.",
	usage: "..",
};
