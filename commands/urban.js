const ud = require("urban-dictionary");
const Discord = require("discord.js");
exports.run = (client, message, args, level) => {

	const bad = client.emojis.get("340357882606256137");
	const good = client.emojis.get("340357918996299778");

	const define = args.join(" ");
	ud.term(define).then(defined => {
		const results = defined.entries;
		const filter = /[[\]]/g;

		const word = results[0].word.toProperCase();
		const definition = results[0].definition.replace(filter, "");
		const example = results[0].example.replace(filter, "");

		if(message.channel.memberPermissions(message.guild.me).has("EMBED_LINKS")){
			const embed = new Discord.RichEmbed()
				.setAuthor(word)
				.addField("Definition:", definition + `\n\u200b`, false)
				.addField("Usage:", example, false)
				.setFooter(message.author.tag, message.author.displayAvatarURL)
				.setTimestamp();
			return message.channel.send({ embed });
		}
		return message.channel.send(`**${word}**\n**Definition:**\n${definition}\n**Usage:**\n${example}`);
	}).catch(e => {
		if(message.channel.memberPermissions(message.guild.me).has("EMBED_LINKS")){
			const embed = new Discord.RichEmbed()
				.addField(`Error ${bad}`, `Couldn't find a definition for the word \`${args[0]}\``)
				.setFooter(message.author.tag, message.author.displayAvatarURL)
				.setTimestamp();
			return message.channel.send({ embed });
		}
		return message.channel.send(`**Error** ${bad}\nCouldn't find a definition for \`${define}\``);
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
	usage: "urban](<..word>)",
};
