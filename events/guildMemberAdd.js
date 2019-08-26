const sql = require("sqlite");
module.exports = async (client, member) => {

	client.log(`"${member.user.tag}" (${member.user.id}) joined the "${member.guild.name}" server.`, "Log");

	sql.run(`INSERT INTO points (guild, user, amount) VALUES ("${member.guild.id}", "${member.user.id}", "0")`).then(() => {
		client.log(`Set "${member.user.tag}" to the default amount of points`, "SQL");
	});


	if(member.guild.id === "237543420543893505"){
		const botRole = member.guild.roles.get("237976002930671616");
		const dj = member.guild.roles.get("462825089541341191");
		const newMem = member.guild.roles.get("237975739243298816");

		if(member.user.bot === true){
			member.addRole(botRole, "New Bot, pls don't replace me >.<");
		} else {
			member.addRoles([dj, newMem], `New member, are you ready ${member.user.username}?`).catch(console.error);
		}
	}

	const data = await sql.get(`SELECT * FROM settings WHERE guild = "${member.guild.id}"`);
	if(!data.joinChannel || !data.joinMsg) return;
	const joinChannel = member.guild.channels.get(data.joinChannel);
	if(!joinChannel) return;
	if(joinChannel.memberPermissions(member.guild.me).has("SEND_MESSAGES")){
		const joinMsg = data.joinMsg.replace("<@user>", member.user).replace("<user>", member.user.username);
		joinChannel.send(joinMsg);
	}
};

module.exports.help = {
	name: "guildMemberAdd",
	description: "Emitted when a user joins a guild",
};
