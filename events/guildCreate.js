const sql = require("sqlite");
module.exports = (client, guild) => {

	client.log(`Joined the "${guild.name}" (${guild.id}) server`, "Notify");
	sql.run(`INSERT INTO settings (guild, prefix) VALUES ("${guild.id}", "${client.config.prefix}")`).then(() => {
		client.log(`Applied default settings to the "${guild.name}" server`, "SQL");
	});
};

module.exports.help = {
	name: "guildCreate",
	description: "Emitted when the client joins a guild",
};
