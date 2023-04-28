const { SlashCommandBuilder, Client, Message, ChatInputCommandInteraction } = require("discord.js");

/**
 * @name info
 * @param {Client} _client The discord client
 * @param {Message|ChatInputCommandInteraction} element The message or interaction that was created
 * @param {String[]} _args The arguments passed to the command
 * @returns {Promise<void>}
**/

async function run(_client, element, _args = []){
	await element.reply({ content: "https://discordstatus.com/", ephemeral: true }).catch(e => { return; });
}

const info = {
	name: "server",
	description: "Posts the discord server link page",
	usage: "server",
	enabled: true,
	altNames: ["discord"],
	dmCompatible: true,
	permLevel: 0,
	category: "Misc"
};


/**
 * @name slash
 * @param {Client} client The discord client
 * @param {Boolean} [funcs=false] Whether to return the functions or the data
 * @returns {Object} The slash command data or functions
**/
function slash(client, funcs = false){
	if(!funcs){ // We don't want to get the functions
		return {
			data: new SlashCommandBuilder()
				.setName(info.name)
				.setDescription(info.description)
				.setDMPermission(false)
		};
	}

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

module.exports = { run, slash, info };