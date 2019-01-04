module.exports = (client) => {

	const colors = require('colors');

	/*
	PERMISSION LEVEL FUNCTION
	This is a very basic permission system for commands which uses "levels"
	"spaces" are intentionally left black so you can add them if you want.
	NEVER GIVE ANYONE BUT OWNER THE LEVEL 10! By default this can run any
	command including the VERY DANGEROUS `eval` and `exec` commands!
	*/

	client.permlevel = message => {
		let permlvl = 0;

		if(message.author.id === client.config.ownerID) return 10;

		// If DMs or webhook, return 0 perm level.
		if(!message.guild || !message.member) return 0;

		// The rest of the perms rely on roles. If those roles are not found
		// in the settings, or the user does not have it, their level will be 0
		try {
			const memberRole = message.guild.roles.find(r => r.name.toLowerCase() === client.config.memberRole.toLowerCase());
			if (memberRole && message.member.roles.has(memberRole.id)) permlvl = 1;
		} catch (e) {
			console.warn("memberRole not present in guild settings. Skipping Member (perm level 1) check");
		}
		try {
			const modRole = message.guild.roles.find(r => r.name.toLowerCase() === client.config.modRole.toLowerCase());
			if (modRole && message.member.roles.has(modRole.id)) permlvl = 3;
		} catch (e) {
			console.warn("modRole not present in guild settings. Skipping Moderator (perm level 3) check");
		}
		try {
			const adminRole = message.guild.roles.find(r => r.name.toLowerCase() === client.config.adminRole.toLowerCase());
			if (adminRole && message.member.roles.has(adminRole.id)) permlvl = 4;
		} catch (e) {
			console.warn("adminRole not present in guild settings. Skipping Administrator (perm level 4) check");
		}

		// Guild Owner gets an extra level, wooh!
		if(message.author.id === message.guild.owner.id) permlvl = 5;

		return permlvl;
	};

	/*
	LOGGING FUNCTION
	Logs to console. Future patches may include time+colors
	*/
	client.log = (msg, title) => {
		if(!title) title = "Log";
		if(title.toLowerCase() === "error"){
			return console.log(`[${colors.red(title)}] ${colors.red(msg)}`);
		}
		if(title.toLowerCase() === "warn"){
			return console.log(`[${colors.yellow(title)}] ${colors.yellow(msg)}`);
		}
		if(title.toLowerCase() === "notify"){
			return console.log(`[${colors.cyan(title)}] ${colors.cyan(msg)}`);
			// return console.log(colors.cyan('[') + title + colors.cyan('] ') + msg);
		}
		if(title.toLowerCase() === "sql"){
			return console.log(`[${colors.magenta(title)}] ${colors.magenta(msg)}`);
		}
		console.log(`[${colors.gray(title)}] ${colors.gray(msg)}`);
	};

	/*
	SINGLE-LINE AWAITMESSAGE
	A simple way to grab a single reply, from the user that initiated
	the command. Useful to get "precisions" on certain things...
	USAGE
	const response = await client.awaitReply(msg, "Favourite Color?");
	msg.reply(`Oh, I really love ${response} too!`);
	*/

	client.awaitReply = async (msg, question, limit = 10000) => {
		const filter = m=>m.author.id = msg.author.id;
		await msg.channel.send(question);
		try {
			const collected = await msg.channel.awaitMessages(filter, { max: 1, time: limit, errors: ["time"] });
			return collected.first().content;
		} catch(e) {
			return false;
		}
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

	/* MISCELANEOUS NON-CRITICAL FUNCTIONS */

	String.prototype.toProperCase = function() {
		return this.replace(/([^\W_]+[^\s-]*) */g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
	};

	// `await wait(1000);` to "pause" for 1 second.
	global.wait = require("util").promisify(setTimeout);

	global.pause = async (num) => {
		await wait(num);
	};

	// Another semi-useful utility command, which creates a "range" of numbers
	// in an array. `range(10).forEach()` loops 10 times for instance. Why?
	// Because honestly for...i loops are ugly.
	global.range = (count, start = 0) => {
		const myArr = [];
		for(let i = 0; i < count; i++) {
			myArr[i] = i + start;
		}
		return myArr;
	};

	global.restartBot = async (restartInfo) => {
		if(!restartInfo){
			restartInfo = "Automatic Restart";
		}
		client.log(`Perfmorming reboot.. Reason: ${restartInfo}`, "Log");
		await wait(1000).then(w => {
			process.exit();
		});
	};

	// These 2 simply handle unhandled things. Like Magic. /shrug
	process.on("uncaughtException", (err) => {
		const errorMsg = err.stack.replace(new RegExp(`${__dirname}/`, "g"), "./");
		console.error("Uncaught Exception: ", errorMsg);
	});

	process.on("unhandledRejection", err => {
		console.error("Uncaught Promise Error: ", err);
	});
};
