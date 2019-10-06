const colors = require("colors");
const sql = require("sqlite");
module.exports = async (client, shardID) => {

	await wait(1000);

	client.guilds.forEach(g => {
		sql.get(`SELECT * FROM settings where guild = "${g.id}"`).then(data => {
			if(!data){
				sql.run(`INSERT INTO settings (guild, prefix) VALUES ("${g.id}", "${client.config.prefix}")`).then(() => {
					client.log(`Joined the "${g.name}" (${g.id}) server`, "Notify");
					client.log(`Applied default settings to the "${g.name}" server`, "SQL");
				});
			}
		});
	});

	const time = new Date();
	client.log(`Accessing a total of '${client.guilds.size}' server(s) With a total of '${client.users.size}' users`, "Ready", shardID);

	let game = "with Auto-D&D";
	if(client.user.id === "260372003310010368") game = "hide the sausage";
	if(client.user.id === "628082697553575941") game = "guildbot debugger";
	client.user.setActivity(game, { type: 'PLAYING' }).then(client.log("Now playing " + colors.white("[") + game + colors.white("]"), "Activity", shardID));
};

module.exports.help = {
	name: "shardReady",
	description: "Emitted when a shard is ready",
};
