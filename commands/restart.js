exports.run = (client, message, args, level) => {

	let good = client.emojis.get("340357918996299778");
	if(!good) good = "👍";

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
	usage: "..",
};
