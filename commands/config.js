const Discord = require("discord.js");
const delMsg = require("./config/delMsg.js");
exports.run = async (client, message, args) => {

	const data = sqlGet(`SELECT * FROM settings WHERE guild = ?`, message.guild.id);
	const adminRole = (!data.admin || !message.guild.roles.get(data.admin)) ? "Not Set" : message.guild.roles.get(data.admin);
	const modRole = (!data.moderator || !message.guild.roles.get(data.moderator)) ? "Not Set" : message.guild.roles.get(data.moderator);
	const memberRole = (!data.member || !message.guild.roles.get(data.member)) ? "Not Set" : message.guild.roles.get(data.member);
	const starboard = (!data.starboard || !message.guild.channels.get(data.starboard)) ? "Not Set" : message.guild.channels.get(data.starboard);

	let roleName = args[0];
	if(!roleName){
		let ecolor = 13238272;
		if(message.guild.owner.roles.color) ecolor = message.guild.owner.roles.highest.color;
		const embed = new Discord.MessageEmbed()
			.setAuthor(`Guild Settings`)
			.setColor(ecolor)
			.addField("Prefix", `${data.prefix}`, false)
			.addField("Admin Role", adminRole, false)
			.addField("Member Role", modRole, false)
			.addField("Moderator Role", memberRole, false)
			.addField("Starboard", starboard, false)
			.setFooter(client.user.tag, client.user.displayAvatarURL())
			.setTimestamp();
		if(message.guild.iconURL) embed.setThumbnail(message.guild.iconURL);
		return message.channel.send({ embed });
	}

	const info = {
		fileName : "",
		sqlName : "",
	};

	let sqlItem = args[1];
	if(!sqlItem) sqlItem = "null";
	sqlItem = sqlItem.toLowerCase();

	switch (sqlItem){
	// Welcome Messages
	case "joinmessage" || "jm" || "welcomemessage" || "wm" || "jmsg" || "wmsg":
		info.fileName = "joinMessage";
		break;
	// Welcome Channel
	case "welcomechannel" || "wchnl" || "wc" || "wmc":
		info.fileName = "joinChannel";
		break;
	// Leave Messages
	case "byemessage" || "byeemsg" || "bmsg" || "bm" || "lm":
		info.fileName = "leaveMessage";
		break;
	// Leave Message Channel
	case "goodbye" || "gchnl" || "gc" || "gmc" || "lmc":
		info.fileName = "leaveChannel";
		break;
	// Prefix
	case "prefix":
		info.fileName = "prefix";
		break;
	// Starboard
	case "stars" || "starchannel" || "starboard":
		info.fileName = "starboard";
		break;
	// Admin
	case "admin" || "admins":
		info.fileName = "roles";
		info.sqlName = "admin";
		break;
	// Moderator
	case "moderator" || "moderators" || "mod" || "mods":
		info.fileName = "roles";
		info.sqlName = "moderator";
		break;
	// Member
	case "member" || "members":
		info.fileName = "roles";
		info.sqlName = "member";
		break;
	// Everything else
	default:
		info.fileName = "invalid";
	}

	roleName = roleName.toLowerCase();
	let aliases = ["set", "add"];
	if(aliases.includes(roleName)){
		if(!args[1]){
			const m = await message.channel.send("Usage: [roles](set)< Prefix/Admin/Mod/Member/Stars >", { code: "markdown" });
			return await delMsg(client, message, m);
		}

		if(info.fileName === "invalid") return message.channel.send(`\`${sqlItem.toProperCase()}\` doesn't appear to be a valid argument`);
		const settings = require(`./config/${info.fileName}.js`);
		if(settings) return settings.edit(client, message, args, data, info);
	}
	// Delete/ Remove/ Reset things
	aliases = ["delete", "reset", "disable"];
	if(aliases.includes(roleName)){
		if(!args[1]){
			const m = await message.channel.send("Usage: [roles](delete)< Prefix/Admin/Mod/Member/Stars >", { code: "markdown" });
			return await delMsg(client, message, m);
		}

		if(info.fileName === "invalid") return message.channel.send(`\`${sqlItem.toProperCase()}\` doesn't appear to be a valid argument`);
		const settings = require(`./config/${info.fileName}.js`);
		if(settings) return settings.delete(client, message, args, data, info);
	}
	const m = await message.channel.send(`\`${args[0].toProperCase()}\` doesn't appear to be a valid argument. Usage:\n\`\`\`md\n[config](set/delete) < setting >\`\`\``);
	return delMsg(client, message, m);
};

exports.conf = {
	enabled: true,
	allowDM: false,
	aliases: ["bot"],
	permLevel: 5,
};

exports.help = {
	name: "config",
	category: "System",
	description: "View or change bot settings.",
	usage: "..variable",
};
