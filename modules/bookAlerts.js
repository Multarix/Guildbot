import fetch from "node-fetch";

import { createRequire } from "module";
const require = createRequire(import.meta.url);

const fs = require("fs");
const { output, grabChannel } = require("../src/functions.js");
const { EmbedBuilder } = require("discord.js");

/**
 * @name bookAlerts
 * @param {Discord.Client} client The discord client
 * @returns {Promise<Void>}
 * @description Checks for new book parts from J-Novel Club
 */
async function bookAlerts(client){

	if(!client.config.bookUpdateURL) return;
	if(!client.config.bookUpdatesChannel) return;

	const channel = await grabChannel(client, client.config.bookUpdatesChannel);
	if(!channel) return;

	let postedParts = [];
	if(fs.existsSync("./data/posted.json")){
		const posted = fs.readFileSync("./data/posted.json", "utf8");
		postedParts = JSON.parse(posted);
		postedParts = postedParts.ids;
	}

	const url = client.config.bookUpdateURL;
	const settings = { method: "Get" };

	const result = await fetch(url, settings);
	const newObj = await result.json();
	const parts = newObj.items;

	const newBookParts = [];

	for(const part of parts){

		if(postedParts.includes(part.title)) continue;

		newBookParts.push(part);
		postedParts.push(part.title);
		output(`New book part found: ${part.title}`, "Book Updates");
	}

	if(newBookParts.length >= 1){
		newBookParts.reverse();

		for(const bookPart of newBookParts){
			const embed = new EmbedBuilder()
				.setAuthor("New book part released!")
				.setDescription(`${bookPart.title}\n[Read it Here](${bookPart.url})`)
				.setColor(22440)
				.setFooter("via J-Novel Club", "https://j-novel.club/apple-touch-icon.png");

			const date = new Date(bookPart.date_published);
			embed.setTimestamp(date);

			if(bookPart.image) embed.setImage(bookPart.image);

			channel.send({ embeds: [embed] });
		}

		const partList = { ids: postedParts };
		fs.writeFileSync("./data/posted.json", JSON.stringify(partList, null, "\t"));
	}
}


module.exports = bookAlerts;