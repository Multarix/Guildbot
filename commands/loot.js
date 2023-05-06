const { SlashCommandBuilder, Client, Message, ChatInputCommandInteraction, EmbedBuilder } = require("discord.js");
const { HoardLoot, IndividualLoot } = require("./loot/main.js");
const { caseFix } = require("../src/functions.js");

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
	const isSlashCommand = (element.user) ? true : false;
	const user = isSlashCommand ? element.user : element.author;

	// Check the challenge type and output an error if it's invalid
	let challengeType = "";
	switch(args[0].toLowerCase()){
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

	// May as well get our embed out of the way now
	const embed = new EmbedBuilder()
		.setTitle(`Challenge level ${challengeLevel}, ${caseFix(challengeType)} encounter loot`)
		.setAuthor({ name: user.username, iconURL: user.displayAvatarURL() })
		.setDescription("The die have been cast... Good Luck!")
		.setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL() })
		.setTimestamp();


	// Set up our embed fields
	const fields = [
		{ name: "Percentile:", 		value: `${loot.lootClassRolls.percentile}`,		inline: true },
		{ name: "D10:", 			value: `${loot.lootClassRolls.d10}`, 			inline: true },
		{ name: "Total:", 			value: `${loot.lootClassRolls.total}`, 			inline: true }
	];

	// Check which coins are not 0, so we know which ones were rolled on
	const coinsNotZero = [];
	for(const [key, value] of Object.entries(loot.money.coins)){
		if(value === 0) continue;
		coinsNotZero.push(key);
	}

	// Arrays for converting into strings
	const allClassArray = [];
	const allRollsArray = [];
	const finalTotalArray = [];

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

		finalTotalArray.push(`${loot.money.coins[coinType]} \u00d7 ${caseFix(coinType)}`);
	}

	// Finally join the coin 'class' and the rolls into strings


	// This is a fancy way of checking if the loot type... and also makes type checking understand that `loot` can only be a HoardLoot after this point
	if(loot instanceof IndividualLoot){
		fields.push({ name: "Loot Class:", value: allClassArray.join("\n"), inline: true }, { name: "\u200b", value: "\u200b", inline: true }, { name: "Rolls:", value: allRollsArray.join("\n"), inline: true });

		const finalTotalString = finalTotalArray.join("\n");

		fields.push({ name: "Final Total:", value: finalTotalString, inline: true });
		embed.setFields(fields);

		return await element.reply({ embeds: [embed] });
	}

	// Now we check the gems/ art objects...
	if(loot.items.gems.amount > 0 || loot.items.art.amount > 0){
		const gemArt = (loot.items.gems.amount > 0) ? "gems" : "art";
		const gemArtObject = loot.items[gemArt];

		// The die used to roll for the gems/ art objects
		const gemDie = gemArtObject.rolls[0].die;

		// Get an array of the gem/ art rolls
		const gemRollArray = [];
		for(const dieRoll in gemArtObject.rolls){
			gemRollArray.push(dieRoll);
		}

		// Add them to the arrays...
		allClassArray.push(`**${gemArtObject.gpCostPer}GP ${(gemArt === "gems") ? "Gems" : "Art Objects"}** - ${gemArtObject.rolls.length} ${gemDie}`);
		allRollsArray.push(gemRollArray.join(", "));
		finalTotalArray.push(`${gemArtObject.amount} \u00d7 ${gemArtObject.gpCostPer} GP ${(gemArt === "gems") ? "Gem(s)" : "Art Object(s)"}`);
	}

	if(loot.items.items.length > 0){
	// Now we check the items, we're getting there slowly >.<
		const itemRollArray = [];
		const itemRollArray2 = [];
		const itemNameArray = [];
		const secondTable = (loot.items.items.length > 1);

		// Data from the first table
		for(const item of loot.items.items[0]){
			const nameString = `1 \u00d7 [${item.name}](${item.link})`;
			itemRollArray.push(item.diceInfo.roll);
			itemNameArray.push(nameString);
		}

		const itemRollString = itemRollArray.join(", ");
		allRollsArray.push(itemRollString);

		// Data from the second table
		if(secondTable){
			for(const item of loot.items.items[1]){
				const nameString = `1 \u00d7 [${item.name}](${item.link})`;
				itemRollArray2.push(item.diceInfo.roll);
				itemNameArray.push(nameString);
			}

			const itemRollString2 = itemRollArray2.join(", ");
			allRollsArray.push(itemRollString2);
		}

		const itemNameString = itemNameArray.join("\n");
		finalTotalArray.push(itemNameString);
	}

	const classString = allClassArray.join("\n");
	const rollString = allRollsArray.join("\n");
	const totalString = finalTotalArray.join("\n");

	fields.push({ name: "Loot Class:", value: classString, inline: true }, { name: "\u200b", value: "\u200b", inline: true }, { name: "Rolls:", value: rollString, inline: true }, { name: "Final Total:", value: totalString, inline: true });
	embed.setFields(fields);

	return await element.reply({ embeds: [embed] });
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

module.exports = { run, slash, info };