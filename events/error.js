module.exports = (client, error) => {
	client.log(error, "Error");
	console.error(error);
};

module.exports.help = {
	name: "error",
	description: "Emitted whenever the client's WebSocket encounters a connection error.",
};
