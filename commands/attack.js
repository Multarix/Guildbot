import { SlashCommandBuilder, Client, Message, ChatInputCommandInteraction } from "discord.js";


/**
 * @name attack
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
	name: "attack",
	altNames: ["damage", "dmg"],
	description: "Rolls for accuracy and damage of an attack",
	usage: "attack <weapon>",
	enabled: false,
	dmCompatible: false,
	permLevel: 0,
	category: "Dungeons & Dragons"
};


const slashData = new SlashCommandBuilder()
	.setName(info.name)
	.setDescription(info.description)
	.setDMPermission(info.dmCompatible);


/**
 * @name execute
 * @param {ChatInputCommandInteraction} interaction The interaction that was created
 * @description The function that is called when the slash command is used
**/
async function runSlash(client, interaction){
	await run(client, interaction);
}


export { run, slashData, runSlash, info };