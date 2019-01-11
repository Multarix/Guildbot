const sql = require("sqlite");

module.exports = (client, guild) => {
	client.log(`Left the "${guild.name}" (${guild.id}) server`, "Log");

	sql.get(`SELECT * From pointTable WHERE guildID = "${guild.id}"`).then(mem => {
		if(!mem){
			return client.log(`Found nobody from the "${guild.name}" server, skipping delete`, "SQL");
		} else {
			sql.run(`DELETE FROM pointTable WHERE guildID = "${guild.id}")`).then(res => {
				client.log(`Removed all users from the "${guild.name}" server`, "SQL");
			});
		}
	});
};

module.exports.help = {
	name: "guildDelete",
	description: "Emitted when the client leaves a guild",
};
