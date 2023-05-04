const randomNumber = require('./randomNumber.js');
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
 * @property {diceObject} diceInfo The die used to obtain the item
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
 * @param {number} rolls The number of rolls to do
 * @param {number} diceMax The max of the die to roll
 * @param {string} table The table to roll on
 * @returns {item[]}
**/
function lootRoller(rolls, dieMax, table){
	const rollArray = [];

	// Check if the table exists
	table = table.toLowerCase();
	if(!tables[table]) return rollArray;

	// Get how many rolls on the table we do
	let tableRolls = 0;
	for(let i = 0; i < rolls; i++){
		const r = randomNumber(1, dieMax);
		tableRolls += r;
	}

	// Roll on the table
	for(let i = 0; i < tableRolls; i++){
		// Roll 1 to 100 and get the item from the table
		const roll = randomNumber(1, 100);
		const item = tables[table](roll);

		rollArray.push({ name: item.name, link: item.link, fromTable: table, diceInfo: { roll, die: "d100" } });
	}

	return rollArray;
}


module.exports = lootRoller;