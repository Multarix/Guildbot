import { SlashCommandBuilder, Client, User, Message, ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import { HoardLoot, IndividualLoot } from "./loot/main.js";
import { handleElement, caseFix } from "../src/functions.js";


/**
 * @name getChallengeType
 * @param {string} argument
 * @returns {string}
**/
function _getChallengeType(argument){
	let challengeType = "";
	switch(argument.toLowerCase()){
		case "h":
		case "hoard":
			challengeType = "hoard";
			break;

		case "i":
		case "individual":
			challengeType = "individual";
			break;

		default:
			challengeType = "invalid";
			break;
	}
	return challengeType;
}


/**
 * @name setupEmbed
 * @param {Client} client
 * @param {User} user
 * @param {string} challengeLevel
 * @param {string} challengeType
 * @returns {EmbedBuilder}
**/
function _setupEmbed(client, user, challengeLevel, challengeType){
	// May as well get our embed out of the way now
	const embed = new EmbedBuilder()
		.setTitle(`Challenge level ${challengeLevel}, ${caseFix(challengeType)} encounter loot`)
		.setAuthor({ name: user.username, iconURL: user.displayAvatarURL() })
		.setDescription("The die have been cast... Good Luck!")
		.setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL() })
		.setTimestamp();

	return embed;
}


/**
 * @name handleCoins
 * @param {string[]} allClassArray
 * @param {string[]} allRollsArray
 * @param {string[]} finalTotalArray
 * @param {HoardLoot.money|IndividualLoot} loot
**/
function _handleCoins(allClassArray, allRollsArray, finalTotalArray, loot){
	// Check which coins are not 0, so we know which ones were rolled on
	const coinsNotZero = [];
	for(const [key, value] of Object.entries(loot.money.coins)){
		if(value === 0) continue;
		coinsNotZero.push(key);
	}

	// Loop through the coins that were rolled on
	for(const coinType of coinsNotZero){
		// Make a string for the coin type and how many were rolled
		allClassArray.push(`**${caseFix(coinType)}** - ${loot.money.rolls[coinType].length} ${loot.money.rolls[coinType][0].die} x${loot.money.modifier[coinType]}`);

		const rollArray = [];

		// Get the rolls that were performed while we're at it
		for(const dieRoll of loot.money.rolls[coinType]){
			rollArray.push(dieRoll.roll);
		}

		// Then convert the rolls into a string to then push to an array
		const coinRollString = rollArray.join(", ");
		allRollsArray.push(coinRollString);

		finalTotalArray.push(`${loot.money.coins[coinType]} \u00d7 **${caseFix(coinType)}**`);
	}
}


/**
 * @name handleGemArt
 * @param {string[]} allClassArray
 * @param {string[]} allRollsArray
 * @param {string[]} finalTotalArray
 * @param {HoardLoot} loot
**/
function _handleGemArt(allClassArray, allRollsArray, finalTotalArray, loot){
	// Now we check the gems/ art objects...
	if(loot.items.gems.amount > 0 || loot.items.art.amount > 0){
		const gemArt = (loot.items.gems.amount > 0) ? "gems" : "art";
		const gemArtObject = loot.items[gemArt];

		// The die used to roll for the gems/ art objects
		const gemDie = gemArtObject.rolls[0].die;

		// Get an array of the gem/ art rolls
		const gemRollArray = [];
		for(const diceObject of loot.items[gemArt].rolls){
			gemRollArray.push(diceObject.roll);
		}

		const gemRollString = gemRollArray.join(", ");

		// Add them to the arrays...
		allClassArray.push(`**${gemArtObject.gpCostPer} GP ${(gemArt === "gems") ? "Gems" : "Art Objects"}** - ${gemArtObject.rolls.length} ${gemDie}`);
		allRollsArray.push(gemRollString);
		finalTotalArray.push(`${gemArtObject.amount} \u00d7 **${gemArtObject.gpCostPer} GP ${(gemArt === "gems") ? "Gem(s)" : "Art Object(s)"}**`);
	}
}


/**
 * @name handleItems
 * @param {string[]} allClassArray
 * @param {string[]} allRollsArray
 * @param {string[]} finalTotalArray
 * @param {HoardLoot} loot
**/
function _handleItems(allClassArray, allRollsArray, finalTotalArray, loot){
	if(loot.items.items.length > 0){
		// Now we check the items, we're getting there slowly >.<
		const itemRollArray = [];
		const itemNameArray = [];
		const table1 = loot.items.items[0][0].fromTable;
		const table1Die = loot.items.items[0][0].tableDie;

		// Data from the first table
		for(const item of loot.items.items[0]){
			const nameString = `1 \u00d7 **[${item.name}](${item.link})**`;
			itemRollArray.push(item.diceInfo.roll);
			itemNameArray.push(nameString);
		}
		allClassArray.push(`**Item Table ${caseFix(table1)}** - ${table1Die}`);
		const itemRollString = itemRollArray.join(", ");
		allRollsArray.push(itemRollString);


		// Data from the second table
		const secondTable = (loot.items.items.length === 2);
		if(secondTable){
			const itemRollArray2 = [];
			const table2 = loot.items.items[1][0].fromTable;
			const table2Die = loot.items.items[1][0].tableDie;

			for(const item of loot.items.items[1]){
				const nameString = `1 \u00d7 **[${item.name}](${item.link})**`;
				itemRollArray2.push(item.diceInfo.roll);
				itemNameArray.push(nameString);
			}

			const itemRollString2 = itemRollArray2.join(", ");
			allRollsArray.push(itemRollString2);
			allClassArray.push(`**Item Table ${caseFix(table2)}** - ${table2Die}`);
		}

		finalTotalArray.push(itemNameArray.join("\n"));
	}
}


