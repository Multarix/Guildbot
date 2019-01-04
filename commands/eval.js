const Discord = require('discord.js');
const colors = require('colors');
const sql = require('sqlite');

exports.run = async (client, message, args, level) => {
	const good = client.emojis.get("340357918996299778");
	const bad = client.emojis.get("340357882606256137");

	const code = args.join(" ");
	try {
		const evaled = eval(code);
		const clean = await client.clean(client, evaled);

		const embed = new Discord.RichEmbed()
			.setColor(2734377)
			.addField('Javascript Evaluated', `**OUTPUT** ${good}\n\`\`\`javascript\n${clean}\n\`\`\``, false)
			.setFooter(client.user.tag, client.user.displayAvatarURL)
			.setTimestamp();

		message.channel.send({ embed });

	} catch(err) {
		const errString = `**ERROR** ${bad}\n\`\`\`javascript\n${await client.clean(client, err)}\n\`\`\``;
		if (errString.length >= 1024){
			console.log(`${await client.clean(client, err)}`);
		} else {

			const embed = new Discord.RichEmbed()
				.setColor(2734377)
				.addField(`Javascript Evaluated`, errString, false)
				.setFooter(client.user.tag, client.user.displayAvatarURL)
				.setTimestamp();

			message.channel.send({ embed });
		}
	}
};

exports.conf = {
	enabled: true,
	guildOnly: false,
	aliases: ["e", "js"],
	permLevel: 10,
};

exports.help = {
	name: "eval",
	category: "System",
	description: "Evaluates javascript",
	usage: "e](<..code>)",
};
