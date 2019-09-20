const ud = require("urban-dictionary");
const Discord = require("discord.js");
exports.run = (client, message, args) => {

	let bad = client.emojis.get("340357882606256137");
	if(!bad) bad = "👎";
	let good = client.emojis.get("340357918996299778");
	if(!good) good = "👍";

	const define = args.join(" ");
	if(!define) return message.channel.send("Usage: [urban](<..words>)", { code: "markdown" });
	ud.term(define).then(defined => {
		const results = defined.entries;
		const filter = /[[\]]/g;

		const word = results[0].word.toProperCase();
		const definition = results[0].definition.replace(filter, "");
		const example = results[0].example.replace(filter, "");

		const embed = new Discord.RichEmbed()
			.setAuthor(word, "https://i.imgur.com/mpeuwPm.png")
			.addField("Definition:", definition, false)
			.addField("Usage:", example, false)
			.setFooter(message.author.tag, message.author.displayAvatarURL)
			.setTimestamp();
		return message.channel.send({ embed });
	}).catch(e => {
		const embed = new Discord.RichEmbed()
			.setAuthor(define.toProperCase(), "https://i.imgur.com/mpeuwPm.png")
			.addField(`Error ${bad}`, `Couldn't find a definition \:(`)	//	eslint-disable-line no-useless-escape
			.setFooter(message.author.tag, message.author.displayAvatarURL)
			.setTimestamp();
		return message.channel.send({ embed });
	});
};

exports.conf = {
	enabled: true,
	guildOnly: false,
	aliases: ["ud"],
	permLevel: 0,
};

exports.help = {
	name: "urban",
	category: "Misc",
	description: "Defines a given word from UrbanDictionary.com",
	usage: "word",
};
