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
function run(lootRoll){

	let platinum, gold, electrum, silver, copper;
	let platinumModifier, goldModifier, electrumModifier, silverModifier, copperModifier;

	platinum = gold = electrum = silver = copper = 0;
	platinumModifier = goldModifier = electrumModifier = silverModifier = copperModifier = 1;
	const [platinumRolls, goldRolls, electrumRolls, silverRolls, copperRolls] = [[], [], [], [], []];

	// 76-100
	if(lootRoll >= 76){

		// 2x d6 x100 gold
		goldModifier = 100;
		gold = moneyRoller(2, 6, goldModifier, gold, goldRolls);

		// 2x d6 x10 platinum
		platinumModifier = 10;
		platinum = moneyRoller(2, 6, platinumModifier, platinum, platinumRolls);
	}

	// 36-75
	if(lootRoll >= 36 && lootRoll <= 75){

		// 2x d6 gold x100
		goldModifier = 100;
		gold = moneyRoller(2, 6, goldModifier, gold, goldRolls);

		// 1x d6 x10 platinum
		platinumModifier = 10;
		platinum = moneyRoller(1, 6, platinumModifier, platinum, platinumRolls);
	}

	// 21-35
	if(lootRoll >= 21 && lootRoll <= 35){

		// 1x d6 x100 electrum
		electrumModifier = 100;
		electrum = moneyRoller(1, 6, electrumModifier, electrum, electrumRolls);

		// 1x d6 x100 silver
		silverModifier = 100;
		silver = moneyRoller(1, 6, silverModifier, silver, silverRolls);
	}

	// 1-20
	if(lootRoll >= 1 && lootRoll <= 20){

		// 4x d6 x100 silver
		silverModifier = 100;
		silver = moneyRoller(4, 6, silverModifier, silver, silverRolls);

		// 1x d6 x100 copper
		copperModifier = 100;
		copper = moneyRoller(1, 6, copperModifier, copper, copperRolls);
	}

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