const Discord = require("discord.js");
const sql = require("sqlite");

const { promisify } = require("util");
const readdir = promisify(require("fs").readdir);

const client = new Discord.Client();

client.config = require("./config.json");
require("./modules/functions.js")(client);

client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
client.events = new Discord.Collection();
client.eventAliases = new Discord.Collection();

const init = async () => {
	const cmdFiles = await readdir("./commands/");
	client.log(`Loading a total of ${cmdFiles.length} commands.`, "Setting Up");
	cmdFiles.forEach(f => {
		try {
			const props = require(`./commands/${f}`);
			if(f.split(".").slice(-1)[0] !== "js") return;
			client.log(`Loaded Command File: ${props.help.name}.js`, "Log");
			client.commands.set(props.help.name, props);
			props.conf.aliases.forEach(alias => {
				client.aliases.set(alias, props.help.name);
			});
		} catch (e) {
			client.log(`Unable to load command ${f}: ${e}`, "Error");
		}
		sql.open("./objects/settings.sqlite");
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
			event.help.aliases.forEach(alias => {
				client.eventAliases.set(alias, event.help.name);
			});

			delete require.cache[require.resolve(`./events/${file}`)];

		} catch (e) {
			client.log(`Unable to load event ${file}: ${e}`, "Error");
		}
	});
	client.login(client.config.clientToken);
};

init();

setTimeout(restartBot, 86400000);

client.on('error', e => {
	console.error(e);
});
