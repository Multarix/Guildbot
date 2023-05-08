/**
 * @typedef {object} activity
 * @property {string} name
 * @property {0|1|2|3|5} type
**/
/**
 * @typedef {object} presence
 * @property {"online"|"idle"|"invisible"|"dnd"} status
 * @property {boolean} afk
 * @property {activity[]} activities
**/


/**
 * @name getActivity
 * @param {*} client
 * @returns {presence}
**/
function getActivity(client){
	// Magic Numbers
	const COMPETING = 5;
	// const CUSTOM = 4; // Can't be used with bots
	const WATCHING = 3;
	const LISTENING = 2;
	const STREAMING = 1;
	const PLAYING = 0;

	let presence;
	switch(client.user.id){
		case "304230184494563329": // D&D Bot
			presence = {
				status: "online",
				afk: false,
				activities: [{
					name: `with ${client.guilds.cache.size} ${(client.guilds.cache.size > 1) ? "die" : "dice"} 🎲 | ${client.config.prefix}help`,
					type: PLAYING
				}]
			};
			break;

		case "628082697553575941": // Beta Bot
			presence = {
				status: "online",
				afk: false,
				activities: [{
					name: `for errors 🔧 | ${client.config.prefix}help`,
					type: WATCHING
				}]
			};
			break;

		default:
			presence = {
				status: "online",
				afk: false,
				activities: [{
					name: `${client.guilds.cache.size} server${(client.guilds.cache.size > 1) ? "s" : ""} | ${client.config.prefix}help`,
					type: COMPETING
				}]
			};
	}

	return presence;
}

module.exports = getActivity;