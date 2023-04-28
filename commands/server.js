const { SlashCommandBuilder, Client, Message, Interaction } = require("discord.js");

/**
 * @name info
 * @param {Client} _client The discord client
 * @param {Message|Interaction} element The message or interaction that was created
 * @param {String[]} _args The arguments passed to the command
 * @returns {Promise<void>}
**/

async function run(_client, element, _args = []){
	await element.reply({ content: "https://discordstatus.com/", ephemeral: true }).catch(e => { return; });
}

const info = {
	name: "server",
	description: "Posts the discord server link page",
	enabled: true,
	altNames: ["discord"],
	dmCompatible: true,
	permLevel: 0,
	category: "Misc"
};

const slash = {
	data:  new SlashCommandBuilder()
		.setName(info.name)
		.setDescription(info.description)
		.setDMPermission(false),
	async execute(client, interaction){
		await run(client, interaction);
	}
};

module.exports = { run, slash, info };