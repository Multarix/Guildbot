function roll(num){
	if(num <= 15) return { "name": "Potion of Greater Healing", "link": "https://www.dndbeyond.com/magic-items/potion-of-healing" };
	if(num <= 22) return { "name": "Potion of Fire Breath", "link": "https://aversten.obsidianportal.com/wiki_pages/potion-of-fire-breath" };
	if(num <= 29) return { "name": "Potion of Resistance", "link": "https://www.dndbeyond.com/magic-items/potion-of-resistance" };
	if(num <= 34) return { "name": "+1 Ammunition", "link": "https://www.dndbeyond.com/magic-items/ammunition-1" };
	if(num <= 39) return { "name": "Potion of Animal Friendship", "link": "https://www.dndbeyond.com/magic-items/potion-of-animal-friendship" };
	if(num <= 44) return { "name": "Potion of Hill Giant Strength", "link": "https://www.dndbeyond.com/magic-items/potion-of-giant-strength" };
	if(num <= 49) return { "name": "Potion of Growth", "link": "https://www.dndbeyond.com/magic-items/potion-of-growth" };
	if(num <= 54) return { "name": "Potion of Water Breathing", "link": "https://www.dndbeyond.com/magic-items/potion-of-water-breathing" };
	if(num <= 59) return { "name": "Spell Scroll (2nd level)", "link": "https://www.dndbeyond.com/magic-items/spell-scroll" };
	if(num <= 64) return { "name": "Spell Scroll (3rd level)", "link": "https://www.dndbeyond.com/magic-items/spell-scroll" };
	if(num <= 67) return { "name": "Bag of Holding", "link": "https://www.dndbeyond.com/magic-items/bag-of-holding" };
	if(num <= 70) return { "name": "Keoghtom's Ointment", "link": "https://www.dndbeyond.com/magic-items/keoghtoms-ointment" };
	if(num <= 73) return { "name": "Oil of Slipperiness", "link": "https://www.dndbeyond.com/magic-items/oil-of-slipperiness" };
	if(num <= 75) return { "name": "Dust of Disappearance", "link": "https://www.dndbeyond.com/magic-items/dust-of-disappearance" };
	if(num <= 77) return { "name": "Dust of Dryness", "link": "https://www.dndbeyond.com/magic-items/dust-of-dryness" };
	if(num <= 79) return { "name": "Dust of Sneezing and Choking", "link": "https://www.dndbeyond.com/magic-items/dust-of-sneezing-and-choking" };
	if(num <= 81) return { "name": "Elemental Gem", "link": "https://www.dndbeyond.com/magic-items/elemental-gem" };
	if(num <= 83) return { "name": "Philter of Love", "link": "https://www.dndbeyond.com/magic-items/philter-of-love" };
	if(num <= 84) return { "name": "Alchemy Jug", "link": "https://www.dndbeyond.com/magic-items/alchemy-jug" };
	if(num <= 85) return { "name": "Cap of Water Breathing", "link": "https://www.dndbeyond.com/magic-items/cap-of-water-breathing" };
	if(num <= 86) return { "name": "Cloak of the Manta Ray", "link": "https://www.dndbeyond.com/magic-items/cloak-of-the-manta-ray" };
	if(num <= 87) return { "name": "Driftglobe", "link": "https://www.dndbeyond.com/magic-items/driftglobe" };
	if(num <= 88) return { "name": "Goggles of Night", "link": "https://www.dndbeyond.com/magic-items/goggles-of-night" };
	if(num <= 89) return { "name": "Helm of Comprehending Languages", "link": "https://www.dndbeyond.com/magic-items/helm-of-comprehending-languages" };
	if(num <= 90) return { "name": "Immovable Rod", "link": "https://www.dndbeyond.com/magic-items/immovable-rod" };
	if(num <= 91) return { "name": "Lantern of Revealing", "link": "https://www.dndbeyond.com/magic-items/lantern-of-revealing" };
	if(num <= 92) return { "name": "Mariner's Armor", "link": "https://www.dndbeyond.com/magic-items/mariners-armor" };
	if(num <= 93) return { "name": "Mithral Armor", "link": "https://www.dndbeyond.com/magic-items/mithral-armor" };
	if(num <= 94) return { "name": "Potion of Poison", "link": "https://www.dndbeyond.com/magic-items/potion-of-poison" };
	if(num <= 95) return { "name": "Ring of Swimming", "link": "https://www.dndbeyond.com/magic-items/ring-of-swimming" };
	if(num <= 96) return { "name": "Robe of Useful Items", "link": "https://www.dndbeyond.com/magic-items/robe-of-useful-items" };
	if(num <= 97) return { "name": "Rope of Climbing", "link": "https://www.dndbeyond.com/magic-items/rope-of-climbing" };
	if(num <= 98) return { "name": "Saddle of the Cavalier", "link": "https://www.dndbeyond.com/magic-items/saddle-of-the-cavalier" };
	if(num <= 99) return { "name": "Wand of Magic Detection", "link": "https://www.dndbeyond.com/magic-items/wand-of-magic-detection" };
	return { "name": "Wand of Secrets", "link": "https://www.dndbeyond.com/magic-items/wand-of-secrets" };
}


export default roll;