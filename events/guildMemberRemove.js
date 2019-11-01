module.exports = async (client, member) => {

	client.log(`"${member.user.tag}" (${member.user.id}) left the "${member.guild.name}" server.`, "Log");

	const mem = sqlGet(`SELECT * From points WHERE user = ? AND guild = ?`, member.user.id, member.guild.id);
	if(!mem) return client.log(`"${member.user.tag}" was not in the database, skipping delete..`, "SQL");
	sqlRun(`DELETE FROM points WHERE user = ? AND guild = ?`, member.user.id, member.guild.id);
	client.log(`Removed "${member.user.tag}" from the database`, "SQL");


	const data = sqlGet(`SELECT * FROM settings WHERE guild = ?`, member.guild.id);
	if(!data.leaveChannel || !data.leaveMsg) return;
	const leaveChannel = member.guild.channels.get(data.leaveChannel);
	if(!leaveChannel) return;
	if(leaveChannel.permissionsFor(member.guild.me).has("SEND_MESSAGES")){
		const leaveMessage = data.leaveMsg.replace("<@user>", `${member.user}`).replace("<user>", member.user.username);
		leaveChannel.send(leaveMessage);
	}
};

module.exports.help = {
	name: "guildMemberRemove",
	description: "Emitted when a user leaves a guild"
};
