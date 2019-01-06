const sql = require("sqlite");

module.exports = (client, guild) => {
	client.log(`Joined the "${guild.name}" (${guild.id}) server`, "Log");
	sql.run(`INSERT INTO settings (prefix, memberRole, modRole, adminRole, guildID) VALUES ('${client.config.prefix}', 'null', 'null', 'null', '${guild.id}')`).then(() => {
		client.log(`Applied default settings to the "${guild.name}" server`, "SQL");
	});
};

module.exports.help = {
	name: "guildCreate",
	aliases: ["guildJoin"],
	description: "Emitted when the client joins a guild",
};
