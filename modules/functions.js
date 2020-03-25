const colors = require('colors');
const fs = require('fs');
module.exports = async (client) => {

	//	Permission level for commands.
	client.permlevel = (message, data) => {
		let permlvl = 0;

		if(!message.guild || !message.member) permlvl = 0;
		if(message.author.id === client.config.ownerID) return permlvl = 10;
		if(message.author.id === message.guild.owner.id) return permlvl = 5;

		const adminRole = message.guild.roles.cache.get(data.admin);
		if(adminRole && message.member.roles.has(adminRole.id)) return permlvl = 4;

		const modRole = message.guild.roles.cache.get(data.moderator);
		if(modRole && message.member.roles.has(modRole.id)) return permlvl = 3;

		const memRole = message.guild.roles.cache.get(data.member);
		if(memRole && message.member.roles.has(memRole.id)) return permlvl = 1;

		return permlvl;
	};

	//	Client log, semi-useful for keeping track of what is what in the console
	client.log = (msg, title, shardID) => {
		if(!title) title = "Log";
		if(isNaN(shardID)) shardID = "null";

		let str = "";
		const time = require("../modules/time.js")();
		switch(title.toLowerCase()){
		/* eslint-disable indent*/
			case "error": str = `<${colors.red(time.time)}>[${colors.red(`Shard-${shardID}`)}](${colors.red(title)}) ${colors.red(msg)}`; break;
			case "warn": str = `<${colors.yellow(time.time)}>[${colors.yellow(`Shard-${shardID}`)}](${colors.yellow(title)}) ${colors.yellow(msg)}`; break;
			case "notify": str = `<${colors.cyan(time.time)}>[${colors.cyan(`Shard-${shardID}`)}](${colors.cyan(title)}) ${colors.cyan(msg)}`; break;
			case "sql":	str = `<${colors.magenta(time.time)}>[${colors.magenta(`Shard-${shardID}`)}](${colors.magenta(title)}) ${colors.magenta(msg)}`; break;
			default: str = `<${colors.gray(time.time)}>[${colors.gray(`Shard-${shardID}`)}](${colors.gray(title)}) ${colors.gray(msg)}`;	break;
		/* eslint-enable indent */
		}
		if(client.logging){
			fs.appendFileSync("./logs.txt", `\n[${time.exactDate}] (${time.time}) ${msg.replace(/\[\d+m/g, "")}`);		// eslint-disable-line no-control-regex
		}
		const reggie = /\[\[\d+mShard-null\[\d+m\]/;	// eslint-disable-line no-control-regex
		str = str.replace(reggie, "");
		console.log(str);
	};

	client.asshole = require("../modules/asshole.js");

	/*
	MESSAGE CLEAN FUNCTION
	"Clean" removes @everyone pings, as well as tokens, and makes code blocks
	escaped so they're shown more easily. As a bonus it resolves promises
	and stringifies objects!
	This is mostly only used by Eval and Exec commands.
	*/
	client.clean = async (client, text) => {
		if(text && text.constructor.name == "Promise"){
			text = await text;
		}
		if(typeof evaled !== "string"){
			text = require("util").inspect(text, { depth: 0 });
		}
		text = text
			.replace(/`/g, "`" + String.fromCharCode(8203))
			.replace(/@/g, "@" + String.fromCharCode(8203))
			.replace(client.token, "https://i.imgur.com/cGIay9e.png");

		return text;
	};

	// Factorial functions.
	client.factorial = (num) => {
		if(isNaN(num)) return NaN;
		num = parseInt(num);
		let mNum = 1;
		for(let i = 2; i <= num; i++) mNum = mNum * i;
		return mNum;
	};

	/* Non-Critical Misc Functions */
	global.sql = require("better-sqlite3")("./objects/settings.sqlite");
	global.sqlGet = (statement, ...argume) => {
		const prep = sql.prepare(statement);
		return prep.get(argume);
	};
	global.sqlRun = (statement, ...argume) => {
		const prep = sql.prepare(statement);
		return prep.run(argume);
	};
	global.sqlAll = (statement, ...argume) => {
		const prep = sql.prepare(statement);
		return prep.all(argume);
	};

	String.prototype.toProperCase = function(){
		return this.replace(/([^\W_]+[^\s-]*) */g, function(txt){ return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); });
	};
	String.prototype.removeIndents = function(){	// Removes indents from a string.
		return this.replace(/\n(\t+)/g, "\n");
	};

	global.wait = require("util").promisify(setTimeout);

	global.sanity = (text) => {
		text = text
			.replace(/`/g, "\\`")
			.replace(/"/g, '\\"')
			.replace(/'/g, "\\'")
			.replace(/\\/g, "\\\\");	// test
		return text;
	};

	/* Custom Globals */

	// Calls process exit, if using something like pm2, the bot should automatically restart.
	global.restartBot = async (restartInfo) => {
		if(!restartInfo) restartInfo = "Automatic Restart";
		client.log(`Perfmorming reboot.. Reason: ${restartInfo}`, "Log");
		await wait(1000).then(w => {
			process.exit();
		});
	};

	// Checks for and fetches a user if it exists.
	global.grabUser = async (userID) => {
		if(!userID) return;
		if(userID.startsWith("<@") && userID.endsWith(">")) userID = userID.slice(2, -1);
		if(userID.startsWith("!")) userID = userID.slice(1);
		if(client.users.cache.get(userID)) return client.users.cache.get(userID);
		await client.users.fetch(userID).catch(e => { return undefined; });
		return client.users.cache.get(userID);
	};

	// Checks for and fetches a channel if it exists.
	global.grabChannel = async (channelID) => {
		if(!channelID) return;
		if(channelID.startsWith("<#") && channelID.endsWith(">")) channelID = channelID.slice(2, -1);
		if(client.channels.cache.get(channelID)) return client.channels.cache.get(channelID);
		await client.channels.fetch(channelID).catch(e => { return undefined; });
		const channel = (client.channels.cache.get(channelID)) ? client.channels.cache.get(channelID) : undefined;
		return channel;
	};

	// Checks for a role and returns it if it exists.
	global.grabRole = (roleID, guild) => {
		if(!roleID) return undefined;
		if(!guild) return undefined;
		if(guild.id) guild = guild.id;
		guild = client.guilds.cache.get(guild);
		if(!guild) return undefined;
		if(roleID.startsWith("<@&") && roleID.endsWith(">")) roleID = roleID.slice(3, -1);
		if(!guild.roles.cache.get(roleID)) return null;
		return guild.roles.cache.get(roleID);
	};

	global.saReact = async (msg) => {
		if(!msg) return null;
		await msg.reactions.removeAll();
		wait(1000);
		const data = sqlGet("SELECT * FROM settings WHERE guild = ?", msg.guild.id);
		const saData = data.assignRoles;
		const assignArray = saData.split("*");
		assignArray.forEach(x => {
			const emojiID = x.match(/\[(.*?)\]/)[0].replace(/[\][]/g, "");
			let actualEmoji = emojiID;
			if(client.emojis.cache.get(actualEmoji)) actualEmoji = client.emojis.cache.get(actualEmoji);
			msg.react(actualEmoji);
		});
	};

	global.talkedRecently = new Set();

	// I see your unhandled things, and present to you, handled things!
	process.on("uncaughtException", (err) => {
		const time = require("../modules/time.js")();
		const errorMsg = err.stack.replace(new RegExp(`${__dirname}/`, "g"), "./");
		fs.appendFileSync("./logs.txt", `\n[${time.exactDate}] (${time.time}) ${"Uncaught Exception:" + errorMsg.toString().replace(/\[3[7&9]m/g, "")}`);	// eslint-disable-line no-control-regex
		client.log(errorMsg, "Error");
		if(err.code !== 10008) restartBot("Uncaught Exception");
	});

	process.on("unhandledRejection", err => {
		const time = require("../modules/time.js")();
		fs.appendFileSync("./logs.txt", `\n[${time.exactDate}] (${time.time}) ${err.toString().replace(/\[3[7&9]m/g, "")}`);	// eslint-disable-line no-control-regex
		client.log(err.message, "Error");
		if(err.code !== 10008) restartBot("Unhandled Rejection");
	});
};
