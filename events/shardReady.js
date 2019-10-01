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
			let assignChannel = data.assignChannel;
			const assignMessage = data.assignMessage;
			if(assignChannel && assignMessage){
				if(client.channels.get(assignChannel)) assignChannel = client.channels.get(assignChannel);
				if(assignChannel){
					assignChannel.messages.fetch(assignMessage).then(m => {
						if(!m) return;
						m.reactions.forEach(x => {
							x.users.fetch();
						});
					});
				}
			}
		});
	});

	client.channels.filter(c => c.type === "text" && c.memberPermissions(c.guild.me).has("VIEW_CHANNEL")).forEach(c => c.messages.fetch({ limit: 5 }));

	const time = new Date();
	client.log(`Logged in as ${client.user.tag}
    > Accessing a total of '${client.guilds.size}' server(s) With a total of '${client.users.size}' users\nReady called at: ${time}`, "Ready", shardID);

	let game = "with Auto-D&D";
	if(client.user.id === "260372003310010368") game = "hide the sausage";
	if(client.user.id === "628082697553575941") game = "guildbot debugger";
	client.user.setActivity(game, { type: 'PLAYING' }).then(client.log("Now playing " + colors.white("[") + game + colors.white("]"), "Activity", shardID));
};

module.exports.help = {
	name: "shardReady",
	description: "Emitted when a shard is ready",
};
