const { Client, Message, PermissionsBitField } = require('discord.js');

/**
 * @name messageCreate
 * @param {Client} client The discord client
 * @param {Message} message THe message that was created
 * @description Emitted whenever a message is created.
 * @returns {Promise<void>}
**/
async function run(client, message){
	try {
		if(message.partial) await message.fetch().catch(e => { return; });
		if(message.author.partial) await message.author.fetch().catch(e => { return; });
		if(message.member.partial) await message.member.fetch().catch(e => { return; });
	} catch (e){ return; }

	if(message.author.bot) return;
	if(message.channel.type === "DM") return;
	if(!message.channel.permissionsFor(message.guild.members.me).has(PermissionsBitField.Flags.SendMessages)) return;


	if(message.mentions.everyone){

		if(message.channel.permissionsFor(message.guild.members.me).has(PermissionsBitField.Flags.AddReactions)){
			let emoji = client.grabEmoji("519919364485677066");
			emoji = (emoji) ? emoji : ">:(";
			message.react(client.emojis.cache.get("519919364485677066"));
		}
	}

	if(!message.content.startsWith(client.config.prefix)) return;

	const lowerMsg = message.content.toLowerCase();
}

const info = {
	name: "messageCreate",
	description: "Emitted whenever a message is created.",
	enabled: true
};

module.exports = { run, info };