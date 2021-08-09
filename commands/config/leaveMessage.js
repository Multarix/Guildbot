const Discord = require("discord.js");
const delMsg = require("./delMsg.js");
exports.edit = async (client, message, args, data, info) => {

	const embed = new Discord.MessageEmbed()
		.setColor(info.color)
		.setTitle("Leave Message")
		.setFooter(client.user.tag, client.user.displayAvatarURL);

	const leaveMsg = args.slice(2).join(" ").replace(/\n/g, "\u200b");
	if(!leaveMsg){
		embed.addField("No Message",
			`\`\`\`md
			${data.prefix}config set leavemessage < message you want >
			\`\`\``.removeIndents())
			.addField("Handy Tips",
				`If you put '<@user>' anywhere in the message, it will be converted to a mention of that user.
				If you put '<user>' anywhere in the message, it will be converted to that users username.`.removeIndents());
		return message.channel.send({ embeds: [embed] });
	}
	sqlRun(`UPDATE settings SET leaveMsg = ? WHERE guild = ?`, sanity(leaveMsg), message.guild.id);
	client.log(`"${message.guild.name}" set their goodbye message`, `SQL`);

	const leaveExample = leaveMsg.replace(/<@user>/g, client.user).replace(/<user>/g, client.user.username).replace(/\u200b/g, "\n");
	embed.addField("Setting Saved", `The leave message has been saved. An example has been provided below.`).addField("Example", leaveExample);
	message.channel.send({ embeds: [embed] });
};

exports.delete = async (client, message, args, data, info) => {

	const embed = new Discord.MessageEmbed()
		.setColor(info.color)
		.setTitle("Leave Message")
		.setFooter(client.user.tag, client.user.displayAvatarURL);

	if(!data.leaveMsg){
		embed.addField("Already Disabled", "The leave message is already disabled and therefore cannot be removed.");
		return message.channel.send({ embeds: [embed] });
	}
	sqlRun(`UPDATE settings SET leaveMsg = null WHERE guild = ?`, message.guild.id);
	client.log(`"${message.guild.name}" removed their welcome message`, `SQL`);

	embed.addField("Deleted Setting", "The leave message has been removed.");
	const m = await message.channel.send({ embeds: [embed] });
	return await delMsg(client, message, m);
};
