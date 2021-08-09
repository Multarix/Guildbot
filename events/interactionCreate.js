module.exports = async (client, interaction) => {
	if(!interaction.isCommand()) return;
	console.log(interaction);

	if(interaction.commandName === 'test'){
		await interaction.reply('Hello World');
	}
};



module.exports.help = {
	name: "messageCreate",
	description: "Emitted when a user sends a message"
};
