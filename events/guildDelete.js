const sql = require("sqlite");
module.exports = async (client, guild) => {

	sql.get(`DELETE FROM settings WHERE guild = "${guild.id}"`).then(() => {
		client.log(`Left the "${guild.name}" (${guild.id}) server`, "Notify");
	});

	const data = await sql.get(`SELECT * FROM points WHERE guild = "${guild.id}"`);
	if(!data) return client.log(`Found nobody from the "${guild.name}" server, skipping delete`, "SQL");

	sql.all(`DELETE FROM points WHERE guild = "${guild.id}"`).then(() => {
		client.log(`Removed all users from the "${guild.name}" server`, "SQL");
	});

};

module.exports.help = {
	name: "guildDelete",
	description: "Emitted when the client leaves a guild",
};
