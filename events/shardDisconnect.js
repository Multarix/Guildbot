module.exports = async (client, event, shardID) => {
	client.log("Failed to re-establish a connection to the websocket.", "Error", shardID);
};

module.exports.help = {
	name: "shardDisconnect",
	description: "Emitted when the client will no longer attempt to reconnect to the websocket",
};
