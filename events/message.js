const Discord = require('discord.js');
const random = require("../objects/random.json");
const random2 = require("../objects/random2.json");
module.exports = async (client, message) => {
	try {
		if(message.partial) await message.fetch().catch(e => { return; });
		if(message.author.partial) await message.author.fetch().catch(e => { return; });
		if(message.member.partial) await message.member.fetch().catch(e => { return; });
	} catch (e){ return; }

	if(message.author.bot) return;
	if(message.channel.type === "dm") return;
	if(!message.channel.permissionsFor(message.guild.me).has("SEND_MESSAGES")) return;

	if(message.mentions.everyone) message.react(client.emojis.get("519919364485677066")).catch(e => { return; });

	if(!talkedRecently.has(`${message.author.id}|${message.guild.id}`)){
		talkedRecently.add(`${message.author.id}|${message.guild.id}`);
		const points = sqlGet(`SELECT * FROM points WHERE user = ? AND guild = ?`, message.author.id, message.guild.id);
		if(!points){
			sqlRun(`INSERT INTO points (guild, user, amount) VALUES (?, ?, "1")`, message.guild.id, message.author.id);
			client.log(`Added "${message.author.tag}" from the "${message.guild.name}" server.`, "SQL");
		} else {
			sqlRun(`UPDATE points SET amount = ? WHERE user = ? AND guild = ?`, points.amount + 1, message.author.id, message.guild.id);
		}
		setTimeout(() => { talkedRecently.delete(`${message.author.id}|${message.guild.id}`); }, 10000);
	}

	const str = message.content.toLowerCase();
	if(random[message.content]){
		return message.channel.send(random[message.content]);
	} else
	if(random2[str]){
		return message.channel.send(random2[str]);
	}

	const guildData = sqlGet("SELECT * FROM settings WHERE guild = ?", message.guild.id);
	const level = client.permlevel(message, guildData);
	const regicide = /(https?:\/\/)?(discord\.gg\/)([^\s]*)/gi;
	const serverAd = message.content.match(regicide);
	if(serverAd && level < 3){
		if(message.channel.permissionsFor(message.guild.me).has("MANAGE_MESSAGES")){
			message.delete();
			message.reply("Advertising for random discord servers is not allowed.\nIf you think this was a mistake, contact an admin. ");
		}
	}

	const mention = new RegExp(`^<@!?${client.user.id}>`);
	const mentionCheck = message.content.match(mention) ? message.content.match(mention)[0] : '!';

	const prefixes = [`${mentionCheck} `, guildData.prefix];
	let prefix = false;
	for(const thisPrefix of prefixes){
		if(message.content.startsWith(thisPrefix)) prefix = thisPrefix;
	}
	if(!prefix) return;

	let args = message.content.replace(/(?:\r\n|\r|\n)/g, "\u200b").split(/\s+/g);

	let command;
	if(args[0] === mentionCheck){
		args = args.slice(1);
		command = args.shift().toLowerCase();
	} else {
		command = args.shift().slice(prefix.length).toLowerCase();
	}
	const cmd = client.commands.get(command) || client.commands.get(client.aliases.get(command));

	if(cmd && level >= cmd.conf.permLevel){
		if(cmd.conf.enabled === true){
			const string = "Due to the nature of this bot, it requires embed permissions to run certain commands.\nPlease grant the bot embed permissions and try the command again.";
			if(!message.channel.permissionsFor(message.guild.me).has("EMBED_LINKS")) return message.channel.send(string);
			cmd.run(client, message, args, level);
		} else {
			client.log(`"${message.author.tag}" tried to use the disabled command "${cmd.help.name}"`, "Log");
		}
	} else if(cmd && level < cmd.conf.permLevel){
		client.log(`"${message.author.tag}" tried to use command: "${cmd.help.name}"`, "Log");
	}
	if(!cmd){
		const cc = await sqlAll(`SELECT * FROM commands WHERE guild = ?`, message.guild.id);
		const cmdList = {};
		cc.forEach(data => cmdList[data.name] = data.output);
		if(cmdList[command]) return message.channel.send(cmdList[command]);
	}
};

module.exports.help = {
	name: "message",
	description: "Emitted when a user sends a message"
};
