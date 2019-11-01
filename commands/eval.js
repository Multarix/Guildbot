const Discord = require('discord.js');
const colors = require('colors');
const moment = require("moment");
require("moment-duration-format");
exports.run = async (client, message, args, level) => {

	let good = client.emojis.get("340357918996299778");
	if(!good) good = "👍";
	let bad = client.emojis.get("340357882606256137");
	if(!bad) bad = "👎";

	const code = args.join(" ").replace(/\u200b/g, "\n");
	try {
		const evaled = eval(code);
		const clean = await client.clean(client, evaled);
		const evalString = `**OUTPUT** ${good}\n\`\`\`javascript\n${clean}\n\`\`\``;
		if(evalString.length >= 1024){
			console.log(clean);
			return message.channel.send(`**OUTPUT** ${good}\nThe output was too long, check the console.`);
		}
		const embed = new Discord.MessageEmbed()
			.setColor(2734377)
			.addField('Javascript Evaluated', evalString, false)
			.setFooter(client.user.tag, client.user.displayAvatarURL())
			.setTimestamp();

		return message.channel.send({ embed });

	} catch (err){
		const errMsg = await client.clean(client, err);
		const errString = `**ERROR** ${bad}\n\`\`\`javascript\n${errMsg}\n\`\`\``;
		if(errString.length >= 1024){
			console.log(errString);
			return message.channel.send(`**ERROR** ${bad}\nThe error message was too long, check the console.`);
		}
		const embed = new Discord.MessageEmbed()
			.setColor(14487568)
			.addField(`Javascript Evaluated`, errString, false)
			.setFooter(client.user.tag, client.user.displayAvatarURL())
			.setTimestamp();
		return message.channel.send({ embed });
	}
};

exports.conf = {
	enabled: true,
	allowDM: true,
	aliases: ["e", "js"],
	permLevel: 10
};

exports.help = {
	name: "eval",
	category: "System",
	description: "Evaluates javascript",
	usage: "code"
};
