const Discord = require("discord.js");
exports.run = async (client, message, args, level) => {
	if(message.channel.memberPermissions(message.guild.me).has("KICK_MEMBERS")) return message.channel.send("I don't have permission to kick users\nUsage: [ban](<..user>)", { code: "markdown" });
	const kickUser = grabUser(args.shift());

	if(!kickUser) return message.channel.send("No user was specified.\nUsage: [kick](<..user>)", { code: "markdown" });
	if(kickUser.id === message.author.id) return message.channel.send("You cannot kick yourself.\nUsage: [kick](<..user>)", { code: "markdown" });
	if(kickUser.id === client.user.id) return message.channel.send("I cannot and will not kick myself.\nUsage: [kick](<..user>)", { code: "markdown" });
	if(kickUser.id === message.guild.owner.id) return message.channel.send("I cannot and will not kick the server owner.\nUsage: [kick](<..user>)", { code: "markdown" });
	if(kickUser.discriminator === "0000") return message.channel.send("You cannot kick a webhook\nUsage: [kick](<..user>)", { code: "markdown" });

	const kickMember = message.guild.members.get(kickUser.id);
	if(!kickMember) return message.channel.send("That user does not appear to be in the guild.\nUsage: [kick](<..user>)", { code: "markdown" });
	if(kickMember.highestRole.calculatedPosition >= message.guild.me.highestRole.calculatedPosition) return message.channel.send("That user's highest role is the same or higher than mine.\nUsage: [kick](<..user>)", { code: "markdown" });
	if(!kickMember.kickable) return message.channel.send("For some unforseen reason, I cannot kick that person.\nUsage: [kick](<..user>)", { code: "markdown" });

	let reason = args.join(" ");
	if(!reason) reason = "Not Specified";

	let mContent;
	if(message.channel.memberPermissions(message.guild.me).has("EMBED_LINKS")){
		mContent = new Discord.RichEmbed()
			.setAuthor(`${kickUser.tag} (${kickUser.id})`, kickUser.displayAvatarURL)
			.setColor(16748032)
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
						.setColor(16748032)
						.setTitle("Working..")
						.setFooter(message.author.tag, message.author.displayAvatarURL)
						.setTimestamp();

					return m.edit({ embed }).then(m => {
						const embed = new Discord.RichEmbed()
							.setAuthor(`${kickUser.tag} (${kickUser.id})`, kickUser.displayAvatarURL)
							.setColor(16748032)
							.setFooter(message.author.tag, message.author.displayAvatarURL)
							.setTimestamp();

						if(kickMember.kickable){
							kickMember.kick().then(member => {
								embed.setTitle(`\`${member.user.tag}\` was succesfully kicked`);
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
	permLevel: 3,
};

exports.help = {
	name: "kick",
	category: "Moderation",
	description: "Kicks a user from the server",
	usage: "Kick](<..user> <..reason>)",
};
