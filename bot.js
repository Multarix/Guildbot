import fs from "fs";

import { Client, GatewayIntentBits, Partials } from "discord.js";
import colors from "colors";

import { output } from "./src/functions.js";
import cronEvents from "./modules/cronEvents.js";


// Yes Node, I know I'm using an experimental feature, stop telling me about it
const originalEmit = process.emit;
process.emit = function(name, data, ...args){
	if(name === `warning` && typeof data === `object` && data.name === `ExperimentalWarning`){
		return false;
	}
	return originalEmit.apply(process, arguments);
};


const defaultConfig = {
	prefix: "!",
	ownerID: "your discord id",
	token: "your bots token",
	weatherLoc: "Paris",
	bookUpdatesChannel: "channel id",
	bookUpdateURL: "jnovel json feed url"
};

// Check if the config file exists
if(!fs.existsSync("./config.json")){
	output("error", "No config file found!");

	try {
		fs.writeFileSync("./config.json", JSON.stringify(defaultConfig, null, 4));
	} catch (err){
		throw new Error(`Failed to create config file! ${err.message}`);
	}

	output("warn", `A new config file has been created! Please edit the config to continue!`);
	process.exit(1);
}

// Load the config
const configFile = fs.readFileSync("./config.json", "utf8");
const config = JSON.parse(configFile);

if(!config.token || config.token === "your bots token"){
	output("error", "No token found in config! Please add your bots token to the config file!");
	process.exit(1);
}

if(!config.prefix){
	output("warn", "No prefix found in config! Using default prefix.");
	config.prefix = defaultConfig.prefix;
}

if(!config.ownerID || config.ownerID === "your discord id"){
	output("warn", "No owner ID found in config! Setting 'Clyde' as the owner");
	config.ownerID = 1;
}



// Handle the unhandled things
process.on("uncaughtException", (err) => {
	const errorMsg = err?.stack?.replace(new RegExp(`${__dirname}/`, "g"), "./");
	output("error", `Uncaught Exception: ${errorMsg}`);
});

process.on("unhandledRejection", (err) => {
	output("error", `Unhandled rejection: ${err}`);
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



const main = async () => {
	// Load the events
	output("misc", "Loading events...");

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
			output("good", `Loaded event: ${paddedName}  > ${event.info.description}`);

			// delete require.cache[require.resolve(`./events/${file}`)];

		} catch (err){
			// Warn if the event failed to load
			output("warn", `Failed to load event: ${file}!`);
			output("error", err);
		}
	}

	// Load the commands
	output("misc", "Loading commands...");

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
			output("good", `Loaded command: ${paddedName}  > ${command.info.description}${disableString}`);

		} catch (err){
			// Warn if the command failed to load
			output("warn", `Failed to load command: ${file}!\n${err}`);
		}
	}

	client.login(client.config.token);
	cronEvents(client);
};

main();