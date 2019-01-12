const Discord = require('discord.js');
const moment = require("moment");
require("moment-duration-format");

exports.run = (client, message, args, level) => {

	const tagged = message.mentions.users.first();
	const memtag = message.mentions.members.first();


	if(!tagged){
		/* Grab person who issued the command */
		const memberJoin = moment.duration(Date.now() - message.author.createdTimestamp).format("Y [years], M [months], D [days]");

		let memberGame = "nothing";
		if(message.author.presence.game) memberGame = message.author.presence.game.name;

		if(message.channel.memberPermissions(message.guild.me).has("EMBED_LINKS")){
			let ecolor1 = 16777215;
			if(message.member.highestRole.color) ecolor1 = message.member.highestRole.color;

			const embed = new Discord.RichEmbed()
				.setAuthor(message.member.displayName)
				.setThumbnail(message.author.displayAvatarURL)
				.setColor(ecolor1)
				.addField("Username:", message.author.username, true)
				.addField("Discrim:", message.author.discriminator, true)
				.addField("Discord ID:", message.author.id, true)
				.addField("Is bot?", message.author.bot.toString().toProperCase(), true)
				.addField("Status:", message.author.presence.status.toProperCase(), true)
				.addField("Playing:", memberGame, true)
				.addField("Joined Discord:", `${memberJoin} ago`, false)
				.setTimestamp()
				.setFooter(client.user.tag, client.user.displayAvatarURL);

			return message.channel.send({ embed }).catch(console.log);
		}
		return message.channel.send(`User Information
----------------
< Username >
${message.author.username}
< Discrim >
${message.author.discriminator}
< Discord ID >
${message.author.id}
< Is Bot? >
${message.author.bot.toString().toProperCase()}
< Status >
${message.author.presence.status.toProperCase()}
< Playing >
${memberGame}
< Joined Discord >
${memberJoin}`, { code: "markdown" });

	}

	// Grab person mentioned in the command
	const taggedJoin = moment.duration(Date.now() - tagged.createdTimestamp).format("Y [years], M [months], D [days]");

	let taggedGame = "nothing";
	if(tagged.presence.game) taggedGame = tagged.presence.game.name;

	if(message.channel.memberPermissions(message.guild.me).has("EMBED_LINKS")){
		let ecolor2 = 16777215;
		if(memtag.highestRole.color) ecolor2 = memtag.highestRole.color;

		const embed = new Discord.RichEmbed()
			.setAuthor(memtag.displayName)
			.setThumbnail(tagged.displayAvatarURL)
			.setColor(ecolor2)
			.addField("Username:", tagged.username, true)
			.addField("Discrim:", tagged.discriminator, true)
			.addField("Discord ID:", tagged.id, true)
			.addField("Is bot?", tagged.bot.toString().toProperCase(), true)
			.addField("Status:", tagged.presence.status.toProperCase(), true)
			.addField("Playing:", taggedGame, true)
			.addField("Joined Discord:", `${taggedJoin} ago`, true)
			.setTimestamp()
			.setFooter(client.user.tag, client.user.displayAvatarURL);

		return message.channel.send({ embed }).catch(console.log);
	}
	return message.channel.send(`User Information
----------------
< Username >
${tagged.username}
< Discrim >
${tagged.discriminator}
< Discord ID >
${tagged.id}
< Is Bot? >
${tagged.bot.toString().toProperCase()}
< Status >
${tagged.presence.status.toProperCase()}
< Playing >
${taggedGame}
< Joined Discord >
${taggedJoin}`, { code: "markdown" });
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: ["uinfo", "ui", "user"],
	permLevel: 0,
};

exports.help = {
	name: "userinfo",
	category: "Misc",
	description: "Grabs information about a user",
	usage: "uinfo](<..user>)",
};
