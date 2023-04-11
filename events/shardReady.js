const colors = require("colors");
module.exports = async (client, shardID) => {

	client.guilds.cache.forEach(g => {
		const data = sqlGet("SELECT * FROM settings WHERE guild = ?", g.id);
		if(!data){
			sqlRun("INSERT INTO settings (guild, prefix) VALUES (?, ?)", g.id, client.config.prefix);
			client.log(`Joined the "${g.name}" (${g.id}) server`, "Notify");
			client.log(`Applied default settings to the "${g.name}" server`, "SQL");
		}
	});

	client.log(`Accessing a total of '${client.guilds.cache.size}' server(s) With a total of '${client.users.cache.size}' users`, "Ready", shardID);

	let game = "with Auto-D&D";
	if(client.user.id === "260372003310010368") game = "maintenance mode";
	if(client.user.id === "628082697553575941") game = "guildbot debugger";
	client.user.setActivity(game, { type: 'PLAYING' });
	client.log("Now playing " + colors.white("[") + game + colors.white("]"), "Activity", shardID);
};

module.exports.help = {
	name: "shardReady",
	description: "Emitted when a shard is ready"
};
