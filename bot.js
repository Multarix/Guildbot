const Discord = require("discord.js");
const fs = require("fs");
const fetch = require("node-fetch");
const cron = require("node-cron");

const { promisify } = require("util");
const readdir = promisify(fs.readdir);



const defJs = {
	version: "https://jsonfeed.org/version/1",
	title: "Series follows",
	home_page_url: "https://j-novel.club/user",
	description: "You can add series to your followed list on our website or app",
	author: {
		name: "J-Novel Club"
	},
	items: [
		{
			id: "id",
			url: "url",
			title: "title",
			summary: "summary",
			date_published: "date"
		}
	]
};



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

	// Repeatable events
	cron.schedule("0 0 12 * * *", async () => {
		if(client.config.dailyMessage) client.asshole(client, client.config.homeServer);
	});


	// Every hour, check for book updates
	cron.schedule("13 2 * * * *", async () => {
		if(!client.config.bookUpdateURL) return;

		let oldObj = defJs;
		if(fs.existsSync("./objects/last.json")){
			const old = fs.readFileSync("./objects/last.json", "utf8");
			oldObj = JSON.parse(old);
		}

		const url = client.config.bookUpdateURL;
		const settings = { method: "Get" };

		const result = await fetch(url, settings);
		const newObj = await result.json();

		const newBookParts = [];

		for(const newItem of newObj.items){
			let newPart = true;
			for(const oldItem of oldObj.items){
				if(newItem.title === oldItem.title){
					newPart = false;
					break;
				}
			}

			if(newPart){
				newBookParts.push(newItem);
				client.log(`New book part found: ${newItem.title}`);
			}
		}

		if(newBookParts.length >= 1){
			newBookParts.reverse();
			if(!client.config.bookUpdatesChannel) return;

			const channel = await grabChannel(client.config.bookUpdatesChannel);
			if(!channel) return;

			for(const bookPart of newBookParts){
				const embed = new Discord.MessageEmbed()
					.setAuthor(bookPart.title)
					.setDescription(`A new book part has been released!\n[Read it here](${bookPart.url})`)
					.setColor(22440)
					.setFooter("via J-Novel Club", "https://j-novel.club/apple-touch-icon.png");

				const date = new Date(bookPart.date_published);
				embed.setTimestamp(date);

				if(bookPart.image) embed.setImage(bookPart.image);

				channel.send({ embeds: [embed] });
			}

			fs.writeFileSync("./objects/last.json", JSON.stringify(newObj, null, "\t"));
		}
	});

};

init();
