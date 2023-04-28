const { SlashCommandBuilder, Client, Message, ChatInputCommandInteraction, EmbedBuilder } = require("discord.js");


/**
 * @name info
 * @param {Client} client The discord client
 * @param {Message|ChatInputCommandInteraction} element The message or interaction that was created
 * @param {String[]} _args The arguments passed to the command
 * @returns {Promise<void>}
**/
async function run(client, element, _args = []){

	const embed = new EmbedBuilder()
		.setAuthor({ name: `Bot Stats` })
		.setColor(13238272)
		.setThumbnail(client.user.displayAvatarURL())
		.setFooter({ text: client.user.tag, iconURL: client.user.displayAvatarURL() })
		.setTimestamp();

	const embedFields = [
		{ name: "Users",		value: client.users.cache.size.toLocaleString(), 		inline: true },
		{ name: "Channels",		value: client.channels.cache.size.toLocaleString(), 	inline: true },
		{ name: "Servers",		value: client.guilds.cache.size.toLocaleString(), 		inline: true }
	];

	embed.addFields(embedFields);

	return element.reply({ embeds: [embed] });
}

const info = {
	name: "info",
	description: "Gives some useful bot statistics",
	usage: "info",
	enabled: false,
	altNames: ["stats"],
	dmCompatible: false,
	permLevel: 1,
	category: "System"
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