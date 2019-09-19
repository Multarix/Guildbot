exports.run = (client, message, args) => {

	if(!args[0]) return message.channel.send(`Usage: [md](<..number>)`, { code: "markdown" });
	if(!parseInt(args[0])) return message.channel.send(`Yea hey.. \`${args[0]}\` isn't a number.`);

	const messagecount = parseInt(args[0]);
	let toDelete = messagecount + 1;
	if(toDelete >= 101) toDelete = 100;

	message.channel.fetchMessages({ limit: toDelete }).then(messages => {
		let msg_array = messages.array();
		msg_array = msg_array.filter(m => m.author.id === client.user.id);
		msg_array.length = messagecount;
		msg_array.map(m => m.delete().catch(console.error));
	});
};

exports.conf = {
	enabled: true,
	guildOnly: false,
	aliases: ["purgeself", "prune", "pruneself"],
	permLevel: 3,
};

exports.help = {
	name: "purge",
	category: "Moderation",
	description: "Prunes a selected amount of messages from the bot itself.",
	usage: "number",
};
