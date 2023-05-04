const gemsArtRoll = require('../../helperFunctions/gemsArtRoll.js');
const lootRoller = require('../../helperFunctions/lootRoller.js');


/**
 * @typedef {object} diceObject
 * @property {number} roll The roll
 * @property {string} dice The dice used
**/
/**
 * @typedef {object} item
 * @property {string} name The name of the item
 * @property {string} link The link to the item on D&D Beyond
**/
/**
 * @typedef {object} itemData
 * @property {item[]} items The items obtained
 * @property {diceObject[]} rolls The rolls used to obtain the items
**/
/**
 * @typedef {object} gemArtData
 * @property {number} gpCostPer The cost of the item
 * @property {number} amount The amount of the item
 * @property {diceObject[]} rolls The rolls
**/
/**
 * @typedef {object} allLoot
 * @property {gemArtData} gems The gems obtained
 * @property {gemArtData} art The art obtained
 * @property {itemData} items The items obtained
**/


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
	items: {
		items: [],
		rolls: []
	}
};


/**
 * @name getLoot
 * @param {number} lootRoll
 * @returns {allLoot};
**/
function getLoot(lootRoll){

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
		results.items = lootRoller(1, 4, "a");
		return results;
	}

	if(lootRoll <= 23){
		// 2d4 750 gp art
		results.art = gemsArtRoll(2, 4, 750);

		// Roll 1d4 times on Magic Item Table A and 1d6 times on Magic Item Table B.
		results.items = lootRoller(1, 4, "a");
		return results;
	}

	if(lootRoll <= 26){
		// 3d6 500 gp gems
		results.gems = gemsArtRoll(3, 6, 500);

		// Roll 1d4 times on Magic Item Table A and 1d6 times on Magic Item Table B.
		results.items = lootRoller(1, 4, "a");
		return results;
	}

	if(lootRoll <= 29){
		// 3d6 1000 gp gems
		results.gems = gemsArtRoll(3, 6, 1000);

		// Roll 1d4 times on Magic Item Table A and 1d6 times on Magic Item Table B.
		results.items = lootRoller(1, 4, "a");
		return results;
	}

	if(lootRoll <= 35){
		// 2d4 250 gp art
		results.art = gemsArtRoll(2, 4, 250);

		// Roll 1d6 times on Magic Item Table C.
		results.items = lootRoller(1, 6, "c");
		return results;
	}

	if(lootRoll <= 40){
		// 2d4 750 gp art
		results.art = gemsArtRoll(2, 4, 750);

		// Roll 1d6 times on Magic Item Table C.
		results.items = lootRoller(1, 6, "c");
		return results;
	}

	if(lootRoll <= 45){
		// 3d6 500 gp gems
		results.gems = gemsArtRoll(3, 6, 500);

		// Roll 1d6 times on Magic Item Table C.
		results.items = lootRoller(1, 6, "c");
		return results;
	}

	if(lootRoll <= 50){
		// 3d6 1000 gp gems
		results.gems = gemsArtRoll(3, 6, 1000);

		// Roll 1d6 times on Magic Item Table C.
		results.items = lootRoller(1, 6, "c");
		return results;
	}

	if(lootRoll <= 54){
		// 2d4 250 gp art
		results.art = gemsArtRoll(2, 4, 250);

		// Roll 1d4 times on Magic Item Table D.
		results.items = lootRoller(1, 4, "d");
		return results;
	}

	if(lootRoll <= 58){
		// 2d4 750 gp art
		results.art = gemsArtRoll(2, 4, 750);

		// Roll 1d4 times on Magic Item Table D.
		results.items = lootRoller(1, 4, "d");
		return results;
	}

	if(lootRoll <= 62){
		// 3d6 500 gp gems
		results.gems = gemsArtRoll(3, 6, 500);

		// Roll 1d4 times on Magic Item Table D.
		results.items = lootRoller(1, 4, "d");
		return results;
	}

	if(lootRoll <= 66){
		// 3d6 1000 gp gems
		results.gems = gemsArtRoll(3, 6, 1000);

		// Roll 1d4 times on Magic Item Table D.
		results.items = lootRoller(1, 4, "d");
		return results;
	}

	if(lootRoll <= 68){
		// 2d4 250 gp art
		results.art = gemsArtRoll(2, 4, 250);

		// Roll once on Magic Item Table E.
		results.items = lootRoller(1, 1, "e");
		return results;
	}

	if(lootRoll <= 70){
		// 2d4 750 gp art
		results.art = gemsArtRoll(2, 4, 750);

		// Roll once on Magic Item Table E.
		results.items = lootRoller(1, 1, "e");
		return results;
	}

	if(lootRoll <= 72){
		// 3d6 500 gp gems
		results.gems = gemsArtRoll(3, 6, 500);

		// Roll once on Magic Item Table E.
		results.items = lootRoller(1, 1, "e");
		return results;
	}

	if(lootRoll <= 74){
		// 3d6 1000 gp gems
		results.gems = gemsArtRoll(3, 6, 1000);

		// Roll once on Magic Item Table E.
		results.items = lootRoller(1, 1, "e");
		return results;
	}

	if(lootRoll <= 76){
		// 2d4 250 gp art
		results.art = gemsArtRoll(2, 4, 250);

		// Roll once on Magic Item Table F and 1d4 times on Magic Item Table G.
		results.items = lootRoller(1, 1, "f");
		return results;
	}

	if(lootRoll <= 78){
		// 2d4 750 gp art
		results.art = gemsArtRoll(2, 4, 750);

		// Roll once on Magic Item Table F and 1d4 times on Magic Item Table G.
		results.items = lootRoller(1, 1, "f");
		return results;
	}

	if(lootRoll <= 80){
		// 3d6 500 gp gems
		results.gems = gemsArtRoll(3, 6, 500);

		// Roll once on Magic Item Table F and 1d4 times on Magic Item Table G.
		results.items = lootRoller(1, 1, "f");
		return results;
	}

	if(lootRoll <= 82){
		// 3d6 1000 gp gems
		results.gems = gemsArtRoll(3, 6, 1000);

		// Roll once on Magic Item Table F and 1d4 times on Magic Item Table G.
		results.items = lootRoller(1, 1, "f");
		return results;
	}

	if(lootRoll <= 85){
		// 2d4 250 gp art
		results.art = gemsArtRoll(2, 4, 250);

		// Roll 1d4 times on Magic Item Table H.
		results.items = lootRoller(1, 4, "h");
		return results;
	}

	if(lootRoll <= 88){
		// 2d4 750 gp art
		results.art = gemsArtRoll(2, 4, 750);

		// Roll 1d4 times on Magic Item Table H.
		results.items = lootRoller(1, 4, "h");
		return results;
	}

	if(lootRoll <= 90){
		// 3d6 500 gp gems
		results.gems = gemsArtRoll(3, 6, 500);

		// Roll 1d4 times on Magic Item Table H.
		results.items = lootRoller(1, 4, "h");
		return results;
	}

	if(lootRoll <= 92){
		// 3d6 1000 gp gems
		results.gems = gemsArtRoll(3, 6, 1000);

		// Roll 1d4 times on Magic Item Table H.
		results.items = lootRoller(1, 4, "h");
		return results;
	}

	if(lootRoll <= 94){
		// 2d4 250 gp art
		results.art = gemsArtRoll(2, 4, 250);

		// Roll once on Magic Item Table I.
		results.items = lootRoller(1, 1, "i");
		return results;
	}

	if(lootRoll <= 96){
		// 2d4 750 gp art
		results.art = gemsArtRoll(2, 4, 750);

		// Roll once on Magic Item Table I.
		results.items = lootRoller(1, 1, "i");
		return results;
	}

	if(lootRoll <= 98){
		// 3d6 500 gp gems
		results.gems = gemsArtRoll(3, 6, 500);

		// Roll once on Magic Item Table I.
		results.items = lootRoller(1, 1, "i");
		return results;
	}

	if(lootRoll <= 100){
		// 3d6 1000 gp gems
		results.gems = gemsArtRoll(3, 6, 1000);

		// Roll once on Magic Item Table I.
		results.items = lootRoller(1, 1, "i");
		return results;
	}
}


module.exports = getLoot;