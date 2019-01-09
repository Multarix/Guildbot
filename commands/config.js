const sql = require("sqlite");
exports.run = async (client, message, args, level) => {
	const good = client.emojis.get("340357918996299778");

	sql.get(`SELECT * FROM settings WHERE guildID = "${message.guild.id}"`).then(data => {

		let admins = data.adminRole;
		let mods = data.modRole;
		let members = data.memberRole;

		let membersID;
		if(members === "null"){
			members = "Not Set";
		} else {
			if(!message.guild.roles.get(members)){
				members = "Invalid Role";
			} else {
				membersID = message.guild.roles.get(members).id;
				members = message.guild.roles.get(members).name;
			}
		}

		let modsID;
		if(mods === "null"){
			mods = "Not Set";
		} else {
			if(!message.guild.roles.get(mods)){
				mods = "Invalid Role";
			} else {
				modsID = message.guild.roles.get(mods).id;
				mods = message.guild.roles.get(mods).name;
			}
		}

		let adminsID;
		if(admins === "null"){
			admins = "Not Set";
		} else {
			if(!message.guild.roles.get(admins)){
				admins = "Invalid Role";
			} else {
				adminsID = message.guild.roles.get(admins).id;
				admins = message.guild.roles.get(admins).name;
			}
		}

		let roleName = args[0];

		if (!roleName){
			return message.channel.send(`=== Guild Settings ===
----------------------
[•](Prefix)             <=>       < ${data.prefix} >
[•](Admin Role)         <=>       < ${admins} >
[•](Member Role)        <=>       < ${members} >
[•](Moderator Role)     <=>       < ${mods} >`, { code: "markdown" });
		} else {

			roleName = roleName.toLowerCase();

			if(roleName === "admin" || roleName === "admins"){
				if(admins === "Invalid Role" || admins === "Not Set"){
					return message.channel.send(`[•](Admin Role)  ::  < ${admins} >`, { code: "markdown" });
				} else {
					return message.channel.send(`[•](Admin Role)  ::  [${admins}](${adminsID})`, { code: "markdown" });
				}
			}

			if(roleName === "moderator" || roleName === "moderators" || roleName === "mod" || roleName === "mods"){
				if(mods === "Invalid Role" || mods === "Not Set"){
					return message.channel.send(`[•](Mod Role)  ::  < ${mods} >`, { code: "markdown" });
				} else {
					return message.channel.send(`[•](Mod Role)  ::  [${mods}](${modsID})`, { code: "markdown" });
				}
			}

			if(roleName === "member" || roleName === "members"){
				if(members === "Invalid Role" || members === "Not Set"){
					return message.channel.send(`[•](Member Role)  ::  < ${members} >`, { code: "markdown" });
				} else {
					return message.channel.send(`[•](Member Role)  ::  [${members}](${membersID})`, { code: "markdown" });
				}
			}

			if(roleName === "prefix"){
				return message.channel.send(`[•](Prefix)  ::  [${data.prefix}](${data.guildID})`, { code: "markdown" });
			}

			if(roleName === "set"){
				if(!args[1]){
					return message.channel.send("Usage: [roles](set)< Admin/Mod/Member/Prefix >", { code: "markdown" }).then(m => {
						if(message.channel.memberPermissions(message.guild.me).has("MANAGE_MESSAGES")){
							m.delete(10000);
							message.delete(10000);
						} else {
							m.delete(10000);
						}
					});
				} else {
					roleName = args[1].toLowerCase();
					const roleMention = message.mentions.roles.first();

					let sqlName = "invalid";
					let realName;

					if(roleName === "prefix"){
						if(!args[2]) return message.channel.send(`No prefix was defined, your current prefix is still \`${data.prefix}\``);
						return sql.get(`UPDATE settings SET prefix = "${args[2]}" WHERE guildID = "${message.guild.id}"`).then(() => {
							message.channel.send(`Prefix has been set to \`${args[2]}\``).then(m => {
								client.log(`${message.guild.name} (${message.guild.id}) changed their prefix to "${args[2]}"`, `SQL`);
								if(message.channel.memberPermissions(message.guild.me).has("MANAGE_MESSAGES")){
									message.delete(10000);
								}
								m.delete(10000);
							});
						});
					}

					if(roleName === "admin" || roleName === "admins"){
						sqlName = "adminRole";
						realName = "Admin";
					}
					if(roleName === "moderator" || roleName === "moderators" || roleName === "mod" || roleName === "mods"){
						sqlName = "modRole";
						realName = "Moderator";
					}
					if(roleName === "member" || roleName === "members"){
						sqlName = "adminRole";
						realName = "Member";
					}

					if(sqlName === "invalid"){
						return message.channel.send(`\`${roleName.toProperCase()}\` doesn't appear to be a valid argument, acceptable arguments are:\n\`Admin\`, \`Moderator\` or \`Member\`.`);
					}

					if(args[2] === "delete"){
						return sql.run(`UPDATE settings SET ${sqlName} = "null" WHERE guildID = "${message.guild.id}"`).then(() => {
							message.channel.send(`Your role settings have been updated.\nThe \`${realName}\` role has been unset`).then(m => {
								if(message.channel.memberPermissions(message.guild.me).has("MANAGE_MESSAGES")){
									m.delete(10000);
									message.delete(10000);
								} else {
									m.delete(10000);
								}
							});
						});
					}

					if(!roleMention){
						return message.channel.send("No Role Mentioned");
					} else {
						return sql.run(`UPDATE settings SET ${sqlName} = "${roleMention.id}" WHERE guildID = "${message.guild.id}"`).then(() => {
							client.log(`"${message.guild.name}" (${message.guild.id}) changed their ${realName} role to "${roleMention.name}" (${roleMention.id})`, "SQL");
							message.react(good);
							message.channel.send(`Your role settings have been updated.\n\`@${roleMention.name}\` is now the \`${realName}\` role.`).then(m => {
								if(message.channel.memberPermissions(message.guild.me).has("MANAGE_MESSAGES")){
									m.delete(10000);
									message.delete(10000);
								} else {
									m.delete(10000);
								}
							});
						});
					}
				}
			}

		}
		return message.channel.send(`\`${roleName.toProperCase()}\` doesn't appear to be a valid argument, acceptable arguments are:\n\`Admin\`, \`Moderator\`, \`Member\`, \`Prefix\` or \`Set\`.`).then(m =>{
			if(message.channel.memberPermissions(message.guild.me).has("MANAGE_MESSAGES")){
				m.delete(10000);
				message.delete(10000);
			} else {
				m.delete(10000);
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
