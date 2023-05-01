const { Client, Message, EmbedBuilder } = require("discord.js");
const { clean } = require("../src/functions.js");

/**
 * @name eval
 * @param {Client} client The discord client
 * @param {Message} element The message or interaction that was created
 * @param {String[]} args The arguments passed to the command
 * @returns {Promise<void>}
**/
async function run(client, element, args = []){

	if(!args) return await element.reply({ content: "You need to provide some code to evaluate!" });

	let good = client.emojis.cache.get("340357918996299778");
	if(!good) good = "👍";
	let bad = client.emojis.cache.get("340357882606256137");
	if(!bad) bad = "👎";

	const embed = new EmbedBuilder()
		.setFooter({ text: client.user.tag, iconURL: client.user.displayAvatarURL() })
		.setTimestamp();

	const code = args.join(" ").replace(/\u200b/g, "\n");
	const inString = `\`\`\`javascript\n${code}\n\`\`\``;
	try {
		const evaled = eval(code);
		const cleaned = await clean(client, evaled);
		const outString = `\`\`\`javascript\n${cleaned}\n\`\`\``;

		embed.setColor(2734377);

		if(outString.length >= 1024 || inString.length >= 1024){
			console.log(cleaned);
			const field = [{ name: `Success ${good}`, value: "The input or output was too long, check the console for details" }];

			embed.addFields(field);

			return await element.channel.send({ embeds: [embed] });
		}

		const fields = [
			{ name: 'Eval Input', value: inString, inline: false },
			{ name: `Eval Output ${good}`, value: outString, inline: false }
		];

		embed.addFields(fields);
		return await element.channel.send({ embeds: [embed] }).catch(e => console.log(e));
	} catch (err){
		const errMsg = await clean(client, err);
		const errString = `\`\`\`javascript\n${errMsg}\n\`\`\``;

		embed.setColor(14487568);

		if(errString.length >= 1024 || inString.length >= 1024){
			console.log(errMsg);
			const field = [{ name: `ERROR ${bad}`, value: "The input or output was too long, check the console for details" }];

			embed.addFields(field);

			return await element.channel.send({ embeds: [embed] });
		}

		const fields = [
			{ name: 'Eval Input', value: inString, inline: false },
			{ name: `Eval Output ${bad}`, value: errString, inline: false }
		];

		embed.addFields(fields);
		return await element.channel.send({ embeds: [embed] });
	}
}


const info = {
	name: "eval",
	description: "(Owner Only) Evaluates Javascript code",
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