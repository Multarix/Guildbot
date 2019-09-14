module.exports = (client, error) => {
	client.log("Encountered a websocket error", "Error");
	console.log(error);
};

module.exports.help = {
	name: "error",
	description: "Emitted whenever the client's WebSocket encounters a connection error.",
};
