const sql = require("sqlite");
const Discord = require("discord.js");
const delMsg = require("./config/delMsg.js");
exports.run = async (client, message, args) => {

	const cc = await sql.all(`SELECT * FROM commands WHERE guild = "${message.guild.id}"`);

	const cmdArray = [];
	const cmdList = {};
	cc.forEach(data => {
		cmdArray.push(`\`${data.name}\``);
		cmdList[data.name] = data.output;
	});

	let cmdStr = cmdArray.join(", ");
	if(!cmdStr) cmdStr = "No custom commands added.";

	const tag = args[0];
	if(!tag){
		const embed = new Discord.MessageEmbed()
			.setColor(14487568)
			.addField("Custom Commands", cmdStr, false);
		if(message.guild.iconURL){
			embed.setAuthor(message.guild.name, message.guild.iconURL);
		} else {
			embed.setAuthor(message.guild.name);
		}
		return message.channel.send({ embed });
	}

	if(tag === "set" || tag === "add"){
		const commandName = args[1];
		if(!commandName) return message.channel.send("No name was specified\nUsage: [custom](set) <name> <..output>", { code: "markdown" });
		const joinOutput = args.slice(2).join(" ");
		if(!joinOutput) return message.channel.send("No output was specified\nUsage: [custom](set) <name> <..output>", { code: "markdown" });
		if(!commandName.length > 15) return message.channel.send("Command name is too long. It must be 15 characters or less in length.");

		if(cmdList[args[1]]){
			await sql.get(`UPDATE commands SET output = "${joinOutput}" WHERE guild = "${message.guild.id}" AND name = "${commandName}"`);
			client.log(`"${message.guild.name}" updated a custom command (${commandName})`, `SQL`);
			const m = await message.channel.send(`Updated the custom command: \`${commandName}\``);
			return await delMsg(client, message, m);
		}
		const cockBlock = client.commands.get(commandName) || client.commands.get(client.aliases.get(commandName));
		if(cockBlock) return message.channel.send("Cannot make a custom command with the same name/ alias as another command.");

		await sql.run(`INSERT INTO commands (name, output, guild) VALUES ("${commandName}", "${joinOutput}", "${message.guild.id}")`);
		client.log(`"${message.guild.name}" added a custom command (${commandName})`, `SQL`);
		const m = await message.channel.send(`Added the custom command: \`${commandName}\``);
		return await delMsg(client, message, m);
	}

	if(tag === "delete" || tag === "remove"){
		const commandName = args[1];
		if(!commandName) return message.channel.send("No name was specified\nUsage: [custom](delete) <name>", { code: "markdown" });
		const check = cc.find(c => c.name === commandName);
		if(!check) return message.channel.send("That command doesn't exist");
		await sql.run(`DELETE FROM commands WHERE name = "${commandName}" AND guild = "${message.guild.id}"`);
		client.log(`"${message.guild.name}" deleted a custom command (${commandName})`, `SQL`);
		const m = await message.channel.send(`The custom command \`${commandName}\` has been deleted.`);
		return await delMsg(client, message, m);
	}
	return message.channel.send(`Usage: [custom](set/delete) <name> <..output>`, { code: "markdown" });
};

exports.conf = {
	enabled: true,
	allowDM: false,
	aliases: ["cc", "tag"],
	permLevel: 2,
};

exports.help = {
	name: "custom",
	category: "System",
	description: "Creates a custom command",
	usage: "key text",
};
