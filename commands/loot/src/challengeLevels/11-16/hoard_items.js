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

	if(lootRoll <= 6){
		// 2d4 250 gp art
		results.art = gemsArtRoll(2, 4, 250);
		return results;
	}

	if(lootRoll <= 9){
		// 2d4 750 gp art
		results.art = gemsArtRoll(2, 4, 750);
		return results;
	}

	if(lootRoll <= 12){
		// 3d6 500 gp gems
		results.gems = gemsArtRoll(3, 6, 500);
		return results;
	}

	if(lootRoll <= 15){
		// 3d6 1000 gp gems
		results.gems = gemsArtRoll(3, 6, 1000);
		return results;
	}

	if(lootRoll <= 19){
		// 2d4 250 gp art
		results.art = gemsArtRoll(2, 4, 250);

		// Roll 1d4 times on Magic Item Table A and 1d6 times on Magic Item Table B.
		results.items.push(lootRoller(1, 4, "a"));
		results.items.push(lootRoller(1, 6, "b"));
		return results;
	}

	if(lootRoll <= 23){
		// 2d4 750 gp art
		results.art = gemsArtRoll(2, 4, 750);

		// Roll 1d4 times on Magic Item Table A and 1d6 times on Magic Item Table B.
		results.items.push(lootRoller(1, 4, "a"));
		results.items.push(lootRoller(1, 6, "b"));
		return results;
	}

	if(lootRoll <= 26){
		// 3d6 500 gp gems
		results.gems = gemsArtRoll(3, 6, 500);

		// Roll 1d4 times on Magic Item Table A and 1d6 times on Magic Item Table B.
		results.items.push(lootRoller(1, 4, "a"));
		results.items.push(lootRoller(1, 6, "b"));
		return results;
	}

	if(lootRoll <= 29){
		// 3d6 1000 gp gems
		results.gems = gemsArtRoll(3, 6, 1000);

		// Roll 1d4 times on Magic Item Table A and 1d6 times on Magic Item Table B.
		results.items.push(lootRoller(1, 4, "a"));
		results.items.push(lootRoller(1, 6, "b"));
		return results;
	}

	if(lootRoll <= 35){
		// 2d4 250 gp art
		results.art = gemsArtRoll(2, 4, 250);

		// Roll 1d6 times on Magic Item Table C.
		results.items.push(lootRoller(1, 6, "c"));
		return results;
	}

	if(lootRoll <= 40){
		// 2d4 750 gp art
		results.art = gemsArtRoll(2, 4, 750);

		// Roll 1d6 times on Magic Item Table C.
		results.items.push(lootRoller(1, 6, "c"));
		return results;
	}

	if(lootRoll <= 45){
		// 3d6 500 gp gems
		results.gems = gemsArtRoll(3, 6, 500);

		// Roll 1d6 times on Magic Item Table C.
		results.items.push(lootRoller(1, 6, "c"));
		return results;
	}

	if(lootRoll <= 50){
		// 3d6 1000 gp gems
		results.gems = gemsArtRoll(3, 6, 1000);

		// Roll 1d6 times on Magic Item Table C.
		results.items.push(lootRoller(1, 6, "c"));
		return results;
	}

	if(lootRoll <= 54){
		// 2d4 250 gp art
		results.art = gemsArtRoll(2, 4, 250);

		// Roll 1d4 times on Magic Item Table D.
		results.items.push(lootRoller(1, 4, "d"));
		return results;
	}

	if(lootRoll <= 58){
		// 2d4 750 gp art
		results.art = gemsArtRoll(2, 4, 750);

		// Roll 1d4 times on Magic Item Table D.
		results.items.push(lootRoller(1, 4, "d"));
		return results;
	}

	if(lootRoll <= 62){
		// 3d6 500 gp gems
		results.gems = gemsArtRoll(3, 6, 500);

		// Roll 1d4 times on Magic Item Table D.
		results.items.push(lootRoller(1, 4, "d"));
		return results;
	}

	if(lootRoll <= 66){
		// 3d6 1000 gp gems
		results.gems = gemsArtRoll(3, 6, 1000);

		// Roll 1d4 times on Magic Item Table D.
		results.items.push(lootRoller(1, 4, "d"));
		return results;
	}

	if(lootRoll <= 68){
		// 2d4 250 gp art
		results.art = gemsArtRoll(2, 4, 250);

		// Roll once on Magic Item Table E.
		results.items.push(lootRoller(1, 1, "e"));
		return results;
	}

	if(lootRoll <= 70){
		// 2d4 750 gp art
		results.art = gemsArtRoll(2, 4, 750);

		// Roll once on Magic Item Table E.
		results.items.push(lootRoller(1, 1, "e"));
		return results;
	}

	if(lootRoll <= 72){
		// 3d6 500 gp gems
		results.gems = gemsArtRoll(3, 6, 500);

		// Roll once on Magic Item Table E.
		results.items.push(lootRoller(1, 1, "e"));
		return results;
	}

	if(lootRoll <= 74){
		// 3d6 1000 gp gems
		results.gems = gemsArtRoll(3, 6, 1000);

		// Roll once on Magic Item Table E.
		results.items.push(lootRoller(1, 1, "e"));
		return results;
	}

	if(lootRoll <= 76){
		// 2d4 250 gp art
		results.art = gemsArtRoll(2, 4, 250);

		// Roll once on Magic Item Table F and 1d4 times on Magic Item Table G.
		results.items.push(lootRoller(1, 1, "f"));
		results.items.push(lootRoller(1, 4, "g"));
		return results;
	}

	if(lootRoll <= 78){
		// 2d4 750 gp art
		results.art = gemsArtRoll(2, 4, 750);

		// Roll once on Magic Item Table F and 1d4 times on Magic Item Table G.
		results.items.push(lootRoller(1, 1, "f"));
		results.items.push(lootRoller(1, 4, "g"));
		return results;
	}

	if(lootRoll <= 80){
		// 3d6 500 gp gems
		results.gems = gemsArtRoll(3, 6, 500);

		// Roll once on Magic Item Table F and 1d4 times on Magic Item Table G.
		results.items.push(lootRoller(1, 1, "f"));
		results.items.push(lootRoller(1, 4, "g"));
		return results;
	}

	if(lootRoll <= 82){
		// 3d6 1000 gp gems
		results.gems = gemsArtRoll(3, 6, 1000);

		// Roll once on Magic Item Table F and 1d4 times on Magic Item Table G.
		results.items.push(lootRoller(1, 1, "f"));
		results.items.push(lootRoller(1, 4, "g"));
		return results;
	}

	if(lootRoll <= 85){
		// 2d4 250 gp art
		results.art = gemsArtRoll(2, 4, 250);

		// Roll 1d4 times on Magic Item Table H.
		results.items.push(lootRoller(1, 4, "h"));
		return results;
	}

	if(lootRoll <= 88){
		// 2d4 750 gp art
		results.art = gemsArtRoll(2, 4, 750);

		// Roll 1d4 times on Magic Item Table H.
		results.items.push(lootRoller(1, 4, "h"));
		return results;
	}

	if(lootRoll <= 90){
		// 3d6 500 gp gems
		results.gems = gemsArtRoll(3, 6, 500);

		// Roll 1d4 times on Magic Item Table H.
		results.items.push(lootRoller(1, 4, "h"));
		return results;
	}

	if(lootRoll <= 92){
		// 3d6 1000 gp gems
		results.gems = gemsArtRoll(3, 6, 1000);

		// Roll 1d4 times on Magic Item Table H.
		results.items.push(lootRoller(1, 4, "h"));
		return results;
	}

	if(lootRoll <= 94){
		// 2d4 250 gp art
		results.art = gemsArtRoll(2, 4, 250);

		// Roll once on Magic Item Table I.
		results.items.push(lootRoller(1, 1, "i"));
		return results;
	}

	if(lootRoll <= 96){
		// 2d4 750 gp art
		results.art = gemsArtRoll(2, 4, 750);

		// Roll once on Magic Item Table I.
		results.items.push(lootRoller(1, 1, "i"));
		return results;
	}

	if(lootRoll <= 98){
		// 3d6 500 gp gems
		results.gems = gemsArtRoll(3, 6, 500);

		// Roll once on Magic Item Table I.
		results.items.push(lootRoller(1, 1, "i"));
		return results;
	}

	if(lootRoll <= 100){
		// 3d6 1000 gp gems
		results.gems = gemsArtRoll(3, 6, 1000);

		// Roll once on Magic Item Table I.
		results.items.push(lootRoller(1, 1, "i"));
		return results;
	}
}


export default getLoot;