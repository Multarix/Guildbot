const sql = require("sqlite");
const Discord = require("discord.js");
exports.run = async (client, message, args, level) => {

	const data = await sql.get(`SELECT * FROM settings WHERE guild = "${message.guild.id}"`);

	const test = [ `${data.admin}`, `${data.member}`, `${data.moderator}` ];

	let names = "";
	let ids = "";
	let i;
	for(i = 0; i < test.length; i++){
		if(!test[i] || !message.guild.roles.get(test[i])){
			names += "Not Set\u200b";
			ids += "Not Set\u200b";
		} else {
			names += `@${message.guild.roles.get(test[i]).name}\u200b`;
			ids += `${message.guild.roles.get(test[i]).id}\u200b`;
		}
	}

	ids += "ignore";
	names += "ignore";
	const idData = ids.split("\u200b");
	const nameData = names.split("\u200b");

	let starboard;
	if(!message.guild.channels.get(data.starboard)){
		starboard = "Not Set";
	} else {
		starboard = "#" + message.guild.channels.get(data.starboard).name.toProperCase();
	}

	let roleName = args[0];

	if(!roleName){
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
				.addField("Starboard", starboard, false)
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
[•](Starboard)          <=>     < ${starboard} >`, { code: "markdown" });
	}

	roleName = roleName.toLowerCase();

	if(roleName === "prefix") return message.channel.send(`[•](Prefix)   ::   [${data.prefix}](${data.guild})`, { code: "markdown" });
	if(roleName === "admin" || roleName === "admins") return message.channel.send(`[•](Admin Role)   ::   [${nameData[0]}](${idData[0]})`, { code: "markdown" });
	if(roleName === "member" || roleName === "members") return message.channel.send(`[•](Member Role)   ::   [${nameData[1]}](${idData[1]})`, { code: "markdown" });
	if(roleName === "moderator" || roleName === "moderators" || roleName === "mod" || roleName === "mods") return message.channel.send(`[•](Moderator Role)   ::   [${nameData[2]}](${idData[2]})`, { code: "markdown" });
	if(roleName === "stars" || roleName === "starchannel" || roleName === "starboard") return message.channel.send(`[•](Starboard)   ::   [${starboard}](${data.starboard})`, { code: "markdown" });

	let aliases = [];
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
		aliases = ["joinmessage", "jm", "welcomemessage", "wm", "jmsg", "wmsg"];
		if(aliases.includes(roleName)){
			const joinMsg = args.slice(2).join(" ").replace(/\u200b/g, "\n");
			if(!joinMsg){
				return message.channel.send(`Usage: [config](set) joinmessage < message you want >\n
Handy Tips:
-----------
If you put '<@user>' anywhere in the message, it will be converted to a mention of that user.
If you put '<user>' anywhere in the message, it will be converted to that users username.`, { code: "markdown" });
			}
			return sql.get(`UPDATE settings SET joinMsg = '${sanity(joinMsg)}' WHERE guild = "${message.guild.id}"`).then(() => {
				client.log(`"${message.guild.name}" set their welcome message`, `SQL`);
				const joinExample = joinMsg.replace(/<@user>/g, client.user).replace(/<user>/g, client.user.username);
				message.channel.send(`The welcome message has been saved. An example of your message is below:\n${joinExample}`);
			});
		}
		// Welcome Channel
		aliases = ["welcomechannel", "wchnl", "wc", "wmc"];
		if(aliases.includes(roleName)){
			const channelMention = grabChannel(args[2]);
			let channel = message.channel;
			if(channelMention) channel = channelMention;

			if(channel.id === data.joinChannel) return message.channel.send(`${channel} is already set as the welcome channel.\n\nYou can delete this setting by doing:\n\`\`\`md\n[config](delete) wmc\n\`\`\``);
			return sql.get(`UPDATE settings SET joinChannel = "${channel.id}" WHERE guild = "${message.guild.id}"`).then(() => {
				client.log(`"${message.guild.name}" set their welcome message channel to "${channel.name}" (${channel.id})`, `SQL`);
				message.channel.send(`The welcome message channel has been set to ${channel}.\n\nYou can delete this setting by doing:\n\`\`\`md\n[config](delete) wmc\n\`\`\``).then(m => {
					if(message.channel.memberPermissions(message.guild.me).has("MANAGE_MESSAGES")){
						m.delete(10000);
						message.delete(10000);
					}
				});
			});
		}
		// Leave Messages
		aliases = ["byemessage", "byeemsg", "bmsg", "bm", "lm"];
		if(aliases.includes(roleName)){
			const leaveMsg = args.slice(2).join(" ").replace(/\u200b/g, "\n");
			if(!leaveMsg){
				return message.channel.send(`Usage: [config](set) leavemessage < message you want >\n
Handy Tips:
-----------
If you put '<@user>' anywhere in the message, it will be converted to a mention of that user.
If you put '<user>' anywhere in the message, it will be converted to that users username.`, { code: "markdown" });
			}
			return sql.get(`UPDATE settings SET leaveMsg = '${sanity(leaveMsg)}' WHERE guild = "${message.guild.id}"`).then(() => {
				client.log(`"${message.guild.name}" set their goodbye message`, `SQL`);
				const leaveExample = leaveMsg.replace(/<@user>/g, client.user).replace(/<user>/g, client.user.username);
				message.channel.send(`The goodbye message has been saved. An example of your message is below:\n${leaveExample}`);
			});
		}
		// Leave Message Channel
		aliases = ["goodbye", "gchnl", "gc", "gmc", "lmc"];
		if(aliases.includes(roleName)){
			const channelMention = grabChannel(args[2]);
			let channel = message.channel;
			if(channelMention) channel = channelMention;

			if(channel.id === data.leaveChannel) return message.channel.send(`${channel} is already set as the goodbye channel.\n\nYou can delete this setting by doing:\n\`\`\`md\n[config](delete) lmc\n\`\`\``);
			return sql.get(`UPDATE settings SET leaveChannel = "${channel.id}" WHERE guild = "${message.guild.id}"`).then(() => {
				client.log(`"${message.guild.name}" set their goodbye channel to "${channel.name}" (${channel.id})`, `SQL`);
				message.channel.send(`The goodbye channel has been set to ${channel}.\n\nYou can delete this setting by doing:\n\`\`\`md\n[config](delete) lmc\n\`\`\``).then(m => {
					if(message.channel.memberPermissions(message.guild.me).has("MANAGE_MESSAGES")){
						m.delete(10000);
						message.delete(10000);
					}
				});
			});
		}

		// Prefix
		aliases = ["prefix"];
		if(aliases.includes(roleName)){
			if(!args[2]) return message.channel.send(`Usage:\n[config](set) prefix < new prefix >`, { code: "markdown" });
			if(args[2] === data.prefix) return message.channel.send(`The prefix is already set to \`${data.prefix}\``);

			return sql.get(`UPDATE settings SET prefix = '${sanity(args[2])}' WHERE guild = "${message.guild.id}"`).then(() => {
				client.log(`"${message.guild.name}" changed their prefix to '${args[2]}'`, `SQL`);
				message.channel.send(`Prefix has been set to \`${args[2]}\`\n\nYou can delete this setting by doing:\n\`\`\`md\n[config](delete) prefix\n\`\`\``).then(m => {
					if(message.channel.memberPermissions(message.guild.me).has("MANAGE_MESSAGES")){
						m.delete(10000);
						message.delete(10000);
					}
				});
			});
		}
		// Starboard
		aliases = ["stars", "starchannel", "starboard"];
		if(aliases.includes(roleName)){
			const channelMention = grabChannel(args[2]);
			let channel = message.channel;
			if(channelMention) channel = channelMention;

			if(channel.id === data.starboard) return message.channel.send(`The channel is already set as the starboard.\n\nYou can delete this setting by doing:\n\`\`\`md\n[config](delete) starboard\n\`\`\``);
			return sql.get(`UPDATE settings SET starboard = "${channel.id}" WHERE guild = "${message.guild.id}"`).then(() => {
				client.log(`"${message.guild.name}" set their Starboard to "${channel.name}" (${channel.id})`, `SQL`);
				message.channel.send(`The \`${channel.name}\` channel will be used as the starboard.\n\nYou can delete this setting by doing:\n\`\`\`md\n[config](delete) starboard\n\`\`\``);
			});
		}

		let sqlName = "invalid";
		let realName = "invalid";
		let dataCheck;
		aliases = ["admin", "admins"];
		if(aliases.includes(roleName)){
			sqlName = "admin";
			realName = "Admin";
			dataCheck = data.admin;
		}
		aliases = ["moderator", "moderators", "mod", "mods"];
		if(aliases.includes(roleName)){
			sqlName = "moderator";
			realName = "Moderator";
			dataCheck = data.moderator;
		}
		aliases = ["member", "members"];
		if(aliases.includes(roleName)){
			sqlName = "member";
			realName = "Member";
			dataCheck = data.member;
		}

		if(sqlName === "invalid" || realName === "invalid") return message.channel.send(`\`${roleName.toProperCase()}\` doesn't appear to be a valid argument, acceptable arguments are:\n\`Admin\`, \`Moderator\`, \`Member\`, \`Prefix\` or \`Stars\`.`);

		const roleMention = grabRole(args[2], message.guild);

		if(!roleMention) return message.channel.send(`No role was mentioned. Usage:\n[config](set) < admin/member/moderator > <@role>`, { code: "markdown" });
		if(roleMention.id === dataCheck) return message.channel.send(`That role is already the \`${realName}\` role.\n\nYou can delete this setting by doing:\n\`\`\`md\n[config](delete) ${realName}\`\`\``);

		return sql.run(`UPDATE settings SET ${sqlName} = "${roleMention.id}" WHERE guild = "${message.guild.id}"`).then(() => {
			client.log(`"${message.guild.name}" changed their ${realName} role to "@${roleMention.name}" (${roleMention.id})`, "SQL");
			message.channel.send(`Your permission settings have been updated.\n\`@${roleMention.name}\` is now the \`${realName}\` role.\n\nYou can delete this setting by doing:\n\`\`\`md\n[config](delete) ${realName}\`\`\``).then(m => {
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
			return message.channel.send("Usage: [roles](reset)< setting >", { code: "markdown" }).then(m => {
				if(message.channel.memberPermissions(message.guild.me).has("MANAGE_MESSAGES")){
					m.delete(10000);
					message.delete(10000);
				}
			});
		}

		roleName = args[1].toLowerCase();
		// Welcome Message
		aliases = ["joinmessage", "jm", "welcomemessage", "wm", "jmsg", "wmsg"];
		if(aliases.includes(roleName)){
			if(!data.joinMsg) return message.channel.send("The welcome message is already disabled and therefore cannot be removed.");
			return sql.get(`UPDATE settings SET joinMsg = null WHERE guild = "${message.guild.id}"`).then(() => {
				client.log(`"${message.guild.name}" removed their welcome message`, `SQL`);
				message.channel.send("The welcome message has been removed.").then(m => {
					if(message.channel.memberPermissions(message.guild.me).has("MANAGE_MESSAGES")){
						m.delete(10000);
						message.delete(10000);
					}
				});
			});
		}
		// Welcome Channel
		aliases = ["welcomechannel", "wchnl", "wc", "wmc"];
		if(aliases.includes(roleName)){
			if(!data.joinChannel) return message.channel.send("The welcome message channel is already disabled and therefore cannot be removed.");
			return sql.get(`UPDATE settings SET joinChannel = null WHERE guild = "${message.guild.id}"`).then(() => {
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
		aliases = ["byemessage", "byeemsg", "bmsg", "bm", "lm"];
		if(aliases.includes(roleName)){
			if(!data.leaveMsg) return message.channel.send("The goodbye message is already disabled and therefore cannot be removed.");
			return sql.get(`UPDATE settings SET leaveMsg = null WHERE guild = "${message.guild.id}"`).then(() => {
				client.log(`"${message.guild.name}" removed their goodbye message`, `SQL`);
				message.channel.send("The goodbye message has been removed.").then(m => {
					if(message.channel.memberPermissions(message.guild.me).has("MANAGE_MESSAGES")){
						m.delete(10000);
						message.delete(10000);
					}
				});
			});
		}

		// Leave Message Channel
		aliases = ["goodbye", "gchnl", "gc", "gmc", "lmc"];
		if(aliases.includes(roleName)){
			if(!data.leaveChannel) return message.channel.send("The goodbye channel is already disabled and therefore cannot be removed.");
			return sql.get(`UPDATE settings SET leaveChannel = null WHERE guild = "${message.guild.id}"`).then(() => {
				client.log(`"${message.guild.name}" removed their goodbye channel`, `SQL`);
				message.channel.send("The goodbye channel has been removed.").then(m => {
					if(message.channel.memberPermissions(message.guild.me).has("MANAGE_MESSAGES")){
						m.delete(10000);
						message.delete(10000);
					}
				});
			});
		}
		// Prefix
		aliases = ["prefix"];
		if(aliases.includes(roleName)){
			if(data.prefix === client.config.prefix) return message.channel.send("Your prefix is already set to default, therefore cannot be reset.");
			return sql.get(`UPDATE settings SET prefix = "${client.config.prefix}" WHERE guild = "${message.guild.id}"`).then(() => {
				client.log(`"${message.guild.name}" changed their prefix to "${client.config.prefix}"`, `SQL`);
				message.channel.send(`Your prefix has been reset to \`${client.config.prefix}\``).then(m => {
					if(message.channel.memberPermissions(message.guild.me).has("MANAGE_MESSAGES")){
						m.delete(10000);
						message.delete(10000);
					}
				});
			});
		}
		// Starboard
		aliases = ["stars", "starchannel", "starboard"];
		if(aliases.includes(roleName)){
			if(!data.starboard) return message.channel.send("The Starboard is not currently set and therefore cannot be removed.");
			return sql.get(`UPDATE settings SET starboard = null WHERE guild = ${message.guild.id}`).then(() => {
				message.channel.send("The Starboard has been removed.").then(m => {
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

		aliases = ["admin", "admins"];
		if(aliases.includes(roleName)){
			if(!data.admin) return message.channel.send(`The \`Admin\` level permission check is already disabled.`);
			sqlName = "admin";
			realName = "Admin";
		}
		aliases = ["moderator", "moderators", "mod", "mods"];
		if(aliases.includes(roleName)){
			if(!data.moderator) return message.channel.send(`The \`Moderator\` level permission check is already disabled.`);
			sqlName = "moderator";
			realName = "Moderator";
		}
		aliases = ["member", "members"];
		if(aliases.includes(roleName)){
			if(data.member) return message.channel.send(`The \`Member\` level permission check is already disabled.`);
			sqlName = "member";
			realName = "Member";
		}

		if(sqlName === "invalid" || realName === "invalid") return message.channel.send(`\`${roleName.toProperCase()}\` doesn't appear to be a valid argument, acceptable arguments are:\n\`Admin\`, \`Moderator\`, \`Member\`, \`Prefix\` or \`Stars\`.`);

		return sql.run(`UPDATE settings SET ${sqlName} = null WHERE guild = "${message.guild.id}"`).then(() => {
			client.log(`"${message.guild.name}" removed their ${realName} level permission check`, "SQL");
			message.channel.send(`Your permission settings have been updated.\nThe \`${realName}\` level permission check has been disabled`).then(m => {
				if(message.channel.memberPermissions(message.guild.me).has("MANAGE_MESSAGES")){
					m.delete(10000);
					message.delete(10000);
				}
			});
		});
	}

	return message.channel.send(`\`${args[0].toProperCase()}\` doesn't appear to be a valid argument. Usage:\n\`\`\`md\n[config](set/delete) < setting >\`\`\``).then(m => {
		if(message.channel.memberPermissions(message.guild.me).has("MANAGE_MESSAGES")){
			m.delete(10000);
			message.delete(10000);
		}
	});
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: ["bot"],
	permLevel: 5,
};

exports.help = {
	name: "config",
	category: "System",
	description: "View or change bot settings.",
	usage: "..variable",
};
