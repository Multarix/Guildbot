exports.run = (client, message, args) => {

	if(!args[0]) return message.channel.send(`Usage: [md](<..number>)`, { code: "markdown" });
	if(!parseInt(args[0])) return message.channel.send(`Yea hey.. \`${args[0]}\` isn't a number.`);

	const messagecount = parseInt(args[0]);
	let toDelete = messagecount + 1;
	if(toDelete >= 101) toDelete = 100;

	if(!message.channel.memberPermissions(message.guild.me).has("MANAGE_MESSAGES")) return message.reply("I don't have permission to delete messages.");
	message.channel.messages.fetch({ limit: toDelete }).then(messages => message.channel.bulkDelete(messages)).catch(e => {
		return message.channel.send(`\`Error:\` ${e.message}`);
	});
};

exports.conf = {
	enabled: true,
	allowDM: false,
	aliases: ["massdelete"],
	permLevel: 1
};

exports.help = {
	name: "md",
	category: "Moderation",
	description: "Mass deletes the specified amount of posts",
	usage: "number"
};
