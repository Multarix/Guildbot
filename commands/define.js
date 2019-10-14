const Discord = require("discord.js");
const wd = require("word-definition");
exports.run = async (client, message, args) => {

	let bad = client.emojis.get("340357882606256137");
	if(!bad) bad = "👎";

	const word = args.join(" ");
	if(!word) return message.channel.send("Usage: [define](<..words>)", { code: "markdown" });

	const m = await message.channel.send(`Searching the dictionary, Gimme a sec..`);
	wd.getDef(word, "en", null, function(definition) {
		let embed;
		if(!definition.definition){
			embed = new Discord.MessageEmbed()
				.setAuthor(word.toProperCase(), "https://i.imgur.com/0hHZB9Z.png")
				.addField(`Error ${bad}`, "No definition found \:(")	//	eslint-disable-line no-useless-escape
				.setFooter(message.author.tag, message.author.displayAvatarURL())
				.setTimestamp();
		} else {
			embed = new Discord.MessageEmbed()
				.setAuthor(definition.word.toProperCase(), "https://i.imgur.com/0hHZB9Z.png")
				.addField("Class", definition.category.toProperCase() + "\u200b", false)
				.addField("Definition:", definition.definition + "\u200b", false)
				.setFooter(message.author.tag, message.author.displayAvatarURL())
				.setTimestamp();
		}
		return m.edit("Results:", { embed });
	});
};

exports.conf = {
	enabled: true,
	allowDM: true,
	aliases: ["word"],
	permLevel: 0,
};

exports.help = {
	name: "define",
	category: "Misc",
	description: "Defines a given word from Wictionary.com",
	usage: "word",
};
