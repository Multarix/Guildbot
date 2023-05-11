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

	if(lootRoll <= 10){
		// 2d4 25 gp art
		results.art = gemsArtRoll(2, 4, 25);
		return results;
	}

	if(lootRoll <= 16){
		// 3d6 50 gp gems
		results.gems = gemsArtRoll(3, 6, 50);
		return results;
	}

	if(lootRoll <= 22){
		// 3d6 100 gp gems
		results.gems = gemsArtRoll(3, 6, 100);
		return results;
	}

	if(lootRoll <= 28){
		// 2d4 250 gp art
		results.art = gemsArtRoll(2, 4, 250);
		return results;
	}

	if(lootRoll <= 32){
		// 2d4 25 gp art
		results.art = gemsArtRoll(2, 4, 25);

		// Roll 1d6 times on Magic Item Table A.
		results.items.push(lootRoller(1, 6, "a"));
		return results;
	}

	if(lootRoll <= 36){
		// 3d6 50 gp gems
		results.gems = gemsArtRoll(3, 6, 50);

		// Roll 1d6 times on Magic Item Table A.
		results.items.push(lootRoller(1, 6, "a"));
		return results;
	}

	if(lootRoll <= 40){
		// 3d6 100 gp gems
		results.gems = gemsArtRoll(3, 6, 100);

		// Roll 1d6 times on Magic Item Table A.
		results.items.push(lootRoller(1, 6, "a"));
		return results;
	}

	if(lootRoll <= 44){
		// 2d4 250 gp art
		results.art = gemsArtRoll(2, 4, 250);

		// Roll 1d6 times on Magic Item Table A.
		results.items.push(lootRoller(1, 6, "a"));
		return results;
	}

	if(lootRoll <= 49){
		// 2d4 25 gp art
		results.art = gemsArtRoll(2, 4, 25);

		// Roll 1d4 times on Magic Item Table B.
		results.items.push(lootRoller(1, 4, "b"));
		return results;
	}

	if(lootRoll <= 54){
		// 3d6 50 gp gems
		results.gems = gemsArtRoll(3, 6, 50);

		// Roll 1d4 times on Magic Item Table B.
		results.items.push(lootRoller(1, 4, "b"));
		return results;
	}

	if(lootRoll <= 59){
		// 3d6 100 gp gems
		results.gems = gemsArtRoll(3, 6, 100);

		// Roll 1d4 times on Magic Item Table B.
		results.items.push(lootRoller(1, 4, "b"));
		return results;
	}

	if(lootRoll <= 63){
		// 2d4 250 gp art
		results.art = gemsArtRoll(2, 4, 250);

		// Roll 1d4 times on Magic Item Table B.
		results.items.push(lootRoller(1, 4, "b"));
		return results;
	}

	if(lootRoll <= 66){
		// 2d4 25 gp art
		results.art = gemsArtRoll(2, 4, 25);

		// Roll 1d4 times on Magic Item Table C.
		results.items.push(lootRoller(1, 4, "c"));
		return results;
	}

	if(lootRoll <= 69){
		// 3d6 50 gp gems
		results.gems = gemsArtRoll(3, 6, 50);

		// Roll 1d4 times on Magic Item Table C.
		results.items.push(lootRoller(1, 4, "c"));
		return results;
	}

	if(lootRoll <= 72){
		// 3d6 100 gp gems
		results.gems = gemsArtRoll(3, 6, 100);

		// Roll 1d4 times on Magic Item Table C.
		results.items.push(lootRoller(1, 4, "c"));
		return results;
	}

	if(lootRoll <= 74){
		// 2d4 250 gp art
		results.art = gemsArtRoll(2, 4, 250);

		// Roll 1d4 times on Magic Item Table C.
		results.items.push(lootRoller(1, 4, "c"));
		return results;
	}

	if(lootRoll <= 76){
		// 2d4 25 gp art
		results.art = gemsArtRoll(2, 4, 25);

		// Roll once on Magic Item Table D.
		results.items.push(lootRoller(1, 1, "d"));
		return results;
	}

	if(lootRoll <= 78){
		// 3d6 50 gp gems
		results.gems = gemsArtRoll(3, 6, 50);

		// Roll once on Magic Item Table D.
		results.items.push(lootRoller(1, 1, "d"));
		return results;
	}

	if(lootRoll <= 79){
		// 3d6 100 gp gems
		results.gems = gemsArtRoll(3, 6, 100);

		// Roll once on Magic Item Table D.
		results.items.push(lootRoller(1, 1, "d"));
		return results;
	}

	if(lootRoll <= 80){
		// 2d4 250 gp art
		results.art = gemsArtRoll(2, 4, 250);

		// Roll once on Magic Item Table D.
		results.items.push(lootRoller(1, 1, "d"));
		return results;
	}

	if(lootRoll <= 84){
		// 2d4 25 gp art
		results.art = gemsArtRoll(2, 4, 25);

		// Roll 1d4 times on Magic Item Table F.
		results.items.push(lootRoller(1, 4, "f"));
		return results;
	}

	if(lootRoll <= 88){
		// 3d6 50 gp gems
		results.gems = gemsArtRoll(3, 6, 50);

		// Roll 1d4 times on Magic Item Table F.
		results.items.push(lootRoller(1, 4, "f"));
		return results;
	}

	if(lootRoll <= 91){
		// 3d6 100 gp gems
		results.gems = gemsArtRoll(3, 6, 100);

		// Roll 1d4 times on Magic Item Table F.
		results.items.push(lootRoller(1, 4, "f"));
		return results;
	}

	if(lootRoll <= 94){
		// 2d4 250 gp art
		results.art = gemsArtRoll(2, 4, 250);

		// Roll 1d4 times on Magic Item Table F.
		results.items.push(lootRoller(1, 4, "f"));
		return results;
	}

	if(lootRoll <= 96){
		// 3d6 100 gp gems
		results.gems = gemsArtRoll(3, 6, 100);

		// Roll 1d4 times on Magic Item Table G.
		results.items.push(lootRoller(1, 4, "g"));
		return results;
	}

	if(lootRoll <= 98){
		// 2d4 250 gp art
		results.art = gemsArtRoll(2, 4, 250);

		// Roll 1d4 times on Magic Item Table G.
		results.items.push(lootRoller(1, 4, "g"));
		return results;
	}

	if(lootRoll <= 99){
		// 3d6 100 gp gems
		results.gems = gemsArtRoll(3, 6, 100);

		// Roll once on Magic Item Table H.
		results.items.push(lootRoller(1, 1, "h"));
		return results;
	}

	if(lootRoll <= 100){
		// 2d4 250 gp art
		results.art = gemsArtRoll(2, 4, 250);

		// Roll once on Magic Item Table H.
		results.items.push(lootRoller(1, 1, "h"));
		return results;
	}
}


export default getLoot;