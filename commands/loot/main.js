import numberGenerator from './src/helperFunctions/numberGenerator.js';


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
 * @property {diceObject[]} platinum Rolls used to obtain total platinum
 * @property {diceObject[]} gold Rolls used to obtain the total gold
 * @property {diceObject[]} electrum Rolls used to obtain the total electrum
 * @property {diceObject[]} silver Rolls used to obtain the total silver
 * @property {diceObject[]} copper Rolls used to obtain then total copper
 * @description An object containing the rolls used to obtain the money.
**/
/**
 * @typedef {object} MoneyModifier
 * @property {number} platinum Modifier used to obtain platinum
 * @property {number} gold Modifier used to obtain gold
 * @property {number} electrum Modifier used to obtain electrum
 * @property {number} silver Modifier used to obtain silver
 * @property {number} copper Modifier used to obtain copper
 * @description An object containing the modifiers for the 5 denominations of money.
**/
/**
 * @typedef {object} MoneyObject
 * @property {TotalMoney} coins Total money obtained using the base 5 denomintaions (platinum, gold, electrum, silver, copper)
 * @property {MoneyRolls} rolls Rolls used to obtain the money
 * @property {MoneyModifier} modifier Modifier to multiply the roll by.
 * @description An object containing the money and the rolls used to obtain it.
**/


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
 * @class Loot
 * @description The base class for all loot types.
**/
class Loot {

	#challengeLevel;

	/**
	 * @name constructor
	 * @param {number} level
	**/
	constructor(level){
		if(level && isNaN(parseInt(level))) throw new TypeError("`level` must be of type number");
		if(level && level <= 0) throw new RangeError("`level` must be 0 or greater");

		this.#challengeLevel = level || 0;
		this.lootClassRolls = {
			percentile: numberGenerator(0, 9) * 10,
			d10: numberGenerator(1, 10)
		};
		this.lootClassRolls.total = this.lootClassRolls.percentile + this.lootClassRolls.d10;


		this.money = {
			coins: { platinum: 0, gold: 0, electrum: 0, silver: 0, copper: 0 },
			rolls: { platinum: [], gold: [], electrum: [], silver: [], copper: [] },
			modifier: { platinum: 0, gold: 0, electrum: 0, silver: 0, copper: 0 }
		};

		this.items = {};
	}

	getChallengeLevel(){ return this.#challengeLevel; }
}


/**
 * @class HoardLoot
 * @description Represents a hoard loot instance.
 * @extends Loot
**/
class HoardLoot extends Loot {

	#type;

	/**
	 * @name constructor
	 * @param {number} level
	**/
	constructor(level){
		super(level);
		this.#type = "hoard";
		this.money = this.#getMoney().then(m => m);
		this.items = this.#getItems().then(i => i);
	}


	/**
	 * @name getMoney
	 * @description Returns the money obtained
	 * @returns {MoneyObject}
	**/
	async #getMoney(){
		let folder = "";
		switch(this.getChallengeLevel()){
			case 0:
			case 1:
			case 2:
			case 3:
			case 4:
				folder = "0-4";
				break;

			case 5:
			case 6:
			case 7:
			case 8:
			case 9:
			case 10:
				folder = "5-10";
				break;

			case 11:
			case 12:
			case 13:
			case 14:
			case 15:
			case 16:
				folder = "11-16";
				break;

			default:
				folder = "17+";
				break;
		}

		const pathToFile = `./src/challengeLevels/${folder}/hoard_money.js`;
		const moneyRoll = await import(pathToFile);

		return moneyRoll();
	}

	/**
	 * @name getItems
	 * @description Returns the items obtained, if any
	 * @returns {allLoot}
	 */
	async #getItems(){
		let folder = "";
		switch(this.getChallengeLevel()){
			case 0:
			case 1:
			case 2:
			case 3:
			case 4:
				folder = "0-4";
				break;

			case 5:
			case 6:
			case 7:
			case 8:
			case 9:
			case 10:
				folder = "5-10";
				break;

			case 11:
			case 12:
			case 13:
			case 14:
			case 15:
			case 16:
				folder = "11-16";
				break;

			default:
				folder = "17+";
				break;
		}

		const pathToFile = `./src/challengeLevels/${folder}/hoard_items.js`;
		const getLoot = await import(pathToFile);

		return getLoot(this.lootClassRolls.total);
	}
}


/**
 * @class IndividualLoot
 * @description Represents an individual loot instance.
 * @extends Loot
**/
class IndividualLoot extends Loot {

	#type;

	/**
	 * @name constructor
	 * @param {number} level
	**/
	constructor(level){
		super(level);
		this.#type = "individual";
		this.money = this.#getMoney();
	}


	/**
	 * @name getMoney
	 * @description Returns the money obtained
	 * @returns {MoneyObject}
	**/
	async #getMoney(){

		let folder = "";
		switch(this.getChallengeLevel()){
			case 1:
			case 2:
			case 3:
			case 4:
				folder = "0-4";
				break;

			case 5:
			case 6:
			case 7:
			case 8:
			case 9:
			case 10:
				folder = "5-10";
				break;

			case 11:
			case 12:
			case 13:
			case 14:
			case 15:
			case 16:
				folder = "11-16";
				break;

			default:
				folder = "17+";
				break;
		}

		const pathToFile = `./src/challengeLevels/${folder}/individual_money.js`;
		const moneyRoll = await import(pathToFile);

		return moneyRoll(this.lootClassRolls.total);
	}
}


export { HoardLoot, IndividualLoot };