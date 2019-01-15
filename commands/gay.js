exports.run = (client, message, args, level) => {

	async function geyPercent() {
		const tagged = await grabUser(args[0]);
		let geyPerson = message.author.username;
		if(tagged) geyPerson = tagged.username;

		return message.channel.send(`\`${geyPerson}\` is ${Math.floor(Math.random() * 100)}% gey!`);
	}

	geyPercent();

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
	usage: "gay](<..user>)",
};
