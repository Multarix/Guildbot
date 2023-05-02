const {
	GuildMember,
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	SlashCommandBuilder,
	Client,
	Message,
	ChatInputCommandInteraction,
	EmbedBuilder,
	PermissionsBitField,
	PermissionFlagsBits
} = require("discord.js");
const { handleElement, grabUser } = require("../src/functions.js");


// Buttons for interactions
const confirm = new ButtonBuilder().setStyle(ButtonStyle.Danger).setLabel("Kick User").setCustomId("kick_confirm");
const cancel = new ButtonBuilder().setStyle(ButtonStyle.Secondary).setLabel("Cancel").setCustomId("kick_cancel");
const buttons = new ActionRowBuilder().addComponents(cancel, confirm);


/**
 * @name handleComponent;
 * @param {Message} interactionReply
 * @param {ChatInputCommandInteraction} inputCommand
 * @param {EmbedBuilder} embed
 * @param {GuildMember} kickMember
 * @returns {Promise<Message>}
**/
async function handleComponent(interactionReply, inputCommand, embed, kickUser, reason){

	// Filter
	const f = (i) => {
		const userID = inputCommand.user?.id || inputCommand.author?.id;
		return i.user.id === userID;
	};

	// Functions for editing the embed
	const successKick = e => e.spliceFields(0, 1).setTitle(`Successfully kicked \`${kickUser.tag}\``);
	const cancelKick = e => e.spliceFields(0, 2).setTitle("Command canceled");
	const timeOut = e => e.spliceFields(0, 2).setTitle("Command timed out");
	const failKick = e => e.spliceFields(0, 2).setTitle(`Failed to kick \`${kickUser.tag}\``);

	try {
		const res = await interactionReply.awaitMessageComponent({ filter: f, time: 30000 });

		if(res.customId === "kick_cancel") return await res.update({ content: "", embeds: [cancelKick(embed)], components: [] });
		if(res.customId === "kick_confirm"){
			let failed = false;
			inputCommand.guild.members.kick(kickUser, reason).catch(() => { failed = true; });

			if(failed) return await res.update({ content: "", embeds: [failKick(embed)], components: [] });
			return await res.update({ content: "", embeds: [successKick(embed)], components: [] });
		}

	} catch (err){
		await interactionReply.edit({ content: "", embeds: [timeOut(embed)], components: [] });
	}
}


/**
 * @name kick
 * @param {Client} client The discord client
 * @param {Message|ChatInputCommandInteraction} element The message or interaction that was created
 * @param {String[]} args The arguments passed to the command
 * @returns {Promise<void>}
**/
async function run(client, element, args = []){

	const isSlashCommand = (element.type === 2) ? true : false;
	// if(isSlashCommand) await element.deferReply({ ephemeral: true }); // Defering breaks things

	const user = isSlashCommand ? element.user : element.author;

	// Check if the bot can even kick
	if(!element.channel.permissionsFor(element.guild.members.me).has(PermissionsBitField.Flags.KickMembers)) return await handleElement(element, isSlashCommand, { content: "I do not have permission to kick members.", ephemeral: true });

	// Grab the user to kick
	let kickUser = args.shift();
	if(!isSlashCommand) kickUser = await grabUser(client, kickUser);
	if(!kickUser) return await handleElement(element, isSlashCommand, { content: "No User/ Invalid User.\nPlease Specify a user to kick", ephemeral: true });

	// Check if the user is even in the server
	const kickMember = element.guild.members.cache.get(kickUser.id);
	if(!kickMember) return await handleElement(element, isSlashCommand, { content: "That user does not appear to be in the server.", ephemeral: true });
	if(kickMember.id === user.id) return handleElement(element, isSlashCommand, { content: "You cannot kick yourself.", ephemeral: true });

	// Check if the user is unkickable for some reason
	if(!kickMember.kickable) return await handleElement(element, isSlashCommand, { content: "I am unable to kick that user.", ephemeral: true });

	// Grab the reason
	let reason = args.join(" ");
	if(!reason) reason = "Not Specified";

	// Create the embed
	const embed = new EmbedBuilder()
		.setAuthor({ name: `${kickUser.tag} (${kickUser.id})`, iconURL: kickUser.displayAvatarURL() })
		.setColor(16750080)
		.setFooter({ text: user.tag, iconURL: user.displayAvatarURL() })
		.setTimestamp();

	const fields = [
		{ name: "Action:", value: "Kick", inline: false },
		{ name: "Reason:", value: reason, inline: false }
	];

	embed.addFields(fields);

	const msg = await handleElement(element, isSlashCommand, { embeds: [embed], components: [buttons], ephemeral: true });
	return handleComponent(msg, element, embed, kickUser, reason);
}


const info = {
	name: "kick",
	altNames: [],
	description: "Kicks a user from the server",
	usage: "kick <user> {reason}",
	enabled: true,
	dmCompatible: false,
	permLevel: 0,
	category: "moderation"
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
				.setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
				.addUserOption(option => option.setRequired(true).setName("user").setDescription("The user to kick"))
				.addStringOption(option => option.setRequired(false).setName("reason").setDescription("The reason for kicking the user"))
		};
	}

	return {
		/**
		 * @name execute
		 * @param {ChatInputCommandInteraction} interaction The interaction that was created
		 * @description The function that is called when the slash command is used
		**/
		execute: async function execute(interaction){
			const args = [];

			const user = interaction.options.getUser("user");
			args.push(user);

			const reason = interaction.options.getString("reason");
			if(reason) args.push(reason);

			await run(client, interaction, args);
		}
	};
}

module.exports = { run, slash, info };