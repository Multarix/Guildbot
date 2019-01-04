const sql = require("sqlite");

module.exports = (client, member) => {

	client.log(`"${member.user.tag}" (${member.user.id}) left the "${member.guild.name}" server.`, "memberLeave");

	sql.get(`SELECT * From pointTable WHERE playerID = "${member.user.id}" AND guildID = "${member.guild.id}"`).then(mem => {
		if(!mem){
			return client.log(`"${member.user.tag}" was not in the database, skipping delete..`, "SQL");
		} else {
			sql.run(`DELETE FROM pointTable WHERE playerID = "${member.user.id}" AND guildID = "${member.guild.id}"`).then(res => {
				client.log(`Removed "${member.user.tag}" from the database`, "SQL");
			});
		}
	});
};

module.exports.help = {
	name: "guildMemberRemove",
	aliases: ["memberLeave"],
	description: "Emitted when a user leaves a guild",
};
