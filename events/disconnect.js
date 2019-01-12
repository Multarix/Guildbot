const colors = require("colors");
module.exports = async client => {
	client.log("Failed to connect to the websocket, restarting bot.", "Error");
	await wait(1000);
	restartBot("Websocket disconnected");
};

module.exports.help = {
	name: "disconnect",
	description: "Emitted when the client will no longer attempt to reconnect to the websocket",
};
