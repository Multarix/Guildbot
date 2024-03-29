import Discord, { Client, Message, EmbedBuilder } from "discord.js";
import os from "os";
import { humanTime } from "../src/functions.js";

const { version } = Discord;

/**
 * @name system
 * @param {Client} client The discord client
 * @param {Message} element The message or interaction that was created
 * @param {String[]} [_args] The arguments passed to the command
 * @returns {Promise<void>}
**/
async function run(client, element, _args = []){

	const duration = humanTime(client.uptime, "\\Ddays, \\Hhrs, \\mmins, \\ssecs");

	const cpuType = os.cpus()[0].model.split(/\s+/g).join(" ");
	const embed = new EmbedBuilder()
		.setAuthor({ name: "System Information" })
		.setColor(13238272)
		.setThumbnail(client.user.displayAvatarURL())
		.setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL() })
		.setTimestamp();

	const embedFields = [
		{ name: "CPU",				value: cpuType,																inline: true },
		{ name: "Architecture",		value: os.arch(),															inline: true },
		{ name: "OS",				value: `${os.platform}`,													inline: true },
		{ name: "Discord.js",		value: `v${version}`, 														inline: true },
		{ name: "Node.js",			value: process.version.toString(), 											inline: true },
		{ name: "Memory Usage",		value: `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB`, 	inline: true },
		{ name: "Total Memory",		value: `${(os.totalmem() / 1024 / 1024 / 1024).toFixed(2)}GB`,				inline: true },
		{ name: "Uptime",			value: duration, 															inline: false }
	];

	embed.addFields(embedFields);

	return element.reply({ embeds: [embed] });
}

const info = {
	name: "system",
	altNames: ["sys", "sysinfo"],
	description: "Lists information about the system the bot is running on",
	usage: "system",
	enabled: true,
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