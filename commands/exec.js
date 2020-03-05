exports.run = async (client, message, args) => {
	const Discord = require('discord.js');
	const embed = new Discord.MessageEmbed()
		.setFooter(client.user.tag, client.user.displayAvatarURL())
		.setTimestamp();

	const joinArgs = args.join(" ");
	client.log(joinArgs, "Exec Input");

	require("child_process").exec(joinArgs, (error, result) => {
		if(error){
			// Error
			client.log(`\n\`\`\`fix${error.message}\`\`\``, "Exec Output");
			const failString = `\`\`\`fix
				Input: ${joinArgs}
				Output:
				${error.message}
				\`\`\``;
			if(failString.length >= 2000) return message.channel.send("```fix\nThe command execution failed.\nThe output was too long - Check the console for results.\n```");
			return message.channel.send(failString.removeIndents());
		}
		if(result){
			// Success
			client.log(`\n${result}`, "Exec Output");
			const successString = `\`\`\`yaml
				Input: ${joinArgs}
				Output:
				${result}
				\`\`\``;
			if(successString.length >= 2000) return message.channel.send("```yaml\nThe command executed successfully.\nThe output was too long - Check the console for results.\n```");
			return message.channel.send(successString.removeIndents());
		}
	});
};

exports.conf = {
	enabled: true,
	allowDM: true,
	aliases: ["cmd"],
	permLevel: 10
};

exports.help = {
	name: "exec",
	category: "System",
	description: "Command Line Stuff",
	usage: "code"
};
