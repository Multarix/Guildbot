const { Client, Message, ChatInputCommandInteraction, EmbedBuilder } = require("discord.js");
const { clean } = require("../src/functions.js");

/**
 * @name eval
 * @param {Client} client The discord client
 * @param {Message} element The message or interaction that was created
 * @param {String[]} args The arguments passed to the command
 * @returns {Promise<void>}
**/
async function run(client, element, args){

	let good = client.emojis.cache.get("340357918996299778");
	if(!good) good = "👍";
	let bad = client.emojis.cache.get("340357882606256137");
	if(!bad) bad = "👎";

	const embed = new EmbedBuilder()
		.setFooter({ text: client.user.tag, iconURL: client.user.displayAvatarURL() })
		.setTimestamp();

	const code = args.join(" ").replace(/\u200b/g, "\n");
	try {
		const evaled = eval(code);
		const cleaned = await clean(client, evaled);
		const evalString = `**OUTPUT** ${good}\n\`\`\`javascript\n${cleaned}\n\`\`\``;
		if(evalString.length >= 1024){
			console.log(cleaned);
			return await element.channel.send(`**OUTPUT** ${good}\nThe output was too long, check the console.`);
		}

		embed.setColor(2734377)
			.addFields({ title: 'Javascript Evaluated', value: evalString, inline: false });

		return await element.channel.send({ embeds: [embed] });

	} catch (err){
		const errMsg = await clean(client, err);
		const errString = `**ERROR** ${bad}\n\`\`\`javascript\n${errMsg}\n\`\`\``;
		if(errString.length >= 1024){
			console.log(errString);
			return await element.channel.send(`**ERROR** ${bad}\nThe error message was too long, check the console.`);
		}

		embed.setColor(14487568)
			.addFields({ title: `Javascript Evaluated`, value: errString, inline: false });

		return await element.channel.send({ embeds: [embed] });
	}
}


const info = {
	name: "eval",
	description: "Evaluates Javascript (Owner Only)",
	usage: "eval {code}",
	enabled: true,
	altNames: ["e", "js"],
	dmCompatible: true,
	permLevel: 100,
	category: "System"
};


/**
 * @name slash
 * @param {Client} client The discord client
 * @param {Boolean} [funcs] Whether to return the functions or the data
 * @returns {Object} The slash command data or functions
**/
function slash(client, funcs = false){
	// if(!funcs){ // We want to get the slash command data
	// 	return {
	// 		data: new SlashCommandBuilder()
	// 			.setName(info.name)
	// 			.setDescription(info.description)
	// 			.setDMPermission(false)
	// 	};
	// }

	return {
		/**
		 * @name execute
		 * @param {ChatInputCommandInteraction} interaction The interaction that was created
		 * @description The function that is called when the slash command is used
		**/
		execute: async function execute(interaction){
			const user = interaction.options.getUser("user");

			const args = [];
			if(user) args.push(user);

			await run(client, interaction, args);
		}
	};
}

module.exports = { run, slash, info };