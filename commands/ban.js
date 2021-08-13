const Discord = require("discord.js");
exports.run = async (client, message, args) => {

	if(!message.channel.permissionsFor(message.guild.me).has("BAN_MEMBERS")) return message.reply("I don't have permission to ban users.");
	const banUser = await grabUser(args.shift());

	if(!banUser) return message.reply("No User/ Invalid User.\nUsage: [ban](<..user> <..reason)", { code: "markdown" });

	const banMember = message.guild.members.cache.get(banUser.id);
	if(banMember && !banMember.bannable) return message.reply("I am unable to ban that user.");

	let reason = args.join(" ");
	if(!reason) reason = "Not Specified";

	const embed = new Discord.MessageEmbed()
		.setAuthor(`${banUser.tag} (${banUser.id})`, banUser.displayAvatarURL())
		.setColor(16711680)
		.addField(`Action:`, "Ban", false)
		.addField(`Reason:`, `${reason}`, false)
		.addField(`Are you sure?`, "`Yes` or `No`", false)
		.setFooter(message.author.tag, message.author.displayAvatarURL())
		.setTimestamp();

	const msg = await message.channel.send({ embeds: [embed] });
	const response = ["y", "yes", "n", "no"];
	const filter = x => x.author.id === message.author.id && response.includes(x.content.toLowerCase());
	const collected = await message.channel.awaitMessages({ filter, max: 1, time: 15000, errors: ['time'] }).catch(() => {
		const embed = new Discord.MessageEmbed()
			.setAuthor(`${banUser.tag} (${banUser.id})`, banUser.displayAvatarURL())
			.setColor(16711680)
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
			.setAuthor(`${banUser.tag} (${banUser.id})`, banUser.displayAvatarURL())
			.setColor(16711680)
			.setTitle("Working..")
			.setFooter(message.author.tag, message.author.displayAvatarURL())
			.setTimestamp();

		await msg.edit({ embeds: [embed] });
		const embedDetail = new Discord.MessageEmbed()
			.setAuthor(`${banUser.tag} (${banUser.id})`, banUser.displayAvatarURL())
			.setColor(16711680)
			.setFooter(message.author.tag, message.author.displayAvatarURL())
			.setTimestamp();

		let user;
		try {
			user = await message.guild.members.ban(banUser, { reason: reason });
			if(user) embedDetail.setTitle(`\`${user.tag}\` was succesfully banned`);
		} catch (e){
			embedDetail.setTitle(`Ruh roh, I was unable to ban \`${banUser.tag}\``);
			embedDetail.addField(`Reason:`, e.message, false);
		}
		await msg.edit({ embeds: [embedDetail] });
	}

	if(m.toLowerCase() === "no" || m.toLowerCase() === "n"){
		const embed = new Discord.MessageEmbed()
			.setAuthor(`${banUser.tag} (${banUser.id})`, banUser.displayAvatarURL())
			.setColor(16711680)
			.setTitle(`Command Canceled.`)
			.setFooter(message.author.tag, message.author.displayAvatarURL())
			.setTimestamp();
		return msg.edit({ embeds: [embed] });
	}
};

exports.conf = {
	enabled: true,
	allowDM: false,
	aliases: [],
	permLevel: 4
};

exports.help = {
	name: "ban",
	category: "Moderation",
	description: "Bans a user from the server",
	usage: "user ..reason"
};
