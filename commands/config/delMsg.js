module.exports = async (client, message, msg) => {
	if(message.channel.permissionsFor(message.guild.me).has("MANAGE_MESSAGES")){
		try {
			await setTimeout(() => message.delete(), 10000);
			await setTimeout(() => msg.delete(), 10000);
		} catch (e){ client.log(e.message, "Error"); }
	}
};
