const fs = require("fs");
const fetch = require("node-fetch");
const Discord = require("discord.js");

module.exports = async (client) => {

	if(!client.config.bookUpdateURL) return;
	if(!client.config.bookUpdatesChannel) return;

	const channel = await grabChannel(client.config.bookUpdatesChannel);
	if(!channel) return;

	let postedParts = [];
	if(fs.existsSync("./objects/posted.json")){
		const posted = fs.readFileSync("./objects/posted.json", "utf8");
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

		if(postedParts.includes(part.title)) break;

		newBookParts.push(part);
		postedParts.add(part.title);
		client.log(`New book part found: ${part.title}`);
	}

	if(newBookParts.length >= 1){
		newBookParts.reverse();

		for(const bookPart of newBookParts){
			const embed = new Discord.MessageEmbed()
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
		fs.writeFileSync("./objects/posted.json", JSON.stringify(partList, null, "\t"));
	}
};