exports.run = async (client, message, args, level) => {

	const tagged = await grabUser(args[0]);
	const theCrush = message.guild.members.random().user.tag;
	const backupCrush = message.guild.members.random().user.tag;

	let lover = message.author.tag;
	if(tagged) lover = tagged.tag;

	if(lover === theCrush){
		return message.channel.send(`\`${lover}\` has a crush on \`${backupCrush}\` ❤😍`);
	}
	return message.channel.send(`\`${lover}\` has a crush on \`${theCrush}\` ❤😍`);
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: ["crush"],
	permLevel: 1,
};

exports.help = {
	name: "love",
	category: "Misc",
	description: "See who has a crush on who",
	usage: "love](<..user>)",
};
