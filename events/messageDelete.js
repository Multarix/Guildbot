const sql = require("sqlite");
module.exports = async (client, message) => {
	const data = await sql.get(`SELECT * FROM settings WHERE guild = "${message.guild.id}"`);
	const messageID = data.assignMessage;
	if(message.id === messageID) return sql.run(`UPDATE settings SET assignMessage = null WHERE guild = "${message.guild.id}"`);
};

module.exports.help = {
	name: "messageDelete",
	description: "Emitted when a message is deleted",
};
