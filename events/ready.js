const colors = require("colors");
const sql = require("sqlite");
module.exports = async client => {

	await wait(1000);

	client.guilds.forEach(g => {
		sql.get(`SELECT * FROM settings where guild = "${g.id}"`).then(data => {
			if(!data){
				sql.run(`INSERT INTO settings (guild, prefix) VALUES ("${g.id}", "${client.config.prefix}")`).then(() => {
					client.log(`Joined the "${g.name}" (${g.id}) server`, "Notify");
					client.log(`Applied default settings to the "${g.name}" server`, "SQL");
				});
			}
			let assignChannel = data.assignChannel;
			const assignMessage = data.assignMessage;
			if(assignChannel && assignMessage){
				if(client.channels.get(assignChannel)) assignChannel = client.channels.get(assignChannel);
				if(assignChannel){
					assignChannel.fetchMessage(assignMessage).then(m => {
						if(!m) return;
						m.reactions.forEach(x => {
							x.fetchUsers();
						});
					});
				}
			}
		});
	});

	client.channels.filter(c => c.type === "text" && c.memberPermissions(c.guild.me).has("VIEW_CHANNEL")).forEach(c => c.fetchMessages({ limit: 5 }));

	const time = new Date();
	client.log(`Logged in as ${client.user.tag}
    > Accessing a total of '${client.guilds.size}' server(s) With a total of '${client.users.size}' users\nReady called at: ${time}`, "Ready");

	if(client.user.id === "260372003310010368") client.user.setActivity("hide the sausage", { type: 'PLAYING' }).then(client.log("Now playing " + colors.white("[") + "hide the sausage" + colors.white("]"), "Activity"));
	if(client.user.id === "628082697553575941") client.user.setActivity("debug simulator", { type: 'PLAYING' }).then(client.log("Now playing " + colors.white("[") + "debug simulator" + colors.white("]"), "Activity"));
};

module.exports.help = {
	name: "ready",
	description: "Emitted when the client is ready",
};
