const sql = require("sqlite");
module.exports = async (client, channel) => {
	const data = await sql.get(`SELECT * FROM settings WHERE guild = "${channel.guild.id}"`);
	const channelID = data.assignMessage;
	if(channel.id === channelID) return sql.run(`UPDATE settings SET assignMessage = null WHERE guild = "${channel.guild.id}"`);
};

module.exports.help = {
	name: "channelDelete",
	description: "Emitted when a channel is deleted",
};
