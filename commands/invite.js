const Discord = require('discord.js');

exports.run = (client, message, args, level) => {
	const embed = new Discord.RichEmbed()
		.setThumbnail(message.author.displayAvatarURL)
		.setColor(14487568)
		.addField('Invite me to a server!', `[Click here to invite this bot!](https://discordapp.com/oauth2/authorize?client_id=${client.user.id}&scope=bot&permissions=2146958551)`, false)
		.setFooter(client.user.tag, client.user.displayAvatarURL)
		.setTimestamp();

	message.channel.send({ embed });


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
	usage: "invite](..)",
};
