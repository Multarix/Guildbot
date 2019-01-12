module.exports = client => {
	client.log("Lost connection to the websocket, attempting reconnection..", "Warn");
};

module.exports.help = {
	name: "reconnecting",
	description: "Emitted when the client tries to reconnect to the websocket",
};
