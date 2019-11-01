module.exports = async (client, channel) => {
	const data = sqlGet(`SELECT * FROM settings WHERE guild = ?`, channel.guild.id);
	const channelID = data.assignMessage;
	if(channel.id === channelID) return sqlRun(`UPDATE settings SET assignMessage = null WHERE guild = ?`, channel.guild.id);
};

module.exports.help = {
	name: "channelDelete",
	description: "Emitted when a channel is deleted"
};
