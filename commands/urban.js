const ud = require("urban-dictionary");
const Discord = require("discord.js");
exports.run = async (client, message, args) => {

	let bad = client.emojis.get("340357882606256137");
	if(!bad) bad = "👎";
	let good = client.emojis.get("340357918996299778");
	if(!good) good = "👍";

	const define = args.join(" ");
	if(!define) return message.channel.send("Usage: [urban](<..words>)", { code: "markdown" });
	const defined = await ud.term(define).catch(e => {
		const embed = new Discord.MessageEmbed()
			.setAuthor(define.toProperCase(), "https://i.imgur.com/mpeuwPm.png")
			.addField(`Error ${bad}`, `Couldn't find a definition \:(`)	//	eslint-disable-line no-useless-escape
			.setFooter(message.author.tag, message.author.displayAvatarURL())
			.setTimestamp();
		message.channel.send({ embed });
		return undefined;
	});
	if(!defined) return;

	const results = defined.entries;

	const filter = /[[\]]/g;
	const filter2 = /[\r\n\r\n]+/g;

	const word = results[0].word.toProperCase();
	const definition = results[0].definition.replace(filter, "").replace(filter2, "\n");
	const example = results[0].example.replace(filter, "").replace(filter2, "\n");
	const link = results[0].permalink;

	const defArray = definition.split("\n");
	const exaArray = example.split("\n");
	// Temporary solution to max character limit issue
	const embed = new Discord.MessageEmbed()
		.setAuthor(word, "https://i.imgur.com/mpeuwPm.png", link)
		.setFooter(message.author.tag, message.author.displayAvatarURL())
		.setTimestamp()
		.addField("Definition:", defArray[0], false)
		.addField("Usage:", exaArray[0], false);
	return message.channel.send({ embed });
};

exports.conf = {
	enabled: true,
	allowDM: true,
	aliases: ["ud"],
	permLevel: 0,
};

exports.help = {
	name: "urban",
	category: "Misc",
	description: "Defines a given word from UrbanDictionary.com",
	usage: "word",
};
