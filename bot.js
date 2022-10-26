const Discord = require("discord.js");
const fs = require("fs");
const { request } = require("http");
const cron = require("node-cron");

const { promisify } = require("util");
const readdir = promisify(fs.readdir);

const Intents = Discord.Intents.FLAGS;
const client = new Discord.Client({
	disableEveryone: true,
	shardCount: 1,
	intents: [Intents.GUILDS, Intents.GUILD_MEMBERS, Intents.GUILD_BANS, Intents.GUILD_EMOJIS_AND_STICKERS, Intents.GUILD_INVITES, Intents.GUILD_PRESENCES, Intents.GUILD_MESSAGES, Intents.GUILD_MESSAGE_REACTIONS]
});

client.config = require("./config.json");
require("./modules/functions.js")(client);


client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
client.events = new Discord.Collection();
client.allowed = new Set();
client.talkedRecently = new Set();

const init = async () => {
	const cmdFiles = await readdir("./commands/");
	client.log(`Loading a total of ${cmdFiles.length} commands.`, "Setting Up");
	cmdFiles.forEach(f => {
		try {
			if(f.split(".").slice(-1)[0] !== "js") return;
			const props = require(`./commands/${f}`);
			client.log(`Loaded Command File: ${props.help.name}.js`);
			client.commands.set(props.help.name, props);
			props.conf.aliases.forEach(alias => {
				client.aliases.set(alias, props.help.name);
			});
		} catch (e){
			client.log(`Unable to load command ${f}: ${e}`, "Error");
		}
	});

	const evtFiles = await readdir("./events/");
	client.log(`Loading a total of ${evtFiles.length} events.`, "Setting Up");
	evtFiles.forEach(file => {
		try {
			if(file.split(".").slice(-1)[0] !== "js") return;
			const event = require(`./events/${file}`);
			const eventName = file.split(".")[0];
			client.on(eventName, event.bind(null, client));
			client.events.set(event.help.name, event);

			delete require.cache[require.resolve(`./events/${file}`)];

		} catch (e){
			client.log(`Unable to load event ${file}: ${e}`, "Error");
		}
	});

	client.login(client.config.clientToken);

	cron.schedule("0 0 12 * * *", async () => {
		if(client.config.dailyMessage) client.asshole(client, client.config.homeServer);
	});

	// Every hour, check for book updates
	cron.schedule("0 * * * *", async () => {
		const last = fs.readFileSync("./objects/last.json", "utf8");
		const lastObj = JSON.parse(last);

		const url = "https://labs.j-novel.club/feed/user/629784d74efdb04c77f8ea67.json";
		let newData = "";
		request(url, function(error, response, body){
			if(!error && response.statusCode == 200){
				newData = JSON.parse(body);
			}
		});

		// Check if the latest chapter is the same as the last one
		if(newData.items[0].title !== lastObj.items[0].title){
			// Send a message to the main channel of the home server

			const textMessage = `${newData.items[0].title} is out!\n${newData.items[0].url}`;
			client.channels.cache.get("1034640596146602024").send(textMessage).catch(e => { return; });

			fs.writeFileSync("./objects/last.json", JSON.stringify(last));
		}
	});
};

init();
