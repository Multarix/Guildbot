import fs from "fs";

import { Client, GatewayIntentBits, Partials } from "discord.js";
import colors from "colors";

import { output } from "./src/functions.js";
import cronEvents from "./modules/cronEvents.js";

import { fileURLToPath } from 'url';
import { dirname } from 'path';

import dotenv from "dotenv";
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dataFolder = "./data";

// Yes Node, I know I'm using an experimental feature, stop telling me about it
const originalEmit = process.emit;
process.emit = function(name, data, ...args){
	if(name === `warning` && typeof data === `object` && data.name === `ExperimentalWarning`){
		return false;
	}
	return originalEmit.apply(process, arguments);
};

if(!process.env.token) throw new Error("No token was supplied. please supply a token and restart.");
if(!process.env.timezone) throw new Error("No Timezone was supplied. Please supply a timezone and restart.");


if(!fs.existsSync(dataFolder)){
	fs.mkdir(dataFolder);
	console.log("Creating Data folder...");

	const initialData = `{"dataType":"Map","value":[]}`;
	fs.writeFileSync(`${dataFolder}/posted.json`, initialData, "utf8");
	console.log(`Creating posted.json ${dataFolder}/posted.json`);
}

// Load the config
const config = {
	prefix: process.env.prefix || "!", // Default config
	ownerID: process.env.ownerID || 1, // Sets to Clyde if not specified
	weatherLoc: process.env.weatherLoc || "Paris", // Random location idgaf.
	token: process.env.token,
	bookUpdatesChannel: process.env.bookUpdatesChannel,
	bookUpdateURL: process.env.bookUpdateURL,
	timezone: process.env.timezone
};

console.log(`Setting prefix to ${config.prefix}`);
console.log(`Setting ownerID to ${config.ownerID}`);
console.log(`Setting weatherLoc to ${config.weatherLoc}`);
console.log(`Setting timezone to ${config.timezone}`);

// Handle the unhandled things
process.on("uncaughtException", (err) => {
	const errorMsg = err?.stack?.replace(new RegExp(`${__dirname}/`, "g"), "./");
	console.error(`Uncaught Exception: ${errorMsg}`);
});

process.on("unhandledRejection", (err) => {
	console.error(`Unhandled rejection: ${err}`);
	process.exit(1); // Hopefully fixes EAI_Again?
});



console.log("Starting Bot...");

const intentFlags = [
	GatewayIntentBits.Guilds,
	GatewayIntentBits.GuildMembers,
	GatewayIntentBits.GuildPresences,
	GatewayIntentBits.GuildEmojisAndStickers,
	GatewayIntentBits.GuildMessages,
	GatewayIntentBits.GuildMessageReactions,
	GatewayIntentBits.DirectMessages,
	GatewayIntentBits.DirectMessageReactions,
	GatewayIntentBits.MessageContent
];

const client = new Client({
	disableEveryone: true,
	intents: intentFlags,
	partials: [Partials.Message, Partials.Reaction]
});

client.config = config;
client.commands = new Map();
client.altNames = new Map();
client.slashCommands = [];

/**
 * @name main
 * @description Starts the discord bot
**/
const main = async () => {
	// Load the events
	output(client, "misc", "Loading events...");

	// Find the event with the longest name
	const eventList = fs.readdirSync("./events").filter(file => file.endsWith(".js")).sort((a, b) => a.length - b.length);
	let longestName = eventList[eventList.length - 1].length - 3;

	for(const file of eventList){
		try {
			// Try loading the event file
			const event = await import(`./events/${file}`);

			if(!event.info.enabled) continue;

			// Add the event to the event listener
			client.on(event.info.name, event.run.bind(null, client));

			const paddedName = event.info.name.padEnd(longestName, " ");
			output(client, "good", `Loaded event: ${paddedName}  > ${event.info.description}`);

			// delete require.cache[require.resolve(`./events/${file}`)];

		} catch (err){
			// Warn if the event failed to load
			output(client, "warn", `Failed to load event: ${file}!`);
			output(client, "error", err);
		}
	}


	// Load the commands
	output(client, "misc", "Loading commands...");

	// Find the command with the longest name
	const commandList = fs.readdirSync("./commands").filter(file => file.endsWith(".js") || file.endsWith(".cjs")).sort((a, b) => a.length - b.length);
	longestName = commandList[commandList.length - 1].length - 3;

	for(const file of commandList){
		try {
			// Try loading the command file
			const command = await import(`./commands/${file}`);

			// Set the command file name for reloading later
			command.info.fileName = file;

			// Set the command name and aliases
			client.commands.set(command.info.name, command);
			command.info.altNames.forEach(alias => client.altNames.set(alias, command.info.name));
			// If the command is a slash command
			if(command.slash?.(client)?.data && command.info.enabled) client.slashCommands.push(command);

			const paddedName = command.info.name.padEnd(longestName, " ");
			const disableString = command.info.enabled ? "" : ` ${colors.red("(disabled)")}`;
			output(client, "good", `Loaded command: ${paddedName}  > ${command.info.description}${disableString}`);

		} catch (err){
			// Warn if the command failed to load
			output(client, "warn", `Failed to load command: ${file}!\n${err}`);
		}
	}

	await client.login(client.config.token);
	cronEvents(client);
};

main();