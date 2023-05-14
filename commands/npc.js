import { SlashCommandBuilder, Client, Message, ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import NPC from "dnd-npc";

import { caseFix } from "../src/functions.js";


// Too many here to list
const races = [
	"aarakocra",
	"bugbear",
	"changling",
	"dragonborn",
	"dwarf",
	"elf",
	"firbolg",
	"genasi",
	"gnome",
	"goblin",
	"goliath",
	"grung",
	"half-elf",
	"halfling",
	"half-orc",
	"hobgoblin",
	"human",
	"kalashtar",
	"kenku",
	"kobold",
	"lizardfolk",
	"orc",
	"shifter",
	"tabaxi",
	"tiefling",
	"triton",
	"warforged",
	"yuanti",
	"random",
	"aasimar"
];


/**
 * @name server
 * @param {Client} client The discord client
 * @param {Message|ChatInputCommandInteraction} element The message or interaction that was created
 * @param {String[]} [args] The arguments passed to the command
 * @returns {Promise<void>}
**/
async function run(client, element, args = []){

	const isSlashCommand = (element instanceof ChatInputCommandInteraction) ? true : false;
	const user = isSlashCommand ? element.user : element.author;

	let classType = "random";
	let raceType = "random";

	if(args[0]) classType = args[0].toLowerCase();
	if(args[1]) raceType = args[1].toLowerCase();


	const dnd = new NPC({ classType, raceType });
	const npc = await dnd.generate();

	const embed = new EmbedBuilder()
		.setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL() })
		.setTimestamp()
		.setTitle(`${npc.character.name}`);

	const fields = [];


	// <NPC>#Character
	const gender = caseFix(npc.character.gender);
	const alignment = npc.character.alignment;
	const age = npc.character.age;
	const background = caseFix(npc.character.background);
	const className = caseFix(npc.class.name);
	const classLink = npc.class.link;

	const characterString =
		`**Gender:** *${gender}*\n` +
		`**Age:** *${age}*\n` +
		`**Class:**\n*[${className}](${classLink} "${className} on dndbeyond.com")*\n` +
		`**Alignment:**\n*${alignment}*\n` +
		`**Background:**\n*${background}*\n\u200b`;

	fields.push({ name: "Misc Info", value: characterString, inline: true });
	fields.push({ name: "\u200b", value: "\u200b", inline: true });

	// <NPC>#Race
	const raceName = npc.race.name;
	const raceLink = npc.race.link;
	const size = npc.race.size;
	const speed = npc.race.speed;
	const raceString =
		`**Race:**\n*[${raceName}](${raceLink} "${raceName} on dndbeyond.com")*\n` +
		`**Size:**\n*${size}*\n` +
		`**Speed:** *${speed}*\n\u200b`;
	fields.push({ name: "Race Info", value: raceString, inline: true });


	// <NPC>#Inventory
	const weapon = npc.inventory.weapon;
	const armor = npc.inventory.armor;

	// <NPC>#Inventory#Weapon
	const weaponName = caseFix(weapon.name);
	const weaponLink = weapon.link;
	const weaponDamage = weapon.damage.toUpperCase();
	const weaponDamageType = caseFix(weapon.damageType);

	const caseFixedProperties = [];
	for(const property of weapon.properties) caseFixedProperties.push(caseFix(property));
	const weaponProperties = (caseFixedProperties.length > 0) ? caseFixedProperties.join(",\n") : "None";

	const weaponString =
		`**[${weaponName}](${weaponLink} "${weaponName} on dndbeyond.com")**\n` +
		`**DMG:** *${weaponDamage}*\n` +
		`**DMG Type:**\n*${weaponDamageType}*\n` +
		`**Properties:**\n*${weaponProperties}*\n\u200b`;
	fields.push({ name: "Weapon Info", value: weaponString, inline: true });
	fields.push({ name: "\u200b", value: "\u200b", inline: true });


	// <NPC>#Inventory#Armor fields
	let armorString = "*None*";
	if(armor){
		const armorName = armor.name;
		const armorLink = armor.link;
		const armorType = caseFix(armor.type);
		const armorAC = armor.armorClass;
		const armorStrength = armor.strengthReq;
		// const armorStealth = armor.isStealthy;
		armorString =
			`**[${armorName}](${armorLink} "${armorName} on dndbeyond.com")**\n` +
			`**Type:** *${armorType}*\n` +
			`**AC:** *${armorAC}*\n` +
			`**STR Req:** *${armorStrength}*\n\u200b`;
	}
	fields.push({ name: "Armor Info", value: armorString, inline: true });


	// <NPC>#Class#Stats
	const stats = npc.class.stats;						// total & prof
	for(const stat of Object.keys(stats)){
		const statName = caseFix(stat);
		const statTotal = stats[stat].total;
		const statProf = stats[stat].prof;

		const statString = `**Total:** ${statTotal}\n**Prof Bonus:** ${statProf}`;
		fields.push({ name: statName, value: statString, inline: true });
	}


	embed.setFields(fields);
	await element.reply({ embeds: [embed] });
}



