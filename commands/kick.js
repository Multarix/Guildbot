const Discord = require("discord.js");
exports.run = async (client, message, args) => {

	if(!message.channel.memberPermissions(message.guild.me).has("KICK_MEMBERS")) return message.reply("I don't have permission to kick users");
	const kickUser = await grabUser(args.shift());

	if(!kickUser) return message.reply("No User/ Invalid User.\nUsage: [kick](<..user> <..reason)", { code: "markdown" });
	if(kickUser.id === message.author.id) return message.reply("You cannot kick yourself.");
	if(kickUser.id === client.user.id) return message.reply("How about I kick you instead?");
	if(kickUser.id === message.guild.owner.id) return message.reply("The server owner is a god and cannot be kicked.");
	if(kickUser.discriminator === "0000") return message.reply("You cannot kick a webhook (What did it ever do to you?!).");

	const kickMember = message.guild.members.get(kickUser.id);
	if(!kickMember) return message.channel.send("That user does not appear to be in the guild.", { code: "markdown" });
	if(kickMember.highestRole.calculatedPosition >= message.guild.me.highestRole.calculatedPosition) return message.reply("That users powerlevel is higher than mine, I am unable to kick them.");
	if(!kickMember.kickable) message.reply("With all the powers bestowed in me, I am unable to kick that user.");

	let reason = args.join(" ");
	if(!reason) reason = "Not Specified";

	const embed = new Discord.RichEmbed()
		.setAuthor(`${kickUser.tag} (${kickUser.id})`, kickUser.displayAvatarURL)
		.setColor(16750080)
		.addField(`Action:`, "Kick", false)
		.addField(`Reason:`, `${reason}`, false)
		.addField(`Are you sure?`, "`Yes` or `No`", false)
		.setFooter(message.author.tag, message.author.displayAvatarURL)
		.setTimestamp();

	const msg = await message.channel.send({ embed });
	const response = ["y", "yes", "n", "no"];
	const filter = x => x.author.id === message.author.id && response.includes(x.content.toLowerCase());
	const collected = await message.channel.awaitMessages(filter, { max: 1, time: 15000, errors: ['time'] }).catch(() => {
		const embed = new Discord.RichEmbed()
			.setAuthor(`${kickUser.tag} (${kickUser.id})`, kickUser.displayAvatarURL)
			.setColor(16750080)
			.setTitle(`Command Canceled.`)
			.setFooter(message.author.tag, message.author.displayAvatarURL)
			.setTimestamp();

		msg.edit({ embed });
		return undefined;
	});
	if(!collected) return;
	const m = collected.first().content;
	if(msg.toLowerCase() === "yes" || msg.toLowerCase() === "y"){
		const embed = new Discord.RichEmbed()
			.setAuthor(`${kickUser.tag} (${kickUser.id})`, kickUser.displayAvatarURL)
			.setColor(16750080)
			.setTitle("Working..")
			.setFooter(message.author.tag, message.author.displayAvatarURL)
			.setTimestamp();

		await msg.edit({ embed });
		const embedDetail = new Discord.RichEmbed()
			.setAuthor(`${kickUser.tag} (${kickUser.id})`, kickUser.displayAvatarURL)
			.setColor(16750080)
			.setFooter(message.author.tag, message.author.displayAvatarURL)
			.setTimestamp();

		const member = await kickMember.kick().catch(e => {
			embed.setTitle(`Ruh roh, I was unable to kick \`${kickUser.tag}\``);
			embedDetail.addField(`Reason:`, e.message, false);
			return null;
		});
		if(member) embed.setTitle(`\`${member.user.tag}\` was succesfully kicked.`);
		return await msg.edit(embedDetail);
	}

	if(msg.toLowerCase() === "no" || msg.toLowerCase() === "n"){
		const embed = new Discord.RichEmbed()
			.setAuthor(`${kickUser.tag} (${kickUser.id})`, kickUser.displayAvatarURL)
			.setColor(16750080)
			.setTitle(`Command Canceled.`)
			.setFooter(message.author.tag, message.author.displayAvatarURL)
			.setTimestamp();
		return await m.edit({ embed });
	}
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: [],
	permLevel: 3,
};

exports.help = {
	name: "kick",
	category: "Moderation",
	description: "Kicks a user from the server",
	usage: "user ..reason)",
};
