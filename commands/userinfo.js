const Discord = require('discord.js');
const moment = require("moment");
require("moment-duration-format");
exports.run = async (client, message, args) => {

	let user = message.author;
	let member = message.member;

	let tagged;
	if(args[0]) tagged = await grabUser(args[0]);

	if(tagged){
		user = tagged;
		member = message.guild.members.get(tagged.id);
	}

	const joinDate = moment.duration(Date.now() - user.createdTimestamp).format("Y [years], M [months], D [days]");

	let game = "nothing";
	if(user.presence.game) game = user.presence.game.name;

	let displayName = user.username;
	if(member) displayName = member.displayName;

	const embed = new Discord.RichEmbed()
		.setAuthor(displayName)
		.setThumbnail(user.displayAvatarURL)
		.addField("Username:", user.username, true)
		.addField("Discrim:", user.discriminator, true)
		.addField("Discord ID:", user.id, true)
		.addField("Is bot?", user.bot.toString().toProperCase(), true)
		.addField("Status:", user.presence.status.toProperCase(), true)
		.addField("Playing:", game, true)
		.addField("Joined Discord:", `${joinDate} ago`, false)
		.setTimestamp()
		.setFooter(client.user.tag, client.user.displayAvatarURL);

	let ecolor1 = 14487568;
	if(member){
		if(member.highestRole.color) ecolor1 = member.highestRole.color;
		if(member.roles){
			const s = function(a, b) { return a.calculatedPosition - b.calculatedPosition; };
			const r = member.roles.array().sort(s).slice(1).join(", ");
			embed.addField("Roles:", r);
		}
	}
	embed.setColor(ecolor1);
	return message.channel.send({ embed });
};

exports.conf = {
	enabled: true,
	allowDM: true,
	aliases: ["uinfo", "ui", "user"],
	permLevel: 0,
};

exports.help = {
	name: "userinfo",
	category: "Misc",
	description: "Grabs information about a user",
	usage: "..user",
};
