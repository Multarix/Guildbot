const { SlashCommandBuilder, Client, Message, Interaction } = require("discord.js");

/**
 * @name help
 * @param {Client} client The discord client
 * @param {Message|Interaction} element The message or interaction that was created
 * @param {String[]} args The arguments passed to the command
 * @returns {Promise<void>}
**/
async function run(client, element, args = []){

	let user = element.author;
	if(!element.author) user = element.user;

	const commandDesc = [];
	const commandNames = [...client.commands.keys()];
	for(const name in commandNames){
		const command = client.commands.get(commandNames[name]);
		commandDesc.push(`${client.config.prefix}${command.info.name} - ${command.info.description}`);
	}

	const joinCommannds = commandDesc.join("\n");
	const userCommands = "Commands:\n```\n" + joinCommannds + "\n```";
	await user.send({ content: userCommands }).catch(e => { return; });
	await element.reply({ content: "I've sent you a DM with all of your available commands.\nIf you didn't receive one, please check your DM settings.", ephemeral: true });
}


const info = {
	name: "help",
	description: "Displays a list of commands",
	enabled: true,
	altNames: ["h", "commands"],
	dmCompatible: true,
	permLevel: 0,
	category: "Misc"
};


const slash = {
	data:  new SlashCommandBuilder().setName(info.name).setDescription(info.description),
	async execute(client, interaction){
		run(client, interaction);
	}
};

module.exports = { run, slash, info };