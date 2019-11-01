module.exports = (client, shardID, eventNum) => {
	client.log(`Re-established a connection to the websocket. Replayed ${eventNum} events.`, "Notify", shardID);
};

module.exports.help = {
	name: "shardResume",
	description: "Emitted when the client reconnects to the websocket."
};
