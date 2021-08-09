const Discord = require("discord.js");
exports.run = async (client, message, args, level) => {
	const settings = sqlGet("SELECT * FROM settings WHERE guild = ?", message.guild.id);

	let ecolor = false;
	if(message.member.roles.highest.color) ecolor = message.member.roles.highest.color;

	const embed = new Discord.MessageEmbed()
		.setAuthor(`Commands for:  ${message.author.tag}`, message.author.displayAvatarURL())
		.setDescription(`Use ${settings.prefix}help <commandname> for more details`)
		.setThumbnail(message.guild.iconURL)
		.setFooter(client.user.tag, client.user.displayAvatarURL())
		.setTimestamp();

	if(ecolor) embed.setColor(ecolor);

	if(!args[0]){

		const myCommands = client.commands.filter(c=>c.conf.permLevel <= level);
		const commandNames = [...myCommands.keys()];
		const longest = commandNames.reduce((long, str) => Math.max(long, str.length), 0);
		let currentCategory = "";
		let output = "";
		const sorted = myCommands.sort((p, c) => p.help.category > c.help.category ? 1 : -1);
		sorted.forEach(c => {
			const cat = c.help.category.toProperCase();
			if(currentCategory !== cat && currentCategory === "") output += `|${cat}|`;
			if(currentCategory !== cat && currentCategory !== "") output += `◙|${cat}|`;

			output += `${c.help.name}  -:-  ${c.help.description}\n`;
			currentCategory = cat;
		});

		const catCommands = output.split("◙");
		catCommands.forEach(deeta => {
			const catName = deeta.match(/(?!\|)(.*?)(?=\|)/)[0];
			embed.addField(catName, deeta.replace(`|${catName}|`, ""));
		});

		message.author.send({ embeds: [embed] }).catch(e => {
			if(e.code === 50007) return;
			return client.log(e.message, "Error");
		});
	} else {
		const command = client.commands.get(args[0]) || client.commands.get(client.aliases.get(args[0]));
		if(command){
			message.channel.send(`< ${command.help.name.toProperCase()} > \n${command.help.description}\nUsage: [${settings.prefix}${command.help.name}](<${command.help.usage.split(" ").join("> <")}>)`, { code:"markdown" });
		}
	}
};

exports.conf = {
	enabled: true,
	allowDM: true,
	aliases: ["commands", "h"],
	permLevel: 0
};

exports.help = {
	name: "help",
	category: "System",
	description: "Displays all the commands",
	usage: "..command-name"
};
