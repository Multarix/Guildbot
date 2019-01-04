exports.run = (client, message, args, level) => {
	const colors = require('colors');

	const good = client.emojis.get("340357918996299778");
	const joinargs = args.join(" ");

	client.user.setActivity(`${joinargs}`, { type: 'LISTENING' }).then(client.log("Now listening to " + colors.white("[") + joinargs + colors.white("]"), "Activity"));
	message.react(good);
	message.delete(10000);
};

exports.conf = {
	enabled: true,
	guildOnly: false,
	aliases: [],
	permLevel: 10,
};

exports.help = {
	name: "listen",
	category: "System",
	description: "Makes the bot listen to stuff",
	usage: "listen](<..variable>)",
};
