exports.run = (client, message, args) => {
	const eggNumber = parseInt(args[0]);
	if(!eggNumber) return message.channel.send("Not a number, please try again");

	const percentage = Math.round((1 - Math.pow((511 / 512), eggNumber)) * 100000) / 1000;
	message.channel.send(`There is a ${percentage}% chance you should have hatched a shiny after ${eggNumber} eggs.`);
};


exports.conf = {
	enabled: true,
	allowDM: true,
	aliases: ["eggs"],
	permLevel: 1
};

exports.help = {
	name: "egg",
	category: "Misc",
	description: "Calculates the chance that a shiny pokemon should have hatched",
	usage: "egg-number"
};
