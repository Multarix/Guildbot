const delMsg = require("./config/delMsg.js");
exports.run = async (client, message, args) => {

	if(!message.channel.memberPermissions(message.guild.me).has("MANAGE_GUILD")) return;
	const invites = await message.guild.fetchInvites();
	const deleted = [];
	invites.forEach(i => {
		if(i.inviter && i.inviter.id !== i.guild.ownerID){
			deleted.push(`[${i.code}](${i.inviter.tag})`);
			return i.delete();
		}
	});
	client.log(`Deleted ${deleted.length} invites from the "${message.guild.name}" (${message.guild.id}) server`);

	let deletedMessage = `Deleted ${deleted.length} invites`;
	if(deleted.length !== 0) deletedMessage = `Deleted ${deleted.length} invites:\n${deleted.join("\n")}`;
	const m = await message.channel.send(deletedMessage, { code: "markdown" });
	return await delMsg(client, message, m);
};

exports.conf = {
	enabled: true,
	allowDM: false,
	aliases: ["pinvites", "pinvs", "pinv", "deleteinvites", "deleteinvs", "deleteinv", "delinvs", "delinv"],
	permLevel: 5,
};

exports.help = {
	name: "purgeinvites",
	category: "Moderation",
	description: "Deletes all invite codes except the server owners.",
	usage: "..",
};
