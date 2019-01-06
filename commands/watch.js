exports.run = (client, message, args, level) => {
	const colors = require('colors');

	const good = client.emojis.get("340357918996299778");
	const joinargs = args.join(" ");

	if(!joinargs) return message.channel.send("Usage: [watch](<..text>)", { code: "markdown" });

	client.user.setActivity(`${joinargs}`, { type: 'WATCHING' }).then(client.log("Now watching " + colors.white("[") + joinargs + colors.white("]"), "Activity"));
	message.react(good);

	if(message.channel.memberPermissions(message.guild.me).has("MANAGE_MESSAGES")){
		message.delete(10000);
	}
};

exports.conf = {
	enabled: true,
	guildOnly: false,
	aliases: [],
	permLevel: 10,
};

exports.help = {
	name: "watch",
	category: "System",
	description: "Makes the bot watch stuff",
	usage: "watch](<..text>)",
};
