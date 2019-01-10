module.exports = (client, message) => {
	const Discord = require('discord.js');
	const sql = require("sqlite");

	if(message.author.bot) return;
	if(message.channel.type === "dm") return;
	if(!message.channel.memberPermissions(message.guild.me).has("SEND_MESSAGES")) return;

	if(message.mentions.everyone){
		return message.react(client.emojis.get("519919364485677066"));
	}

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

	sql.get(`SELECT * FROM settings WHERE guildID = "${message.guild.id}"`).then(info => {
		if(!info) sql.run(`INSERT INTO settings (prefix, memberRole, modRole, adminRole, guildID, joinMessage, leaveMessage, starChannel) VALUES ('${client.config.prefix}', 'null', 'null', 'null', '${message.guild.id}' 'null', 'null', 'null')`);
	});

	sql.get(`SELECT * FROM settings WHERE guildID = "${message.guild.id}"`).then(data => {

		if(message.content.indexOf(data.prefix) !== 0) return;
		const args = message.content.split(/\s+/g);
		const command = args.shift().slice(data.prefix.length).toLowerCase();

		const level = client.permlevel(message, data);
		const cmd = client.commands.get(command) || client.commands.get(client.aliases.get(command));

		if (cmd && level >= cmd.conf.permLevel) {
			if(cmd.conf.enabled === true){
				cmd.run(client, message, args, level);
			} else {
				client.log(`"${message.author.tag}" tried to use the disabled command "${cmd.help.name}"`, "Notify");
			}
		} else if (cmd && level < cmd.conf.permLevel){
			client.log(`"${message.author.tag}" tried to use command: "${cmd.help.name}"`, "Notify");
		}
	});
};

module.exports.help = {
	name: "message",
	aliases: [],
	description: "Emitted when a user sends a message",
};
