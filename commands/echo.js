exports.run = async (client, message, args) => {

	const joinargs = args.join(" ").replace(/\u200b/g, "\n");
	if(!joinargs) return message.channel.send("Usage: [echo](<..text>)", { code: "markdown" });

	if(message.channel.permissionsFor(message.guild.me).has("MANAGE_MESSAGES")) message.delete();

	message.channel.send(joinargs);
};

exports.conf = {
	enabled: true,
	allowDM: true,
	aliases: [],
	permLevel: 1
};

exports.help = {
	name: "echo",
	category: "Misc",
	description: "Repeats what you say",
	usage: "text"
};
