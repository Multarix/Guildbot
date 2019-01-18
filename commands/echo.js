exports.run = async (client, message, args, level) => {

	const joinargs = args.join(" ");
	if(!joinargs) return message.channel.send("Usage: [echo](<..text>)", { code: "markdown" });

	if(message.channel.memberPermissions(message.guild.me).has("MANAGE_MESSAGES")) message.delete();

	message.channel.send(joinargs);
};

exports.conf = {
	enabled: true,
	guildOnly: false,
	aliases: [],
	permLevel: 1,
};

exports.help = {
	name: "echo",
	category: "Misc",
	description: "Repeats what you say",
	usage: "echo](<..text>)",
};
