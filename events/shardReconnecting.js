module.exports = (client, shardID) => {
	client.log("Lost connection to the websocket, attempting reconnection..", "Warn", shardID);
};

module.exports.help = {
	name: "shardReconnecting",
	description: "Emitted when the client tries to reconnect to the websocket"
};
