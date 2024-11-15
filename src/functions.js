import { User, Client, Emoji, PermissionsBitField, ActionRowBuilder, Embed } from "discord.js";

import colors from "colors";


/**
 * @name ordinal
 * @param {Number|String} num The number to be converted to an ordinal format
 * @returns {String} The number in ordinal format
 * @description Convert a number to an ordinal format (1st, 2nd, 3rd, 4th.. etc.)
 * @example const ord = ordinal(53);
 * console.log(ord); // 53rd
**/
function ordinal(num){
	// Ordinal indicators (1st, 2nd, 3rd, 4th.. etc.)
	if(isNaN(num)) return 'NaN';

	const ord = num.toString();
	if(ord.endsWith("1") && !ord.endsWith("11")) return `${ord}st`;
	if(ord.endsWith("2") && !ord.endsWith("12")) return `${ord}nd`;
	if(ord.endsWith("3") && !ord.endsWith("13")) return `${ord}rd`;

	return `${ord}th`;
}


/**
 * @typedef {object} timeObject
 * @property {string} day The day of the week
 * @property {string} shortDay The day of the week in short form
 * @property {string} month The month of the year
 * @property {string} shortMonth The month of the year in short form
 * @property {string} date The date in the format `DD/MM/YYYY`
 * @property {string} fullDate The date in the format `DDth of Month, YYYY`
 * @property {string} time The time in the format `HH:MM:SS`
 * @property {string} ISO The time in the format `YYYY-MM-DDTHH:MM:SS.MSSZ`
**/
/**
 * @name timeFormat
 * @param {Date} [dateTime] The date object to be used, defaults to the current time
 * @returns {timeObject} An object containing the time in different formats
 * @description Returns the time in different formats
 * - day: The day of the week
 * - shortDay: The day of the week in short form
 * - month: The month of the year
 * - shortMonth: The month of the year in short form
 * - date: The date in the format `DD/MM/YYYY`
 * - fullDate: The date in the format `DDth of Month, YYYY`
 * - time: The time in the format `HH:MM:SS`
 * - ISO: The time in the format `YYYY-MM-DDTHH:MM:SS.MSSZ`
 * @example const time = timeFormat();
 * console.log(time.fullDate); // 25th of August, 2023
**/
function timeFormat(dateTime = new Date()){

	const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
	const shortWeekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
	const months = [
		'January',	 'February',
		'March',	 'April',
		'May', 		 'June',
		'July',	 	 'August',
		'September', 'October',
		'November',	 'December'
	];

	const shortMonths = [
		'Jan', 'Feb',
		'Mar', 'Apr',
		'May', 'Jun',
		'Jul', 'Aug',
		'Sep', 'Oct',
		'Nov', 'Dec'
	];

	const day = weekdays[dateTime.getDay()];													// Tuesday
	const shortDay = shortWeekdays[dateTime.getDay()];											// Tue
	const month = months[dateTime.getMonth()];													// August
	const shortMonth = shortMonths[dateTime.getMonth()];										// Aug
	const date = `${dateTime.getDate()}/${dateTime.getMonth() + 1}/${dateTime.getFullYear()}`;	// 25/8/2023


	const ordinalDay = ordinal(dateTime.getDate().toString());
	const fullDate = `${ordinalDay} of ${month}, ${dateTime.getFullYear()}`;					// 25th of August, 2023


	let hour = dateTime.getHours().toString();
	if(dateTime.getHours() < 10) hour = "0" + dateTime.getHours();
	let minute = dateTime.getMinutes().toString();
	if(dateTime.getMinutes() < 10) minute = "0" + dateTime.getMinutes();
	let second = dateTime.getSeconds().toString();
	if(dateTime.getSeconds() < 10) second = "0" + dateTime.getSeconds();
	const time = `${hour}:${minute}:${second}`;													// 12:30:15

	return {
		day,
		shortDay,
		month,
		shortMonth,
		date,
		fullDate,
		time,
		ISO: dateTime.toISOString()																// 2023-08-25T12:30:15.000Z
	};
}


