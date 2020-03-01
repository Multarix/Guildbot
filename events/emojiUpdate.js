const Discord = require("discord.js");
module.exports = async (client, oldEmoji, emoji) => {

	const guild = emoji.guild;
	const data = sqlGet("SELECT * FROM settings WHERE guild = ?", guild.id);
	const channel = guild.channels.cache.get(data.emojiChannel);
	if(!data.emojiChannel || !channel) return;
	if(!channel.permissionsFor(guild.me).has("SEND_MESSAGES")) return;

	const messages = await channel.messages.fetch({ limit: 100 });
	const message = await messages.filter(msg => {
		if(msg.author.id !== client.user.id) return false;
		if(!msg.embeds[0]) return false;
		if(!msg.embeds[0].footer) return false;
		if(msg.embeds[0].footer.text === oldEmoji.id) return true;
		return false;
	}).first();

	if(!message) return;

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

	return message.edit("A new emoji has been added.", { embed });
};

module.exports.help = {
	name: "emojiUpdate",
	description: "Emitted whenever a custom emoji is updated in a guild."
};
