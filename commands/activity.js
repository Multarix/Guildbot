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
			await message.react(good);
			if(message.channel.permissionsFor(message.guild.me).has("MANAGE_MESSAGES")) message.delete({ timeout: 5000 });
			break;
		case "watch":
			await client.user.setActivity(`${joinargs}`, { type: 'WATCHING' });
			client.log("Now watching " + colors.white("[") + joinargs + colors.white("]"), "Activity");
			await message.react(good);
			if(message.channel.permissionsFor(message.guild.me).has("MANAGE_MESSAGES")) message.delete({ timeout: 5000 });
			break;
		case "listen":
			await client.user.setActivity(`${joinargs}`, { type: 'LISTENING' });
			client.log("Now listening to " + colors.white("[") + joinargs + colors.white("]"), "Activity");
			await message.react(good);
			if(message.channel.permissionsFor(message.guild.me).has("MANAGE_MESSAGES")) message.delete({ timeout: 5000 });
			break;
		default:
			message.channel.send("Usage: [activity](<play/watch/listen> <..new-activity>)", { code: "markdown" }).then(m => {
				m.delete(5000);
				if(message.channel.permissionsFor(message.guild.me).has("MANAGE_MESSAGES")) message.delete({ timeout: 5000 });
			});
	}

};

exports.conf = {
	enabled: true,
	allowDM: true,
	aliases: ["active", "game"],
	permLevel: 10,
};

exports.help = {
	name: "activity",
	category: "System",
	description: "Sets the activity of the bot",
	usage: "setting ..activity",
};
