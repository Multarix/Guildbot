exports.run = async (client, message, args, level) => {

	if(!args[0] || args.size < 1) return message.channel.send("Usage: [reload](..command)", { code: "markdown" });

	let command;
	if(client.commands.has(args[0])){
		command = client.commands.get(args[0]);
	} else if(client.aliases.has(args[0])){
		command = client.commands.get(client.aliases.get(args[0]));
	}
	if(!command){
		return message.reply(`The command '${args[0]}' doesn"t seem to exist, nor is it an alias. Try again!`);
	}
	command = command.help.name;

	delete require.cache[require.resolve(`./${command}.js`)];
	const cmd = require(`./${command}`);
	client.commands.delete(command);
	client.aliases.forEach((cmd, alias) => {
		if(cmd === command) client.aliases.delete(alias);
	});
	client.commands.set(command, cmd);
	cmd.conf.aliases.forEach(alias => {
		client.aliases.set(alias, cmd.help.name);
	});
	client.log(`The command '${command}' was reloaded`, "Log");
	message.reply(`The command '${command}' has been reloaded`).then(msg =>{
		if(message.channel.memberPermissions(message.guild.me).has("MANAGE_MESSAGES")){
			msg.delete(5000);
			message.delete(5000);
		}
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
	usage: "command-name",
};
