const sql = require("sqlite");
module.exports = (client, guild) => {
	
	sql.get(`DELETE FROM settings WHERE guildID = "${guild.id}"`).then(() => {
		client.log(`Left the "${guild.name}" (${guild.id}) server`, "Notify");
	});

	sql.get(`SELECT * FROM pointTable WHERE guildID = "${guild.id}"`).then(data => {
		if(!data) return client.log(`Found nobody from the "${guild.name}" server, skipping delete`, "SQL");

		sql.all(`DELETE FROM pointTable WHERE guildID = "${guild.id}"`).then(() => {
			client.log(`Removed all users from the "${guild.name}" server`, "SQL");
		});

	});
};

module.exports.help = {
	name: "guildDelete",
	description: "Emitted when the client leaves a guild",
};
