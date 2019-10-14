module.exports = async (client, guild) => {

	const delSettings = sql.prepare();

	sqlGet(`DELETE FROM settings WHERE guild = ?`, guild.id);
	client.log(`Left the "${guild.name}" (${guild.id}) server`, "Notify");

	const data = sqlGet(`SELECT * FROM points WHERE guild = ?`, guild.id);
	if(!data) return client.log(`Found nobody from the "${guild.name}" server, skipping delete`, "SQL");

	sqlAll(`DELETE FROM points WHERE guild = ?`, guild.id);
	client.log(`Removed all users from the "${guild.name}" server`, "SQL");
};

module.exports.help = {
	name: "guildDelete",
	description: "Emitted when the client leaves a guild",
};
