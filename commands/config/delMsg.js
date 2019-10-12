module.exports = async (client, message, msg) => {
	if(message.channel.permissionsFor(message.guild.me).has("MANAGE_MESSAGES")){
		try {
			await message.delete({ timeout: 10000 });
			await msg.delete({ timeout: 10000 });
		} catch (e){ client.log(e.message, "Error"); }
	}
};
