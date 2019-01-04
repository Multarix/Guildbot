exports.run = (client, message, args, level) => {

	const tagged = message.mentions.users.first();
	const theCrush = message.guild.members.random().user.tag;
	const backupCrush = message.guild.members.random().user.tag;

	let lover;
	if(!tagged){
		lover = message.author.tag;
	} else {
		lover = tagged.tag;
	}

	if(lover === theCrush){
		return message.channel.send(`\`${lover}\` has a crush on \`${backupCrush}\` ❤😍`);
	} else {
		return message.channel.send(`\`${lover}\` has a crush on \`${theCrush}\` ❤😍`);
	}
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: ["crush"],
	permLevel: 0,
};

exports.help = {
	name: "love",
	category: "Misc",
	description: "See who has a crush on who",
	usage: "love](<..user>)",
};
