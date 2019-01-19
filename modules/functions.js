const colors = require('colors');
module.exports = async (client) => {


	//	Permission level for commands.

	client.permlevel = (message, data) => {
		let permlvl = 0;

		if(!message.guild || !message.member) permlvl = 0;
		if(message.author.id === client.config.ownerID) return permlvl = 10;
		if(message.author.id === message.guild.owner.id) return permlvl = 5;

		try {
			const adminRole = message.guild.roles.get(data.adminRole);
			if (adminRole && message.member.roles.has(adminRole.id)) return permlvl = 4;
		} catch (e) {
			client.log("Oopsie, something went wrong D: (adminRole)", "Warn");
		}

		try {
			const modRole = message.guild.roles.get(data.modRole);
			if (modRole && message.member.roles.has(modRole.id)) return permlvl = 3;
		} catch (e) {
			client.log("Oopsie, something went wrong D: (modRole)", "Warn");
		}

		try {
			const memRole = message.guild.roles.get(data.memberRole);
			if (memRole && message.member.roles.has(memRole.id)) return permlvl = 1;
		} catch (e) {
			client.log("Oopsie, something went wrong D: (memberRole)", "Warn");
		}

		return permlvl;
	};


	//	Client log, semi-useful for keeping track of what is what in the console

	client.log = (msg, title) => {
		const t = new Date();
		let hours = t.getHours();
		if(hours < 10) hours = "0" + hours;
		let minutes = t.getMinutes();
		if(minutes < 10) minutes = "0" + minutes;
		const time = `${hours}:${minutes}`;

		if(!title) title = "Log";
		if(title.toLowerCase() === "error") return console.log(`[${colors.red(time)}](${colors.red(title)}) ${colors.red(msg)}`);
		if(title.toLowerCase() === "warn") return console.log(`[${colors.yellow(time)}](${colors.yellow(title)}) ${colors.yellow(msg)}`);
		if(title.toLowerCase() === "notify") return console.log(`[${colors.cyan(time)}](${colors.cyan(title)}) ${colors.cyan(msg)}`);
		if(title.toLowerCase() === "sql") return console.log(`[${colors.magenta(time)}](${colors.magenta(title)}) ${colors.magenta(msg)}`);
		console.log(`[${colors.gray(time)}](${colors.gray(title)}) ${colors.gray(msg)}`);
	};

	/*
	MESSAGE CLEAN FUNCTION
	"Clean" removes @everyone pings, as well as tokens, and makes code blocks
	escaped so they're shown more easily. As a bonus it resolves promises
	and stringifies objects!
	This is mostly only used by the Eval and Exec commands.
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

	//	Non-Critical Misc Functions

	String.prototype.toProperCase = function() {
		return this.replace(/([^\W_]+[^\s-]*) */g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
	};

	global.wait = require("util").promisify(setTimeout);

	global.pause = async (num) => {
		await wait(num);
	};
	// Custom Global functions
	global.restartBot = async (restartInfo) => {
		if(!restartInfo){
			restartInfo = "Automatic Restart";
		}
		client.log(`Perfmorming reboot.. Reason: ${restartInfo}`, "Log");
		await wait(1000).then(w => {
			process.exit();
		});
	};

	global.grabUser = async (userID) => {
		if(!userID) return;
		if(userID.startsWith("<@") && userID.endsWith(">")) userID = userID.slice(2, -1);
		if(userID.startsWith("!")) userID = userID.slice(1);
		await client.fetchUser(userID).catch(e => { return; });
		return client.users.get(userID);
	};

	global.grabChannel = (channelID) => {
		if(!channelID) return;
		if(channelID.startsWith("<#") && channelID.endsWith(">")) channelID = channelID.slice(2, -1);
		return client.channels.get(channelID);
	};

	global.grabRole = (roleID, guild) => {
		if(!roleID) return;
		if(!guild) return;
		if(roleID.startsWith("<@&") && roleID.endsWith(">")) roleID = roleID.slice(3, -1);
		return guild.roles.get(roleID);
	};

	// I see your unhandled things, and present to you, handled things!

	process.on("uncaughtException", (err) => {
		const errorMsg = err.stack.replace(new RegExp(`${__dirname}/`, "g"), "./");
		console.error("Uncaught Exception: ", errorMsg);
	});

	process.on("unhandledRejection", err => {
		console.error("Uncaught Promise Error: ", err);
	});
};
