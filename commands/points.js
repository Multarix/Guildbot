const Discord = require('discord.js');
const sql = require("sqlite");

exports.run = async (client, message, args, level) => {
	const tagged = await grabUser(args[0]);

	let user = message.author;
	let member = message.member;
	if(tagged) user = tagged; member = message.guild.members.get(tagged.id);

	let ecolor = 16777215;
	if(member.highestRole.color) ecolor = member.highestRole.color;

	sql.get(`SELECT * FROM pointTable WHERE playerID = "${user.id}" AND guildID = "${message.guild.id}"`).then(p => {

		const embed = new Discord.RichEmbed()
			.setAuthor(`${user.tag}`)
			.setThumbnail(message.author.displayAvatarURL)
			.setColor(ecolor)
			.setTimestamp()
			.setFooter(client.user.tag);

		if(!p){
			sql.run(`INSERT INTO pointTable (points, playerID, guildID) VALUES (0, "${user.id}", "${message.guild.id}")`).then(() => {
				client.log(`Set "${user.tag}" (${user.id}) to the default amount of points`, "SQL");
				embed.addField("**Current Points**", "0", false);
				return message.channel.send({ embed });
			});
		} else {
			embed.addField("Current Points", `${p.points}`, false);
			return message.channel.send({ embed });
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
