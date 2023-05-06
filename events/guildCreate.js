const { Client, Guild } = require("discord.js");
const { output } = require("../src/functions.js");
const deploySlash = require("../src/deploySlash.js");


/**
 * @name guildCreate
 * @param {Client} client The discord client
 * @param {Guild} guild The guild that was joined
 * @description Emitted whenever the client joins a guild.
 * @returns {Promise<void>}
**/
async function run(client, guild){
	if(guild.partial) await guild.fetch().catch(e => { return; });

	await deploySlash(client, guild);

	output("misc", `Joined a new server: '${guild.name}' (${guild.id})`);

	const presence = {
		status: "online",
		activities: [{
			name: `${client.guilds.cache.size} server${(client.guilds.cache.size > 1) ? "s" : ""} | ${client.config.prefix}help`,
			type: 5
		}]
	};

	client.user.setPresence(presence);
}

const info = {
	name: "guildCreate",
	description: "Emitted whenever the client joins a guild.",
	enabled: true
};


module.exports = { run, info };