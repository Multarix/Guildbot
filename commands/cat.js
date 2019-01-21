const cats = require("cats-js");
const Discord = require("discord.js");
exports.run = async (client, message, args, level) => {

	const cat = new cats();
	const pic = await cat.get();

	if(message.channel.memberPermissions(message.guild.me).has("EMBED_LINKS")){
		const embed = new Discord.RichEmbed()
			.setImage(pic.images.image.url);

		return message.channel.send({ embed });
	}
	message.channel.send(pic.images.image.url);
};

exports.conf = {
	enabled: true,
	guildOnly: false,
	aliases: ["cats", "neko"],
	permLevel: 10,
};

exports.help = {
	name: "cat",
	category: "Misc",
	description: "Posts a random cat picture or gif.",
	usage: "cat](..)",
};
