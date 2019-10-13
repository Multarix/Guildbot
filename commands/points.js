const Discord = require('discord.js');
const sql = require("sqlite");
exports.run = async (client, message, args) => {

	const tagged = await grabUser(args[0]);

	let user = message.author;
	let member = message.member;
	if(tagged){
		user = tagged;
		member = message.guild.members.get(tagged.id);
	}

	let ecolor = 16777215;
	if(member.roles.highest.color) ecolor = member.roles.highest.color;

	const p = await sql.get(`SELECT * FROM points WHERE user = "${user.id}" AND guild = "${message.guild.id}"`);

	const embed = new Discord.MessageEmbed()
		.setAuthor(`${user.tag}`)
		.setThumbnail(message.author.displayAvatarURL())
		.setColor(ecolor)
		.setTimestamp()
		.setFooter(client.user.tag);

	if(!p){
		await sql.run(`INSERT INTO points (guild, user, amount) VALUES ("${message.guild.id}", "${user.id}", "0")`);
		client.log(`Set "${user.tag}" (${user.id}) to the default amount of points`, "SQL");
		embed.addField("Current Points", "0", false);
		return message.channel.send({ embed });
	} else {
		embed.addField("Current Points", `${p.amount}`, false);
		return message.channel.send({ embed });
	}
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
	usage: "..user",
};
