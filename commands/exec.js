import { Client, Message, EmbedBuilder } from "discord.js";


/**
 * @name exec
 * @param {Client} client The discord client
 * @param {Message} element The message or interaction that was created
 * @param {String[]} [args] The arguments passed to the command
 * @returns {Promise<void>}
**/
async function run(client, element, args = []){

	let good = client.emojis.cache.get("340357918996299778");
	if(!good) good = "👍";
	let bad = client.emojis.cache.get("340357882606256137");
	if(!bad) bad = "👎";

	const embed = new EmbedBuilder()
		.setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL() })
		.setTimestamp();

	const joinArgs = args.join(" ");

	require("child_process").exec(joinArgs, async (error, result) => {
		// Error
		if(error){
			const errorMessage = "```yaml\n" + error.message + "```";

			const fields = [
				{ name: 'Exec Input', value: "```yaml\n" + joinArgs + "```", inline: false },
				{ name: 'Exec Output', value: errorMessage, inline: false }
			];

			embed.setColor(14487568).addFields(fields);

			if(errorMessage.length >= 1024){
				console.log(`Exec Error:\n${error.message}`);
				return element.channel.send("```yaml\nThe command execution failed & the output was too long - Check the console for details.\n```");
			}

			return await element.channel.send({ embeds: [embed] });
		}

		// Success
		if(result){
			const resultMessage = "```yaml\n" + result + "```";

			const fields = [
				{ name: 'Exec Input', value: "```yaml\n" + joinArgs + "```", inline: false },
				{ name: 'Exec Output', value: resultMessage, inline: false }
			];

			embed.setColor(2734377).addFields(fields);

			if(resultMessage.length >= 1024) return element.channel.send("```yaml\nThe command executed successfully but The output was too long - Check the console for details.\n```");
			return await element.channel.send({ embeds: [embed] });
		}
	});
}


const info = {
	name: "exec",
	altNames: ["cmd"],
	description: "Command line interaction",
	usage: "exec {code}",
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
			const user = interaction.options.getUser("user");

			const args = [];
			if(user) args.push(user);

			await run(client, interaction, args);
		}
	};
}

export { run, slash, info };