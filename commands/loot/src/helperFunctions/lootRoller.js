const numberGenerator = require('./numberGenerator.js');
const tableA = require('../magicItemTables/MagicItemTableA.js');
const tableB = require('../magicItemTables/MagicItemTableB.js');
const tableC = require('../magicItemTables/MagicItemTableC.js');
const tableD = require('../magicItemTables/MagicItemTableD.js');
const tableE = require('../magicItemTables/MagicItemTableE.js');
const tableF = require('../magicItemTables/MagicItemTableF.js');
const tableG = require('../magicItemTables/MagicItemTableG.js');
const tableH = require('../magicItemTables/MagicItemTableH.js');
const tableI = require('../magicItemTables/MagicItemTableI.js');


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
	if(dieMax === 1) tableDieRolls = "once";

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


module.exports = lootRoller;