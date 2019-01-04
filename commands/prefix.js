const sql = require("sqlite");
sql.open("./objects/settings.sqlite");
exports.run = async (client, message, args, level) => {
	sql.get(`SELECT * FROM settings WHERE guildID = "${message.guild.id}"`).then(data => {

		if(!args[0]){
			return message.channel.send(`Current prefix is set to: \`${data.prefix}\``);
		} else {
			return sql.get(`UPDATE settings SET prefix = "${args[0]}" WHERE guildID = "${message.guild.id}"`).then(updated => {
				message.channel.send(`Prefix has been set to \`${args[0]}\``).then(m => {
					client.log(`${message.guild.name} (${message.guild.id}) updated their prefix to "${args[0]}"`, `SQL`);
					message.delete(7000);
				});
			});
		}
	});
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: [""],
	permLevel: 3,
};

exports.help = {
	name: "prefix",
	category: "System",
	description: "View or change the prefix of the server",
	usage: "prefix](<..variable>)",
};
