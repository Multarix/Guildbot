const { SlashCommandBuilder, Client, Message, Interaction, EmbedBuilder } = require("discord.js");


/**
 * @name info
 * @param {Client} client The discord client
 * @param {Message|Interaction} element The message or interaction that was created
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
	enabled: false,
	altNames: ["stats"],
	dmCompatible: false,
	permLevel: 1,
	category: "System"
};

const slash = {
	data: new SlashCommandBuilder()
		.setName(info.name)
		.setDescription(info.description)
		.setDMPermission(false),
	async execute(client, interaction){
		await run(client, interaction);
	}
};

module.exports = { run, slash, info };