const Discord = require("discord.js");

module.exports = async (client, messageReaction, user) => {

	const reaction = messageReaction;
	if(reaction.emoji.name !== '⭐') return;

	const message = reaction.message;
	const starboard = message.channel.guild.channels.find(x => x.name === "starboard");

	if(!starboard) return;

	if(message.author.bot) return;
	if(user.id === message.author.id) return;

	const fetchedMsgs = await starboard.fetchMessages({ limit: 100 });
	const starredMessage = fetchedMsgs.find(m => m.embeds[0].footer.text.startsWith("⭐") && m.embeds[0].footer.text.endsWith(message.id));
	if(starredMessage){
		const embedFound = starredMessage.embeds[0];
		const starCount = /\d+/g.exec(embedFound.footer.text);

		if(parseInt(starCount) - 1 == 1) return starredMessage.delete();

		const embed = new Discord.RichEmbed()
			.setThumbnail(embedFound.thumbnail.url)
			.setColor(15844367)
			.addField("Author", `${embedFound.fields[0].value}`, true)
			.addField("Channel", `${embedFound.fields[1].value}`, true)
			.addField("Message", `${embedFound.fields[2].value}`, false)
			.addField("Message", `${embedFound.fields[3].value}`, false)
			.setFooter(`⭐${parseInt(starCount) - 1} | ${message.id}`)
			.setTimestamp();

		const image = starredMessage.embeds[0].image;
		if(image) embed.setImage(image.url);

		await starredMessage.edit({ embed });
	}
};


module.exports.help = {
	name: "messageReactionAdd",
	aliases: ["addReaction"],
	description: "Emitted when a user adds a reaction",
};