const info = {
	name: "npc",
	altNames: [],
	description: "Creates a semi-random NPC",
	usage: "npc {race} {class}",
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

		const classes = [
			{ name: "artificer", value: "artificer" },
			{ name: "barbarian", value: "barbarian" },
			{ name: "bard", value: "bard" },
			{ name: "cleric", value: "cleric" },
			{ name: "druid", value: "druid" },
			{ name: "fighter", value: "fighter" },
			{ name: "monk", value: "monk" },
			{ name: "paladin", value: "paladin" },
			{ name: "ranger", value: "ranger" },
			{ name: "rogue", value: "rogue" },
			{ name: "sorcerer", value: "sorcerer" },
			{ name: "warlock", value: "warlock" },
			{ name: "wizard", value: "wizard" },
			{ name: "random", value: "random" }
		];

		// This isn't all the races, but a trimmed down subset of reasonable ones
		const races = [
			{ name: "aarakocra", value: "aarakocra" },
			{ name: "aasimar", value: "aasimar" },
			{ name: "changeling", value: "changeling" },
			{ name: "dragonborn", value: "dragonborn" },
			{ name: "dwarf", value: "dwarf" },
			{ name: "elf", value: "elf" },
			{ name: "firbolg", value: "firbolg" },
			{ name: "genasi", value: "genasi" },
			{ name: "gnome", value: "gnome" },
			{ name: "goliath", value: "goliath" },
			{ name: "half-elf", value: "half-elf" },
			{ name: "halfling", value: "halfling" },
			{ name: "half-orc", value: "half-orc" },
			{ name: "human", value: "human" },
			{ name: "kalashtar", value: "kalashtar" },
			{ name: "kenku", value: "kenku" },
			{ name: "lizardfolk", value: "lizardfolk" },
			{ name: "shifter", value: "shifter" },
			{ name: "tabaxi", value: "tabaxi" },
			{ name: "tiefling", value: "tiefling" },
			{ name: "triton", value: "triton" },
			{ name: "warforged", value: "warforged" },
			{ name: "yuan-ti", value: "yuan-ti" },
			{ name: "random", value: "random" }
		];

		return {
			data: new SlashCommandBuilder()
				.setName(info.name)
				.setDescription(info.description)
				.setDMPermission(info.dmCompatible)
				.addStringOption(option => option.setRequired(false).setName("class").setDescription("The class of the NPC").addChoices(...classes))
				.addStringOption(option => option.setRequired(false).setName("race").setDescription("The race of the NPC").addChoices(...races))
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

			interaction.options.getString("class") ? args.push(interaction.options.getString("class")) : args.push("random");
			interaction.options.getString("race") ? args.push(interaction.options.getString("race")) : args.push("random");

			await run(client, interaction, args);
		}
	};
}

export { run, slash, info };