exports.run = (client, message, args, level) => {
	const Discord = require('discord.js');
	const tagged = message.mentions.users.first();
	const memtag = message.mentions.members.first();

	let ecolor1;
	if(!message.member.highestRole.color){
		ecolor1 = 16777215;
	} else {
		ecolor1 = message.member.highestRole.color;
	}

	if(!tagged){
	// Grab person who issued the command
		const embed = new Discord.RichEmbed()
			.setAuthor(message.member.displayName)
			.setThumbnail(message.author.displayAvatarURL)
			.setColor(ecolor1)
			.addField("Username:", message.author.username, true)
			.addField("Discrim:", message.author.discriminator, true)
			.addField("Discord ID:", message.author.id, true)
			.addField("Is bot?", message.author.bot, true)
			.addField("Status:", message.author.presence.status, true)
			.addField("Joined Discord:", message.author.createdAt, true)
			.setTimestamp()
			.setFooter(message.author.tag);

		message.channel.send({ embed }).catch(console.log);
	} else {
		// Grab person mentioned in the command
		let ecolor2;
		if(!memtag.highestRole.color){
			ecolor2 = 16777215;
		} else {
			ecolor2 = memtag.highestRole.color;
		}

		const embed = new Discord.RichEmbed()
			.setAuthor(memtag.displayName)
			.setThumbnail(tagged.displayAvatarURL)
			.setColor(ecolor2)
			.addField("Username:", tagged.username, true)
			.addField("Discrim:", tagged.discriminator, true)
			.addField("Discord ID:", tagged.id, true)
			.addField("Is bot?", tagged.bot, true)
			.addField("Status:", tagged.presence.status, true)
			.addField("Joined Discord:", tagged.createdAt, true)
			.setTimestamp()
			.setFooter(tagged.tag);

		message.channel.send({ embed }).catch(console.log);
	}
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: ["ui", "uinfo"],
	permLevel: 0,
};

exports.help = {
	name: "userinfo",
	category: "Misc",
	description: "Grabs information about a user",
	usage: "uinfo](<..user>)",
};
