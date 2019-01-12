const colors = require("colors");
module.exports = async client => {
	client.log("Failed to re-establish a connection to the websocket.", "Error");
	await wait(1000);
	restartBot("Websocket disconnected");
};

module.exports.help = {
	name: "disconnect",
	description: "Emitted when the client will no longer attempt to reconnect to the websocket",
};
