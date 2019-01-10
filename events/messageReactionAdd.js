const Discord = require("discord.js");
const sql = require("sqlite");

module.exports = async (client, messageReaction, user) => {

	const message = messageReaction.message;

	sql.get(`SELECT * FROM settings WHERE guildID = "${message.guild.id}"`).then(data => {
		const reaction = messageReaction;
		if(reaction.emoji.name !== '⭐') return;

		const starboard = message.channel.guild.channels.get(data.starChannel);

		if(!starboard) return client.log("Guild does not have a starboard channel, skipping starboard message", "Stars");

		if(!starboard.memberPermissions(message.guild.me).has("SEND_MESSAGES")) return;

		if(user.id === message.author.id){
			return message.reply(`You cannot star your own messages`).then(m => {
				reaction.remove(user);
				m.delete(5000);
			});
		}

		if(message.author.bot) {
			return message.channel.send(`${user}, You cannot star bot messages`).then(m => {
				reaction.remove(user);
				m.delete(5000);
			});
		}

		if(reaction.count >= 2) {
			const fetchedMsgs = starboard.fetchMessages({ limit: 100 });
			const starredMessage = fetchedMsgs.find(m => m.embeds[0].footer.text.startsWith("⭐") && m.embeds[0].footer.text.endsWith(message.id));
			if(starredMessage){
				const embedFound = starredMessage.embeds[0];
				const starCount = /\d+/g.exec(embedFound.footer.text);

				const embed = new Discord.RichEmbed()
					.setThumbnail(embedFound.thumbnail.url)
					.setColor(15844367)
					.addField("Author", `${embedFound.fields[0].value}`, true)
					.addField("Channel", `${embedFound.fields[1].value}`, true)
					.addField("Message", `${embedFound.fields[2].value}`, false)
					.addField("Message", `${embedFound.fields[3].value}`, false)
					.setFooter(`⭐${parseInt(starCount) + 1} | ${message.id}`)
					.setTimestamp();

				const image = starredMessage.embeds[0].image;
				if(image) embed.setImage(image.url);

				const starMsg = starboard.fetchMessage(starredMessage.id);
				starredMessage.edit({ embed });
			}
			if(!starredMessage){
				const embed = new Discord.RichEmbed()
					.setThumbnail(message.author.displayAvatarURL)
					.setColor(15844367)
					.addField("Author", `${message.author}`, true)
					.addField("Channel", `${message.channel}`, true)
					.addField("Message", `\u200b${message.content}`, false)
					.addField("Message", `[Jump To](${message.url})`, false)
					.setFooter(`⭐2 | ${message.id}`)
					.setTimestamp();

				if(message.attachments.first()) {
					embed.setImage(message.attachments.first().url);
				}
				client.log(`"${message.content}" was starred in the "${message.guild.name}" discord.`, "Stars");
				starboard.send({ embed });
			}
		}

	});
};


module.exports.help = {
	name: "messageReactionAdd",
	aliases: ["addReaction"],
	description: "Emitted when a user adds a reaction",
};
