module.exports = (client, error, shardID) => {
	client.log(error.message, "Error", shardID);
};

module.exports.help = {
	name: "shardError",
	description: "Emitted whenever the client's WebSocket encounters a connection error.",
};
