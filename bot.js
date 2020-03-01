const Discord = require("discord.js");
const cron = require("node-cron");

const { promisify } = require("util");
const readdir = promisify(require("fs").readdir);

const client = new Discord.Client({ disableEveryone: true, shardCount: 1, partials: Object.values(Discord.Constants.PartialTypes) });

client.config = require("./config.json");
require("./modules/functions.js")(client);

client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
client.events = new Discord.Collection();

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
		client.asshole(client);
	});
};

init();
