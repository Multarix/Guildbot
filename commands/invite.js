const Discord = require('discord.js');
exports.run = (client, message, args, level) => {

	let good = client.emojis.get("340357918996299778");
	if(!good) good = "👍";

	const embed = new Discord.RichEmbed()
		.setThumbnail(client.user.displayAvatarURL)
		.setColor(14487568)
		.addField(`${client.user.username} Invite Link`, `[Click Here](https://discordapp.com/oauth2/authorize?client_id=${client.user.id}&scope=bot&permissions=8 "Invite ${client.user.username.toProperCase()} to your server") to invite\n${client.user.username} to your\nown server.`, false)
		.setFooter(client.user.tag, client.user.displayAvatarURL)
		.setTimestamp();

	message.react(good);

	return message.author.send({ embed });
};

exports.conf = {
	enabled: true,
	guildOnly: false,
	aliases: ["inv"],
	permLevel: 0,
};

exports.help = {
	name: "invite",
	category: "Misc",
	description: "Generates the bot's invite link",
	usage: "..",
};
