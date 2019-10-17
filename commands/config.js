const Discord = require("discord.js");
const delMsg = require("./config/delMsg.js");
exports.run = async (client, message, args) => {

	const data = sqlGet(`SELECT * FROM settings WHERE guild = ?`, message.guild.id);
	const adminRole = (!data.admin || !message.guild.roles.get(data.admin)) ? "Not Set" : message.guild.roles.get(data.admin);
	const modRole = (!data.moderator || !message.guild.roles.get(data.moderator)) ? "Not Set" : message.guild.roles.get(data.moderator);
	const memberRole = (!data.member || !message.guild.roles.get(data.member)) ? "Not Set" : message.guild.roles.get(data.member);
	const starboard = (!data.starboard || !message.guild.channels.get(data.starboard)) ? "Not Set" : message.guild.channels.get(data.starboard);
	const emojiChannel = (!data.emojiChannel || !message.guild.channels.get(data.emojiChannel)) ? "Not Set" : message.guild.channels.get(data.emojiChannel);

	let ecolor = 13238272;
	if(message.guild.owner.roles.color) ecolor = message.guild.owner.roles.highest.color;

	let roleName = args[0];
	if(!roleName){
		const embed = new Discord.MessageEmbed()
			.setAuthor(`Guild Settings`)
			.setColor(ecolor)
			.addField("Prefix", `${data.prefix}`, true)
			.addField("Starboard", starboard, true)
			.addField("Emoji Channel", emojiChannel, true)
			.addField("Admin Role", adminRole, true)
			.addField("Member Role", modRole, true)
			.addField("Moderator Role", memberRole, true)
			.setFooter(client.user.tag, client.user.displayAvatarURL())
			.setTimestamp();
		if(message.guild.iconURL) embed.setThumbnail(message.guild.iconURL);
		return message.channel.send({ embed });
	}

	const info = {
		fileName : "",
		sqlName : "",
		color: ecolor,
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
	case "starboard":
		info.fileName = "starboard";
		break;
	case "emoji" || "emojichannel":
		info.fileName = "emoji";
		break;
	// Admin
	case "admin":
		info.fileName = "roles";
		info.sqlName = "admin";
		break;
	// Moderator
	case "moderator" || "mod":
		info.fileName = "roles";
		info.sqlName = "moderator";
		break;
	// Member
	case "member":
		info.fileName = "roles";
		info.sqlName = "member";
		break;
	// Everything else
	default:
		info.fileName = "invalid";
	}

	const embed = new Discord.MessageEmbed()
		.setTitle(`Configurable Settings`)
		.setColor(info.color)
		.addField("Role Settings", "`admin`, `moderator`, `member`", false)
		.addField("Channel Settings", "`joinchannel`, `leavechannel`, `starboard`, `emoji`", false)
		.addField("Message Settings", "`joinmessage`, `leavemessage`", false)
		.setFooter(client.user.tag, client.user.displayAvatarURL())
		.setTimestamp();

	roleName = roleName.toLowerCase();
	let aliases = ["set", "add"];
	if(aliases.includes(roleName)){
		embed.setDescription(`${data.prefix}config set <setting>`);
		if(!args[1]){
			return await message.channel.send({ embed }).catch(() => undefined);
		}

		if(info.fileName === "invalid") return message.channel.send({ embed }).catch(() => undefined);
		const settings = require(`./config/${info.fileName}.js`);
		if(settings) return settings.edit(client, message, args, data, info);
	}
	// Delete/ Remove/ Reset things
	aliases = ["delete", "reset", "disable"];
	if(aliases.includes(roleName)){
		embed.setDescription(`${data.prefix}config delete <setting>`);
		if(!args[1]) return await message.channel.send({ embed }).catch(() => undefined);

		if(info.fileName === "invalid") return await message.channel.send({ embed }).catch(() => undefined);
		const settings = require(`./config/${info.fileName}.js`);
		if(settings) return settings.delete(client, message, args, data, info);
	}
	embed.setDescription(`${data.prefix}config set/delete <setting>`);
	return await message.channel.send({ embed }).catch(() => undefined);
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
