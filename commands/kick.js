const Discord = require("discord.js");
exports.run = async (client, message, args, level) => {
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

	let mContent;
	if(message.channel.memberPermissions(message.guild.me).has("EMBED_LINKS")){
		mContent = new Discord.RichEmbed()
			.setAuthor(`${kickUser.tag} (${kickUser.id})`, kickUser.displayAvatarURL)
			.setColor(16750080)
			.addField(`Action:`, "Kick", false)
			.addField(`Reason:`, `${reason}`, false)
			.addField(`Are you sure?`, "`Yes` or `No`", false)
			.setFooter(message.author.tag, message.author.displayAvatarURL)
			.setTimestamp();
	} else {
		mContent = `\`\`\`md\n${kickUser.tag} (${kickUser.id})\nAction: kick\nReason: ${reason}\nAre you sure?\nYes or No\`\`\``;
	}

	message.channel.send(mContent).then(m => {
		const response = ["y", "yes", "n", "no"];
		const filter = m => m.author.id === message.author.id && response.includes(m.content.toLowerCase());
		message.channel.awaitMessages(filter, { max: 1, time: 15000, errors: ['time'] }).then(collected => {
			const msg = collected.first().content;
			if(msg.toLowerCase() === "yes" || msg.toLowerCase() === "y"){
				if(message.channel.memberPermissions(message.guild.me).has("EMBED_LINKS")){
					const embed = new Discord.RichEmbed()
						.setAuthor(`${kickUser.tag} (${kickUser.id})`, kickUser.displayAvatarURL)
						.setColor(16750080)
						.setTitle("Working..")
						.setFooter(message.author.tag, message.author.displayAvatarURL)
						.setTimestamp();

					return m.edit({ embed }).then(m => {
						const embed = new Discord.RichEmbed()
							.setAuthor(`${kickUser.tag} (${kickUser.id})`, kickUser.displayAvatarURL)
							.setColor(16750080)
							.setFooter(message.author.tag, message.author.displayAvatarURL)
							.setTimestamp();

						if(kickMember.kickable){
							kickMember.kick().then(member => {
								embed.setTitle(`\`${member.user.tag}\` was succesfully kicked.`);
								return m.edit({ embed });
							});
						}
						embed.setTitle(`Ruh roh, I was unable to kick \`${kickUser.tag}\``);
						return m.edit({ embed });
					});
				}

				m.edit("Working..").then(m => {
					if(kickMember.kickable){
						kickMember.kick().then(member => {
							return m.edit(`\`${member.user.tag}\` was succesfully kicked`);
						});
					}
					return m.edit(`Ruh roh, I was unable to kick \`${kickUser.tag}\``);
				});

			}
			if(msg.toLowerCase() === "no" || msg.toLowerCase() === "n"){
				if(message.channel.memberPermissions(message.guild.me).has("EMBED_LINKS")){
					const embed = new Discord.RichEmbed()
						.setAuthor(`${kickUser.tag} (${kickUser.id})`, kickUser.displayAvatarURL)
						.setColor(16750080)
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
					.setAuthor(`${kickUser.tag} (${kickUser.id})`, kickUser.displayAvatarURL)
					.setColor(16750080)
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
	permLevel: 3,
};

exports.help = {
	name: "kick",
	category: "Moderation",
	description: "Kicks a user from the server",
	usage: "Kick](<..user> <..reason>)",
};
