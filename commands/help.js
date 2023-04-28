const { SlashCommandBuilder, Client, Message, Interaction, EmbedBuilder } = require("discord.js");

/**
 * @name help
 * @param {Client} client The discord client
 * @param {Message|Interaction} element The message or interaction that was created
 * @param {String[]} args The arguments passed to the command
 * @returns {Promise<void>}
**/
async function run(client, element, args = []){

	// Set the user who created the interaction/ message
	let user = element.author;
	if(!element.author) user = element.user;

	// Set up the Embed
	const embed = new EmbedBuilder()
		.setAuthor({ name: `Commands for:  ${user.tag}`, iconURL: user.displayAvatarURL() })
		.setDescription(`${element.channel}\nUse ${client.config.prefix}help <commandname> for more details`)
		.setFooter({ text: client.user.tag, iconURL: client.user.displayAvatarURL() })
		.setTimestamp();

	// const iconURL = element?.guild?.iconURL();
	// if(iconURL) embed.setThumbnail(iconURL);

	let embedColor = false;
	if(element.member.roles.highest.color) embedColor = element.member.roles.highest.color;
	if(embedColor) embed.setColor(embedColor);

	// Get all the commands
	const commands = [...client.commands.values()];

	// Find the size of the longest command name
	const longest = commands.reduce((long, command) => Math.max(long, command.info.name.length), 0);

	// Sort everything into the correct categories
	const categories = {};
	for(const command of commands){
		// If the user can't even run the command, don't show it
		if(!command.info.enabled) continue;
		if(command.info.permLevel > client.permLevel(user, element.channel)) continue;
		// Pad the name with spaces so all the names line up at the same spot
		const paddedName = command.info.name.padEnd(longest, " ");

		// Split the commands into categories, creating the category if it doesn't exist
		const category = command.info.category;
		if(!categories[category]) categories[category] = [];

		categories[category].push(`\`${paddedName} ➜\` ${command.info.description}`);
	}

	// Each category gets its own embedField
	const embedFields = [];
	for(const category in categories){
		const embedData = { name: category, value: categories[category].join("\n"), inline: false };
		embedFields.push(embedData);
	}

	embed.addFields(embedFields);

	// Send a DM to the user, and inform them in the channel that they have been DMed
	await user.send({ embeds: [embed] }).catch(e => { return; });
	await element.reply({ content: "I've sent you a DM with all of your available commands.\nIf you didn't receive one, please check your DM settings.", ephemeral: true }).catch(e => { return; });
}


const info = {
	name: "help",
	description: "Displays a list of commands",
	enabled: true,
	altNames: ["h", "commands"],
	dmCompatible: true,
	permLevel: 0,
	category: "System"
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