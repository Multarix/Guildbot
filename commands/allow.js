exports.run = async (client, message, args) => {
	const user = await grabUser(args.shift());
	if(!user){
		return message.channel.send("No user was specified, please tag a user").then(msg => {
			if(message.channel.permissionsFor(message.guild.me).has("MANAGE_MESSAGES")){
				try {
					setTimeout(() => message.delete(), 10000);
					setTimeout(() => msg.delete(), 10000);
				} catch (e){ client.log(e.message, "Error"); }
			}
		});
	}

	const uniqueIdent = `${user.id}|${message.guild.id}`;

	if(client.allowed.has(uniqueIdent)) return;
	client.allowed.add(uniqueIdent);
	message.channel.send(`\`${user.tag}\` is allowed to post invite links for the next 10 minutes`).then(msg => {
		if(message.channel.permissionsFor(message.guild.me).has("MANAGE_MESSAGES")){
			try {
				setTimeout(() => message.delete(), 10000);
				setTimeout(() => msg.delete(), 600000);
			} catch (e){ client.log(e.message, "Error"); }
		}
	});

	setTimeout(() => {
		client.allowed.delete(uniqueIdent);
	}, 600000);
};

exports.conf = {
	enabled: true,
	allowDM: false,
	aliases: ["bypass"],
	permLevel: 4
};

exports.help = {
	name: "allow",
	category: "Moderation",
	description: "Allows a user to post links",
	usage: "user"
};
