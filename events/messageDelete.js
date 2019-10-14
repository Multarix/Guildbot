module.exports = async (client, message) => {
	const data = sqlGet("SELECT * FROM settings WHERE guild = ?", message.guild.id);
	const messageID = data.assignMessage;
	if(message.id === messageID) return sqlRun(`UPDATE settings SET assignMessage = null WHERE guild = ?`, message.guild.id);
};

module.exports.help = {
	name: "messageDelete",
	description: "Emitted when a message is deleted",
};