/**
 * @typedef {("good" | "warn" | "error" | "info" | "misc" | "normal")} outputType
**/
/**
 * @name output
 * @param {outputType} type The type of message
 * @param {any} message The item to be logged
 * @returns {void}
 * @description Logs a message to the console
 * @example client.output("normal", "This is a message");
 * // [2020-12-31 | 11:59:59] This is a message
**/
function output(type, message){
	const curTime = timeFormat();
	switch(type.toLowerCase()){
		case "good":
			console.log(`[${colors.gray(`${curTime.date} | ${curTime.time}`)}] ${colors.green(message)}`);
			break;

		case "warn":
			console.log(`[${colors.gray(`${curTime.date} | ${curTime.time}`)}] ${colors.yellow(message)}`);
			break;

		case "error":
			console.log(`[${colors.gray(`${curTime.date} | ${curTime.time}`)}] ${colors.red(message)}`);
			break;

		case "info":
			console.log(`[${colors.gray(`${curTime.date} | ${curTime.time}`)}] ${colors.magenta(message)}`);
			break;

		case "misc":
			console.log(`[${colors.gray(`${curTime.date} | ${curTime.time}`)}] ${colors.blue(message)}`);
			break;

		case "normal":	// fallsthrough
		default:
			console.log(`[${colors.gray(`${curTime.date} | ${curTime.time}`)}] ${colors.white(message)}`);
			break;
	}
}


/**
 * @name permLevel
 * @param {Client} client The client object
 * @param {User} user A discord user object
 * @param {Channel} channel A discord channel object
 * @returns {number}
 * @description Returns the permission level of the user
 * @example const permLevel = client.permLevel(client, message);
**/
function permLevel(client, user, channel){
	let perm = 0;

	const DM = 1;
	const GroupDM = 3;
	if(channel.type === DM || channel.type === GroupDM) return perm;

	const personCanDelete = channel.permissionsFor(channel.guild.members.cache.get(user.id)).has(PermissionsBitField.Flags.ManageMessages);
	const personCanKick = channel.permissionsFor(channel.guild.members.cache.get(user.id)).has(PermissionsBitField.Flags.KickMembers);
	const personCanBan = channel.permissionsFor(channel.guild.members.cache.get(user.id)).has(PermissionsBitField.Flags.BanMembers);
	const personIsAdmin = channel.permissionsFor(channel.guild.members.cache.get(user.id)).has(PermissionsBitField.Flags.Administrator);

	if(personCanDelete) perm = 2;
	if(personCanKick) perm = 4;
	if(personCanBan) perm = 6;
	if(personIsAdmin) perm = 8;

	if(user.id === channel.guild.ownerId) perm = 10;
	if(user.id === client.config.ownerID) perm = 100;

	return perm;
}


