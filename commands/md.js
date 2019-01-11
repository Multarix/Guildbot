const sql = require("sqlite");

exports.run = (client, message, args, level) => {
	if(!args[0]){
		return message.channel.send(`Usage: [md](<..number>)`, { code: "markdown" });
	}

	if(!parseInt(args[0])){
		return message.channel.send(`Yea hey.. \`${args[0]}\` isn't a number.`);
	}

	const messagecount = parseInt(args[0]);
	let toDelete = messagecount + 1;
	if(toDelete >= 101){
		toDelete = 100;
	}

	if(!message.channel.memberPermissions(message.guild.me).has("MANAGE_MESSAGES")){
		return message.reply("I don't have permission to delete messages.").catch(console.error);
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
	description: "Mass deletes the specified amount of posts",
	usage: "md](<..number>)",
};
