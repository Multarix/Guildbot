const { SlashCommandBuilder, Client, Message, ChatInputCommandInteraction, EmbedBuilder } = require("discord.js");


/**
 * @name loot
 * @param {Client} client The discord client
 * @param {Message|ChatInputCommandInteraction} element The message or interaction that was created
 * @param {String[]} args The arguments passed to the command
 * @returns {Promise<void>}
**/
async function run(client, element, args = []){
	return await element.reply("This command is not yet functional.");
}


const info = {
	name: "loot",
	altNames: [],
	description: "👑 Rolls for loot",
	usage: "loot <type> <challenge-level>",
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
		const choices = [
			{ name: "hoard", value: "hoard" },
			{ name: "individual", value: "individual" }
		];

		return {
			data: new SlashCommandBuilder()
				.setName(info.name)
				.setDescription(info.description)
				.setDMPermission(info.dmCompatible)
				.addStringOption(option => option.setRequired(true).setName("type").setDescription("The type of encounter").setChoices(...choices))
				.addIntegerOption(option => option.setRequired(true).setName("challenge-level").setDescription("The challenge level of the encounter").setMinValue(0))

		};
	}

	return {
		/**
		 * @name execute
		 * @param {ChatInputCommandInteraction} interaction The interaction that was created
		 * @description The function that is called when the slash command is used
		**/
		execute: async function execute(interaction){
			const args = [];

			const encounterType = interaction.options.getString("type");
			args.push(encounterType);

			const challengeLevel = interaction.options.getInteger("challenge-level");
			args.push(challengeLevel);


			await run(client, interaction, args);
		}
	};
}

module.exports = { run, slash, info };