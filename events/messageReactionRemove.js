const Discord = require("discord.js");
const sql = require("sqlite");
module.exports = async (client, messageReaction, user) => {
	if(user.bot) return;

	const reaction = messageReaction;
	const message = reaction.message;
	if(message.partial) await message.fetch();

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
					message.guild.members.get(user.id).roles.remove(role, "Unreacted on self assign message.").catch(e => { client.log(e.message, "error"); });
				}
				checkEmoji = true;
			}
		});
		if(!checkEmoji && message.channel.permissionsFor(message.guild.me).has("MANAGE_MESSAGES")) return reaction.remove(user.id);
	}

	if(reaction.emoji.name !== '⭐') return;
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

		const embed = new Discord.MessageEmbed()
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
	name: "messageReactionRemove",
	description: "Emitted when a user removes a reaction",
};
