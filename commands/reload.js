import { Client, Message } from "discord.js";
import { output } from "../src/functions.js";


/**
 * @name reload
 * @param {Client} client The discord client
 * @param {Message} element The message or interaction that was created
 * @param {String[]} [args] The arguments passed to the command
 * @returns {Promise<void>}
**/
async function run(client, element, args = []){
	if(!args[0] || args.size < 1) return element.reply({ content: `Usage: \`${client.config.prefix}reload <command>\`` });

	const commandName = args[0].toLowerCase();

	let command = undefined;
	if(client.commands.has(commandName)) command = client.commands.get(commandName);
	if(client.altNames.has(commandName)) command = client.commands.get(client.altNames.get(commandName));

	if(!command) return element.reply({ content: `The command \`${commandName}\` doesn't exist, nor is it an alias.` });

	command = command.info.fileName;

	try {
	// Delete the command from the cache and maps
		delete require.cache[require.resolve(`./${command}`)];
		client.commands.delete(command);
		for(const [cmdName, alias] of client.altNames){
			if(cmdName === command) client.altNames.delete(alias);
		}

		// Re-add the command to the cache and maps
		const cmd = require(`./${command}`);
		cmd.info.fileName = command;

		client.commands.set(cmd.info.name, cmd);
		cmd.info.altNames.forEach(alias => client.altNames.set(alias, cmd.info.name));

		output(client, "good", `The command '${command}' was reloaded.`);

		const msg = await element.reply({ content: `The command \`${command}\` was reloaded.` });

		if(msg.deletable) setTimeout(() => msg.delete(), 5000);
		if(element.deletable) setTimeout(() => element.delete(), 5000);
	} catch (err){
		output(client, "error", `There was an error while reloading a command \`${command}\`:\n${err}`);
		const msg = await element.reply({ content: `There was an error while reloading a command \`${command}\`` });

		if(msg.deletable) setTimeout(() => msg.delete(), 5000);
		if(element.deletable) setTimeout(() => element.delete(), 5000);

	}
}


const info = {
	name: "reload",
	altNames: [],
	description: "Reloads commands",
	usage: "reload <command>",
	enabled: false,
	dmCompatible: true,
	permLevel: 100,
	category: "debug"
};


/**
 * @name slash
 * @param {Client} client The discord client
 * @param {Boolean} [funcs] Whether to return the functions or the data
 * @returns {Object} The slash command data or functions
**/
function slash(client, funcs = false){
	// if(!funcs){ // We want to get the slash command data
	// 	return {
	// 		data: new SlashCommandBuilder()
	// 			.setName(info.name)
	// 			.setDescription(info.description)
	// 			.setDMPermission(false)
	// 	};
	// }

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

export { run, slash, info };