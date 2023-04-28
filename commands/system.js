const { Client, Message, Interaction, EmbedBuilder, version } = require("discord.js");
const os = require("os");

const humanTime = require("../modules/humanTime.js");

/**
 * @name system
 * @param {Client} client The discord client
 * @param {Message|Interaction} element The message or interaction that was created
 * @param {String[]} _args The arguments passed to the command
 * @returns {Promise<void>}
**/
async function run(client, element, _args = []){

	const duration = humanTime(client.uptime, "\\Ddays, \\Hhrs, \\mmins, \\ssecs");

	const cpuType = os.cpus()[0].model.split(/\s+/g).join(" ");
	const embed = new EmbedBuilder()
		.setAuthor({ name: "System Information" })
		.setColor(13238272)
		.setThumbnail(client.user.displayAvatarURL())
		.setFooter({ text: client.user.tag, iconURL: client.user.displayAvatarURL() })
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
	description: "Lists the system information upon which the bot is running",
	enabled: true,
	altNames: ["sys", "sysinfo"],
	dmCompatible: true,
	permLevel: 100,
	category: "System"
};

// const slash = {
// 	data:  new SlashCommandBuilder()
// 		.setName(info.name)
// 		.setDescription(info.description)
// 		.setDMPermission(false),
// 	async execute(client, interaction){
// 		await run(client, interaction);
// 	}
// };

module.exports = { run, /* slash, */ info };