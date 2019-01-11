exports.run = (client, message, args, level) => {

	function geyPercent() {
		const tagged = message.mentions.users.first();
		let geyPerson;
		if(!tagged){
			geyPerson = message.author.username;
		} else {
			geyPerson = tagged.username;
		}
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
