exports.run = (client, message, args, level) => {
	const good = client.emojis.get("340357918996299778");

	message.react(good).then(m =>{
		restartBot("Manual Restart");
	});

};

exports.conf = {
	enabled: true,
	guildOnly: false,
	aliases: ["reboot"],
	permLevel: 10,
};

exports.help = {
	name: "restart",
	category: "System",
	description: "Restarts the bot",
	usage: "restart](..)",
};
