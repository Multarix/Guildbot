const { version } = require("discord.js");
const moment = require("moment");
require("moment-duration-format");
const Discord = require("discord.js");
exports.run = (client, message, args, level) => {

	const duration = moment.duration(client.uptime).format(" D [days], H [hrs], m [mins], s [secs]");

	if(message.channel.memberPermissions(message.guild.me).has("EMBED_LINKS")){
		const embed = new Discord.RichEmbed()
			.setAuthor(`Bot Stats`)
			.setColor(13238272)
			.setThumbnail(client.user.displayAvatarURL)
			.addField("Memory Usage", `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB`, true)
			.addField("Users", `${client.users.size.toLocaleString()}`, true)
			.addField("Node.js", `${process.version}`, true)
			.addField("Channels", `${client.channels.size.toLocaleString()}`, true)
			.addField("Discord.js", `v${version}`, true)
			.addField("Servers", `${client.guilds.size.toLocaleString()}`, true)
			.addField("Uptime", `${duration}`, true)
			.setFooter(client.user.tag, client.user.displayAvatarURL)
			.setTimestamp();

		return message.channel.send({ embed });
	}

	message.channel.send(`= Bot Stats =
--------------
[•](Mem Usage)    <=>   < ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB >
[•](Node)         <=>   < ${process.version} >
[•](Discord.js)   <=>   < v${version} >
[•](Users)        <=>   < ${client.users.size.toLocaleString()} >
[•](Channels)     <=>   < ${client.channels.size.toLocaleString()} >
[•](Servers)      <=>   < ${client.guilds.size.toLocaleString()} >
[•](Uptime)       <=>   < ${duration} >`, { code: "markdown" });

};

exports.conf = {
	enabled: true,
	guildOnly: false,
	aliases: ["stats"],
	permLevel: 1,
};

exports.help = {
	name: "info",
	category: "System",
	description: "Gives some useful bot statistics",
	usage: "stats](..)",
};
