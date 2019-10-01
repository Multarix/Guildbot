exports.run = (client, message, args) => {

	message.channel.send('Pinging...').then(sent => {
		sent.edit(`Pong! Took ${sent.createdTimestamp - message.createdTimestamp}ms\nHeartbeat ping is: ${Math.round(client.ws.ping)}ms`);
	});
};

exports.conf = {
	enabled: true,
	guildOnly: false,
	aliases: [],
	permLevel: 0,
};

exports.help = {
	name: "ping",
	category: "Misc",
	description: "Gets the bot's ping",
	usage: "..",
};
