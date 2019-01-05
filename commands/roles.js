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
				const membersID = message.guild.roles.get(members).id;
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
				const modsID = message.guild.roles.get(mods).id;
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
				const adminsID = message.guild.roles.get(admins).id;
				admins = message.guild.roles.get(admins).name;
			}
		}

		let roleName = args[0];

		if (!roleName){
			return message.channel.send(`Admin Role:         < ${admins} >\nMember Role:        < ${members} >\nModerator Role:     < ${mods} >`, { code: "markdown" });
		} else {

			roleName = roleName.toLowerCase();

			if(roleName === "admin" || roleName === "admins"){
				if(admins === "Invalid Role" || admins === "Not Set"){
					return message.channel.send(`Admin Role:     < ${admins} >`, { code: "markdown" });
				} else {
					return message.channel.send(`Admin Role:     [${admins}](${adminsID})`, { code: "markdown" });
				}
			}

			if(roleName === "moderator" || roleName === "moderators" || roleName === "mod" || roleName === "mods"){
				if(mods === "Invalid Role" || mods === "Not Set"){
					return message.channel.send(`Mod Role:       < ${mods} >`, { code: "markdown" });
				} else {
					return message.channel.send(`Mod Role:       [${mods}](${modsID})`, { code: "markdown" });
				}
			}

			if(roleName === "member" || roleName === "members"){
				if(members === "Invalid Role" || members === "Not Set"){
					return message.channel.send(`Member Role:    < ${members} >`, { code: "markdown" });
				} else {
					return message.channel.send(`Member Role:    [${members}](${membersID})`, { code: "markdown" });
				}
			}

			if(roleName === "set"){
				if(!args[1]){
					return message.channel.send(`Yo dawg, what the fuck. I can't set your new role if you don't give me the full deets`).then(m => {
						m.delete(7000);
						message.delete(7000);
					});
				} else {
					roleName = args[1].toLowerCase();
					const roleMention = message.mentions.roles.first();

					let sqlName = "invalid";
					let realName;
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
						return message.channel.send(`"${roleName.toProperCase()}" doesn't appear to be a valid argument, acceptable arguments are:\n\`Admin\`, \`Moderator\` or \`Member\`.`);
					}

					if(!roleMention){
						return message.channel.send("Yo dude whatup.. I just wanted to let you know that YOU DIDN'T MENTION A ROLE");
					} else {
						return sql.run(`UPDATE settings SET ${sqlName} = "${roleMention.id}" WHERE guildID = "${message.guild.id}"`).then(() => {
							client.log(`"${message.guild.name}" (${message.guild.id}) changed their ${realName} role to "${roleMention.name}" (${roleMention.id})`, "SQL");
							message.react(good);
							message.channel.send(`Your role settings have been updated.\n"${roleMention.name}" is now the ${realName} role.`).then(m => {
								m.delete(7000);
								message.delete(7000);
							});
						});
					}
				}
			}

		}
		return message.channel.send(`"${roleName.toProperCase()}" doesn't appear to be a valid argument, acceptable arguments are:\n\`Admin\`, \`Moderator\`, \`Member\` or \`Set\`.`).then(m =>{
			m.delete(7000);
			message.delete(7000);
		});
	});
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: ["role"],
	permLevel: 4,
};

exports.help = {
	name: "roles",
	category: "System",
	description: "View or change Admin/ Mod/ Member roles for the bot.",
	usage: "role](<..variable>)",
};
