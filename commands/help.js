const sql = require("sqlite");
exports.run = async (client, message, args, level) => {

	const settings = await sql.get(`SELECT * FROM settings WHERE guildID = "${message.guild.id}"`);
	if(!args[0]) {

		const myCommands = client.commands.filter(c=>c.conf.permLevel <= level);
		const commandNames = myCommands.keyArray();
		const longest = commandNames.reduce((long, str) => Math.max(long, str.length), 0);
		let currentCategory = "";
		let output = `< Command List >\n\nUse [${settings.prefix}help](commandname) for details\n`;
		const sorted = myCommands.sort((p, c) => p.help.category > c.help.category ? 1 : -1);
		sorted.forEach(c => {
			const cat = c.help.category.toProperCase();
			if(currentCategory !== cat) {
				output += `\n< ${cat} >\n`;
				currentCategory = cat;
			}
			output += `[${settings.prefix}](${c.help.name})${" ".repeat(longest - c.help.name.length)} <:> ${c.help.description}\n`;
		});
		message.author.send(output, { code:"markdown" });
	} else {
		let command = args[0];
		if (client.commands.has(command)) {
			command = client.commands.get(command);
			message.channel.send(`< ${command.help.name.toProperCase()} > \n${command.help.description}\nUsage: [${settings.prefix}${command.help.usage}`, { code:"markdown" });
		}
	}
};

exports.conf = {
	enabled: true,
	guildOnly: false,
	aliases: ["commands", "h"],
	permLevel: 0,
};

exports.help = {
	name: "help",
	category: "System",
	description: "Displays all the commands",
	usage: "help](<..command-name>)",
};
