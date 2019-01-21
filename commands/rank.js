const Discord = require('discord.js');
const sql = require("sqlite");
exports.run = async (client, message, args, level) => {

	const players = client.users;

	const res = await sql.all(`SELECT * FROM points WHERE guild = "${message.guild.id}" ORDER BY amount DESC`);
	if(message.channel.memberPermissions(message.guild.me).has("EMBED_LINKS")){
		let ecolor = 13238272;
		if(message.guild.me.highestRole.color) ecolor = message.guild.me.highestRole.color;

		const embed = new Discord.RichEmbed()
			.setAuthor(`Point Leaderboard - ${message.guild.name}`)
			.setColor(ecolor)
			.addField("**Rank #1** :crown:", `**${res[0].amount}** Points - **${players.get(`${res[0].user}`).tag}**`, false)
			.setTimestamp()
			.setFooter(client.user.tag);

		if(message.guild.iconURL) embed.setThumbnail(message.guild.iconURL);

		let i;
		for(i = 1;i < res.length && i <= 4; i++) {
			embed.addField(`**Rank #${i + 1}**`, `**${res[i].amount}** Points - **${players.get(`${res[i].user}`).tag}**`, false);
		}

		return message.channel.send({ embed });
	}
	let i;
	let noEmbed = `< Rank #1 > 👑\n[${res[0].amount} Points](${players.get(`${res[0].user}`).tag})`;
	for(i = 1;i < res.length && i <= 4; i++) {
		noEmbed += `\n< Rank #${i + 1} >\n[${res[i].amount} Points](${players.get(`${res[i].user}`).tag})`;
	}
	return message.channel.send(noEmbed, { code: "markdown" });
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
