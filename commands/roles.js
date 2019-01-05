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
					return message.channel.send(`Yo dawg, what the fuck. I can't set your new role if you don't give me the full deets`);
				} else {
					roleName = args[1].toLowerCase();
					const roleMention = message.mentions.roles.first();

					if(roleName === "admin" || roleName === "admins"){
						if(!roleMention){
							return message.channel.send("Yo dude whatup.. I just worked out that YOU DIDN'T MENTION A ROLE ffs.");
						} else {
							return sql.run(`UPDATE settings SET adminRole = "${roleMention.id}" WHERE guildID = "${message.guild.id}"`).then(() => {
								client.log(`"${message.guild.name}" (${message.guild.id}) changed their adminRole to "${roleMention.name}" (${roleMention.id})`, "SQL");
								message.react(good);
								message.channel.send(`Your preference has been saved`);
							});
						}
					}

					if(roleName === "moderator" || roleName === "moderators" || roleName === "mod" || roleName === "mods"){
						if(!roleMention){
							return message.channel.send("Yo dude whatup.. I just worked out that YOU DIDN'T MENTION A ROLE ffs.");
						} else {
							return sql.run(`UPDATE settings SET modRole = "${roleMention.id}" WHERE guildID = "${message.guild.id}"`).then(() => {
								client.log(`"${message.guild.name}" (${message.guild.id}) changed their modRole to "${roleMention.name}" (${roleMention.id})`, "SQL");
								message.react(good);
								message.channel.send(`Your preference has been saved`);
							});
						}
					}

					if(roleName === "member" || roleName === "members"){
						if(!roleMention){
							return message.channel.send("Yo dude whatup.. I just worked out that YOU DIDN'T MENTION A ROLE ffs.");
						} else {
							return sql.run(`UPDATE settings SET memberRole = "${roleMention.id}" WHERE guildID = "${message.guild.id}"`).then(() => {
								client.log(`"${message.guild.name}" (${message.guild.id}) changed their memberRole to "${roleMention.name}" (${roleMention.id})`, "SQL");
								message.react(good);
								message.channel.send(`Your preference has been saved`);
							});
						}
					}
					return message.channel.send(`"${roleName.toProperCase()}" doesn't appear to be a valid argument, acceptable arguments are:\n\`Admin\`, \`Moderator\` or \`Member\`.`);
				}
			}
			return message.channel.send(`"${roleName.toProperCase()}" doesn't appear to be a valid argument, acceptable arguments are:\n\`Admin\`, \`Moderator\`, \`Member\` or \`Set\`.`);
		}
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
	description: "View or change settings for your server",
	usage: "role](<..variable>)",
};
