exports.run = (client, message, args, level) => {
	const good = client.guilds.get(client.config.homeServer).emojis.get("340357918996299778");
	message.react(good);

	const messagecount = parseInt(args[0]);
	message.channel.fetchMessages({ limit: 100 }).then(messages => {
		let msg_array = messages.array();
		msg_array = msg_array.filter(m => m.author.id === client.user.id);
		msg_array.length = messagecount;
		msg_array.map(m => m.delete().catch(console.error));
	});

	message.react(good);
};

exports.conf = {
	enabled: true,
	guildOnly: false,
	aliases: ["", "purge"],
	permLevel: 10,
};

exports.help = {
	name: "purgeself",
	category: "Moderation",
	description: "Prunes a selected amount of messages",
	usage: "prune](<..number>)",
};
