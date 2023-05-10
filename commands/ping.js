import { SlashCommandBuilder, Client, Message, ChatInputCommandInteraction } from "discord.js";


/**
 * @name ping
 * @param {Client} client The discord client
 * @param {Message|ChatInputCommandInteraction} element The message or interaction that was created
 * @param {String[]} [_args] The arguments passed to the command
 * @returns {Promise<void>}
**/
async function run(client, element, _args = []){
	const sent = await element.reply({ content: 'Pinging...', fetchReply: true, ephemeral: true });

	const pingMessage = `Pong!: ${sent.createdTimestamp - element.createdTimestamp}ms\nHeartbeat ping is: ${Math.round(client.ws.ping)}ms`;
	if(element instanceof ChatInputCommandInteraction) return element.editReply({ content: pingMessage });

	return await sent.edit({ content: pingMessage });
}


const info = {
	name: "ping",
	altNames: ["discord"],
	description: "Gets the bot ping of the bot",
	usage: "ping",
	enabled: true,
	dmCompatible: true,
	permLevel: 0,
	category: "system"
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
				.setDMPermission(info.dmCompatible)
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

export { run, slash, info };