const sql = require("sqlite");
sql.open("./objects/settings.sqlite");
exports.run = async (client, message, args, level) => {
	sql.get(`SELECT * FROM settings WHERE guildID = "${message.guild.id}"`).then(data => {
		if (!args[0]){
			return message.channel.send(`Current prefix is set to: \`${data.prefix}\``);
		}

		if (args[0] === "set"){
			if(!args[1]){
				return message.channel.send("I don't have ESP, I just follow my code. Give me a prefix shitlord. Sheez.");
			} else {
				sql.get(`UPDATE settings SET prefix = "${args[1]}" WHERE guildID = "${message.guild.id}"`).then(updated => {
					message.channel.send(`Prefix has been set to \`${args[1]}\``).then(m => {
						client.log(`${message.guild.name} (${message.guild.id}) updated their prefix to "${args[1]}"`, `SQL`);
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
	enabled: true,
	guildOnly: true,
	aliases: [""],
	permLevel: 3,
};

exports.help = {
	name: "prefix",
	category: "System",
	description: "View or change the prefix of the server",
	usage: "prefix](<set> <..variable>)",
};
