const fs = require("fs");
const { Client, GatewayIntentBits } = require("discord.js");

console.log("Starting Bot...");

// const Partials = Discord.Partials;

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
	partials: ["MESSAGE", "CHANNEL", "REACTION"]
});

const defaultConfig = {
	prefix: "!",
	ownerID: "your discord id",
	token: "your discord token",
	weatherLoc: "Paris"
};

// Load the config
require("./modules/functions.js")(client);


try {
	client.config = require("./config.json");

	if(!client.config.prefix){
		client.output("warn", "No prefix found in config! Using default prefix.");
		client.config.prefix = defaultConfig.prefix;
	}

} catch (err){
	client.output("error", "No config file found!");

	try { fs.writeFileSync("./config.json", JSON.stringify(defaultConfig, null, 4)); } catch (err){
		client.output("error", `Failed to create config file! Process exiting...`);
		process.exit(1);
	}

	client.output("warn", `A new config file has been created! Please edit the config to continue!`);
	process.exit(1);
}

client.commands = new Map();
client.altNames = new Map();
client.slashCommands = [];

/**
 * @name main
 * @description Starts the discord bot
**/
const main = async () => {
	// Load the events
	client.output("misc", "Loading events...");

	// Find the event with the longest name
	const eventList = fs.readdirSync("./events").filter(file => file.endsWith(".js")).sort((a, b) => a.length - b.length);
	let longestName = eventList[eventList.length - 1].length - 3;

	for(const file of eventList){
		try {
			// Try loading the event file
			const event = require(`./events/${file}`);

			if(!event.info.enabled) continue;

			// Add the event to the event listener
			client.on(event.info.name, event.run.bind(null, client));

			const paddedName = event.info.name.padEnd(longestName, " ");
			client.output("good", `Loaded event: ${paddedName}   > ${event.info.description}`);

			delete require.cache[require.resolve(`./events/${file}`)];

		} catch (err){
			// Warn if the event failed to load
			client.output("warn", `Failed to load event: ${file}!`);
		}
	}

	// Load the commands
	client.output("misc", "Loading commands...");

	// Find the command with the longest name
	const commandList = fs.readdirSync("./commands").filter(file => file.endsWith(".js")).sort((a, b) => a.length - b.length);
	longestName = commandList[commandList.length - 1].length - 3;

	for(const file of commandList){
		try {
			// Try loading the command file
			const command = require(`./commands/${file}`);

			// Set the command name and aliases
			client.commands.set(command.info.name, command);
			command.info.altNames.forEach(alias => client.altNames.set(alias, command.info.name));

			// If the command is a slash command
			if(command.slash && command.info.enabled) client.slashCommands.push(command);

			const paddedName = command.info.name.padEnd(longestName, " ");
			client.output("good", `Loaded command: ${paddedName}   > ${command.info.description}`);

		} catch (err){
			// Warn if the command failed to load
			client.output("warn", `Failed to load command: ${file}!\n${err.message}`);
		}
	}

	client.login(client.config.token);

	// const repeatingEvents = require("./modules/cronEvents.js");
	// repeatingEvents(client);
};

main();