const sql = require("sqlite");
const Discord = require("discord.js");
exports.run = async (client, message, args, level) => {
	const good = client.emojis.get("340357918996299778");

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
[•](Moderator Role)     <=>     < ${nameData[2]} >`, { code: "markdown" });
		}

		roleName = roleName.toLowerCase();

		if(roleName === "prefix"){
			return message.channel.send(`[•](Prefix)   ::   [${data.prefix}](${data.guildID})`, { code: "markdown" });
		}
		if(roleName === "admin" || roleName === "admins"){
			return message.channel.send(`[•](Admin Role)   ::   [${nameData[0]}](${idData[0]})`, { code: "markdown" });
		}
		if(roleName === "member" || roleName === "members"){
			return message.channel.send(`[•](Member Role)   ::   [${nameData[1]}](${idData[1]})`, { code: "markdown" });
		}
		if(roleName === "moderator" || roleName === "moderators" || roleName === "mod" || roleName === "mods"){
			return message.channel.send(`[•](Moderator Role)   ::   [${nameData[2]}](${idData[2]})`, { code: "markdown" });
		}

		if(roleName === "set"){
			if(!args[1]){
				return message.channel.send("Usage: [roles](set)< Admin/Mod/Member/Prefix >", { code: "markdown" }).then(m => {
					if(message.channel.memberPermissions(message.guild.me).has("MANAGE_MESSAGES")){
						m.delete(10000);
						message.delete(10000);
					}
				});
			}

			roleName = args[1].toLowerCase();

			if(roleName === "prefix"){
				if(!args[2]){
					return message.channel.send(`Usage:\n[${data.prefix}config](set) <prefix> < new prefix >`, { code: "markdown" });
				}
				return sql.get(`UPDATE settings SET prefix = "${args[2]}" WHERE guildID = "${message.guild.id}"`).then(() => {
					message.channel.send(`Prefix has been set to \`${args[2]}\``).then(m => {
						client.log(`${message.guild.name} (${message.guild.id}) changed their prefix to "${args[2]}"`, `SQL`);
						if(message.channel.memberPermissions(message.guild.me).has("MANAGE_MESSAGES")){
							m.delete(10000);
							message.delete(10000);
						}
					});
				});
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
						}
					});
				});
			}

			const roleMention = message.mentions.roles.first();

			if(!roleMention){
				return message.channel.send(`No role was mentioned. Usage:\n[${data.prefix}config](set) < admin/member/moderator > <@role>`, { code: "markdown" });
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

		return message.channel.send(`\`${args[0].toProperCase()}\` doesn't appear to be a valid argument, acceptable arguments are:\n\`Admin\`, \`Moderator\`, \`Member\`, \`Prefix\` or \`Set\`.`).then(m =>{
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