/**
 * @name finishEmbed()
 * @param {EmbedBuilder} embed
 * @param {HoardLoot|IndividualLoot} loot
 * @returns {EmbedField[]}
**/
async function _getEmbedFields(loot){
	const fields = [
		{
			name: "Percentile:",
			value: `${loot.getLootClassRolls().percentile}`,
			inline: true
		},
		{
			name: "D10:",
			value: `${loot.getLootClassRolls().d10}`,
			inline: true
		},
		{
			name: "Total:",
			value: `${loot.getLootClassRolls().total}`,
			inline: true
		}
	];

	// Arrays for converting into strings
	const allClassArray = [];
	const allRollsArray = [];
	const finalTotalArray = [];

	await loot.getMoney(); // This await is nessecary despite what my linter says
	_handleCoins(allClassArray, allRollsArray, finalTotalArray, loot);

	// This is a fancy way of checking the loot type...
	// Also makes type checking understand that `loot` can only be a HoardLoot after this point
	if(loot instanceof IndividualLoot){
		fields.push({ name: "Loot Class:", value: `\u200b${allClassArray.join("\n")}`, inline: true }, { name: "\u200b", value: "\u200b", inline: true }, { name: "Rolls:", value: allRollsArray.join("\n"), inline: true });

		const finalTotalString = finalTotalArray.join("\n");

		fields.push({ name: "Final Total:", value: `\u200b${finalTotalString}`, inline: true });
		return fields;
	}

	await loot.getItems(); // This await is nessecary despite what my linter says
	_handleGemArt(allClassArray, allRollsArray, finalTotalArray, loot);
	_handleItems(allClassArray, allRollsArray, finalTotalArray, loot);

	const classString = allClassArray.join("\n");
	const rollString = allRollsArray.join("\n");
	const totalString = finalTotalArray.join("\n");

	fields.push({ name: "Loot Class:", value: `\u200b${classString}`, inline: true }, { name: "\u200b", value: "\u200b", inline: true }, { name: "Rolls:", value: `\u200b${rollString}`, inline: true }, { name: "Final Total:", value: `\u200b${totalString}`, inline: true });
	return fields;
}


/**
 * @name loot
 * @param {Client} client The discord client
 * @param {Message|ChatInputCommandInteraction} element The message or interaction that was created
 * @param {String[]} args The arguments passed to the command
 * @returns {Promise<void>}
**/
async function run(client, element, args = []){
	// This command is still going to be a clusterfuck even when using a class, so lets go

	// Check if it's a slash command, and set "user"
	const isSlashCommand = (element instanceof ChatInputCommandInteraction) ? true : false;
	const user = isSlashCommand ? element.user : element.author;

	// Check the challenge type and output an error if it's invalid
	const challengeType = _getChallengeType(args[0]);
	if(challengeType === "invalid") return await element.reply("You must specify a loot type. (`hoard` or `individual`)");

	// Check the challenge level, if it's invalid we just set it to 0
	if(!args[1] || isNaN(parseInt(args[1])) || parseInt(args[1]) < 0) args[1] = "0";

	const challengeLevel = parseInt(args[1]);

	// Set our loot class, it will automatically generate what we need
	let loot;
	if(challengeType === "hoard"){
		loot = new HoardLoot(challengeLevel);
	} else {
		loot = new IndividualLoot(challengeLevel);
	}

	// May as well get our embed and fields out of the way now
	const embed = _setupEmbed(client, user, challengeLevel, challengeType);
	const fields = await _getEmbedFields(loot); // This await is nessecary despite what my linter says

	embed.addFields(fields);

	handleElement(element, isSlashCommand, { embeds: [embed] });
}

const info = {
	name: "loot",
	altNames: [],
	description: "Rolls for loot",
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

export { run, slash, info };

/**
 * @typedef {item[]} tableArray
**/
/**
 * @typedef {object} item
 * @property {string} name The name of the item
 * @property {string} link The link to the item on D&D Beyond
 * @property {"a"|"b"|"c"|"d"|"e"|"f"|"i"} fromTable The table the item came from
 * @property {string} tableDie How many and what type of die the the table rolled on
 * @property {diceObject} diceInfo The die used to obtain the item
 * @description An object representing an item, which table it came from and the roll used to obtain it.
**/
/**
 * @typedef {object} gemArtData
 * @property {number} gpCostPer The cost of a singular gem/ art object in gold
 * @property {number} amount The amount of items obtained
 * @property {diceObject[]} rolls The rolls used to obtain the gems/ art objects
 * @description An object containing the data for the gems/ art objects obtained.
**/
/**
 * @typedef {object} allLoot
 * @property {gemArtData} gems The gems obtained if any
 * @property {gemArtData} art The art obtained if any
 * @property {tableArray[]} items An array of items obtained, if any
 * @description An object containing all the loot obtained.
**/
/**
 * @typedef {object} EmbedField
 * @property {string} name The name of the field
 * @property {string} value The value of the field
 * @property {boolean} [inline] Whether the field is inline or not
**/