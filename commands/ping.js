exports.run = (client, message, args, level) => {
	const good = client.emojis.get("340357918996299778");
	message.react(good);
	message.channel.send('Pinging...').then(sent => {
		sent.edit(`Pong! Took ${sent.createdTimestamp - message.createdTimestamp}ms\nHeartbeat ping is: ${Math.round(client.ping)}ms`);
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
	usage: "ping](..)",
};
