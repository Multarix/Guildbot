const delMsg = require("./config/delMsg.js");
exports.run = async (client, message, args) => {

	if(!args[0]) return message.channel.send("Usage:\n [status](..status)", { code: "markdown" });

	const status = `${args[0].toLowerCase()}`;

	let good = client.emojis.get("340357918996299778");
	if(!good) good = "👍";
	let bad = client.emojis.get("340357882606256137");
	if(!bad) bad = "👎";

	let newStatus = "invalid";
	switch (status){
	case "online":
		newStatus = "Online";
		break;
	case "dnd":
		newStatus = "dnd";
		break;
	case "idle":
		newStatus = "idle";
		break;
	case ("offline" || "invisible"):
		newStatus = "invisible";
		break;
	}

	if(newStatus === "invalid"){
		message.react(bad);
		const m = await message.channel.send(`\`${args[0]}\` is not a valid status. Try again.`);
		return await delMsg(client, message, m);
	}
	client.user.setStatus(newStatus);
	message.react(good);
	if(message.channel.permissionsFor(message.guild.me).has("MANAGE_MESSAGES")) return message.delete({ timeout: 5000 });
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
	usage: "status",
};
