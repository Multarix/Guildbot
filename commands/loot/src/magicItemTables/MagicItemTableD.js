function roll(num){
	if(num <= 20) return { "name": "Potion of Supreme Healing", "link":"https://www.dndbeyond.com/magic-items/potion-of-healing" };
	if(num <= 30) return { "name": "Potion of Invisibility", "link":"https://www.dndbeyond.com/magic-items/Potion-of-Invisibility" };
	if(num <= 40) return { "name": "Potion of Speed", "link":"https://www.dndbeyond.com/magic-items/Potion-of-Speed" };
	if(num <= 50) return { "name": "Spell Scroll (6th level)", "link":"https://www.dndbeyond.com/magic-items/spell-scroll" };
	if(num <= 57) return { "name": "Spell Scroll (7th level)", "link":"https://www.dndbeyond.com/magic-items/spell-scroll" };
	if(num <= 62) return { "name": "+3 Ammunition", "link":"https://www.dndbeyond.com/magic-items/ammunition-3" };
	if(num <= 67) return { "name": "Oil of Sharpness", "link":"https://www.dndbeyond.com/magic-items/oil-of-sharpness" };
	if(num <= 72) return { "name": "Potion of Flying", "link":"https://www.dndbeyond.com/magic-items/potion-of-flying" };
	if(num <= 77) return { "name": "Potion of Cloud Giant Strength", "link":"https://www.dndbeyond.com/magic-items/potion-of-giant-strength" };
	if(num <= 82) return { "name": "Potion of Longevity", "link":"https://aversten.obsidianportal.com/wiki_pages/potion-of-longevity" };
	if(num <= 87) return { "name": "Potion of Vitality", "link":"https://www.dndbeyond.com/magic-items/potion-of-vitality" };
	if(num <= 92) return { "name": "Spell Scroll (8th level)", "link":"https://www.dndbeyond.com/magic-items/spell-scroll" };
	if(num <= 95) return { "name": "Horseshoes of a Zephyr", "link":"https://www.dndbeyond.com/magic-items/horseshoes-of-a-zephyr" };
	if(num <= 98) return { "name": "Nolzur's Marvelous Pigments", "link":"https://www.dndbeyond.com/magic-items/nolzurs-marvelous-pigments" };
	if(num <= 99) return { "name": "Bag of Devouring", "link":"https://www.dndbeyond.com/magic-items/bag-of-devouring" };
	return { "name": "Portable Hole", "link":"https://www.dndbeyond.com/magic-items/portable-hole" };
}


export default roll;