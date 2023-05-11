import numberGenerator from './numberGenerator.js';


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
 * @returns {gemArtData} The gems or art object
**/
function gemsArtRoll(numRolls, dieMax, costOfItem){

	let total = 0;
	const diceRolls = [];
	for(let i = 0; i < numRolls; i++){
		const num = numberGenerator(1, dieMax);
		diceRolls.push({ roll: num, die: `d${dieMax}` });
		total += num;
	}


	return { gpCostPer: costOfItem, amount: total, rolls: diceRolls };
}


export default gemsArtRoll;