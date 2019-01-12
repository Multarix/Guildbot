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
		const evalString = `**OUTPUT** ${good}\n\`\`\`javascript\n${clean}\n\`\`\``;
		if (evalString.length >= 1024){
			console.log(clean);
			return message.channel.send(`**OUTPUT** ${good}\nThe output was too long, check the console.`);
		}
		if(message.channel.memberPermissions(message.guild.me).has("EMBED_LINKS")){
			const embed = new Discord.RichEmbed()
				.setColor(2734377)
				.addField('Javascript Evaluated', evalString, false)
				.setFooter(client.user.tag, client.user.displayAvatarURL)
				.setTimestamp();

			return message.channel.send({ embed });
		}
		message.channel.send(evalString);

	} catch(err) {
		const errMsg = await client.clean(client, err);
		const errString = `**ERROR** ${bad}\n\`\`\`javascript\n${errMsg}\n\`\`\``;
		if (errString.length >= 1024){
			console.log(errString);
			return message.channel.send(`**ERROR** ${bad}\nThe error message was too long, check the console.`);
		}
		if(message.channel.memberPermissions(message.guild.me).has("EMBED_LINKS")){
			const embed = new Discord.RichEmbed()
				.setColor(14487568)
				.addField(`Javascript Evaluated`, errString, false)
				.setFooter(client.user.tag, client.user.displayAvatarURL)
				.setTimestamp();
			return message.channel.send({ embed });
		}
		return message.channel.send(errString);
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
