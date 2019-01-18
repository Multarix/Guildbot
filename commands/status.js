exports.run = (client, message, args, level) => {

	if(!args[0]) return message.channel.send("Usage:\n [status](..status)", { code: "markdown" });

	const status = `${args[0].toLowerCase()}`;

	const good = client.emojis.get("340357918996299778");
	const bad = client.emojis.get("340357882606256137");

	let newStatus = "invalid";

	if (status === "online"){
		newStatus = "Online";
	}
	if (status === "dnd"){
		newStatus = "dnd";
	}
	if (status === "idle"){
		newStatus = "idle";
	}
	if (status === "offline" || status === "invisible"){
		newStatus = "invisible";
	}
	if (newStatus === "invalid"){
		message.react(bad);
		message.channel.send(`\`${args[0]}\` is not a valid status. Try again.`).then(m => {
			if(message.channel.memberPermissions(message.guild.me).has("MANAGE_MESSAGES")){
				m.delete(5000);
				message.delete(5000);
			}
		});
	} else {
		client.user.setStatus(newStatus);
		message.react(good);
	}
};


exports.conf = {
	enabled: true,
	guildOnly: false,
	aliases: [],
	permLevel: 10,
};

exports.help = {
	name: "status",
	category: "System",
	description: "Changes the bot's status",
	usage: "status](<..status>)",
};
