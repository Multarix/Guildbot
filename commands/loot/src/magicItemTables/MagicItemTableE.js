function run(roll){
	if(roll <= 30) return { "name": "Spell Scroll (8th level)", "link":"https://www.dndbeyond.com/magic-items/spell-scroll" };
	if(roll <= 55) return { "name": "Potion of Storm Giant Strength", "link":"https://www.dndbeyond.com/magic-items/potion-of-giant-strength" };
	if(roll <= 70) return { "name": "Potion of Supreme Healing", "link":"https://www.dndbeyond.com/magic-items/potion-of-healing" };
	if(roll <= 85) return { "name": "Spell Scroll (9th level)", "link":"https://www.dndbeyond.com/magic-items/spell-scroll" };
	if(roll <= 93) return { "name": "Universal Solvent", "link":"https://www.dndbeyond.com/magic-items/universal-solvent" };
	if(roll <= 98) return { "name": "Arrow of Slaying", "link":"https://www.dndbeyond.com/magic-items/arrow-of-slaying" };
	return { "name": "Sovereign Glue", "link":"https://www.dndbeyond.com/magic-items/sovereign-glue" };
}


export default run;