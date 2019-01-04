const Discord = require('discord.js');
const sql = require("sqlite");

exports.run = (client, message, args, level) => {
	const players = client.users;

	let ecolor;

	if(!message.guild.me.highestRole.color){
		ecolor = 13238272;
	} else {
		ecolor = message.guild.me.highestRole.color;
	}

	sql.all(`SELECT * FROM pointTable WHERE guildID = "${message.guild.id}" ORDER BY points DESC`).then(res => {

		const embed = new Discord.RichEmbed()
			.setAuthor(`Point Leaderboard - ${message.guild.name}`)
			.setThumbnail(client.user.displayAvatarURL)
			.setColor(ecolor)
			.addField("**Rank #1** :crown:", `**${res[0].points}** Points - **${players.get(`${res[0].playerID}`).tag}**`, false)
			.setTimestamp()
			.setFooter(client.user.tag);

		let i;
		for(i = 1;i < res.length && i <= 4; i++) {
			embed.addField(`**Rank #${i + 1}**`, `**${res[i].points}** Points - **${players.get(`${res[i].playerID}`).tag}**`, false);
		}

		message.channel.send({ embed });
	});
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: ["ranking", "rankings", "ranks"],
	permLevel: 0,
};

exports.help = {
	name: "rank",
	category: "Misc",
	description: "Lists the users with the top 5 amount of points",
	usage: "ranking](..)",
};
