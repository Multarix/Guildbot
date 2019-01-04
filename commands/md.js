exports.run = (client, message, args, level) => {

	if(!args[0]){
		return message.channel.send("Yea um.. you didn't specify how many messages to delete you moron.");
	}

	if(!parseInt(args[0])){
		return message.channel.send("Yea hey idiot... That's not a number.");
	}

	const messagecount = parseInt(args[0]);
	var toDelete = messagecount + 1;	// eslint-disable-line no-var
	if(toDelete >= 101){
		var toDelete = 100;	// eslint-disable-line no-var, no-redeclare
	}

	if(!message.guild.me.permissionsIn(message.channel.id).has("MANAGE_MESSAGES")){
		return message.reply("I dun have permission to delete messages. Fking Amatuer smh.").catch(console.error);
	} else {
		message.channel.fetchMessages({ limit: toDelete }).then(messages => message.channel.bulkDelete(messages)).catch(console.error);
	}

};

exports.conf = {
	enabled: true,
	guildOnly: false,
	aliases: ["massdelete"],
	permLevel: 3,
};

exports.help = {
	name: "md",
	category: "Moderation",
	description: "Deletes the specified amount of posts",
	usage: "md](<..number>)",
};
