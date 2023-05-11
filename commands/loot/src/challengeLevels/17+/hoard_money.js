import moneyRoller from "../../helperFunctions/moneyRoller.js";


/**
 * @typedef {object} diceObject
 * @property {number} roll The roll
 * @property {string} die The dice used
**/
/**
 * @typedef {object} TotalMoney
 * @property {number} platinum Total platinum
 * @property {number} gold Total gold
 * @property {number} electrum Total electrum
 * @property {number} silver Total silver
 * @property {number} copper Total copper
 * @description An object containing the total money.
**/
/**
 * @typedef {object} MoneyRolls
 * @property {diceObject[]} platinum Rolls used to obtain platinum
 * @property {diceObject[]} gold Rolls used to obtain gold
 * @property {diceObject[]} electrum Rolls used to obtain electrum
 * @property {diceObject[]} silver Rolls used to obtain silver
 * @property {diceObject[]} copper Rolls used to obtain copper
 * @description An object containing the rolls used to obtain the money.
**/
/**
 * @typedef {object} MoneyModifier
 * @property {number} platinum Modifier used to obtain platinum
 * @property {number} gold Modifier used to obtain gold
 * @property {number} electrum Modifier used to obtain electrum
 * @property {number} silver Modifier used to obtain silver
 * @property {number} copper Modifier used to obtain copper
 * @description An object containing the modifier used to obtain the money.
**/
/**
 * @typedef {object} MoneyObject
 * @property {TotalMoney} coins Total money obtained
 * @property {MoneyRolls} rolls Rolls used to obtain the money
 * @property {MoneyModifier} modifier Modifier used to obtain the money
 * @description An object containing the money and the rolls used to obtain it.
**/


/**
 * @name run
 * @param {number} lootRoll The loot roll to compare against.
 * @returns {MoneyObject} An object containing the money and the rolls used to obtain it.
 * @description Rolls for money based on the loot roll.
**/
function run(){

	let platinum, gold, electrum, silver, copper;
	let platinumModifier, goldModifier, electrumModifier, silverModifier, copperModifier;

	platinum = gold = electrum = silver = copper = 0;
	platinumModifier = goldModifier = electrumModifier = silverModifier = copperModifier = 1;
	const [platinumRolls, goldRolls, electrumRolls, silverRolls, copperRolls] = [[], [], [], [], []];


	// 12x d6 x1000 Gold
	goldModifier = 1000;
	gold = moneyRoller(12, 6, goldModifier, gold, goldRolls);

	// 8x d6 x1000 Platinum
	platinumModifier = 1000;
	platinum = moneyRoller(8, 6, platinumModifier, platinum, platinumRolls);


	return {
		coins: {
			platinum,
			gold,
			electrum,
			silver,
			copper
		},

		rolls: {
			platinum: platinumRolls,
			gold: goldRolls,
			electrum: electrumRolls,
			silver: silverRolls,
			copper: copperRolls
		},

		modifier: {
			platinum: platinumModifier,
			gold: goldModifier,
			electrum: electrumModifier,
			silver: silverModifier,
			copper: copperModifier
		}
	};
}

export default run;