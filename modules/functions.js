const colors = require('colors');
const fs = require('fs');
module.exports = async (client) => {

	//	Permission level for commands.
	client.permlevel = (message, data) => {
		let permlvl = 0;

		if(!message.guild || !message.member) permlvl = 0;
		if(message.author.id === client.config.ownerID) return permlvl = 10;
		if(message.author.id === message.guild.owner.id) return permlvl = 5;

		const adminRole = message.guild.roles.get(data.admin);
		if (adminRole && message.member.roles.has(adminRole.id)) return permlvl = 4;

		const modRole = message.guild.roles.get(data.moderator);
		if (modRole && message.member.roles.has(modRole.id)) return permlvl = 3;

		const memRole = message.guild.roles.get(data.member);
		if (memRole && message.member.roles.has(memRole.id)) return permlvl = 1;

		return permlvl;
	};

	//	Client log, semi-useful for keeping track of what is what in the console
	client.log = (msg, title) => {
		if(!title) title = "Log";
		fs.appendFileSync("./logs.txt", `\n[${time.exactDate}] (${time.time}) ${msg.replace(/\[3[7&9]m/g, "")}`);		// eslint-disable-line no-control-regex
		if(title.toLowerCase() === "error") return console.log(`[${colors.red(time.time)}](${colors.red(title)}) ${colors.red(msg)}`);
		if(title.toLowerCase() === "warn") return console.log(`[${colors.yellow(time.time)}](${colors.yellow(title)}) ${colors.yellow(msg)}`);
		if(title.toLowerCase() === "notify") return console.log(`[${colors.cyan(time.time)}](${colors.cyan(title)}) ${colors.cyan(msg)}`);
		if(title.toLowerCase() === "sql") return console.log(`[${colors.magenta(time.time)}](${colors.magenta(title)}) ${colors.magenta(msg)}`);
		console.log(`[${colors.gray(time.time)}](${colors.gray(title)}) ${colors.gray(msg)}`);
	};

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

	// Ordinal indicators (1st, 2nd, 3rd, 4th.. etc.)
	client.ordinal = (num) => {
		if(isNaN(num)) return NaN;
		num = num.toString();
		if(num.endsWith("1") && !num.endsWith("11")) return `${num}st`;
		if(num.endsWith("2") && !num.endsWith("12")) return `${num}nd`;
		if(num.endsWith("3") && !num.endsWith("13")) return `${num}rd`;
		return `${num}th`;
	};

	/* Non-Critical Misc Functions */

	String.prototype.toProperCase = function() {
		return this.replace(/([^\W_]+[^\s-]*) */g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
	};

	global.wait = require("util").promisify(setTimeout);

	global.pause = async (num) => {
		await wait(num);
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
		await client.fetchUser(userID).catch(e => { return; });
		return client.users.get(userID);
	};

	// Checks for and fetches a channel if it exists.
	global.grabChannel = (channelID) => {
		if(!channelID) return;
		if(channelID.startsWith("<#") && channelID.endsWith(">")) channelID = channelID.slice(2, -1);
		if(!client.channel.get(channelID)) return "Invalid Channel";
		return client.channels.get(channelID);
	};

	// Checks for a role and returns it if it exists.
	global.grabRole = (roleID, guild) => {
		if(!roleID) return;
		if(!guild) return;
		if(guild.id) guild = guild.id;
		guild = client.guilds.get(guild);
		if(!guild) return "Invalid Guild";
		if(roleID.startsWith("<@&") && roleID.endsWith(">")) roleID = roleID.slice(3, -1);
		if(!guild.roles.get(roleID)) return "Invalid Role";
		return guild.roles.get(roleID);
	};

	// Time Function
	function thime() {
		const t = new Date();
		let hours = t.getHours();
		if(hours < 10) hours = "0" + hours;
		let minutes = t.getMinutes();
		if(minutes < 10) minutes = "0" + minutes;
		const monthArray = ["Jan", "Feb", "Mar", "April", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"];
		const dayArray = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

		const dayNumber = t.getDate().toString();
		const daySuffix = client.ordinal(dayNumber);

		return {
			time : `${hours}:${minutes}`,
			day : `${dayArray[t.getDay()]}`,
			exactDate : `${t.getDate()}/${t.getMonth()}/${t.getFullYear()}`,
			date : `${daySuffix} of ${monthArray[t.getMonth()]}`,
		};
	}

	global.time = thime();

	// I see your unhandled things, and present to you, handled things!

	process.on("uncaughtException", (err) => {
		const errorMsg = err.stack.replace(new RegExp(`${__dirname}/`, "g"), "./");
		console.error("Uncaught Exception: ", errorMsg);
		fs.appendFileSync("./logs.txt", `\n[${time.exactDate}] (${time.time}) ${errorMsg}`);
	});

	process.on("unhandledRejection", err => {
		console.error("Uncaught Promise Error: ", err);
		fs.appendFileSync("./logs.txt", `\n[${time.exactDate}] (${time.time}) ${err}`);
	});
};
