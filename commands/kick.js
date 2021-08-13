const Discord = require("discord.js");
exports.run = async (client, message, args) => {

	if(!message.channel.permissionsFor(message.guild.me).has("KICK_MEMBERS")) return message.reply("I don't have permission to kick users");
	const kickUser = await grabUser(args.shift());

	if(!kickUser) return message.reply("No User/ Invalid User.\nUsage: [kick](<..user> <..reason)", { code: "markdown" });

	const kickMember = message.guild.members.cache.get(kickUser.id);
	if(!kickMember) return message.channel.send("That user does not appear to be in the server.", { code: "markdown" });
	if(!kickMember.kickable) return message.reply("I am unable to kick that user.");

	let reason = args.join(" ");
	if(!reason) reason = "Not Specified";

	const embed = new Discord.MessageEmbed()
		.setAuthor(`${kickUser.tag} (${kickUser.id})`, kickUser.displayAvatarURL())
		.setColor(16750080)
		.addField(`Action:`, "Kick", false)
		.addField(`Reason:`, `${reason}`, false)
		.addField(`Are you sure?`, "`Yes` or `No`", false)
		.setFooter(message.author.tag, message.author.displayAvatarURL())
		.setTimestamp();

	const msg = await message.channel.send({ embeds: [embed] });
	const response = ["y", "yes", "n", "no"];
	const filter = x => x.author.id === message.author.id && response.includes(x.content.toLowerCase());
	const collected = await message.channel.awaitMessages({ filter, max: 1, time: 15000, errors: ['time'] }).catch(() => {
		const embed = new Discord.MessageEmbed()
			.setAuthor(`${kickUser.tag} (${kickUser.id})`, kickUser.displayAvatarURL())
			.setColor(16750080)
			.setTitle(`Command Canceled.`)
			.setFooter(message.author.tag, message.author.displayAvatarURL())
			.setTimestamp();

		msg.edit({ embeds: [embed] });
		return undefined;
	});
	if(!collected) return;
	const m = collected.first().content;
	if(m.toLowerCase() === "yes" || m.toLowerCase() === "y"){
		const embed = new Discord.MessageEmbed()
			.setAuthor(`${kickUser.tag} (${kickUser.id})`, kickUser.displayAvatarURL())
			.setColor(16750080)
			.setTitle("Working..")
			.setFooter(message.author.tag, message.author.displayAvatarURL())
			.setTimestamp();

		await msg.edit({ embeds: [embed] });
		const embedDetail = new Discord.MessageEmbed()
			.setAuthor(`${kickUser.tag} (${kickUser.id})`, kickUser.displayAvatarURL())
			.setColor(16750080)
			.setFooter(message.author.tag, message.author.displayAvatarURL())
			.setTimestamp();

		let member;
		try {
			member = await message.guild.members.kick(kickUser, { reason: reason });
			if(member) embed.setTitle(`\`${member.user.tag}\` was succesfully kicked.`);
		} catch (e){
			embed.setTitle(`Ruh roh, I was unable to kick \`${kickUser.tag}\``);
			embed.addField(`Reason:`, e.message, false);
		}
		await msg.edit({ embeds: [embed] });
	}

	if(m.toLowerCase() === "no" || m.toLowerCase() === "n"){
		const embed = new Discord.MessageEmbed()
			.setAuthor(`${kickUser.tag} (${kickUser.id})`, kickUser.displayAvatarURL())
			.setColor(16750080)
			.setTitle(`Command Canceled.`)
			.setFooter(message.author.tag, message.author.displayAvatarURL())
			.setTimestamp();
		return await msg.edit({ embeds: [embed] });
	}
};

exports.conf = {
	enabled: true,
	allowDM: false,
	aliases: [],
	permLevel: 3
};

exports.help = {
	name: "kick",
	category: "Moderation",
	description: "Kicks a user from the server",
	usage: "user ..reason)"
};
