exports.run = async (client, message, args) => {

	const tagged = await grabUser(args[0]);

	let lover = message.author;
	if(tagged) lover = tagged;

	const theCrush = message.guild.members.cache.filter(m => m.user.id !== lover.id).random().user.tag;
	return message.channel.send(`\`${lover.tag}\` has a crush on \`${theCrush}\` ❤😍`);
};

exports.conf = {
	enabled: true,
	allowDM: false,
	aliases: ["crush"],
	permLevel: 1
};

exports.help = {
	name: "love",
	category: "Misc",
	description: "See who has a crush on who",
	usage: "..user"
};
