import fetch from "node-fetch";
import { EmbedBuilder } from "discord.js";
import { promises as fs } from "fs";
import { output, grabChannel } from "../src/functions.js";


/**
 * @name replacer
 * @description Replaces a Map with an object so it can be stringified
**/
const _replacer = (key, value) => {
	if(value instanceof Map){
		return {
			dataType: "Map",
			value: [...value]
		};
	} else {
		return value;
	}
};


/**
 * @name reviver
 * @description Revives a Map from a JSON object
**/
const _reviver = (key, value) => {
	if(typeof value === "object" && value !== null){
		if(value.dataType === "Map"){
			return new Map(value.value);
		}
	}
	return value;
};


/**
 * @name getSavedMap
 * @returns {Map<string, bookPart>}
**/
async function _getSavedMap(client){
	/**
	 * @name postedParts
	 * @type {Map<string, bookPart>}
	**/
	// Read the posted.json file to get a list of already posted parts
	let alreadyPosted;

	try {
		const postedJSON = await fs.readFile("./data/posted.json", "utf8");
		alreadyPosted = JSON.parse(postedJSON, _reviver);

	} catch (e){
		if(e.code === "ENOENT" || !alreadyPosted) alreadyPosted = new Map();
		output(client, "error", e.message);
	}

	return alreadyPosted;
}


/**
 * @name saveMapToFile
 * @param {bookPart[]} alreadyPosted
 * @description Saves the posted parts to a file
 * @returns {void}
**/
async function _saveMapToFile(client, alreadyPosted){
	while(alreadyPosted.size > 100){
		alreadyPosted.delete(alreadyPosted.keys().next().value);
	}

	const jsonString = JSON.stringify(alreadyPosted, _replacer, "\t");

	try {
		await fs.writeFile("./data/posted.json", jsonString, "utf8");
	} catch (e){
		output(client, "error", e.message);
	}
}


/**
 * @name getJNovelResponse
 * @param {object} settings
 * @param {string} settings.bookUpdateURL
 * @param {string} settings.bookUpdatesChannel
 * @returns
**/
async function _getJNovelResponse(client, settings){
	try {
	// Get the data from J-Novel Club
		const response = await fetch(settings.bookUpdateURL);
		if(!response.ok) throw new Error(`An error occured trying to connect to J-Novel Club: ${response.statusText}`);

		const text = await response.text();

		return JSON.parse(text);
	} catch (e){
		output(client, "error", e.message);
	}

	return { items: [] };
}


/**
 * @name getNewParts
 * @param {bookPart[]} alreadyPosted
 * @param {bookPart[]} bookParts
 * @returns {bookPart[]}
**/
async function _getNewParts(client, alreadyPosted, bookParts){
	const newParts = [];
	for(const bookPart of bookParts){
		if(alreadyPosted.has(bookPart.id)) continue;

		newParts.push(bookPart);
		output(client, "normal", `New book part found: ${bookPart.title}`);
	}

	return newParts.reverse();
}


/**
 * @name postNewParts
 * @param {bookPart[]} alreadyPosted
 * @param {bookPart[]} newParts
 * @param {*} channel
**/
async function _postNewParts(alreadyPosted, newParts, channel, batchSize = 10){
	const embeds = newParts.map(bookPart => {
		const date = new Date(bookPart.date_published);
		const embed = new EmbedBuilder()
			.setAuthor({ name: "New book part released!" })
			.setDescription(`${bookPart.title}\n[Read it Here](${bookPart.url})`)
			.setColor(22440)
			.setFooter({ text: "via J-Novel Club", iconURL: "https://j-novel.club/apple-touch-icon.png" })
			.setTimestamp(date);

		if(bookPart.image) embed.setImage(bookPart.image);

		alreadyPosted.set(bookPart.id, bookPart);
		return embed;
	});

	// Batching of parts (ChatGPT helped out?)
	for(let i = 0; i < embeds.length; i += batchSize){
		await channel.send({ embeds: embeds.slice(i, i + batchSize) });
	}
}


/**
 * @name bookAlerts
 * @param {*} client
 * @returns
**/
async function bookAlerts(client){
	const { bookUpdateURL, bookUpdatesChannel } = client.config;

	// Check if the config is set up
	if(!bookUpdateURL || bookUpdateURL === "jnovel json feed url") return;
	if(!bookUpdatesChannel || bookUpdatesChannel === "channel id") return;

	try {
		const channel = await grabChannel(client, bookUpdatesChannel);
		if(!channel) return;

		// Get the posted parts
		const alreadyPosted = await _getSavedMap(client);
		console.log(alreadyPosted);
		const bookData = await _getJNovelResponse(client, client.config);

		// Check if there are any new parts
		const newParts = await _getNewParts(client, alreadyPosted, bookData.items);

		if(newParts.length >= 1){
			await _postNewParts(alreadyPosted, newParts, channel);
			await _saveMapToFile(client, alreadyPosted); // Save the posted parts
		}

	} catch (e){
		return output(client, "error", e.message);
	}
}


export default bookAlerts;