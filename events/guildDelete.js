module.exports = async (client, guild) => {
	client.log(`Left the "${guild.name}" (${guild.id}) server`, "Notify");

	sqlRun(`DELETE FROM settings WHERE guild = ?`, guild.id);
	sqlRun(`DELETE FROM points WHERE guild = ?`, guild.id);
	sqlRun("DELETE FROM commands WHERE guild = ?", guild.id);
	client.log(`Removed all traces of "${guild.name}" (${guild.id}) from the database.`, "SQL");
};

module.exports.help = {
	name: "guildDelete",
	description: "Emitted when the client leaves a guild"
};
