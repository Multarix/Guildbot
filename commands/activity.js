const colors = require('colors');
exports.run = async (client, message, args) => {

	let good = client.emojis.get("340357918996299778");
	if(!good) good = "👍";

	const activity = args[0];
	if(!activity) return message.channel.send("Usage: [activity](<play/watch/listen> <..new-activity>)", { code: "markdown" });

	const joinargs = args.slice(1).join(" ");
	if(!joinargs) return message.channel.send("Usage: [activity](<play/watch/listen> <..new-activity>)", { code: "markdown" });

	switch (activity){
	case "play":
		await client.user.setActivity(`${joinargs}`);
		client.log("Now playing " + colors.white("[") + joinargs + colors.white("]"), "Activity");
		message.react(good);
		break;
	case "watch":
		await client.user.setActivity(`${joinargs}`, { type: 'WATCHING' });
		client.log("Now watching " + colors.white("[") + joinargs + colors.white("]"), "Activity");
		message.react(good);
		break;
	case "listen":
		await client.user.setActivity(`${joinargs}`, { type: 'LISTENING' });
		client.log("Now listening to " + colors.white("[") + joinargs + colors.white("]"), "Activity");
		message.react(good);
		break;
	}

};

exports.conf = {
	enabled: true,
	guildOnly: false,
	aliases: ["active"],
	permLevel: 10,
};

exports.help = {
	name: "activity",
	category: "System",
	description: "Sets the activity of the bot",
	usage: "setting ..activity",
};
