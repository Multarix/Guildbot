exports.run = (client, message, args, level) => {

	const messagecount = parseInt(args[0]);
	message.channel.fetchMessages({ limit: 100 }).then(messages => {
		let msg_array = messages.array();
		msg_array = msg_array.filter(m => m.author.id === client.user.id);
		msg_array.length = messagecount;
		msg_array.map(m => m.delete().catch(console.error));
	});
};

exports.conf = {
	enabled: true,
	guildOnly: false,
	aliases: ["prune", "purge"],
	permLevel: 10,
};

exports.help = {
	name: "purgeself",
	category: "Moderation",
	description: "Prunes a selected amount of messages",
	usage: "prune](<..number>)",
};
