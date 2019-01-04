const sql = require("sqlite");

module.exports = (client, member) => {

	client.log(`"${member.user.tag}" (${member.user.id}) joined the "${member.guild.name}" server.`, "memberJoin");

	sql.run(`INSERT INTO pointTable (points, playerID, guildID) VALUES ("-1", "${member.user.id}", "${member.guild.id}")`).then(res => {
		client.log(`Set "${member.user.tag}" to the default amount of points`, "SQL");
	});

	if(member.guild.id === "190317170478153729"){
		const botDefault = member.guild.roles.get("234466818071199744");
		const games = member.guild.roles.get("350584854246588416");
		if(member.user.bot === true){
			member.addRole(botDefault, "New Bot, pls don't replace me >.<");
		} else {
			if(member.user.id === "135942191246737408"){
				member.guild.channels.get("190317170478153729").send("Welcome back kitty, how long will your stay be this time ( ͡° ͜ʖ ͡°)");
			}
			member.addRoles(games, `New member, are you ready ${member.user.username}?`).catch(console.error);
		}
	}

	if(member.guild.id === "237543420543893505"){
		const botRole = member.guild.roles.get("237976002930671616");
		const dj = member.guild.roles.get("462825089541341191");
		const cmdbots = member.guild.roles.get("270836957456629761");
		const newMem = member.guild.roles.get("237975739243298816");

		if(member.user.bot === true){
			member.addRole(botRole, "New Bot, pls don't replace me >.<");
		} else {
			member.addRoles([dj, newMem, cmdbots], `New member, are you ready ${member.user.username}?`).catch(console.error);
		}
	}

};

module.exports.help = {
	name: "guildMemberAdd",
	aliases: ["memberJoin"],
	description: "Emitted when a user joins a guild",
};
