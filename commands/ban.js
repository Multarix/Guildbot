import Discord, {
	GuildMember,
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	SlashCommandBuilder,
	Client,
	Message,
	ChatInputCommandInteraction,
	EmbedBuilder
} from "discord.js";

import { handleElement, grabUser } from "../src/functions.js";
const { PermissionFlagsBits } = Discord;

// Buttons for interactions
const confirm = new ButtonBuilder().setStyle(ButtonStyle.Danger).setLabel("Ban User").setCustomId("ban_confirm");
const cancel = new ButtonBuilder().setStyle(ButtonStyle.Secondary).setLabel("Cancel").setCustomId("ban_cancel");
const buttons = new ActionRowBuilder().addComponents(cancel, confirm);


/**
 * @name handleComponent;
 * @param {Message} interactionReply
 * @param {ChatInputCommandInteraction} inputCommand
 * @param {EmbedBuilder} embed
 * @param {GuildMember} kickMember
 * @returns {Promise<Message>}
**/
async function handleComponent(interactionReply, inputCommand, embed, banUser, reason){

	// Filter
	const f = (i) => {
		const userID = inputCommand.user?.id || inputCommand.author?.id;
		return i.user.id === userID;
	};

	// Functions for editing the embed
	const successKick = e => e.spliceFields(0, 1).setTitle(`Successfully banned \`${banUser.username}\``);
	const cancelKick = e => e.spliceFields(0, 2).setTitle("Command canceled");
	const timeOut = e => e.spliceFields(0, 2).setTitle("Command timed out");
	const failBan = e => e.spliceFields(0, 2).setTitle(`Failed to ban \`${banUser.username}\``);

	try {
		const res = await interactionReply.awaitMessageComponent({ filter: f, time: 30000 });

		if(res.customId === "ban_cancel") return await res.update({ content: "", embeds: [cancelKick(embed)], components: [] });
		if(res.customId === "ban_confirm"){
			let failed = false;
			inputCommand.guild.members.ban(banUser, { reason }).catch(() => { failed = true; });

			if(failed) return await res.update({ content: "", embeds: [failBan(embed)], components: [] });
			return await res.update({ content: "", embeds: [successKick(embed)], components: [] });
		}

	} catch (err){
		await interactionReply.edit({ content: "", embeds: [timeOut(embed)], components: [] });
	}
}


/**
 * @name ban
 * @param {Client} client The discord client
 * @param {Message|ChatInputCommandInteraction} element The message or interaction that was created
 * @param {String[]} [args] The arguments passed to the command
 * @returns {Promise<void>}
**/
async function run(client, element, args = []){

	const isSlashCommand = (element instanceof ChatInputCommandInteraction) ? true : false;
	// if(isSlashCommand) await element.deferReply({ ephemeral: true }); // Defering breaks things

	const user = isSlashCommand ? element.user : element.author;

	// Check if the bot can even kick
	if(!element.channel.permissionsFor(element.guild.members.me).has(PermissionsBitField.Flags.BanMembers)) return await handleElement(element, isSlashCommand, { content: "I do not have permission to kick members.", ephemeral: true });

	// Grab the user to kick
	let banUser = args.shift();
	if(!isSlashCommand) banUser = await grabUser(client, banUser);
	if(!banUser) return await handleElement(element, isSlashCommand, { content: "No User/ Invalid User.\nPlease Specify a user to ban", ephemeral: true });

	// Check if the user is in the server
	const banMember = element.guild.members.cache.get(banUser.id);
	// Check if the user is unbannable for some reason
	if(banMember && !banMember.kickable) return await handleElement(element, isSlashCommand, { content: "I am unable to ban that user.", ephemeral: true });

	// Grab the reason
	let reason = args.join(" ");
	if(!reason) reason = "Not Specified";

	// Create the embed
	const embed = new EmbedBuilder()
		.setAuthor({ name: `${banUser.username} (${banUser.id})`, iconURL: banUser.displayAvatarURL() })
		.setColor(16750080)
		.setFooter({ text: user.username, iconURL: user.displayAvatarURL() })
		.setTimestamp();

	const fields = [
		{ name: "Action:", value: "Ban", inline: false },
		{ name: "Reason:", value: reason, inline: false }
	];

	embed.addFields(fields);

	const msg = await handleElement(element, isSlashCommand, { embeds: [embed], components: [buttons], ephemeral: true });
	return handleComponent(msg, element, embed, banUser, reason);
}


const info = {
	name: "ban",
	altNames: [],
	description: "Bans a user from the server",
	usage: "ban <user> {reason}",
	enabled: true,
	dmCompatible: false,
	permLevel: 6,
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
				.setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
				.addUserOption(option => option.setRequired(true).setName("user").setDescription("The user to ban"))
				.addStringOption(option => option.setRequired(false).setName("reason").setDescription("The reason for banning the user"))
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

export { run, slash, info };