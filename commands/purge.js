const { SlashCommandBuilder, Client, Message, ChatInputCommandInteraction, PermissionsBitField, PermissionFlagsBits } = require("discord.js");

/**
 * @name help
 * @param {Client} _client The discord client
 * @param {Message|ChatInputCommandInteraction} element The message or interaction that was created
 * @param {String[]} [args] The arguments passed to the command
 * @returns {Promise<void>}
**/
async function run(_client, element, args = []){

	const botCanDelete = element.channel.permissionsFor(element.guild.members.me).has(PermissionsBitField.Flags.ManageMessages);
	if(!botCanDelete) return await element.reply({ content: "I do not have permission to delete messages in this channel", ephemeral: true });

	let slashCommand = false;
	if(!element.author) slashCommand = true;

	if(!args[0]) return;
	if(!parseInt(args[0])) return element.reply({ content: `Oops! \`${args[0]}\` Doesn't seem to be a number!` });

	const messagecount = parseInt(args[0]);
	let toDelete = messagecount;
	if(!slashCommand) toDelete += 1;
	if(toDelete >= 101) toDelete = 100;

	let success = true;
	element.channel.messages.fetch({ limit: toDelete }).then(messages => element.channel.bulkDelete(messages, true)).catch(e => {
		success = false;
		return element.reply({ content: `\`Error:\` ${e.message}`, ephemeral: true });
	});

	if(slashCommand) element.reply({ content: `Successfully deleted ${toDelete} messages`, ephemeral: true });
}


const info = {
	name: "purge",
	description: "Mass deletes a specified amount of messages",
	usage: "purge [number]",
	enabled: true,
	altNames: ["md", "massdelete"],
	dmCompatible: false,
	permLevel: 2,
	category: "Moderation"
};

/**
 * @name slash
 * @param {Client} client The discord client
 * @param {Boolean} [funcs=false] Whether to return the functions or the data
 * @returns {Object} The slash command data or functions
**/
function slash(client, funcs = false){
	if(!funcs){ // We want to get the slashCommand data
		return {
			data: new SlashCommandBuilder()
				.setName(info.name)
				.setDescription(info.description)
				.setDMPermission(false)
				.setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
				.addIntegerOption(option =>
					option.setRequired(true)
						.setName("number")
						.setDescription("The ammount of messages to delete")
						.setMinValue(1)
						.setMaxValue(100)
				)
		};
	}

	return {
		/**
		 * @name execute
		 * @param {ChatInputCommandInteraction} interaction The interaction that was created
		 * @description The function that is called when the slash command is used
		**/
		execute: async function execute(interaction){
			let command = interaction.options.getInteger("number");
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