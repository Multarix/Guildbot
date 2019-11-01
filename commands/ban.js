const Discord = require("discord.js");
exports.run = async (client, message, args) => {

	if(!message.channel.permissionsFor(message.guild.me).has("BAN_MEMBERS")) return message.reply("I don't have permission to ban users.");
	const banUser = await grabUser(args.shift());

	if(!banUser) return message.reply("No User/ Invalid User.\nUsage: [ban](<..user> <..reason)", { code: "markdown" });
	if(banUser.id === message.author.id) return message.reply("You cannot ban yourself.");
	if(banUser.id === client.user.id) return message.reply("How about I ban you instead?");
	if(banUser.id === message.guild.owner.id) return message.reply("The server owner is a god and cannot be banned.");
	if(banUser.discriminator === "0000") return message.reply("You cannot ban a webhook (What did it ever do to you?!).");

	const banMember = message.guild.members.get(banUser.id);
	if(banMember){
		if(banMember.roles.highest.calculatedPosition >= message.guild.me.roles.highest.calculatedPosition) return message.reply("That users powerlevel is higher than mine, I am unable to ban them.");
		if(!banMember.bannable) return message.reply("With all the powers bestowed in me, I am unable to ban that user.");
	}

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

	const msg = await message.channel.send({ embed });
	const response = ["y", "yes", "n", "no"];
	const filter = x => x.author.id === message.author.id && response.includes(x.content.toLowerCase());
	const collected = await message.channel.awaitMessages(filter, { max: 1, time: 15000, errors: ['time'] }).catch(() => {
		const embed = new Discord.MessageEmbed()
			.setAuthor(`${banUser.tag} (${banUser.id})`, banUser.displayAvatarURL())
			.setColor(16711680)
			.setTitle(`Command Canceled.`)
			.setFooter(message.author.tag, message.author.displayAvatarURL())
			.setTimestamp();

		msg.edit({ embed });
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

		await msg.edit({ embed });
		const embedDetail = new Discord.MessageEmbed()
			.setAuthor(`${banUser.tag} (${banUser.id})`, banUser.displayAvatarURL())
			.setColor(16711680)
			.setFooter(message.author.tag, message.author.displayAvatarURL())
			.setTimestamp();

		const user = await message.guild.members.ban(banUser, { reason: reason }).catch(e => {
			embedDetail.setTitle(`Ruh roh, I was unable to ban \`${banUser.tag}\``);
			embedDetail.addField(`Reason:`, e.message, false);
			return null;
		});
		if(user) embedDetail.setTitle(`\`${user.tag}\` was succesfully banned`);
		return await msg.edit(embedDetail);
	}

	if(m.toLowerCase() === "no" || m.toLowerCase() === "n"){
		const embed = new Discord.MessageEmbed()
			.setAuthor(`${banUser.tag} (${banUser.id})`, banUser.displayAvatarURL())
			.setColor(16711680)
			.setTitle(`Command Canceled.`)
			.setFooter(message.author.tag, message.author.displayAvatarURL())
			.setTimestamp();
		return msg.edit({ embed });
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
