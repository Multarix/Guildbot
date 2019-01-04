module.exports = async client => {

	await wait(1000);
	const time = new Date();

	client.log(`Logged in as ${client.user.tag}
    > Accessing a total of '${client.guilds.size}' server(s) With a total of '${client.users.size}' users\nReady called at: ${time}`, "Ready");

	if(client.user.id === "260372003310010368") client.user.setActivity("hide the sausage", { type: 'PLAYING' }).then(client.log("Now playing [hide the sausage]", "Activity"));
	if(client.user.id === "304230184494563329") client.user.setActivity("debug simulator", { type: 'PLAYING' }).then(client.log("Now playing [debug simulator]", "Activity"));

//    client.guilds.filter(g => !client.settings.has(g.id)).forEach(g => client.settings.set(g.id, client.config.defaultSettings));
};

module.exports.help = {
	name: "ready",
	aliases: [],
	description: "Emitted when the client is ready",
};
