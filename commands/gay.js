exports.run = async (client, message, args, level) => {


	const tagged = await grabUser(args[0]);
	let geyPerson = message.author;
	if(tagged) geyPerson = tagged;

	if(geyPerson.id === "336709922647441409") return message.channel.send(`\`${geyPerson.username}\` is ${Math.floor(Math.random() * 100) + 100}% gey!`);
	return message.channel.send(`\`${geyPerson.username}\` is ${Math.floor(Math.random() * 100)}% gey!`);

};

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: ["gey"],
	permLevel: 1,
};

exports.help = {
	name: "gay",
	category: "Misc",
	description: "See how gay you or someone else is",
	usage: "..user",
};
