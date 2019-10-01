module.exports = (client, error) => {
	client.log(error.message, "Error");
};

module.exports.help = {
	name: "error",
	description: "Emitted when the client encounters an error",
};
