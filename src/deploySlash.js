const { Client, Guild, REST, Routes } = require("discord.js");
const { output } = require("./functions");


/**
 * @name deploySlash
 * @param {Client} client The discord client
 * @param {Guild} guild The guild to deploy to, or "all" to deploy to all guilds
 * @description Deploys slash commands to all guilds
**/
async function deploySlash(client, guild){

	// Set up slash commands
	const rest = new REST().setToken(client.config.token);

	const slashCommands = [];
	for(const command of client.slashCommands) slashCommands.push(command.slash(client).data.toJSON());

	// Deploy to a single guild
	if(guild !== "all"){
		try {
			await rest.put(Routes.applicationGuildCommands(client.user.id, guild.id), { body: slashCommands });
		} catch {
			output("error", `Failed to deploy slash commands to guild '${guild.name}' (${guild.id})`);
		}
	}

	// Deploy to all guilds
	for(const guildData of client.guilds.cache){
		const guild = guildData[1];
		if(guildData.partial) await guild.fetch().catch(e => { return; });
		try {
			await rest.put(Routes.applicationGuildCommands(client.user.id, guild.id), { body: slashCommands });
		} catch {
			output("error", `Failed to deploy slash commands to guild '${guild.name}' (${guild.id})`);
		}
	}
}


module.exports = deploySlash;