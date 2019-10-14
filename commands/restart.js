exports.run = (client, message, args) => {

	let good = client.emojis.get("340357918996299778");
	if(!good) good = "👍";

	message.react(good).then(m =>{
		restartBot("Manual Restart");
	});

};

exports.conf = {
	enabled: true,
	allowDM: true,
	aliases: ["reboot"],
	permLevel: 10,
};

exports.help = {
	name: "restart",
	category: "System",
	description: "Restarts the bot",
	usage: "..",
};
