const sql = require("sqlite");
sql.open("./objects/settings.sqlite");
exports.run = async (client, message, args, level) => {
	sql.get(`SELECT * FROM settings WHERE guildID = "${message.guild.id}"`).then(data => {

		const admins = message.guild.roles.get(data.adminRole);
		const mods = message.guild.roles.get(data.modRole);
		const members = message.guild.roles.get(data.memberRole);

		if(!members){
			const members2 = "Not Set";
		}
		if(!mods){
			const mods2 = "Not Set";
		}
		if(!admins){
			const admins2 = "Not Set";
		}

		if (!args[0]){
			return message.channel.send(`\`\`\`md\n[Admin]      < ${data.adminRole} >\n[Member]     < ${data.memberRole} >\`\`\``);
		}

		if (args[0] === "set"){
			if(!args[1]){
				return message.channel.send("I don't have ESP, I just follow my code. Give me a role shitlord. Sheez.");
			} else {
				sql.get(`UPDATE settings SET prefix = "${args[1]}" WHERE guildID = "${message.guild.id}"`).then(updated => {
					message.channel.send(`Prefix has been set to \`${args[1]}\``).then(m => {
						client.log(`Log`, `${message.guild.name} (${message.guild.id}) updated their prefix to "${args[1]}"`, `SQL`);
						message.delete(7000);
					});
				});
				return;
			}
		} else {
			return message.channel.send(`Oi Moron, \`${args[0]}\` isn't a valid option here. It's either \`set\` or nothing`);
		}
	});
};

exports.conf = {
	enabled: false,
	guildOnly: true,
	aliases: [""],
	permLevel: 10,
};

exports.help = {
	name: "roles",
	category: "System",
	description: "View or change settings for your server",
	usage: "role](<..variable>)",
};
