const Discord = require('discord.js');
const moment = require("moment");
require("moment-duration-format");

exports.run = async (client, message, args, level) => {
	const tagged = await grabUser(args[0]);

	let user = message.author;
	let member = message.member;
	if(tagged) user = tagged; member = message.guild.members.get(tagged.id);

	const joinDate = moment.duration(Date.now() - user.createdTimestamp).format("Y [years], M [months], D [days]");

	let game = "nothing";
	if(user.presence.game) game = user.presence.game.name;

	if(message.channel.memberPermissions(message.guild.me).has("EMBED_LINKS")){
		let ecolor1 = 16777215;
		if(member.highestRole.color) ecolor1 = member.highestRole.color;

		const embed = new Discord.RichEmbed()
			.setAuthor(member.displayName)
			.setThumbnail(user.displayAvatarURL)
			.setColor(ecolor1)
			.addField("Username:", user.username, true)
			.addField("Discrim:", user.discriminator, true)
			.addField("Discord ID:", user.id, true)
			.addField("Is bot?", user.bot.toString().toProperCase(), true)
			.addField("Status:", user.presence.status.toProperCase(), true)
			.addField("Playing:", game, true)
			.addField("Joined Discord:", `${joinDate} ago`, false)
			.setTimestamp()
			.setFooter(client.user.tag, client.user.displayAvatarURL);

		return message.channel.send({ embed });
	}
	return message.channel.send(`User Information
----------------
< Username >
${user.username}
< Discrim >
${user.discriminator}
< Discord ID >
${user.id}
< Is Bot? >
${user.bot.toString().toProperCase()}
< Status >
${user.presence.status.toProperCase()}
< Playing >
${game}
< Joined Discord >
${joinDate}`, { code: "markdown" });

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
