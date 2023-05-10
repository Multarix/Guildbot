import fetch from "node-fetch";
import { EmbedBuilder } from "discord.js";

import fs from "fs";

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
function _getSavedMap(){
	/**
	 * @name postedParts
	 * @type {Map<string, bookPart>}
	**/
	// Read the posted.json file to get a list of already posted parts
	let alreadyPosted ;
	if(fs.existsSync("./data/posted.json")){
		const postedJSON = fs.readFileSync("./data/posted.json", "utf8");
		alreadyPosted = JSON.parse(postedJSON, _reviver);
	}

	if(!alreadyPosted) alreadyPosted = new Map();

	return alreadyPosted;
}


/**
 * @name getJNovelResponse
 * @param {object} settings
 * @param {string} settings.bookUpdateURL
 * @param {string} settings.bookUpdatesChannel
 * @returns
**/
async function _getJNovelResponse(settings){
	// Get the data from J-Novel Club
	const response = await fetch(settings.bookUpdateURL);
	const text = await response.text();

	/**
	 * @name bookData
	 * @type {JNovelResponse}
	 * @description The response from J-Novel Club
	**/

	return JSON.parse(text);
}


/**
 * @name postNewParts
 * @param {bookPart[]} alreadyPosted
 * @param {bookPart[]} newParts
 * @param {*} channel
**/
async function _postNewParts(alreadyPosted, newParts, channel){
	for(const bookPart of newParts){
		const date = new Date(bookPart.date_published);
		const embed = new EmbedBuilder()
			.setAuthor({ name: "New book part released!" })
			.setDescription(`${bookPart.title}\n[Read it Here](${bookPart.url})`)
			.setColor(22440)
			.setFooter({ text: "via J-Novel Club", iconURL: "https://j-novel.club/apple-touch-icon.png" })
			.setTimestamp(date);

		if(bookPart.image) embed.setThumbnail(bookPart.image);

		await channel.send({ embeds: [embed] });
		alreadyPosted.set(bookPart.id, bookPart);
	}
}


/**
 * @name getNewParts
 * @param {bookPart[]} alreadyPosted
 * @param {bookPart[]} bookParts
 * @returns {bookPart[]}
**/
function _getNewParts(alreadyPosted, bookParts){
	const newParts = [];
	for(const bookPart of bookParts){
		if(alreadyPosted.has(bookPart.id)) continue;

		newParts.push(bookPart);
		output("normal", `New book part found: ${bookPart.title}`);
	}

	return newParts;
}


/**
 * @name saveMapToFile
 * @param {bookPart[]} alreadyPosted
 * @description Saves the posted parts to a file
 * @returns {void}
**/
function _saveMapToFile(alreadyPosted){
	while(alreadyPosted.size > 100){
		alreadyPosted.delete(alreadyPosted.keys().next().value);
	}

	const jsonString = JSON.stringify(alreadyPosted, _replacer, "\t");
	fs.writeFileSync("./data/posted.json", jsonString, "utf8");
}


/**
 * @name bookAlerts
 * @param {*} client
 * @returns
**/
async function bookAlerts(client){
	const settings = client.config;

	// Check if the config is set up
	if(!settings.bookUpdateURL || settings.bookUpdateURL === "jnovel json feed url") return;
	if(!settings.bookUpdatesChannel || settings.bookUpdatesChannel === "channel id") return;

	try {
		const channel = await grabChannel(client, settings.bookUpdatesChannel);
		if(!channel) return;

		// Get the posted parts
		const alreadyPosted = _getSavedMap();
		const bookData = await _getJNovelResponse(settings);

		// Check if there are any new parts
		const newParts = _getNewParts(alreadyPosted, bookData.items);

		if(newParts.length >= 1) await _postNewParts(alreadyPosted, newParts, channel);

		// Save the posted parts;
		_saveMapToFile(alreadyPosted);

	} catch (e){
		return output("error", e.message);
	}
}


export default bookAlerts;


/**
 * @typedef {object} bookPart
 * @property {string} id
 * @property {string} url
 * @property {string} title
 * @property {string} summary
 * @property {string} [image]
 * @property {string} date_published
**/
/**
 * @typedef {object} JNovelResponse
 * @property {string} version
 * @property {string} title
 * @property {string} home_page_url
 * @property {string} description
 * @property {object} author
 * @property {string} author.name
 * @property {bookPart[]} items
**/
