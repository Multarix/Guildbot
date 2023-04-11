const ud = require("urban-dictionary");
const Discord = require("discord.js");
exports.run = async (client, message, args) => {

	let bad = client.emojis.cache.get("340357882606256137");
	if(!bad) bad = "👎";
	let good = client.emojis.cache.get("340357918996299778");
	if(!good) good = "👍";

	const word = args.join(" ");
	if(!word) return message.channel.send("Usage: [urban](<..words>)", { code: "markdown" });
	const defined = await ud.define(word);

	if(!defined){
		const embed = new Discord.MessageEmbed()
			.setAuthor(defined.toProperCase(), "https://i.imgur.com/mpeuwPm.png")
			.addField(`Error ${bad}`, `Couldn't find a definition \:(`)	//	eslint-disable-line no-useless-escape
			.setFooter(message.author.tag, message.author.displayAvatarURL())
			.setTimestamp();
		message.channel.send({ embeds: [embed] });
		return undefined;
	}

	const result = defined[0];

	const filter = /[[\]]/g;
	const filter2 = /[\r\n\r\n]+/g;

	const properWord = result.word.toProperCase();
	const definition = result.definition.replace(filter, "").replace(filter2, "\n");
	const example = result.example.replace(filter, "").replace(filter2, "\n");
	const link = result.permalink;

	let defArray = definition.split("\n");
	let exaArray = example.split("\n");

	defArray = defArray[0];
	exaArray = exaArray[0];

	if(defArray.length >= 1024){
		defArray = defArray.substring(0, 924);
		defArray = `${defArray}... ${link}`;
	}
	if(exaArray.length >= 1024){
		exaArray = exaArray.substring(0, 924);
		exaArray = `${exaArray}...`;
	}

	const embed = new Discord.MessageEmbed()
		.setAuthor(`${properWord}`, "https://i.imgur.com/mpeuwPm.png", link)
		.setFooter(`${message.author.tag}`, message.author.displayAvatarURL())
		.setTimestamp()
		.addField("Definition:", `${defArray}`, false)
		.addField("Usage:", `${exaArray}`, false);
	return message.channel.send({ embeds: [embed] });
};

exports.conf = {
	enabled: true,
	allowDM: true,
	aliases: ["ud"],
	permLevel: 0
};

exports.help = {
	name: "urban",
	category: "Misc",
	description: "Defines a given word from UrbanDictionary.com",
	usage: "word"
};
