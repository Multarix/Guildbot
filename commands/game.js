exports.run = (client, message, args, level) => {
	const colors = require('colors');

	const good = client.emojis.get("340357918996299778");
	const joinargs = args.join(" ");

	if(!joinargs) return message.channel.send("Usage: [game](<..text>)", { code: "markdown" });

	client.user.setActivity(`${joinargs}`).then(client.log("Now playing " + colors.white("[") + joinargs + colors.white("]"), "Activity"));
	message.react(good);

	if(message.channel.memberPermissions(message.guild.me).has("MANAGE_MESSAGES")){
		message.delete(10000);
	}
};

exports.conf = {
	enabled: true,
	guildOnly: false,
	aliases: ["playgame"],
	permLevel: 10,
};

exports.help = {
	name: "game",
	category: "System",
	description: "Sets the bot's game",
	usage: "game](<..text>)",
};
