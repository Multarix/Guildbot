const Discord = require("discord.js");
module.exports = async (client, emoji) => {

	const guild = emoji.guild;
	const data = sqlGet("SELECT * FROM settings WHERE guild = ?", guild.id);
	const channel = guild.channels.get(data.emojiChannel);
	if(!data.emojiChannel || !channel) return;
	if(!channel.permissionsFor(guild.me).has("SEND_MESSAGES")) return;

	const user = await emoji.fetchAuthor();

	const embed = new Discord.MessageEmbed()
		.setTitle(`New Emoji: ${emoji}`)
		.setAuthor(user.username, user.displayAvatarURL())
		.setColor()
		.addField("Details",
			`**Usage** - \`:${emoji.name}:\`
			**Animated** - ${emoji.animated}`.removeIndents())
		.setThumbnail(emoji.url)
		.setFooter(emoji.id, client.user.displayAvatarURL())
		.setTimestamp();

	return channel.send("A new emoji has been added. ", { embed });
};

module.exports.help = {
	name: "emojiCreate",
	description: "Emitted whenever a custom emoji is created in a guild.",
};
