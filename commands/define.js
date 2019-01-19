const Discord = require("discord.js");
const wd = require("word-definition");
exports.run = (client, message, args, level) => {

	let bad = client.emojis.get("340357882606256137");
	if(!bad) bad = "👎";

	const word = args.join(" ");
	if(!word) return message.channel.send("Usage: [define](<..words>)", { code: "markdown" });

	message.channel.send(`Searching the dictionary, Gimme a sec..`).then(m => {

		wd.getDef(word, "en", null, function(definition) {
			if(message.channel.memberPermissions(message.guild.me).has("EMBED_LINKS")){
				let embed;
				if(!definition.definition){
					embed = new Discord.RichEmbed()
						.setAuthor(word.toProperCase(), "https://i.imgur.com/0hHZB9Z.png")
						.addField(`Error ${bad}`, "No definition found \:(")	//	eslint-disable-line no-useless-escape
						.setFooter(message.author.tag, message.author.displayAvatarURL)
						.setTimestamp();
				} else {
					embed = new Discord.RichEmbed()
						.setAuthor(definition.word.toProperCase(), "https://i.imgur.com/0hHZB9Z.png")
						.addField("Class", definition.category.toProperCase() + "\u200b", false)
						.addField("Definition:", definition.definition + "\u200b", false)
						.setFooter(message.author.tag, message.author.displayAvatarURL)
						.setTimestamp();
				}
				return m.edit("Results:", { embed });
			}
			let content;
			if(!definition.definition){
				content = `Error:\nNo definition found \:(`; // eslint-disable-line
			} else {
				content = `# Word\n- ${definition.word.toProperCase()}\n# Class\n- ${definition.category.toProperCase()}\n# Definition\n${definition.definition}`;
			}
			return m.edit(content, { code: "markdown" });
		});
	});
};

exports.conf = {
	enabled: true,
	guildOnly: false,
	aliases: ["word"],
	permLevel: 0,
};

exports.help = {
	name: "define",
	category: "Misc",
	description: "Defines a given word from Wictionary.com",
	usage: "define](<..word>)",
};
