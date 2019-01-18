const Discord = require('discord.js');
const sql = require("sqlite");
module.exports = (client, message) => {

	if(message.author.bot) return;
	if(message.channel.type === "dm") return;
	if(!message.channel.memberPermissions(message.guild.me).has("SEND_MESSAGES")) return;

	if(message.mentions.everyone) return message.react(client.emojis.get("519919364485677066"));

	sql.get(`SELECT * FROM pointTable WHERE playerID = "${message.author.id}" AND guildID = "${message.guild.id}"`).then(pointAmount => {
		if(!pointAmount){
			return sql.run(`INSERT INTO pointTable (points, playerID, guildID) VALUES (1, "${message.author.id}", "${message.guild.id}")`).then(() => {
				client.log(`Added "${message.author.tag}" from the "${message.guild.name}" server.`, "SQL");
			});
		} else {
			sql.run(`UPDATE pointTable SET points = "${pointAmount.points + 1}" WHERE playerID = "${message.author.id}" AND guildID = "${message.guild.id}"`);
		}
	});

	const random = require("../objects/random.json");
	const random2 = require("../objects/random2.json");

	const str = message.content.toLowerCase();
	if(random[message.content]) {
		return message.channel.send(random[message.content]).catch(console.error);
	} else
	if(random2[str]){
		return message.channel.send(random2[str]).catch(console.error);
	}

	sql.get(`SELECT * FROM settings WHERE guildID = "${message.guild.id}"`).then(data => {
		const mention = new RegExp(`^<@!?${client.user.id}>`);
		const mentionCheck = message.content.match(mention) ? message.content.match(mention)[0] : '!';

		const prefixes = [`${mentionCheck} `, data.prefix];
		let prefix = false;
		for(const thisPrefix of prefixes){
			if(message.content.startsWith(thisPrefix)) prefix = thisPrefix;
		}
		if(!prefix) return;

		let args = message.content.split(/\s+/g);

		let command;
		if(args[0] === mentionCheck){
			args = args.slice(1);
			command = args.shift().toLowerCase();
		} else {
			command = args.shift().slice(prefix.length).toLowerCase();
		}
		const level = client.permlevel(message, data);
		const cmd = client.commands.get(command) || client.commands.get(client.aliases.get(command));

		if (cmd && level >= cmd.conf.permLevel) {
			if(cmd.conf.enabled === true){
				cmd.run(client, message, args, level);
			} else {
				client.log(`"${message.author.tag}" tried to use the disabled command "${cmd.help.name}"`, "Log");
			}
		} else if (cmd && level < cmd.conf.permLevel){
			client.log(`"${message.author.tag}" tried to use command: "${cmd.help.name}"`, "Log");
		}
	});
};

module.exports.help = {
	name: "message",
	description: "Emitted when a user sends a message",
};
