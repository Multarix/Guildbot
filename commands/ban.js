const Discord = require("discord.js");
exports.run = async (client, message, args, level) => {
	if(!message.channel.memberPermissions(message.guild.me).has("BAN_MEMBERS")) return message.reply("I don't have permission to ban users.");
	const banUser = await grabUser(args.shift());

	if(!banUser) return message.reply("No User/ Invalid User.\nUsage: [ban](<..user> <..reason)", { code: "markdown" });
	if(banUser.id === message.author.id) return message.reply("You cannot ban yourself.");
	if(banUser.id === client.user.id) return message.reply("How about I ban you instead?");
	if(banUser.id === message.guild.owner.id) return message.reply("The server owner is a god and cannot be banned.");
	if(banUser.discriminator === "0000") return message.reply("You cannot ban a webhook (What did it ever do to you?!).");

	const banMember = message.guild.members.get(banUser.id);
	if(banMember){
		if(banMember.highestRole.calculatedPosition >= message.guild.me.highestRole.calculatedPosition) return message.reply("That users powerlevel is higher than mine, I am unable to ban them.");
		if(!banMember.banable) return message.reply("With all the powers bestowed in me, I am unable to ban that user.");
	}

	let reason = args.join(" ");
	if(!reason) reason = "Not Specified";

	let mContent;
	if(message.channel.memberPermissions(message.guild.me).has("EMBED_LINKS")){
		mContent = new Discord.RichEmbed()
			.setAuthor(`${banUser.tag} (${banUser.id})`, banUser.displayAvatarURL)
			.setColor(16711680)
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
						.setColor(16711680)
						.setTitle("Working..")
						.setFooter(message.author.tag, message.author.displayAvatarURL)
						.setTimestamp();

					return m.edit({ embed }).then(m => {
						const embed = new Discord.RichEmbed()
							.setAuthor(`${banUser.tag} (${banUser.id})`, banUser.displayAvatarURL)
							.setColor(16711680)
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
						return m.edit(`\`${user.tag}\` was succesfully banned.`);
					}).catch(e => {
						return m.edit(`Ruh roh, I was unable to ban \`${banUser.tag}\`\nReason: ${e.message}`);
					});

				});

			}
			if(msg.toLowerCase() === "no" || msg.toLowerCase() === "n"){
				if(message.channel.memberPermissions(message.guild.me).has("EMBED_LINKS")){
					const embed = new Discord.RichEmbed()
						.setAuthor(`${banUser.tag} (${banUser.id})`, banUser.displayAvatarURL)
						.setColor(16711680)
						.setTitle(`Command Canceled.`)
						.setFooter(message.author.tag, message.author.displayAvatarURL)
						.setTimestamp();
					return m.edit({ embed });
				}
				return m.edit("Command Canceled.");
			}
		}).catch(() => {
			if(message.channel.memberPermissions(message.guild.me).has("EMBED_LINKS")){
				const embed = new Discord.RichEmbed()
					.setAuthor(`${banUser.tag} (${banUser.id})`, banUser.displayAvatarURL)
					.setColor(16711680)
					.setTitle(`Command Canceled.`)
					.setFooter(message.author.tag, message.author.displayAvatarURL)
					.setTimestamp();
				return m.edit({ embed });
			}
			return m.edit("Command Canceled.");
		});
	});

};

exports.conf = {
	enabled: true,
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
