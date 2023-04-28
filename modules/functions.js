const colors = require("colors");
const time = require("./timeFormat.js");
const { User, Channel, Client, Emoji, PermissionsBitField } = require("discord.js");

/**
 * @name functions
 * @param {Client} client The discord client object
 * @description A collection of functions used throughout the bot
**/
module.exports = (client) => {


	/**
	 * @name output
	 * @param {string} type Possible Values: good, warn, info, misc, error, normal
	 * @param {any} message The item to be logged
	 * @returns {void}
	 * @description Logs a message to the console
	 * @example client.output("normal", "This is a message");
	 * // [2020-12-31 | 11:59:59] This is a message
	**/
	client.output = function output(type, message){
		const curTime = time();
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
			case "misc":
				console.log(`[${colors.gray(`${curTime.date} | ${curTime.time}`)}] ${colors.cyan(message)}`);
				break;

			case "normal":
			default:
				console.log(`[${colors.gray(`${curTime.date} | ${curTime.time}`)}] ${colors.white(message)}`);
				break;
		}
	};


	/**
	 * @name permLevel
	 * @param {User} user A discord user object
	 * @param {Channel} channel A discord channel object
	 * @returns {number}
	 * @description Returns the permission level of the user
	 * @example const permLevel = client.permLevel(client, message);
	**/
	client.permLevel = function permLevel(user, channel){
		let permlevel = 0;
		if(channel.type === "DM") return permlevel;

		if(channel.permissionsFor(channel.guild.members.cache.get(user.id)).has(PermissionsBitField.Flags.ManageMessages)) permlevel = 5;
		if(user.id === channel.guild.ownerId) permlevel = 10;
		if(user.id === client.config.ownerID) permlevel = 100;

		return permlevel;
	};


	/**
	 * @name clean
	 * @param {string} text The text to be cleaned
	 * @returns {Promise<string>}
	 * @description Cleans the text of any sensitive information
	 * @example const cleanText = client.clean(client, text);
	**/
	client.clean = async function clean(text){
		if(text && text.constructor.name == "Promise") text = await text;
		if(typeof evaled !== "string") text = require("util").inspect(text, { depth: 0 });

		text = text
			.replace(/`/g, "`" + String.fromCharCode(8203))
			.replace(/@/g, "@" + String.fromCharCode(8203))
			.replace(client.token, "https://i.imgur.com/cGIay9e.png");

		return text;
	};


	/**
	 * @name grabChannel
	 * @param {string} channelID The ID of the channel to be grabbed
	 * @returns {Promise<Channel | undefined>} The channel object or undefined if the channel is not found
	 * @description Grabs a channel object from the cache or fetches it from the API
	 * @example const channel = client.grabChannel("1234567890");
	**/
	client.grabChannel = async function grabChannel(channelID){
		if(!channelID) return undefined;
		if(channelID.startsWith("<#") && channelID.endsWith(">")) channelID = channelID.slice(2, -1);
		if(client.channels.cache.get(channelID)) return client.channels.cache.get(channelID);

		await client.channels.fetch(channelID).catch(e => { return undefined; });

		return (client.channels.cache.get(channelID)) ? client.channels.cache.get(channelID) : undefined;
	};


	/**
	 * @name grabUser
	 * @param {string} userID The ID of the user to be grabbed
	 * @returns {Promise<User | undefined>} The user object or undefined if the user is not found
	 * @description Grabs a user object from the cache or fetches it from the API
	 * @example const user = client.grabUser("1234567890");
	 */
	client.grabUser = async function grabUser(userID){
		if(!userID) return undefined;
		if(userID.startsWith("<@") && userID.endsWith(">")) userID = userID.slice(2, -1);
		if(userID.startsWith("!")) userID = userID.slice(1);

		if(client.users.cache.get(userID)) return client.users.cache.get(userID);

		await client.users.fetch(userID).catch(e => { return undefined; });

		return (client.users.cache.get(userID)) ? client.users.cache.get(userID) : undefined;
	};


	/**
	 * @name grabEmoji
	 * @param {string} emojiID The ID of the emoji to be grabbed
	 * @returns {Promise<Emoji | undefined>} The emoji object or undefined if the emoji is not found
	 * @description Grabs a emoji object from the cache via it's ID
	 * @example const emoji = client.grabEmoji("1234567890");
	 */
	client.grabEmoji = async function grabEmoji(emojiID){
		if(!emojiID) return undefined;
		if(emojiID.startsWith("<a:") && emojiID.endsWith(">")) emojiID = emojiID.slice(3, -1);	// Animated
		if(emojiID.startsWith("<:") && emojiID.endsWith(">")) emojiID = emojiID.slice(2, -1);	// Static

		const emojiSplit = emojiID.split(":");
		emojiID = emojiSplit[emojiSplit.length - 1];

		return (client.emojis.cache.get(emojiID)) ? client.emojis.cache.get(emojiID) : undefined;
	};


	// Handle the unhandled things
	process.on("uncaughtException", (err) => {
		const errorMsg = err?.stack?.replace(new RegExp(`${__dirname}/`, "g"), "./");
		client.output("error", `Uncaught Exception: ${errorMsg}`);
	});

	process.on("unhandledRejection", (err) => {
		client.output("error", `Unhandled rejection: ${err}`);
	});

};