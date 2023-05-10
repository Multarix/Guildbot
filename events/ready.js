import { Client } from "discord.js";
import { output } from "../src/functions.js";
import deploySlash from "../src/deploySlash.js";
import getActivity from "./activity/getActivity.js";

const presenceDecode = {
	0: "Playing",
	1: "Streaming",
	2: "Listening to",
	3: "Watching",
	4: "Custom Status:",
	5: "Competing in"
};


/**
 * @name ready
 * @param {Client} client The discord client
 * @description Emitted when the client becomes ready to start working.
 * @returns {Promise<void>}
**/
async function run(client){

	output("misc", "Deploying slash commands...");
	await deploySlash(client, "all");

	const presence = getActivity(client);
	client.user.setPresence(presence);

	output("info", `Logged in as '${client.user.tag}'`);
	output("info", `Accessing a total of '${client.guilds.cache.size}' server(s) With a total of '${client.users.cache.size}' users`);
	output("info", `Set activity to '${presenceDecode[presence.activities[0].type]} ${presence.activities[0].name}'`);
}


const info = {
	name: "ready",
	description: "Emitted when the client becomes ready to start working.",
	enabled: true
};


export { run, info };