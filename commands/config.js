const Discord = require("discord.js");
const delMsg = require("./config/delMsg.js");
exports.run = async (client, message, args) => {
	const owner = await message.guild.fetchOwner();

	const data = sqlGet(`SELECT * FROM settings WHERE guild = ?`, message.guild.id);
	const adminRole = (!data.admin || !message.guild.roles.cache.get(data.admin)) ? "Not Set" : message.guild.roles.cache.get(data.admin);
	const modRole = (!data.moderator || !message.guild.roles.cache.get(data.moderator)) ? "Not Set" : message.guild.roles.cache.get(data.moderator);
	const memberRole = (!data.member || !message.guild.roles.cache.get(data.member)) ? "Not Set" : message.guild.roles.cache.get(data.member);
	const starboard = (!data.starboard || !message.guild.channels.cache.get(data.starboard)) ? "Not Set" : message.guild.channels.cache.get(data.starboard);
	const emojiChannel = (!data.emojiChannel || !message.guild.channels.cache.get(data.emojiChannel)) ? "Not Set" : message.guild.channels.cache.get(data.emojiChannel);

	let ecolor = 13238272;
	if(owner.roles.color) ecolor = owner.roles.highest.color;

	let roleName = args[0];
	if(!roleName){
		const embed = new Discord.MessageEmbed()
			.setAuthor(`Guild Settings`)
			.setColor(ecolor)
			.addField("Prefix", `${data.prefix}`, true)
			.addField("Starboard", `${starboard}`, true)
			.addField("Emoji Channel", `${emojiChannel}`, true)
			.addField("Admin Role", `${adminRole}`, true)
			.addField("Member Role", `${memberRole}`, true)
			.addField("Moderator Role", `${modRole}`, true)
			.setFooter(`${client.user.tag}`, `${client.user.displayAvatarURL()}`)
			.setTimestamp();
		if(message.guild.iconURL) embed.setThumbnail(message.guild.iconURL);
		return message.channel.send({ embeds: [embed] });
	}

	const info = {
		fileName : "",
		sqlName : "",
		color: ecolor
	};

	let sqlItem = args[1];
	if(!sqlItem) sqlItem = "null";
	sqlItem = sqlItem.toLowerCase();

	switch(sqlItem){
		// Welcome Messages
		case "jm":
		case "joinmessage":
			info.fileName = "joinMessage";
			break;
		// Welcome Channel
		case "jc":
		case "joinchannel":
			info.fileName = "joinChannel";
			break;
		// Leave Messages
		case "lm":
		case "leavemessage":
			info.fileName = "leaveMessage";
			break;
		// Leave Message Channel
		case "lc":
		case "leavechannel":
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
		case "emoji":
		case "emojichannel":
			info.fileName = "emoji";
			break;
		// Admin
		case "admin":
			info.fileName = "roles";
			info.sqlName = "admin";
			break;
		// Moderator
		case "mod":
		case "moderator":
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
			return await message.channel.send({ embeds: [embed] }).catch(() => undefined);
		}

		if(info.fileName === "invalid") return message.channel.send({ embeds: [embed] }).catch(() => undefined);
		const settings = require(`./config/${info.fileName}.js`);
		if(settings) return settings.edit(client, message, args, data, info);
	}
	// Delete/ Remove/ Reset things
	aliases = ["delete", "reset", "disable"];
	if(aliases.includes(roleName)){
		embed.setDescription(`${data.prefix}config delete <setting>`);
		if(!args[1]) return await message.channel.send({ embeds: [embed] }).catch(() => undefined);

		if(info.fileName === "invalid") return await message.channel.send({ embeds: [embed] }).catch(() => undefined);
		const settings = require(`./config/${info.fileName}.js`);
		if(settings) return settings.delete(client, message, args, data, info);
	}
	embed.setDescription(`${data.prefix}config set/delete <setting>`);
	return await message.channel.send({ embeds: [embed] }).catch(() => undefined);
};

exports.conf = {
	enabled: true,
	allowDM: false,
	aliases: ["bot"],
	permLevel: 5
};

exports.help = {
	name: "config",
	category: "System",
	description: "View or change bot settings.",
	usage: "..variable"
};
