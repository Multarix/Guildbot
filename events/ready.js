const colors = require("colors");
const sql = require("sqlite");
module.exports = async client => {

	await wait(1000);

	client.guilds.forEach(g => {
		sql.get(`SELECT * FROM settings where guildID = "${g.id}"`).then(data => {
			if(!data){
				sql.run(`INSERT INTO settings (prefix, memberRole, modRole, adminRole, guildID, joinMessage, leaveMessage, starChannel) VALUES ("${client.config.prefix}", "null", "null", "null", "${g.id}", "null", "null", "null")`).then(() => {
					client.log(`Applied default settings to the "${g.name}" server`, "SQL");
				});
			}
		});
	});

	client.channels.filter(c => c.type === "text" && c.memberPermissions(c.guild.me).has("VIEW_CHANNEL")).forEach(c => c.fetchMessages({ limit: 5 }));

	const time = new Date();
	client.log(`Logged in as ${client.user.tag}
    > Accessing a total of '${client.guilds.size}' server(s) With a total of '${client.users.size}' users\nReady called at: ${time}`, "Ready");

	if(client.user.id === "260372003310010368") client.user.setActivity("hide the sausage", { type: 'PLAYING' }).then(client.log("Now playing " + colors.white("[") + "hide the sausage" + colors.white("]"), "Activity"));
	if(client.user.id === "304230184494563329") client.user.setActivity("debug simulator", { type: 'PLAYING' }).then(client.log("Now playing " + colors.white("[") + "debug simulator" + colors.white("]"), "Activity"));
};

module.exports.help = {
	name: "ready",
	description: "Emitted when the client is ready",
};
