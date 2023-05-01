const { Client, Message, PermissionsBitField } = require('discord.js');
const { permLevel, grabEmoji } = require('../src/functions.js');


/**
 * @name messageCreate
 * @param {Client} client The discord client
 * @param {Message} message THe message that was created
 * @description Emitted whenever a message is created.
 * @returns {Promise<void>}
**/
async function run(client, message){
	// Handle partials
	try {
		if(message.partial) await message.fetch().catch(e => { return; });
		if(message.author.partial) await message.author.fetch().catch(e => { return; });
		if(message.member.partial) await message.member.fetch().catch(e => { return; });
	} catch (e){ return; }

	// Guard Clauses
	const messageIsDefaultType = (message.type === 0);
	const isDMChannel = (message.channel.type === 1);
	const authorIsBot = message.author.bot;
	const canViewChannel = message.channel.permissionsFor(message.guild.members.me).has(PermissionsBitField.Flags.ViewChannel);
	if(!messageIsDefaultType) return;
	if(isDMChannel) return;
	if(authorIsBot) return;
	if(!canViewChannel) return;

	// Check if the message mentions "everyone", react appropriately if so
	if(message.mentions.everyone && message.channel.permissionsFor(message.guild.members.me).has(PermissionsBitField.Flags.AddReactions)){
		let emoji = grabEmoji(client, "519919364485677066");
		emoji = (emoji) ? emoji : "😠";
		message.react(client.emojis.cache.get("519919364485677066")).catch(e => { return; });
	}

	const prefix = client.config.prefix;
	if(!message.content.startsWith(prefix)) return;

	// Check if we can even send a message in response
	if(!message.channel.permissionsFor(message.guild.members.me).has(PermissionsBitField.Flags.SendMessages)) return;
	if(!message.channel.permissionsFor(message.guild.members.me).has(PermissionsBitField.Flags.EmbedLinks)){
		const str = "I need embed permissions to function. Please grant me them then try the command again.";
		return message.reply({ content: str }).catch(e => { return; });
	}

	// Replace all line breaks with zero-width spaces and then split via whitespace to get our arguments
	const args = message.content.replace(/(?:\r\n|\r|\n)/g, "\u200b").split(/\s+/g);
	const commandName = args.shift().slice(prefix.length).toLowerCase(); // Get the name of the command we want

	const command = client.commands.get(commandName) || client.altNames.get(commandName);

	if(!command) return;
	if(!command.info.enabled || command.info.permLevel > permLevel(client, message.author, message.channel)) return;
	// At this point, the command exists, is enabled and the person has permission to run it

	await command.run(client, message, args);
}


const info = {
	name: "messageCreate",
	description: "Emitted whenever a message is created.",
	enabled: true
};


module.exports = { run, info };