const sql = require("sqlite");
module.exports = (client, member) => {

	client.log(`"${member.user.tag}" (${member.user.id}) left the "${member.guild.name}" server.`, "Log");

	sql.get(`SELECT * From pointTable WHERE playerID = "${member.user.id}" AND guildID = "${member.guild.id}"`).then(mem => {
		if(!mem){
			return client.log(`"${member.user.tag}" was not in the database, skipping delete..`, "SQL");
		} else {
			sql.run(`DELETE FROM pointTable WHERE playerID = "${member.user.id}" AND guildID = "${member.guild.id}"`).then(res => {
				client.log(`Removed "${member.user.tag}" from the database`, "SQL");
			});
		}
	});

	sql.get(`SELECT * FROM settings WHERE guildID = "${member.guild.id}"`).then(data => {
		if(data.leaveChannel !== "null" && data.leaveMessage !== "null"){
			if(member.guild.channels.get(data.leaveChannel)){
				if(member.guild.channels.get(data.leaveChannel).memberPermissions(member.guild.me).has("SEND_MESSAGES")){
					const leaveMessage = data.leaveMessage.replace("<@user>", member.user).replace("<user>", member.user.username);
					member.guild.channels.get(data.leaveChannel).send(leaveMessage);
				}
			}
		}
	});

};

module.exports.help = {
	name: "guildMemberRemove",
	description: "Emitted when a user leaves a guild",
};
