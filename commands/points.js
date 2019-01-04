const Discord = require('discord.js');
const sql = require("sqlite");

exports.run = (client, message, args, level) => {
	const tagged = message.mentions.users.first();
	const memtag = message.mentions.members.first();

	let pointPerson;
	if(!tagged){
		pointPerson = message.author;
	} else {
		pointPerson = tagged;
	}

	let ecolor;

	if(!memtag){
		if(!message.member.highestRole.color){
			ecolor = 13238272;
		} else {
			ecolor = message.member.highestRole.color;
		}
	} else {
		if(!memtag.highestRole.color){		// eslint-disable-line
			ecolor = 13238272;
		} else {
			ecolor = memtag.highestRole.color;
		}
	}

	sql.get(`SELECT * FROM pointTable WHERE playerID = "${pointPerson.id}" AND guildID = "${message.guild.id}"`).then(p => {

		const embed = new Discord.RichEmbed()
			.setAuthor(`${pointPerson.tag}`)
			.setThumbnail(message.author.displayAvatarURL)
			.setColor(ecolor)
			.setTimestamp()
			.setFooter(client.user.tag);

		if(!p){
			sql.run(`INSERT INTO pointTable (points, playerID, guildID) VALUES (0, "${pointPerson.id}", "${message.guild.id}")`).then(pnp => {
				client.log(`Set "${pointPerson.tag}" (${pointPerson.id}) to the default amount of points`, "SQL");
				embed.addField("**Current Points**", "**0**", false);
				message.channel.send({ embed });
			});
		} else {
			embed.addField("Current Points", `${p.points}`, false);
			message.channel.send({ embed });
		}
	});

};

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: ["p", "point"],
	permLevel: 0,
};

exports.help = {
	name: "points",
	category: "Misc",
	description: "See how many points you or another user has",
	usage: "points](<..user>)",
};
