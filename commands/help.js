const { SlashCommandBuilder, Client, Message, ChatInputCommandInteraction, EmbedBuilder } = require("discord.js");
const { permLevel, handleElement, caseFix } = require("../src/functions.js");


/**
 * @name help
 * @param {Client} client The discord client
 * @param {Message|ChatInputCommandInteraction} element The message or interaction that was created
 * @param {String[]} [args] The arguments passed to the command
 * @returns {Promise<void>}
**/
async function run(client, element, args = []){

	const isSlashCommand = (element.user) ? true : false;
	// if(isSlashCommand) await element.deferReply({ ephemeral: true }); // Don't need deferred here

	const user = (isSlashCommand) ? element.user : element.author;

	// Set up the Embed
	const embed = new EmbedBuilder()
		.setFooter({ text: client.user.tag, iconURL: client.user.displayAvatarURL() })
		.setTimestamp();

	// const iconURL = element?.guild?.iconURL();
	// if(iconURL) embed.setThumbnail(iconURL);

	let embedColor = false;
	if(element.member.roles.highest.color) embedColor = element.member.roles.highest.color;
	if(embedColor) embed.setColor(embedColor);

	const userPermLevel = permLevel(client, user, element.channel);

	if(args[0]){
		const command = client.commands.get(args[0]) || client.commands.get(client.aliases.get(args[0]));
		const permissionToRun = (command.info.permLevel <= userPermLevel);

		if(command && command.info.enabled && permissionToRun){
			const prefix = client.config.prefix;

			const title = caseFix(command.info.name);

			let aliases = "";
			if(command.info.altNames.length) aliases = command.info.altNames.join(" ");
			const commandInfo = `${command.info.description}\nAliases: \`${aliases}\``;
			const usage = `${prefix}${command.info.usage}`;
			const usageField = "\nExample Usage:\n```md\n" + usage + "```";

			const fullDesc = `${commandInfo}\n${usageField}`;

			embed.addFields([{ name: title, value: fullDesc, inline: false }]);
			return await handleElement(element, isSlashCommand, { embeds: [embed], ephemeral: true });
		}
	}

	// Get all the commands
	const commands = [...client.commands.values()];

	// Find the size of the longest command name
	const longest = commands.reduce((long, command) => Math.max(long, command.info.name.length), 0);

	// Sort everything into the correct categories
	const categories = {};
	for(const command of commands){
		// If the user can't even run the command, don't show it
		if(!command.info.enabled) continue;
		if(command.info.permLevel > userPermLevel) continue;
		// Pad the name with spaces so all the names line up at the same spot
		const paddedName = command.info.name.padEnd(longest, " ");

		// Split the commands into categories, creating the category if it doesn't exist
		const category = command.info.category;
		if(!categories[category]) categories[category] = [];

		categories[category].push(`\`${paddedName}  ➜\` ${command.info.description}`);
	}

	// Each category gets its own embedField
	const embedFields = [];
	for(const category of Object.keys(categories).sort()){
		const embedData = { name: category, value: categories[category].join("\n"), inline: false };
		embedFields.push(embedData);
	}

	embed.setAuthor({ name: `Commands for:  ${user.tag}`, iconURL: user.displayAvatarURL() })
		.setDescription(`**Commands available in** ${element.channel}\nUse \`${client.config.prefix}help {command}\` for details on a specific command.`)
		.addFields(embedFields);

	// If the command is a slash command
	if(isSlashCommand) return await element.reply({ embeds: [embed], ephemeral: true });

	// Otherwise send a DM to the user, and inform them in the channel that they have been DMed
	await user.send({ embeds: [embed] }).catch(e => { return; });
	await element.reply({ content: "I've sent you a DM with all of your available commands.\nIf you didn't receive one, please check your DM settings." });
}


const info = {
	name: "help",
	description: "Displays a list of commands",
	usage: "help {command}",
	enabled: true,
	altNames: ["h", "commands"],
	dmCompatible: true,
	permLevel: 0,
	category: "System"
};


/**
 * @name slash
 * @param {Client} client The discord client
 * @param {Boolean} [funcs] Whether to return the functions or the data
 * @returns {Object} The slash command data or functions
**/
function slash(client, funcs = false){
	if(!funcs){ // We want to get the slashCommand data
		return {
			data: new SlashCommandBuilder()
				.setName(info.name)
				.setDescription(info.description)
				.setDMPermission(false)
				.addStringOption(option => option.setRequired(false).setName("command").setDescription("The command to get help for"))
		};
	}

	return {
		/**
		 * @name execute
		 * @param {ChatInputCommandInteraction} interaction The interaction that was created
		 * @description The function that is called when the slash command is used
		**/
		execute: async function execute(interaction){
			let command = interaction.options.getString("command");
			command = command?.toString();

			const args = [];
			if(command){
				arguments = command.replace(/(?:\r\n|\r|\n)/g, "\u200b").split(/\s+/g);
				args.push(command);
			}

			await run(client, interaction, args);
		}
	};
}

module.exports = { run, slash, info };