exports.run = async (client, message, args, level) => {
	const invites = await message.guild.fetchInvites();
	const deleted = [];
	invites.forEach(i => {
		if(i.inviter && i.inviter.id !== i.guild.ownerID){
			if(!message.channel.memberPermissions(message.guild.me).has("MANAGE_GUILD")) return;
			deleted.push(`[${i.code}](${i.inviter.tag})`);
			return i.delete();
		}
	});
	client.log(`Deleted ${deleted.length} invites from the "${message.guild.name}" (${message.guild.id}) server`);

	let deletedMessage = `Deleted ${deleted.length} invites`;
	if(deleted.length !== 0) deletedMessage = `Deleted ${deleted.length} invites:\n${deleted.join("\n")}`;
	message.channel.send(deletedMessage, { code: "markdown" }).then(m => {
		if(!message.channel.memberPermissions(message.guild.me).has("MANAGE_MESSAGES")) return;
		message.delete();
	});
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: ["pinvites", "pinvs", "pinv", "deleteinvites", "deleteinvs", "deleteinv", "delinvs", "delinv"],
	permLevel: 5,
};

exports.help = {
	name: "purgeinvites",
	category: "Moderation",
	description: "Deletes all invite codes except the server owners.",
	usage: "..",
};