/**
 * @name clean
 * @param {Client} client The client object
 * @param {string |} text The text to be cleaned
 * @returns {Promise<string>}
 * @description Cleans the text of any sensitive information
 * @example const cleanText = clean(client, "some text");
**/
async function clean(client, text){
	if(text && text.constructor.name == "Promise") text = await text;
	if(typeof text !== "string"){
		const imp = await import("util");
		imp.default.inspect(text, { depth: 0 });
	}
	text = text.toString()
		.replace(/`/g, "`" + String.fromCharCode(8203))
		.replace(/@/g, "@" + String.fromCharCode(8203))
		.replace(client.token, "https://i.imgur.com/cGIay9e.png");

	return text;
}


/**
 * @name grabChannel
 * @param {string} channelID The ID of the channel to be grabbed
 * @returns {Promise<Channel | undefined>} The channel object or undefined if the channel is not found
 * @description Grabs a channel object from the cache or fetches it from the API
 * @example const channel = grabChannel(client, "1234567890");
**/
async function grabChannel(client, channelID){
	if(!channelID) return undefined;
	if(channelID.startsWith("<#") && channelID.endsWith(">")) channelID = channelID.slice(2, -1);
	if(client.channels.cache.get(channelID)) return client.channels.cache.get(channelID);

	await client.channels.fetch(channelID).catch(e => {
		return undefined;
	});

	return (client.channels.cache.get(channelID)) ? client.channels.cache.get(channelID) : undefined;
}


/**
 * @name grabUser
 * @param {Client} client The client object
 * @param {string} userID The ID of the user to be grabbed
 * @returns {Promise<User | undefined>} The user object or undefined if the user is not found
 * @description Grabs a user object from the cache or fetches it from the API
 * @example const user = grabUser(client, "1234567890");
**/
async function grabUser(client, userID){
	if(!userID) return undefined;
	if(userID.startsWith("<@") && userID.endsWith(">")) userID = userID.slice(2, -1);
	if(userID.startsWith("!")) userID = userID.slice(1);

	if(client.users.cache.get(userID)) return client.users.cache.get(userID);

	await client.users.fetch(userID).catch(e => {
		return undefined;
	});

	return (client.users.cache.get(userID)) ? client.users.cache.get(userID) : undefined;
}


/**
 * @name grabEmoji
 * @param {Client} client The client object
 * @param {string} emojiID The ID of the emoji to be grabbed
 * @returns {Promise<Emoji | undefined>} The emoji object or undefined if the emoji is not found
 * @description Grabs a emoji object from the cache via it's ID
 * @example const emoji = grabEmoji("1234567890");
**/
async function grabEmoji(client, emojiID){
	if(!emojiID) return undefined;
	if(emojiID.startsWith("<a:") && emojiID.endsWith(">")) emojiID = emojiID.slice(3, -1);	// Animated
	if(emojiID.startsWith("<:") && emojiID.endsWith(">")) emojiID = emojiID.slice(2, -1);	// Static

	const emojiSplit = emojiID.split(":");
	emojiID = emojiSplit[emojiSplit.length - 1];

	return (client.emojis.cache.get(emojiID)) ? client.emojis.cache.get(emojiID) : undefined;
}


/**
 * @typedef {object} messageData
 * @property {string} content The content of the message
 * @property {Embed[]} embeds An array of message embeds
 * @property {ActionRowBuilder[]} components An array of ActionRowBuilders
 * @property {bool} ephemeral Whether or not the message should be ephemeral
 **/
/**
 * @name handleElement
 * @param {Message|ChatInputCommandInteraction} element The message or interaction that was created
 * @param {bool} slashCommand Whether or not the command is a slash command
 * @param {messageData} messsgeData The data to send
 * @returns {Message|InteractionResponse}
**/
async function handleElement(element, slashCommand, messageData, deferred = false){

	if(!messageData?.content && !messageData?.embeds) throw new Error().name("NoContentError").message("No content or embeds were provided");

	const data = {};
	if(messageData.content)	data.content = messageData.content.toString();
	if(messageData.embeds) data.embeds = messageData.embeds;
	if(messageData.components) data.components = messageData.components;
	if(slashCommand && messageData.ephemeral && !deferred) data.ephemeral = messageData.ephemeral;

	let reply;
	if(deferred){
		reply = await element.editReply(data);
	} else {
		reply = await element.reply(data);
	}

	return reply;
}


/**
 * @name caseFix
 * @param {String} string The string to be fixed
 * @returns {string} The string with correct natural capitalization
 * @description Fixes the capitalization of a string
 * @example const fixed = caseFix("this is a StrinG. thE capitaLIZaTion iS wrOng.");
 * console.log(fixed); // This is a string. The capitalization is wrong.
**/
function caseFix(string){
	string = string.toString();

	const stringArray = string.toLowerCase().split(/\s+/g);
	const newStringArray = [];

	let capNext = true;
	for(const word of stringArray){
		let s = word;
		if(capNext) s = word.charAt(0).toUpperCase() + word.slice(1);
		newStringArray.push(s);

		capNext = (word.includes(".")) ? true : false;
	}

	const newString = newStringArray.join(" ");
	return newString;
}


/**
 * @name humanTime
 * @param {Number} ms The number of milliseconds to convert
 * @param {String} [format] The format to convert the time to, defaults to "\\h hours \\m minutes \\s seconds"
 * @returns {String} The converted time
 * @description Convert milliseconds to human readable formats
 * - `\\S` = Miliseconds
 * - `\\s` = Seconds
 * - `\\m` = Minutes
 * - `\\h` or `\\H` = Hours
 * - `\\d` or `\\D` = Days
 * - `\\M` = Months
 * - `\\y` or `\\Y` = Years
 * @example const format = humanTime(951000, "\\m minutes \\s seconds");
 * console.log(format); // 15 minutes 51 seconds
**/
function humanTime(ms, format = "\\h hours \\m minutes \\s seconds"){

	if(!format) return `${ms}ms`;

	const baseMilliseconds = ms;
	const baseSeconds = Math.floor(baseMilliseconds / 1000);
	const baseMinutes = Math.floor(baseSeconds / 60);
	const baseHours = Math.floor(baseMinutes / 60);
	const baseDays = Math.floor(baseHours / 24);
	const baseMonths = Math.floor(baseDays / 30);
	const baseYears = Math.floor(baseDays / 365);

	let milliseconds = baseMilliseconds;
	let seconds = baseSeconds;
	let minutes = baseMinutes;
	let hours = baseHours;
	let days = baseDays;
	let months = baseMonths;
	const years = baseYears;

	if(format.includes("\\s")) milliseconds = baseMilliseconds % 1000;					// Seconds
	if(format.includes("\\m")) seconds = baseSeconds % 60;								// Minutes
	if(format.includes("\\h") || format.includes("\\H")) minutes = baseMinutes % 60;	// Hours
	if(format.includes("\\d") || format.includes("\\D")) hours = baseHours % 24;		// Days
	if(format.includes("\\M")) days = baseDays % 30;									// Months
	if(format.includes("\\y") || format.includes("\\Y")) months = months % 12;			// Years

	const duration = format.replace(/\\S/, milliseconds)
		.replace(/\\s/g, seconds)
		.replace(/\\m/g, minutes)
		.replace(/\\h/g, hours)
		.replace(/\\H/g, hours)
		.replace(/\\d/g, days)
		.replace(/\\D/g, days)
		.replace(/\\M/g, months)
		.replace(/\\y/g, years)
		.replace(/\\Y/g, years);

	return duration;
}


/**
 * @typedef {(number|string)} numberLike
**/
/**
 * @name randomNumber
 * @param {numberLike} min The minimum number that should be returned
 * @param {numberLike} max The maximum number that should be returned
 * @returns {number} A random number between the min and max
**/
function randomNumber(min, max){

	if(isNaN(parseInt(min))) throw new Error("'min' must be a number or a number-like string");
	if(isNaN(parseInt(max))) throw new Error("'max' must be a number or a number-like string");
	if(min >= max) throw new Error("'min' must be less than 'max'");

	return Math.floor(Math.random() * (max - min + 1)) + min;
}


/**
 * @name compareStrings
 * @param {string} str1 The first string to compare against
 * @param {string} str2 The second string to compare against
 * @returns {number} The percentage of similarity between the two strings
 * @description Compares two strings and returns the Levenshtein distance between them
 * Code reference: https://www.tutorialspoint.com/levenshtein-distance-in-javascript
**/
function compareStrings(str1, str2){
	// Basic typechecking
	if(typeof str1 !== "string") throw new TypeError("'str1' must be a string!");
	if(typeof str2 !== "string") throw new TypeError("'str2' must be a string!");

	// First off, if they're the same, there are no changes to make, so we can just return a 0.
	if(str1 === str2) return 0;

	const str1Length = str1.length;
	const str2Length = str2.length;

	// If a string is zero, return the length of the other string
	if(str1Length === 0) return str2Length;
	if(str2Length === 0) return str1Length;

	const track = Array(str2Length + 1).fill(null).map(() => Array(str1Length + 1).fill(null));
	for(let i = 0; i <= str1Length; i += 1) track[0][i] = i;
	for(let j = 0; j <= str2Length; j += 1) track[j][0] = j;

	for(let j = 1; j <= str2Length; j += 1){
		for(let i = 1; i <= str1Length; i += 1){
			const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
			// 						deletion 				insertion 				substitution
			track[j][i] = Math.min(track[j][i - 1] + 1,		track[j - 1][i] + 1,	track[j - 1][i - 1] + indicator);
		}
	}

	return track[str2Length][str1Length];
}


/**
 * @name findSmallestDistance
 * @param {string} a
 * @param {string[]} strings
 * @returns {object} The best match
 * @description Finds the best match for a string in an array of strings
**/
function findSmallestDistance(a, strings){
	const bestMatch = { score: Infinity, item: null };
	for(const b of strings){
		const score = compareStrings(a, b) / Math.max(a.length, b.length);
		if(score === 0){
			bestMatch.score = score;
			bestMatch.item = b;
			break;
		}

		if(score < bestMatch.score){
			bestMatch.score = score;
			bestMatch.item = b;
		}
	}

	return bestMatch;
}


export {
	ordinal,
	timeFormat,
	output,
	permLevel,
	clean,
	grabChannel,
	grabUser,
	grabEmoji,
	handleElement,
	caseFix,
	humanTime,
	randomNumber,
	compareStrings,
	findSmallestDistance
};