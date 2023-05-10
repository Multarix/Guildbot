import gemsArtRoll from '../../helperFunctions/gemsArtRoll.js';
import lootRoller from '../../helperFunctions/lootRoller.js';


/**
 * @typedef {item[]} tableArray
**/
/**
 * @typedef {object} diceObject
 * @property {number} roll The roll
 * @property {string} dice The dice used
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
 * @name getLoot
 * @param {number} lootRoll
 * @returns {allLoot};
**/
function getLoot(lootRoll){

	const results = {
		gems: {
			gpCostPer: 0,
			amount: 0,
			rolls: []
		},
		art: {
			gpCostPer: 0,
			amount: 0,
			rolls: []
		},
		items: []
	};

	if(lootRoll <= 3){
		// Nothing
		return results;
	}

	if(lootRoll <= 16){
		// 2d6 10 gp gems
		results.gems = gemsArtRoll(2, 6, 10);
		return results;
	}

	if(lootRoll <= 26){
		// 2d4 25 gp art
		results.art = gemsArtRoll(2, 4, 25);
		return results;
	}

	if(lootRoll <= 36){
		// 2d6 50 gp gems
		results.gems = gemsArtRoll(2, 6, 50);
		return results;
	}

	if(lootRoll <= 44){
		// 2d6 10 gp gems
		results.gems = gemsArtRoll(2, 6, 10);

		// Roll 1d6 times on Magic Item Table A.
		results.items.push(lootRoller(1, 6, "a"));
		return results;
	}

	if(lootRoll <= 52){
		// 2d4 25 gp art
		results.art = gemsArtRoll(2, 4, 25);

		// Roll 1d6 times on Magic Item Table A.
		results.items.push(lootRoller(1, 6, "a"));
		return results;
	}

	if(lootRoll <= 60){
		// 2d6 50 gp gems
		results.gems = gemsArtRoll(2, 6, 50);

		// Roll 1d6 times on Magic Item Table A.
		results.items.push(lootRoller(1, 6, "a"));
		return results;
	}

	if(lootRoll <= 65){
		// 2d6 10 gp gems
		results.gems = gemsArtRoll(2, 6, 10);

		// Roll 1d4 times on Magic Item Table B.
		results.items.push(lootRoller(1, 4, "b"));
		return results;
	}

	if(lootRoll <= 70){
		// 2d4 25 gp art
		results.art = gemsArtRoll(2, 4, 25);

		// Roll 1d4 times on Magic Item Table B.
		results.items.push(lootRoller(1, 4, "b"));
		return results;
	}

	if(lootRoll <= 75){
		// 2d6 50 gp gems
		results.gems = gemsArtRoll(2, 6, 50);

		// Roll 1d4 times on Magic Item Table B.
		results.items.push(lootRoller(1, 4, "b"));
		return results;
	}

	if(lootRoll <= 78){
		// 2d6 10 gp gems
		results.gems = gemsArtRoll(2, 6, 10);

		// Roll 1d4 times on Magic Item Table C.
		results.items.push(lootRoller(1, 4, "c"));
		return results;
	}

	if(lootRoll <= 80){
		// 2d4 25 gp art
		results.art = gemsArtRoll(2, 4, 25);

		// Roll 1d4 times on Magic Item Table C.
		results.items.push(lootRoller(1, 4, "c"));
		return results;
	}

	if(lootRoll <= 85){
		// 2d6 50 gp gems
		results.gems = gemsArtRoll(2, 6, 50);

		// Roll 1d4 times on Magic Item Table C.
		results.items.push(lootRoller(1, 4, "c"));
		return results;
	}

	if(lootRoll <= 92){
		// 2d4 25 gp art
		results.art = gemsArtRoll(2, 4, 25);

		// Roll 1d4 times on Magic Item Table F.
		results.items.push(lootRoller(1, 4, "f"));
		return results;
	}

	if(lootRoll <= 97){
		// 2d6 50 gp gems
		results.gems = gemsArtRoll(2, 6, 50);

		// Roll 1d4 times on Magic Item Table F.
		results.items.push(lootRoller(1, 4, "f"));
		return results;
	}

	if(lootRoll <= 99){
		// 2d4 25 gp art
		results.art = gemsArtRoll(2, 4, 25);

		// Roll once on Magic Item Table G.
		results.items.push(lootRoller(1, 1, "g"));
		return results;
	}

	if(lootRoll <= 100){
		// 2d6 50 gp gems
		results.gems = gemsArtRoll(2, 6, 50);

		// Roll once on Magic Item Table G.
		results.items.push(lootRoller(1, 1, "g"));
		return results;
	}
}


export default getLoot;