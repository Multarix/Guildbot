const Discord = require("discord.js");
const os = require("os");
exports.run = (client, message, args, level) => {

	const cpuType = os.cpus()[0].model.split(/\s+/g).join(" ");

	if(message.channel.memberPermissions(message.guild.me).has("EMBED_LINKS")){
		const embed = new Discord.RichEmbed()
			.setAuthor(`System information`)
			.setColor(13238272)
			.setThumbnail(client.user.displayAvatarURL)
			.addField("CPU", `${cpuType}`, false)
			.addField("Architecture", `${os.arch()}`, true)
			.addField("OS", `${os.platform}`, true)
			.addField("Total Memory", `${(os.totalmem() / 1024 / 1024 / 1024).toFixed(2)}GB`, true)
			.setFooter(client.user.tag, client.user.displayAvatarURL)
			.setTimestamp();

		return message.channel.send({ embed });
	}

	message.channel.send(`= System information =
----------------------
[•](CPU)              <=>   < ${cpuType}>
[•](Architecture)     <=>   < ${os.arch()} >
[•](OS)               <=>   < ${os.platform} >
[•](Total Memory)     <=>   < ${(os.totalmem() / 1024 / 1024 / 1024).toFixed(2)}GB >`, { code: "markdown" });

};

exports.conf = {
	enabled: true,
	guildOnly: false,
	aliases: ["sys", "sysinfo"],
	permLevel: 10,
};

exports.help = {
	name: "system",
	category: "System",
	description: "Lists the system information upon which the bot is running",
	usage: "system](..)",
};
