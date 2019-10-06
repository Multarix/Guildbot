const Discord = require("discord.js");
const sql = require("sqlite");
module.exports = async (client, messageReaction, user) => {

	if(user.bot) return;
	const message = messageReaction.message;
	if(message.partial) await message.fetch();
	const reaction = messageReaction;
	const regPrefix = /[!\/]reboot/g;	// eslint-disable-line no-useless-escape
	if(message.content.toLowerCase().match(regPrefix) && user.id === client.config.ownerID && reaction.emoji.id === "340357918996299778") return message.delete().catch(e => { return; });

	const data = await sql.get(`SELECT * FROM settings WHERE guild = "${message.guild.id}"`);

	const emojiMessageID = data.assignMessage;
	if(message.id === emojiMessageID){
		const roleEmoji = data.assignRoles;
		const roleDataInfo = roleEmoji.split("*");

		const emojiRoles = [];
		roleDataInfo.forEach(x => {
			const emojiID = x.match(/\[(.*?)\]/)[0].replace(/[\][]/g, "");
			const roleID = x.match(/\((.*?)\)/)[0].replace(/[)(]/g, "");
			return emojiRoles.push({ emojiID, roleID });
		});

		let emojiIdentifier = reaction.emoji.id;
		if(!emojiIdentifier) emojiIdentifier = reaction.emoji.name;

		let checkEmoji = false;
		emojiRoles.forEach(y => {
			if(y.emojiID === emojiIdentifier){
				const role = grabRole(y.roleID, message.guild.id);
				if(!role) return;
				if(role.comparePositionTo(message.guild.me.roles.highest) >= 0) return;
				if(message.channel.permissionsFor(message.guild.me).has("MANAGE_ROLES")){
					message.guild.members.get(user.id).roles.add(role, "Reacted on self assign message.").catch(e => { client.log(e.message, "error"); });
				}
				checkEmoji = true;
			}
		});
		if(!checkEmoji && message.channel.permissionsFor(message.guild.me).has("MANAGE_MESSAGES")) return reaction.remove(user.id);
	}

	if(reaction.emoji.name !== '⭐') return;

	const starboard = message.channel.guild.channels.get(data.starboard);

	if(!starboard) return client.log("Guild does not have a starboard channel, skipping starboard message", "Stars");

	if(!starboard.memberPermissions(message.guild.me).has("SEND_MESSAGES")) return;
	if(!starboard.memberPermissions(message.guild.me).has("EMBED_LINKS")) return;

	if(user.id === message.author.id){
		return message.reply(`You cannot star your own messages`).then(m => {
			reaction.remove(user);
			m.delete(5000);
		});
	}

	if(message.author.bot){
		return message.channel.send(`${user}, You cannot star bot messages`).then(m => {
			reaction.remove(user);
			m.delete(5000);
		});
	}

	if(reaction.count >= 2){
		const fetchedMsgs = starboard.fetchMessages({ limit: 100 });
		const starredMessage = fetchedMsgs.find(m => m.embeds[0].footer.text.startsWith("⭐") && m.embeds[0].footer.text.endsWith(message.id));
		if(starredMessage){
			const embedFound = starredMessage.embeds[0];
			const starCount = /\d+/g.exec(embedFound.footer.text);

			const embed = new Discord.MessageEmbed()
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
			const embed = new Discord.MessageEmbed()
				.setThumbnail(message.author.displayAvatarURL())
				.setColor(15844367)
				.addField("Author", `${message.author}`, true)
				.addField("Channel", `${message.channel}`, true)
				.addField("Message", `\u200b${message.content}`, false)
				.addField("Message", `[Jump To](${message.url})`, false)
				.setFooter(`⭐2 | ${message.id}`)
				.setTimestamp();

			if(message.attachments.first()){
				embed.setImage(message.attachments.first().url);
			}
			client.log(`"${message.content}" was starred in the "${message.guild.name}" discord.`, "Stars");
			starboard.send({ embed });
		}
	}
};


module.exports.help = {
	name: "messageReactionAdd",
	description: "Emitted when a user adds a reaction",
};
