const colors = require("colors");
module.exports = client => {
	client.log("Re-established a connection to the websocket.", "Notify");
};

module.exports.help = {
	name: "resume",
	description: "Emitted when the client reconnects to the websocket.",
};
