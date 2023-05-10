import { Client, Message } from "discord.js";
import { output } from "../src/functions.js";


/**
 * @name reboot
 * @param {Client} client The discord client
 * @param {Message} element The message or interaction that was created
 * @param {String[]} [_args] The arguments passed to the command
 * @returns {Promise<void>}
**/
async function run(client, element, _args = []){
	let good = client.emojis.cache.get("340357918996299778");
	if(!good) good = "👍";

	output("misc", "Perfmorming manual reboot...");
	await element.react(good);

	process.exit();
}


const info = {
	name: "reboot",
	altNames: ["restart"],
	description: "Restarts the bot",
	usage: "reboot",
	enabled: true,
	dmCompatible: true,
	permLevel: 100,
	category: "debug"
};


/**
 * @name slash
 * @param {Client} client The discord client
 * @param {Boolean} [funcs] Whether to return the functions or the data
 * @returns {Object} The slash command data or functions
**/
function slash(client, funcs = false){
	// if(!funcs){ // We want to get the slash command data
	// 	return {
	// 		data: new SlashCommandBuilder()
	// 			.setName(info.name)
	// 			.setDescription(info.description)
	// 			.setDMPermission(false)
	// 	};
	// }

	return {
		/**
		 * @name execute
		 * @param {ChatInputCommandInteraction} interaction The interaction that was created
		 * @description The function that is called when the slash command is used
		**/
		execute: async function execute(interaction){
			await run(client, interaction);
		}
	};
}

export { run, slash, info };