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

	if(lootRoll <= 5){
		// 3d6 1000 gp gems
		results.gems = gemsArtRoll(3, 6, 1000);

		// Roll 1d8 times on Magic Item Table C.
		results.items.push(lootRoller(1, 8, "c"));
		return results;
	}

	if(lootRoll <= 11){
		// 1d4 7500 gp art
		results.art = gemsArtRoll(1, 4, 7500);

		// Roll 1d8 times on Magic Item Table C.
		results.items.push(lootRoller(1, 8, "c"));
		return results;
	}

	if(lootRoll <= 14){
		// 1d8 5000 gp gems
		results.gems = gemsArtRoll(1, 8, 5000);

		// Roll 1d8 times on Magic Item Table C.
		results.items.push(lootRoller(1, 8, "c"));
		return results;
	}

	if(lootRoll <= 22){
		// 3d6 1000 gp gems
		results.gems = gemsArtRoll(3, 6, 1000);

		// Roll 1d6 times on Magic Item Table D.
		results.items.push(lootRoller(1, 6, "d"));
		return results;
	}

	if(lootRoll <= 38){
		// 1d4 7500 gp art
		results.art = gemsArtRoll(1, 4, 7500);

		// Roll 1d6 times on Magic Item Table D.
		results.items.push(lootRoller(1, 6, "d"));
		return results;
	}

	if(lootRoll <= 46){
		// 1d8 5000 gp gems
		results.gems = gemsArtRoll(1, 8, 5000);

		// Roll 1d6 times on Magic Item Table D.
		results.items.push(lootRoller(1, 6, "d"));
		return results;
	}

	if(lootRoll <= 52){
		// 3d6 1000 gp gems
		results.gems = gemsArtRoll(3, 6, 1000);

		// Roll 1d6 times on Magic Item Table E.
		results.items.push(lootRoller(1, 6, "e"));
		return results;
	}

	if(lootRoll <= 63){
		// 1d4 7500 gp art
		results.art = gemsArtRoll(1, 4, 7500);

		// Roll 1d6 times on Magic Item Table E.
		results.items.push(lootRoller(1, 6, "e"));
		return results;
	}

	if(lootRoll <= 68){
		// 1d8 5000 gp gems
		results.gems = gemsArtRoll(1, 8, 5000);

		// Roll 1d6 times on Magic Item Table E.
		results.items.push(lootRoller(1, 6, "e"));
		return results;
	}

	if(lootRoll <= 69){
		// 3d6 1000 gp gems
		results.gems = gemsArtRoll(3, 6, 1000);

		// Roll 1d4 times on Magic Item Table G.
		results.items.push(lootRoller(1, 4, "g"));
		return results;
	}

	if(lootRoll <= 71){
		// 1d4 7500 gp art
		results.art = gemsArtRoll(1, 4, 7500);

		// Roll 1d4 times on Magic Item Table G.
		results.items.push(lootRoller(1, 4, "g"));
		return results;
	}

	if(lootRoll <= 72){
		// 1d8 5000 gp gems
		results.gems = gemsArtRoll(1, 8, 5000);

		// Roll 1d4 times on Magic Item Table G.
		results.items.push(lootRoller(1, 4, "g"));
		return results;
	}

	if(lootRoll <= 74){
		// 3d6 1000 gp gems
		results.gems = gemsArtRoll(3, 6, 1000);

		// Roll 1d4 times on Magic Item Table H.
		results.items.push(lootRoller(1, 4, "h"));
		return results;
	}

	if(lootRoll <= 78){
		// 1d4 7500 gp art
		results.art = gemsArtRoll(1, 4, 7500);

		// Roll 1d4 times on Magic Item Table H.
		results.items.push(lootRoller(1, 4, "h"));
		return results;
	}

	if(lootRoll <= 80){
		// 1d8 5000 gp gems
		results.gems = gemsArtRoll(1, 8, 5000);

		// Roll 1d4 times on Magic Item Table H.
		results.items.push(lootRoller(1, 4, "h"));
		return results;
	}

	if(lootRoll <= 85){
		// 3d6 1000 gp gems
		results.gems = gemsArtRoll(3, 6, 1000);

		// Roll 1d4 times on Magic Item Table I.
		results.items.push(lootRoller(1, 4, "i"));
		return results;
	}

	if(lootRoll <= 95){
		// 1d4 7500 gp art
		results.art = gemsArtRoll(1, 4, 7500);

		// Roll 1d4 times on Magic Item Table I.
		results.items.push(lootRoller(1, 4, "i"));
		return results;
	}

	if(lootRoll <= 100){
		// 1d8 5000 gp gems
		results.gems = gemsArtRoll(1, 8, 5000);

		// Roll 1d4 times on Magic Item Table I.
		results.items.push(lootRoller(1, 4, "i"));
		return results;
	}
}


export default getLoot;