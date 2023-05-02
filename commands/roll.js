const { SlashCommandBuilder, Client, Message, ChatInputCommandInteraction, EmbedBuilder } = require("discord.js");
const { handleElement, randomNumber } = require("../src/functions.js");
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

	let isValidInput = false;
	let func;
	switch(args[0]){
		case "d4":
			func = randomNumber.bind(null, 1, 4);
			isValidInput = true;
			break;

		case "d6":
			func = randomNumber.bind(null, 1, 6);
			isValidInput = true;
			break;

		case "d8":
			func = randomNumber.bind(null, 1, 8);
			isValidInput = true;
			break;

		case "d10":
			func = randomNumber.bind(null, 1, 10);
			isValidInput = true;
			break;

		case "d12":
			func = randomNumber.bind(null, 1, 12);
			isValidInput = true;
			break;

		case "d20":
			func = randomNumber.bind(null, 1, 20);
			isValidInput = true;
			break;

		case "d100":
		case "percentile":
		case "percent":
		case "p":
			args[0] = "percentile";
			func = () => {
				let num = randomNumber(1, 10);
				num *= 10;
				return num;
			};
			isValidInput = true;
			break;

		default:
			isValidInput = false;
	}

	if(!isValidInput) return await element.reply({ content: "That is not a valid type of die. Valid Types: `d4`, `d6`, `d8`, `d10`, `d12`, `d20`, `percentile`", ephemeral: true });

	let rolls = 1;
	if(args[1]){
		const arg = parseInt(args[1]);
		const isInvalidNumber = isNaN(parseInt(arg));

		if(!isInvalidNumber) rolls = arg;
	}
	if(rolls > 21) rolls = 21;


	const embed = new EmbedBuilder()
		.setAuthor({ name: `${user.username} - Rolled ${rolls}x ${args[0]}`, iconURL: user.displayAvatarURL() })
		.setDescription(`The die have been cast... Good luck!`)
		.setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL() })
		.setTimestamp();


	// Roll the die
	const fields = [];
	let total = 0;
	for(let i = 0; i < rolls; i++){

		if(rolls === 1){
			fields.push({ name: "Roll", value: `${func()}`, inline: false });
			continue;
		}

		const num = func();
		fields.push({ name: `Roll #${i + 1}`, value: `${num}`, inline: true });
		total += num;
	}

	if(fields.length > 3 && (fields.length % 3) !== 0){
		for(let i = 0; (fields.length % 3) !== 0; i++){
			fields.push({ name: "\u200b", value: "\u200b", inline: true });
		}
	}

	if(rolls > 1) fields.push({ name: "Total value of rolls", value: `${total}`, inline: false });

	embed.setFields(fields);

	const hasDMRole = (element.member?.roles.cache.find(role => role.name.toLowerCase() === "dungeon master"));
	const hidden = (isSlashCommand && hasDMRole && args[2]);
	await handleElement(element, isSlashCommand, { embeds: [embed], ephemeral: hidden });
}


const info = {
	name: "roll",
	altNames: [],
	description: "Rolls dice 🎲",
	usage: "roll <dice> {amount} {hidden}",
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
			{ name: "d4", value: "d4" },
			{ name: "d6", value: "d6" },
			{ name: "d8", value: "d8" },
			{ name: "d10", value: "d10" },
			{ name: "d12", value: "d12" },
			{ name: "d20", value: "d20" },
			{ name: "percentile", value: "percentile" }
		];
		return {
			data: new SlashCommandBuilder()
				.setName(info.name)
				.setDescription(info.description)
				.setDMPermission(info.dmCompatible)
				.addStringOption(option => option.setName("dice").setDescription("The type of die to roll").setRequired(true).setChoices(...choices))
				.addIntegerOption(option => option.setName("amount").setDescription("The amount of die to roll").setRequired(false).setMinValue(1).setMaxValue(21))
				.addBooleanOption(option => option.setName("hidden").setDescription("Whether to make the reply visible only to you").setRequired(false))
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

			const diceType = interaction.options.getString("dice");
			args.push(diceType);

			let amount = interaction.options.getInteger("amount");
			if(!amount) amount = 1;
			args.push(amount);

			let hidden = interaction.options.getBoolean("hidden");
			if(!hidden) hidden = false;
			args.push(hidden);

			await run(client, interaction, args);
		}
	};
}

module.exports = { run, slash, info };