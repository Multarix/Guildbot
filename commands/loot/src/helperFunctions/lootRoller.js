import numberGenerator from './numberGenerator.js';
import tableA from '../magicItemTables/MagicItemTableA.js';
import tableB from '../magicItemTables/MagicItemTableB.js';
import tableC from '../magicItemTables/MagicItemTableC.js';
import tableD from '../magicItemTables/MagicItemTableD.js';
import tableE from '../magicItemTables/MagicItemTableE.js';
import tableF from '../magicItemTables/MagicItemTableF.js';
import tableG from '../magicItemTables/MagicItemTableG.js';
import tableH from '../magicItemTables/MagicItemTableH.js';
import tableI from '../magicItemTables/MagicItemTableI.js';


/**
 * @typedef {object} diceObject
 * @property {number} roll The roll
 * @property {string} die The dice used
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


const tables = {
	'a': tableA,
	'b': tableB,
	'c': tableC,
	'd': tableD,
	'e': tableE,
	'f': tableF,
	'g': tableG,
	'h': tableH,
	'i': tableI
};


/**
 * @name lootRoller
 * @param {number} rolls The number of dice rolls to do
 * @param {number} diceMax What type of die to use
 * @param {string} table The table to roll on
 * @returns {item[]}
**/
function lootRoller(rolls, dieMax, table){
	const rollArray = [];

	let tableDieRolls = `${rolls} d${dieMax} rolls`;
	if(dieMax === 1) tableDieRolls = "Roll once";

	// Check if the table exists
	table = table.toLowerCase();
	if(!tables[table]) return rollArray;

	// Get how many rolls on the table we do
	let tableRolls = 0;
	for(let i = 0; i < rolls; i++){
		const roll = numberGenerator(1, dieMax);
		tableRolls += roll;
	}

	// Roll on the table
	for(let i = 0; i < tableRolls; i++){
		// Roll 1 to 100 and get the item from the table
		const roll = numberGenerator(1, 100);
		const item = tables[table](roll);

		rollArray.push({ name: item.name, link: item.link, fromTable: table, tableDie: tableDieRolls, diceInfo: { roll, die: "d100" } });
	}

	return rollArray;
}


export default lootRoller;