const { SlashCommandBuilder, Client, Message, ChatInputCommandInteraction, EmbedBuilder } = require("discord.js");
const { randomNumber } = require("../src/functions.js");
/**
 * @name roll
 * @param {Client} _client The discord client
 * @param {Message|ChatInputCommandInteraction} element The message or interaction that was created
 * @param {String[]} _args The arguments passed to the command
 * @returns {Promise<void>}
**/
async function run(client, element, args = []){
	if(!args[0]) return await element.reply({ content: "You need to specify the type of die to roll" });

	const isSlashCommand = (element.user) ? true : false;
	const user = isSlashCommand ? element.user : element.author;


	let rolls;
	if(args[1]){
		const arg = parseInt(args[1]);
		const isInvalidNumber = isNaN(parseInt(arg));

		rolls = isInvalidNumber ? 1 : arg;
	}


	const embed = new EmbedBuilder
		.setAuthor({ name: message.member.displayName, iconURL: message.author.displayAvatarURL })
		.setDescription("The dice has been cast...")
		.setFooter(client.user.username, client.user.displayAvatarURL)
		.setTimestamp();


	// Roll the die
	const fields = [];
	for(let i = 0; i < args[1]; i++){

		switch(args[0]){
			case "d4":
				break;

			case "d6":
				break;

			case "d8":
				break;

			case "d10":
				break;

			case "d12":
				break;

			case "d20":
				break;

			case "d100":
			case "percentile":
			case "percent":
			case "p":
				break;
			default:
				return await element.reply({ content: "That is not a valid type of die. Valid Types: `d4`, `d6`, `d8`, `d10`, `d12`, `d20`, `d100`, `percentile`", ephemeral: true });
		}
	}
}


const info = {
	name: "roll",
	altNames: ["discord"],
	description: "Rolls some die",
	usage: "roll <dice> {amount}",
	enabled: true,
	dmCompatible: true,
	permLevel: 0,
	category: "Dungeons & Dragons"
};


/**
 * @name slash
 * @param {Client} client The discord client
 * @param {Boolean} [funcs] Whether to return the functions or the data
 * @returns {Object} The slash command data or functions
**/
function slash(client, funcs = false){
	if(!funcs){ // We want to get the slash command data
		return {
			data: new SlashCommandBuilder()
				.setName(info.name)
				.setDescription(info.description)
				.setDMPermission(info.dmCompatible)
		};
	}

	return {
		/**
		 * @name execute
		 * @param {ChatInputCommandInteraction} interaction The interaction that was created
		 * @description The function that is called when the slash command is used
		**/
		execute: async function execute(interaction){
			await run(client, interaction);
		}
	};
}

module.exports = { run, slash, info };