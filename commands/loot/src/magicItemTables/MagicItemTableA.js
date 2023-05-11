function roll(num){
	if(num <= 50) return { "name": "Potion of Healing", "link": "https://www.dndbeyond.com/magic-items/potion-of-healing" };
	if(num <= 60) return { "name": "Spell Scroll (Cantrip)", "link": "https://www.dndbeyond.com/magic-items/spell-scroll" };
	if(num <= 70) return { "name": "Potion of Climbing", "link": "https://www.dndbeyond.com/magic-items/potion-of-climbing" };
	if(num <= 90) return { "name": "Spell Scroll (1st level)", "link": "https://www.dndbeyond.com/magic-items/spell-scroll" };
	if(num <= 94) return { "name": "Spell Scroll (2nd level)", "link": "https://www.dndbeyond.com/magic-items/spell-scroll" };
	if(num <= 98) return { "name": "Potion of Greater Healing", "link": "https://www.dndbeyond.com/magic-items/potion-of-healing" };
	if(num <= 99) return { "name": "Bag of Holding", "link": "https://www.dndbeyond.com/magic-items/bag-of-holding" };
	return { "name": "Driftglobe", "link": "https://www.dndbeyond.com/magic-items/driftglobe" };
}


export default roll;

