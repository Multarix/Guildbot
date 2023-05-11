import numberGenerator from "../helperFunctions/numberGenerator.js";
const d12 = numberGenerator.bind(null, 1, 12);


function roll(num){
	if(num <= 5) return { "name": "Defender", "link":"https://www.dndbeyond.com/magic-items/defender" };
	if(num <= 10) return { "name": "Hammer of Thunderbolts", "link":"https://www.dndbeyond.com/magic-items/hammer-of-thunderbolts" };
	if(num <= 20) return { "name": "Sword of Answering", "link":"https://aversten.obsidianportal.com/wiki_pages/sword-of-answering" };
	if(num <= 23) return { "name": "Holy Avenger", "link":"https://www.dndbeyond.com/magic-items/holy-avenger" };
	if(num <= 26) return { "name": "Ring of Djinni Summoning", "link":"https://www.dndbeyond.com/magic-items/ring-of-djinni-summoning" };
	if(num <= 29) return { "name": "Ring of Invisibility", "link":"https://www.dndbeyond.com/magic-items/ring-of-invisibility" };
	if(num <= 32) return { "name": "Ring of Spell Turning", "link":"https://www.dndbeyond.com/magic-items/ring-of-spell-turning" };
	if(num <= 38) return { "name": "Rod of Lordly Might", "link":"https://www.dndbeyond.com/magic-items/rod-of-lordly-might" };
	if(num <= 41) return { "name": "Vorpal Sword", "link":"https://www.dndbeyond.com/magic-items/vorpal-sword" };
	if(num <= 43) return { "name": "Belt of Cloud Giant Strength", "link":"https://www.dndbeyond.com/magic-items/belt-of-cloud-giant-strength" };
	if(num <= 45) return { "name": "Armor, +2 Breastplate", "link":"https://www.dndbeyond.com/magic-items/armor-2" };
	if(num <= 47) return { "name": "Armor, +3 Chain Mail", "link":"https://www.dndbeyond.com/magic-items/armor-3" };
	if(num <= 49) return { "name": "Armor, +3 Chain Shirt", "link":"https://www.dndbeyond.com/magic-items/armor-3" };
	if(num <= 51) return { "name": "Cloak of Invisibility", "link":"https://aversten.obsidianportal.com/wiki_pages/cloak-of-invisibility" };
	if(num <= 53) return { "name": "Crystal Ball (Legendary Version)", "link":"https://www.dndbeyond.com/magic-items/crystal-ball" };
	if(num <= 55) return { "name": "Armor, +1 Half Plate", "link":"https://www.dndbeyond.com/magic-items/armor-1" };
	if(num <= 57) return { "name": "Iron Flask", "link":"https://www.dndbeyond.com/magic-items/iron-flask" };
	if(num <= 59) return { "name": "Armor, +3 Leather", "link":"https://www.dndbeyond.com/magic-items/armor-3" };
	if(num <= 61) return { "name": "Armor, +1 Plate", "link":"https://www.dndbeyond.com/magic-items/armor-1" };
	if(num <= 63) return { "name": "Robe of the Archmagi", "link":"https://www.dndbeyond.com/magic-items/robe-of-the-archmagi" };
	if(num <= 65) return { "name": "Rod of Resurrection", "link":"https://www.dndbeyond.com/magic-items/rod-of-resurrection" };
	if(num <= 67) return { "name": "Armor, +1 Scale Mail", "link":"https://www.dndbeyond.com/magic-items/armor-1" };
	if(num <= 69) return { "name": "Scarab of Protection", "link":"https://www.dndbeyond.com/magic-items/scarab-of-protection" };
	if(num <= 71) return { "name": "Armor, +2 Splint", "link":"https://www.dndbeyond.com/magic-items/armor-2" };
	if(num <= 73) return { "name": "Armor, +2 Studded Leather", "link":"https://www.dndbeyond.com/magic-items/armor-2" };
	if(num <= 75) return { "name": "Well of Many Worlds", "link":"https://www.dndbeyond.com/magic-items/well-of-many-worlds" };
	if(num <= 76) return { "name": "Magic Armor (Roll 1d12)", "link":"https://www.dndbeyond.com/sources/dmg/treasure#MagicItemTableH" };
	if(num <= 77) return { "name": "Apparatus of Kwalish", "link":"https://aversten.obsidianportal.com/wiki_pages/apparatus-of-kwalish" };
	if(num <= 78) return { "name": "Armor of Invulnerability", "link":"https://www.dndbeyond.com/magic-items/armor-of-invulnerability" };
	if(num <= 79) return { "name": "Belt of Storm Giant Strength", "link":"https://www.dndbeyond.com/magic-items/belt-of-storm-giant-strength" };
	if(num <= 80) return { "name": "Cubic Gate", "link":"https://www.dndbeyond.com/magic-items/cubic-gate" };
	if(num <= 81) return { "name": "Deck of Many Things", "link":"https://www.dndbeyond.com/magic-items/deck-of-many-things" };
	if(num <= 82) return { "name": "Efretti Chain", "link":"https://www.dndbeyond.com/magic-items/efreeti-chain" };
	if(num <= 83) return { "name": "Armor of Resistance (Half Plate)", "link":"https://www.dndbeyond.com/magic-items/armor-of-resistance" };
	if(num <= 84) return { "name": "Horn of Valhalla (Iron)", "link":"https://www.dndbeyond.com/magic-items/horn-of-valhalla" };
	if(num <= 85) return { "name": "Instrument of the Bards (Ollamh Harp)", "link":"https://aversten.obsidianportal.com/wiki_pages/instrument-of-the-bards" };
	if(num <= 86) return { "name": "Ioun Stone (Greater Absorption)", "link":"https://www.dndbeyond.com/magic-items/ioun-stone-of-greater-absorption" };
	if(num <= 87) return { "name": "Ioun Stone (Mastery)", "link":"https://www.dndbeyond.com/magic-items/ioun-stone-of-mastery" };
	if(num <= 88) return { "name": "Ioun Stone (Regneration)", "link":"https://www.dndbeyond.com/magic-items/ioun-stone-of-regeneration" };
	if(num <= 89) return { "name": "Plate Armor of Etherealness", "link":"https://www.dndbeyond.com/magic-items/plate-armor-of-etherealness" };
	if(num <= 90) return { "name": "Plate Armor of Resistance", "link":"https://www.dndbeyond.com/magic-items/plate-armor-of-resistance" };
	if(num <= 91) return { "name": "Ring of Air Elemental Command", "link":"https://www.dndbeyond.com/magic-items/ring-of-air-elemental-command" };
	if(num <= 92) return { "name": "Ring of Earth Elemental Command", "link":"https://www.dndbeyond.com/magic-items/ring-of-earth-elemental-command" };
	if(num <= 93) return { "name": "Ring of Fire Elemental Command", "link":"https://www.dndbeyond.com/magic-items/ring-of-fire-elemental-command" };
	if(num <= 94) return { "name": "Ring of Three Wishes", "link":"https://www.dndbeyond.com/magic-items/ring-of-three-wishes" };
	if(num <= 95) return { "name": "Ring of Water Elemental Command", "link":"https://www.dndbeyond.com/magic-items/ring-of-water-elemental-command" };
	if(num <= 96) return { "name": "Sphere of Annihilation", "link":"https://www.dndbeyond.com/magic-items/sphere-of-annihilation" };
	if(num <= 97) return { "name": "Talisman of Pure Good", "link":"https://www.dndbeyond.com/magic-items/talisman-of-pure-good" };
	if(num <= 98) return { "name": "Talisman of the Sphere", "link":"https://www.dndbeyond.com/magic-items/talisman-of-the-sphere" };
	if(num <= 99) return { "name": "Talisman of Ultimate Evil", "link":"https://www.dndbeyond.com/magic-items/talisman-of-ultimate-evil" };
	return { "name": "Tome of the Stilled Tongue", "link":"https://www.dndbeyond.com/magic-items/tome-of-the-stilled-tongue" };
}


export default roll;