const { Client, Interaction, PermissionsBitField } = require("discord.js");

/**
 * @name interactionCreate
 * @param {Client} client The discord client
 * @param {Interaction} interaction The interaction that was created
 * @description Emitted whenever an interaction is created.
 * @returns {Promise<void>}
**/
async function run(client, interaction){

	if(!interaction.isChatInputCommand()) return;
	if(interaction.channel.type === "DM") return;

	if(!interaction.channel.permissionsFor(interaction.guild.members.me).has([PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ViewChannel])) return;

	const command = client.commands.get(interaction.commandName);
	if(!command) return client.output("error", `Command ${interaction.commandName} not found!`);

	// Check if the command is enabled
	if(!command.info.enabled) return;

	// Check if the user has permission to run the command
	const userPermLevel = client.permLevel(interaction.user, interaction.channel);
	if(command.info.permLevel > userPermLevel) return;

	try {
		await command.slash.execute(client, interaction);
	} catch (e){
		client.output("error", e);
		let followUp = false;
		if(interaction.replied || interaction.deferred){
			await interaction.followUp({ content: "An error occurred while executing this command!", ephemeral: true });
			followUp = true;
		}

		if(!followUp) await interaction.reply({ content: "An error occurred while executing this command!", ephemeral: true });
	}
}

const info = {
	name: "interactionCreate",
	description: "Emitted whenever an interaction is created.",
	enabled: true
};

module.exports = { run, info };