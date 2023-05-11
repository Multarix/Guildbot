function roll(num){
	if(num <= 15) return { "name": "Potion of Superior Healing", "link":"https://www.dndbeyond.com/magic-items/potion-of-healing" };
	if(num <= 22) return { "name": "Spell Scroll (4th level)", "link":"https://www.dndbeyond.com/magic-items/spell-scroll" };
	if(num <= 27) return { "name": "+2 Ammunition", "link":"https://www.dndbeyond.com/magic-items/ammunition-2" };
	if(num <= 32) return { "name": "Potion of Clairvoyance", "link":"https://www.dndbeyond.com/magic-items/potion-of-clairvoyance" };
	if(num <= 37) return { "name": "Potion of Diminution", "link":"https://www.dndbeyond.com/magic-items/potion-of-diminution" };
	if(num <= 42) return { "name": "Potion of Gaseous Form", "link":"https://www.dndbeyond.com/magic-items/potion-of-gaseous-form" };
	if(num <= 47) return { "name": "Potion of Frost Giant Strength", "link":"https://www.dndbeyond.com/magic-items/potion-of-frost-giant-strength" };
	if(num <= 52) return { "name": "Potion of Fire Giant Strength", "link":"https://www.dndbeyond.com/magic-items/potion-of-fire-giant-strength" };
	if(num <= 57) return { "name": "Potion of Growth", "link":"https://www.dndbeyond.com/magic-items/potion-of-growth" };
	if(num <= 62) return { "name": "Potion of Stone Giant Strength", "link":"https://www.dndbeyond.com/magic-items/potion-of-stone-giant-strength" };
	if(num <= 67) return { "name": "Potion of Heroism", "link":"https://www.dndbeyond.com/magic-items/potion-of-heroism" };
	if(num <= 72) return { "name": "Potion of Invulnerability", "link":"https://www.dndbeyond.com/magic-items/potion-of-invulnerability" };
	if(num <= 77) return { "name": "Potion of Mind Reading", "link":"https://www.dndbeyond.com/magic-items/potion-of-mind-reading" };
	if(num <= 82) return { "name": "Spell Scroll (5th level)", "link":"https://www.dndbeyond.com/magic-items/spell-scroll" };
	if(num <= 87) return { "name": "Elixir of Health", "link":"https://www.dndbeyond.com/magic-items/elixir-of-health" };
	if(num <= 92) return { "name": "Oil of Etherealness", "link":"https://www.dndbeyond.com/magic-items/oil-of-etherealness" };
	if(num <= 95) return { "name": "Potion of Fire Breath", "link":"https://www.dndbeyond.com/magic-items/potion-of-fire-breath" };
	if(num <= 98) return { "name": "Potion of Resistance", "link":"https://www.dndbeyond.com/magic-items/potion-of-resistance" };
	if(num <= 99) return { "name": "Potion of Animal Friendship", "link":"https://www.dndbeyond.com/magic-items/potion-of-animal-friendship" };
	return { "name": "Potion of Water Breathing", "link":"https://www.dndbeyond.com/magic-items/potion-of-water-breathing" };
}


export default roll;
