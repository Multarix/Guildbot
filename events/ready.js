const { Client } = require("discord.js");
const { output } = require("../src/functions.js");
const deploySlash = require("../src/deploySlash.js");
const getActivity = require("./activity/getActivity.js");


/**
 * @name ready
 * @param {Client} client The discord client
 * @description Emitted when the client becomes ready to start working.
 * @returns {Promise<void>}
**/
async function run(client){

	await deploySlash(client, "all");

	output("misc", `Accessing a total of '${client.guilds.cache.size}' server(s) With a total of '${client.users.cache.size}' users`);

	const presence = getActivity(client);
	client.user.setPresence(presence);

	output("normal", `Setting Activity to '${presence.activities[0].name}'`);
}


const info = {
	name: "ready",
	description: "Emitted when the client becomes ready to start working.",
	enabled: true
};


module.exports = { run, info };