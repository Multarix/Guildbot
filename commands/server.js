const { SlashCommandBuilder, Client, Message, ChatInputCommandInteraction } = require("discord.js");


/**
 * @name server
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
	altNames: ["discord"],
	description: "Posts the discord server link page",
	usage: "server",
	enabled: true,
	dmCompatible: true,
	permLevel: 0,
	category: "misc"
};


/**
 * @name slash
 * @param {Client} client The discord client
 * @param {Boolean} [funcs] Whether to return the functions or the data
 * @returns {Object} The slash command data or functions
**/
function slash(client, funcs = false){
	if(!funcs){ // We want to get the slash command data
		return {
			data: new SlashCommandBuilder()
				.setName(info.name)
				.setDescription(info.description)
				.setDMPermission(true)
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