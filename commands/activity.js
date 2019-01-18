const colors = require('colors');
exports.run = (client, message, args, level) => {

	let good = client.emojis.get("340357918996299778");
	if(!good) good = "👍";

	const activity = args[0];
	if(!activity) return message.channel.send("Usage: [activity](<play/watch/listen> <..new-activity>)", { code: "markdown" });

	const joinargs = args.slice(1).join(" ");
	if(!joinargs) return message.channel.send("Usage: [activity](<play/watch/listen> <..new-activity>)", { code: "markdown" });

	if(activity === "play"){
		return client.user.setActivity(`${joinargs}`).then(() => {
			client.log("Now playing " + colors.white("[") + joinargs + colors.white("]"), "Activity");
			message.react(good);
		});
	}
	if(activity === "watch"){
		return client.user.setActivity(`${joinargs}`, { type: 'WATCHING' }).then(() => {
			client.log("Now watching " + colors.white("[") + joinargs + colors.white("]"), "Activity");
			message.react(good);
		});
	}
	if(activity === "listen"){
		return client.user.setActivity(`${joinargs}`, { type: 'LISTENING' }).then(() => {
			client.log("Now listening to " + colors.white("[") + joinargs + colors.white("]"), "Activity");
			message.react(good);
		});
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
	usage: "activity](<setting> <activity>)",
};
