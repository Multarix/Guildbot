const sql = require("sqlite");
const Discord = require("discord.js");
exports.run = async (client, message, args, level) => {

	sql.get(`SELECT * FROM settings WHERE guildID = "${message.guild.id}"`).then(data => {

		const test = [ `${data.adminRole}`, `${data.memberRole}`, `${data.modRole}` ];

		let names = "";
		let ids = "";
		let i;
		for(i = 0; i < test.length; i++) {
			if(test[i] === "Null" || !message.guild.roles.get(test[i])){
				names += "Not Set\u200b";
				ids += "Not Set\u200b";
			} else {
				names += `${message.guild.roles.get(test[i]).name}\u200b`;
				ids += `${message.guild.roles.get(test[i]).id}\u200b`;
			}
		}

		ids += "ignore";
		names += "ignore";
		const idData = ids.split("\u200b");
		const nameData = names.split("\u200b");

		let starChannel;
		if(!message.guild.channels.get(data.starChannel)){
			starChannel = "Not Set";
		} else {
			starChannel = message.guild.channels.get(data.starChannel).name;
		}

		let roleName = args[0];

		if (!roleName){
			if(message.channel.memberPermissions(message.guild.me).has("EMBED_LINKS")){
				let ecolor = 13238272;
				if(message.guild.owner.highestRole.color) ecolor = message.guild.owner.highestRole.color;
				const embed = new Discord.RichEmbed()
					.setAuthor(`Guild Settings`)
					.setColor(ecolor)
					.addField("Prefix", `${data.prefix}`, false)
					.addField("Admin Role", nameData[0], false)
					.addField("Member Role", nameData[1], false)
					.addField("Moderator Role", nameData[2], false)
					.addField("Star Channel", starChannel, false)
					.setFooter(client.user.tag, client.user.displayAvatarURL)
					.setTimestamp();

				if(message.guild.iconURL) embed.setThumbnail(message.guild.iconURL);

				return message.channel.send({ embed });
			}
			return message.channel.send(`=== Guild Settings ===
----------------------
[•](Prefix)             <=>     < ${data.prefix} >
[•](Admin Role)         <=>     < ${nameData[0]} >
[•](Member Role)        <=>     < ${nameData[1]} >
[•](Moderator Role)     <=>     < ${nameData[2]} >
[•](Star Channel)       <=>     < ${starChannel} >`, { code: "markdown" });
		}

		roleName = roleName.toLowerCase();

		if(roleName === "prefix") return message.channel.send(`[•](Prefix)   ::   [${data.prefix}](${data.guildID})`, { code: "markdown" });
		if(roleName === "admin" || roleName === "admins") return message.channel.send(`[•](Admin Role)   ::   [${nameData[0]}](${idData[0]})`, { code: "markdown" });
		if(roleName === "member" || roleName === "members") return message.channel.send(`[•](Member Role)   ::   [${nameData[1]}](${idData[1]})`, { code: "markdown" });
		if(roleName === "moderator" || roleName === "moderators" || roleName === "mod" || roleName === "mods") return message.channel.send(`[•](Moderator Role)   ::   [${nameData[2]}](${idData[2]})`, { code: "markdown" });
		if(roleName === "stars" || roleName === "starchannel") return message.channel.send(`[•](Star Channel)   ::   [${starChannel}](${data.starChannel})`, { code: "markdown" });

		if(roleName === "set"){
			if(!args[1]){
				return message.channel.send("Usage: [roles](set)< Prefix/Admin/Mod/Member/Stars >", { code: "markdown" }).then(m => {
					if(message.channel.memberPermissions(message.guild.me).has("MANAGE_MESSAGES")){
						m.delete(10000);
						message.delete(10000);
					}
				});
			}

			roleName = args[1].toLowerCase();
			// Welcome Messages
			if(roleName === "jmsg" || roleName === "jm" || roleName === "joinmsg" || roleName === "join"){
				const joinMsg = args.slice(2).join(" ");
				if(!joinMsg){
					return message.channel.send(`Usage: [config](set) <joinmsg> < message you want >\n
Handy Tips:
-----------
If you put '<@user>' anywhere in the message, it will be converted to a mention of that user.
If you put '<user>' anywhere in the message, it will be converted to that users username.`, { code: "markdown" });
				}
				return sql.get(`UPDATE settings SET joinMessage = "${joinMsg}" WHERE guildID = "${message.guild.id}"`).then(() => {
					const joinExample = joinMsg.replace("<@user>", client.user).replace("<user>", client.user.username);
					message.channel.send(`The welcome message has been saved. An example of your message is below:\n${joinExample}`);
				});
			}

			if(roleName === "welcomechannel" || roleName === "wc" || roleName === "jmcs"){
				const channelMention = message.mentions.channels.first();
				if(!channelMention){
					if(message.channel.id === data.welcomeChannel) return message.channel.send("The welcome message channel is already set to this channel.");

					return sql.get(`UPDATE settings SET welcomeChannel = "${message.channel.id}" WHERE guildID = "${message.guild.id}"`).then(() => {
						client.log();
						message.channel.send(`The welcome message channel has been set to ${message.channel}`).then(m => {
							if(message.channel.memberPermissions(message.guild.me).has("MANAGE_MESSAGES")){
								m.delete(10000);
								message.delete(10000);
							}
						});
					});
				}
				if(channelMention.id === data.welcomeChannel) return message.channel.send("The welcome message channel is already set to that channel.");

				return sql.get(`UPDATE settings SET welcomeChannel = "${channelMention.id}" WHERE guildID = "${message.guild.id}"`).then(() => {
					client.log();
					message.channel.send(`The welcome message channel has been set to ${channelMention}`).then(m => {
						if(message.channel.memberPermissions(message.guild.me).has("MANAGE_MESSAGES")){
							m.delete(10000);
							message.delete(10000);
						}
					});
				});
			}
			// Leave Messages
			if(roleName === "lmsg" || roleName === "lm" || roleName === "leavemsg" || roleName === "leave"){
				const leaveMsg = args.slice(2).join(" ");
				if(!leaveMsg){
					return message.channel.send(`Usage: [config](set) <leavemsg> < message you want >\n
Handy Tips:
-----------
If you put '<@user>' anywhere in the message, it will be converted to a mention of that user.
If you put '<user>' anywhere in the message, it will be converted to that users username.`, { code: "markdown" });
				}
				return sql.get(`UPDATE settings SET leaveMessage = "${leaveMsg}" WHERE guildID = "${message.guild.id}"`).then(() => {
					const leaveExample = leaveMsg.replace("<@user>", client.user).replace("<user>", client.user.username);
					message.channel.send(`The member leave message has been saved. An example of your message is below:\n${leaveExample}`);
				});
			}

			if(roleName === "leavechannel" || roleName === "lc" || roleName === "lmcs"){
				const channelMention = message.mentions.channels.first();
				if(!channelMention){
					if(message.channel.id === data.leaveChannel) return message.channel.send("The leave message channel is already set to this channel.");

					return sql.get(`UPDATE settings SET leaveChannel = "${message.channel.id}" WHERE guildID = "${message.guild.id}"`).then(() => {
						client.log();
						message.channel.send(`The leave message channel has been set to ${message.channel}`).then(m => {
							if(message.channel.memberPermissions(message.guild.me).has("MANAGE_MESSAGES")){
								m.delete(10000);
								message.delete(10000);
							}
						});
					});
				}
				if(channelMention.id === data.leaveChannel) return message.channel.send("The leave message channel is already set to that channel.");

				return sql.get(`UPDATE settings SET leaveChannel = "${channelMention.id}" WHERE guildID = "${message.guild.id}"`).then(() => {
					client.log();
					message.channel.send(`The leave message channel has been set to ${channelMention}`).then(m => {
						if(message.channel.memberPermissions(message.guild.me).has("MANAGE_MESSAGES")){
							m.delete(10000);
							message.delete(10000);
						}
					});
				});
			}
			// Prefix
			if(roleName === "prefix"){
				if(!args[2]) return message.channel.send(`Usage:\n[config](set) <prefix> < new prefix >`, { code: "markdown" });
				if(args[2] === data.prefix) return message.channel.send(`The prefix is already set to \`${data.prefix}\``);

				return sql.get(`UPDATE settings SET prefix = "${args[2]}" WHERE guildID = "${message.guild.id}"`).then(() => {
					client.log(`"${message.guild.name}" changed their prefix to "${args[2]}"`, `SQL`);
					message.channel.send(`Prefix has been set to \`${args[2]}\``).then(m => {
						if(message.channel.memberPermissions(message.guild.me).has("MANAGE_MESSAGES")){
							m.delete(10000);
							message.delete(10000);
						}
					});
				});
			}
			// Star Channel
			if(roleName === "stars" || roleName === "starchannel"){
				const channelMention = message.mentions.channels.first();
				if(!channelMention){
					return sql.get(`UPDATE settings SET starChannel = "${message.channel.id}" WHERE guildID = "${message.guild.id}"`).then(() => {
						client.log(`"${message.guild.name}" set their Star Channel to "${message.channel.name}" (${message.channel.id})`, `SQL`);
						message.channel.send("The current channel will be used for the star channel.\nYou can delete this setting by doing:\n```md\n[config](delete) <starchannel>\n```");
					});
				} else {
					return sql.get(`UPDATE settings SET starChannel = "${channelMention.id}" WHERE guildID = "${message.guild.id}"`).then(() => {
						client.log(`"${message.guild.name}" set their Star Channel to "${channelMention.name}" (${channelMention.id})`, `SQL`);
						message.channel.send(`The \`${channelMention.name}\` channel will be used for the star channel.\nYou can delete this setting by doing:\n\`\`\`md\n[config](delete) <starchannel>\n\`\`\``);
					});
				}
			}

			let sqlName = "invalid";
			let realName = "invalid";

			if(roleName === "admin" || roleName === "admins"){
				sqlName = "adminRole";
				realName = "Admin";
			}
			if(roleName === "moderator" || roleName === "moderators" || roleName === "mod" || roleName === "mods"){
				sqlName = "modRole";
				realName = "Moderator";
			}
			if(roleName === "member" || roleName === "members"){
				sqlName = "memberRole";
				realName = "Member";
			}

			if(sqlName === "invalid" || realName === "invalid") return message.channel.send(`\`${roleName.toProperCase()}\` doesn't appear to be a valid argument, acceptable arguments are:\n\`Admin\`, \`Moderator\`, \`Member\`, \`Prefix\` or \`Stars\`.`);

			const roleMention = message.mentions.roles.first();

			if(!roleMention) return message.channel.send(`No role was mentioned. Usage:\n[${data.prefix}config](set) < admin/member/moderator > <@role>`, { code: "markdown" });

			return sql.run(`UPDATE settings SET ${sqlName} = "${roleMention.id}" WHERE guildID = "${message.guild.id}"`).then(() => {
				client.log(`"${message.guild.name}" changed their ${realName} role to "@${roleMention.name}" (${roleMention.id})`, "SQL");
				message.channel.send(`Your permission settings have been updated.\n\`@${roleMention.name}\` is now the \`${realName}\` role.`).then(m => {
					if(message.channel.memberPermissions(message.guild.me).has("MANAGE_MESSAGES")){
						m.delete(10000);
						message.delete(10000);
					}
				});
			});
		}
		// Delete/ Remove/ Reset things
		if(roleName === "delete" || roleName === "reset" || roleName === "disable"){
			if(!args[1]){
				return message.channel.send("Usage: [roles](reset)< Prefix/Admin/Mod/Member/Stars >", { code: "markdown" }).then(m => {
					if(message.channel.memberPermissions(message.guild.me).has("MANAGE_MESSAGES")){
						m.delete(10000);
						message.delete(10000);
					}
				});
			}

			roleName = args[1].toLowerCase();
			// Welcome Message
			if(roleName === "jmsg" || roleName === "jm" || roleName === "joinmsg" || roleName === "join"){
				if(data.joinMessage === "null") return message.channel.send("The member join message is already disabled and therefore cannot be removed.");
				return sql.get(`UPDATE settings SET joinMessage = "null" WHERE guildID = "${message.guild.id}"`).then(() => {
					client.log(`"${message.guild.name}" removed their member join message`, `SQL`);
					message.channel.send("The join message has been removed.").then(m => {
						if(message.channel.memberPermissions(message.guild.me).has("MANAGE_MESSAGES")){
							m.delete(10000);
							message.delete(10000);
						}
					});
				});
			}

			if(roleName === "welcomechannel" || roleName === "wc" || roleName === "jmcs"){
				if(data.welcomeChannel === "null") return message.channel.send("The welcome message channel is already disabled and therefore cannot be removed.");
				return sql.get(`UPDATE settings SET welcomeChannel = "null" WHERE guildID = "${message.guild.id}"`).then(() => {
					client.log(`"${message.guild.name}" removed their welcome message channel`, `SQL`);
					message.channel.send("The welcome message channel has been removed.").then(m => {
						if(message.channel.memberPermissions(message.guild.me).has("MANAGE_MESSAGES")){
							m.delete(10000);
							message.delete(10000);
						}
					});
				});
			}
			// Leave Messages
			if(roleName === "lmsg" || roleName === "lm" || roleName === "leavemsg" || roleName === "leave"){
				if(data.leaveMessage === "null") return message.channel.send("The join message is already disabled and therefore cannot be removed.");
				return sql.get(`UPDATE settings SET leaveMessage = "null" WHERE guildID = "${message.guild.id}"`).then(() => {
					client.log(`"${message.guild.name}" removed their member join message`, `SQL`);
					message.channel.send("The leave message has been removed.").then(m => {
						if(message.channel.memberPermissions(message.guild.me).has("MANAGE_MESSAGES")){
							m.delete(10000);
							message.delete(10000);
						}
					});
				});
			}

			if(roleName === "leavechannel" || roleName === "lc" || roleName === "lmcs"){
				if(data.leaveChannel === "null") return message.channel.send("The leave message channel is already disabled and therefore cannot be removed.");
				return sql.get(`UPDATE settings SET leaveChannel = "null" WHERE guildID = "${message.guild.id}"`).then(() => {
					client.log(`"${message.guild.name}" removed their leave message channel`, `SQL`);
					message.channel.send("The leave message channel has been removed.").then(m => {
						if(message.channel.memberPermissions(message.guild.me).has("MANAGE_MESSAGES")){
							m.delete(10000);
							message.delete(10000);
						}
					});
				});
			}
			// Prefix
			if(roleName === "prefix"){
				if(data.prefix === client.config.prefix) return message.channel.send("Your prefix is already set to default, therefore cannot be reset.");
				return sql.get(`UPDATE settings SET prefix = "${client.config.prefix}" WHERE guildID = ${message.guild.id}`).then(() => {
					client.log(`"${message.guild.name}" changed their prefix to "${client.config.prefix}"`, `SQL`);
					message.channel.send(`Your prefix has been reset to \`${client.config.prefix}\``).then(m => {
						if(message.channel.memberPermissions(message.guild.me).has("MANAGE_MESSAGES")){
							m.delete(10000);
							message.delete(10000);
						}
					});
				});
			}
			// Star Channel
			if(roleName === "stars" || roleName === "starchannel"){
				if(data.starChannel === "null") return message.channel.send("The star channel is not currently set and therefore cannot be removed.");
				return sql.get(`UPDATE settings SET starChannel = "null" WHERE guildID = ${message.guild.id}`).then(() => {
					message.channel.send("The star channel has been removed.").then(m => {
						if(message.channel.memberPermissions(message.guild.me).has("MANAGE_MESSAGES")){
							m.delete(10000);
							message.delete(10000);
						}
					});
				});
			}
			// Permission level roles
			let sqlName = "invalid";
			let realName = "invalid";

			if(roleName === "admin" || roleName === "admins"){
				if(data.adminRole === "null") return message.channel.send(`The \`Admin\` level permission check is already disabled.`);
				sqlName = "adminRole";
				realName = "Admin";
			}
			if(roleName === "moderator" || roleName === "moderators" || roleName === "mod" || roleName === "mods"){
				if(data.modRole === "null") return message.channel.send(`The \`Moderator\` level permission check is already disabled.`);
				sqlName = "modRole";
				realName = "Moderator";
			}
			if(roleName === "member" || roleName === "members"){
				if(data.memberRole === "null") return message.channel.send(`The \`Member\` level permission check is already disabled.`);
				sqlName = "memberRole";
				realName = "Member";
			}

			if(sqlName === "invalid" || realName === "invalid") return message.channel.send(`\`${roleName.toProperCase()}\` doesn't appear to be a valid argument, acceptable arguments are:\n\`Admin\`, \`Moderator\`, \`Member\`, \`Prefix\` or \`Stars\`.`);

			return sql.run(`UPDATE settings SET ${sqlName} = "null" WHERE guildID = "${message.guild.id}"`).then(() => {
				client.log(`"${message.guild.name}" removed their ${realName} level permission check`, "SQL");
				message.channel.send(`Your permission settings have been updated.\nThe \`${realName}\` level permission check has been disabled`).then(m => {
					if(message.channel.memberPermissions(message.guild.me).has("MANAGE_MESSAGES")){
						m.delete(10000);
						message.delete(10000);
					}
				});
			});
		}

		return message.channel.send(`\`${args[0].toProperCase()}\` doesn't appear to be a valid argument, acceptable arguments are:\n\`Prefix\`, \`Admin\`, \`Moderator\`, \`Member\`, \`Stars\`, \`Set\` or \`Reset\`.`).then(m => {
			if(message.channel.memberPermissions(message.guild.me).has("MANAGE_MESSAGES")){
				m.delete(10000);
				message.delete(10000);
			}
		});
	});
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: ["bot"],
	permLevel: 4,
};

exports.help = {
	name: "config",
	category: "System",
	description: "View or change bot settings.",
	usage: "config](<..variable>)",
};
