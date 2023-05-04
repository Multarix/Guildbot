const randomNumber = require('./randomNumber.js');


/**
 * @typedef {object} diceObject
 * @property {number} roll The roll
 * @property {string} die The dice used
**/
/**
 * @typedef {object} gemArtData
 * @property {number} gpCostPer The cost of the item
 * @property {number} amount The amount of the item
 * @property {diceObject[]} rolls The rolls
**/


/**
 * @name gemsArtRoll
 * @param {number} costOfItem The cost of an individual item
 * @param {number} numRolls The number of rolls to do
 * @param {number} dieMax The max of the die to roll
 * @returns {itemData} The gems or art object
**/
function gemsArtRoll(numRolls, dieMax, costOfItem){

	let total = 0;
	const rolls = [];
	for(let i = 0; i < numRolls; i++){
		const roll = randomNumber(1, dieMax);
		rolls.push({ roll, die: `d${dieMax}` });
		total += roll;
	}


	return { gpCostPer: costOfItem, amount: total, rolls };
}


module.exports = gemsArtRoll;