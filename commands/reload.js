exports.run = async (client, message, args, level) => {
	const good = client.emojis.get("340357918996299778");
	const bad = client.emojis.get("340357882606256137");

	if(!args[0] || args.size < 1){
		message.react(bad);
		return message.reply("Must provide a command to reload.");
	}

	let command;
	if (client.commands.has(args[0])) {
		command = client.commands.get(args[0]);
	} else if (client.aliases.has(args[0])) {
		command = client.commands.get(client.aliases.get(args[0]));
	}
	if(!command){
		message.react(bad);
		return message.reply(`The command '${args[0]}' doesn"t seem to exist, nor is it an alias. Try again!`);
	}
	command = command.help.name;

	delete require.cache[require.resolve(`./${command}.js`)];
	const cmd = require(`./${command}`);
	client.commands.delete(command);
	client.aliases.forEach((cmd, alias) => {
		if (cmd === command) client.aliases.delete(alias);
	});
	client.commands.set(command, cmd);
	cmd.conf.aliases.forEach(alias => {
		client.aliases.set(alias, cmd.help.name);
	});
	message.react(good);
	client.log(`The command '${command}' was reloaded`, "Log");
	message.reply(`The command '${command}' has been reloaded`).then(msg =>{
		msg.delete(5000);
		message.delete(5000);
	});
};

exports.conf = {
	enabled: true,
	guildOnly: false,
	aliases: [],
	permLevel: 10,
};

exports.help = {
	name: "reload",
	category: "System",
	description: "Reloads a command that's been modified",
	usage: "reload](<..command-name>)",
};
