import { Client } from "discord.js";
import { output } from "../src/functions.js";
import deploySlash from "../src/deploySlash.js";
import getActivity from "./activity/getActivity.js";


/**
 * @name ready
 * @param {Client} client The discord client
 * @description Emitted when the client becomes ready to start working.
 * @returns {Promise<void>}
**/
async function run(client){

	output("misc", "Deploying slash commands...");
	await deploySlash(client, "all");
	output("misc", `Accessing a total of '${client.guilds.cache.size}' server(s) With a total of '${client.users.cache.size}' users`);

	const presence = getActivity(client);
	client.user.setPresence(presence);
	
	output("misc", `Logged in as '${client.user.tag}'`);
	output("normal", `Setting activity to '${presence.activities[0].name}'`);
}


const info = {
	name: "ready",
	description: "Emitted when the client becomes ready to start working.",
	enabled: true
};


export { run, info };