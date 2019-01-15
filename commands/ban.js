const Discord = require("discord.js");
const sql = require("sqlite");
exports.run = async (client, message, args, level) => {
	if(!message.channel.memberPermissions(message.guild.me).has("BAN_MEMBERS")) return message.channel.send("I don't have permission to ban users\nUsage: [ban](<..user>)", { code: "markdown" });
	const banUser = grabUser(args.shift());

	let reason = args.join(" ");
	if(!reason) reason = "Not Specified";

	if(!banUser) return message.channel.send("No user/ Invalid User\nUsage: [ban](<..user>)", { code: "markdown" });
	if(banUser.id === message.author.id) return message.channel.send("You cannot ban yourself.\nUsage: [ban](<..user>)", { code: "markdown" });
	if(banUser.id === client.user.id) return message.channel.send("I cannot and will not ban myself.\nUsage: [ban](<..user>)", { code: "markdown" });
	if(banUser.id === message.guild.owner.id) return message.channel.send("I cannot and will not ban the server owner.\nUsage: [ban](<..user>)", { code: "markdown" });
	if(banUser.discriminator === "0000") return message.channel.send("You cannot ban a webhook\nUsage: [ban](<..user>)", { code: "markdown" });

	const banMember = message.guild.members.get(banUser.id);
	if(banMember){
		if(banMember.highestRole.calculatedPosition >= message.guild.me.highestRole.calculatedPosition) return message.channel.send("That user's highest role is the same or higher than mine.\nUsage: [ban](<..user>)", { code: "markdown" });
		if(!banMember.banable) return message.channel.send("For some unforseen reason, I cannot ban that person.\nUsage: [ban](<..user>)", { code: "markdown" });
	}
	let mContent;
	if(message.channel.memberPermissions(message.guild.me).has("EMBED_LINKS")){
		mContent = new Discord.RichEmbed()
			.setAuthor(`${banUser.tag} (${banUser.id})`, banUser.displayAvatarURL)
			.setColor(16748032)
			.addField(`Action:`, "Ban", false)
			.addField(`Reason:`, `${reason}`, false)
			.addField(`Are you sure?`, "`Yes` or `No`", false)
			.setFooter(message.author.tag, message.author.displayAvatarURL)
			.setTimestamp();
	} else {
		mContent = `\`\`\`md\n${banUser.tag} (${banUser.id})\nAction: ban\nReason: ${reason}\nAre you sure?\nYes or No\`\`\``;
	}

	message.channel.send(mContent).then(m => {
		const response = ["y", "yes", "n", "no"];
		const filter = m => m.author.id === message.author.id && response.includes(m.content.toLowerCase());
		message.channel.awaitMessages(filter, { max: 1, time: 15000, errors: ['time'] }).then(collected => {
			const msg = collected.first().content;
			if(msg.toLowerCase() === "yes" || msg.toLowerCase() === "y"){
				if(message.channel.memberPermissions(message.guild.me).has("EMBED_LINKS")){
					const embed = new Discord.RichEmbed()
						.setAuthor(`${banUser.tag} (${banUser.id})`, banUser.displayAvatarURL)
						.setColor(16748032)
						.setTitle("Working..")
						.setFooter(message.author.tag, message.author.displayAvatarURL)
						.setTimestamp();

					return m.edit({ embed }).then(m => {
						const embed = new Discord.RichEmbed()
							.setAuthor(`${banUser.tag} (${banUser.id})`, banUser.displayAvatarURL)
							.setColor(16748032)
							.setFooter(message.author.tag, message.author.displayAvatarURL)
							.setTimestamp();

						message.guild.ban(banUser, reason).then(user => {
							embed.setTitle(`\`${user.tag}\` was succesfully banned`);
							return m.edit({ embed });
						}).catch(e => {
							embed.setTitle(`Ruh roh, I was unable to ban \`${banUser.tag}\``);
							embed.addField(`Reason:`, e.message, false);
							return m.edit({ embed });
						});

					});
				}

				m.edit("Working..").then(m => {

					message.guild.ban(banUser, reason).then(user => {
						return m.edit(`\`${user.tag}\` was succesfully banned`);
					}).catch(e => {
						return m.edit(`Ruh roh, I was unable to ban \`${banUser.tag}\`\nReason: ${e.message}`);
					});

				});

			}
			if(msg.toLowerCase() === "no" || msg.toLowerCase() === "n"){
				return message.channel.send("Command Canceled.");
			}
		}).catch(() => {
			m.edit("Command Canceled.");
		});
	});

};

exports.conf = {
	enabled: false,
	guildOnly: true,
	aliases: [],
	permLevel: 4,
};

exports.help = {
	name: "ban",
	category: "Moderation",
	description: "Bans a user from the server",
	usage: "ban](<..user> <..reason>)",
};
