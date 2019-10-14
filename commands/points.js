const Discord = require('discord.js');
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

	const p = sqlGet("SELECT * FROM points WHERE user = ? AND guild = ?", user.id, message.guild.id);

	const embed = new Discord.MessageEmbed()
		.setAuthor(`${user.tag}`)
		.setThumbnail(message.author.displayAvatarURL())
		.setColor(ecolor)
		.setTimestamp()
		.setFooter(client.user.tag);

	if(!p){
		await sqlRun("INSERT INTO points (guild, user, amount) VALUES (?, ?, '0')", message.guild.id, user.id);
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
	allowDM: false,
	aliases: ["p", "point"],
	permLevel: 0,
};

exports.help = {
	name: "points",
	category: "Misc",
	description: "See how many points you or another user has",
	usage: "..user",
};
