// Dangerous to test/ Annoying to set up
const Discord = require("discord.js");
const delMsg = require("./config/delMsg.js");
exports.run = async (client, message, args) => {

	const secondary = args[0];
	if(!args[0]) return message.channel.send("Usage: [selfassign](<..set/add/remove>)", { code: "markdown" });

	const saData = sqlGet(`SELECT * FROM settings WHERE guild = ?`, message.guild.id);
	let match = [];

	const roleData = saData.assignRoles;
	const channelID = saData.assignChannel;
	const messageID = saData.assignMessage;

	// Check if the channel exists, if it doesnt return the channel as null and update the database
	let channel = undefined;
	if(channelID) channel = await grabChannel(channelID);
	if(channelID && !channel){
		sqlRun(`UPDATE settings SET assignChannel = null, assignMessage = null WHERE guild = ?`, message.guild.id);
	}
	// Check if the message exists, if it doesnt, return the message as null and update the database
	let assignMessage = undefined;
	if(channel && messageID) assignMessage = await channel.messages.fetch(messageID).catch(e => { return null; });
	if(messageID && !assignMessage) sqlRun(`UPDATE settings SET assignMessage = null WHERE guild = ?`, message.guild.id);

	// Embed variable
	const embed = new Discord.MessageEmbed()
		.setTitle("Self Assignable Roles")
		.setDescription("React with one of the following emoji to recieve the corresponding role\n\u200b")
		.setColor(14487568)
		.setFooter(client.user.tag, client.user.displayAvatarURL());

	// Setting the self assign channel
	match = ["set", "channel"];
	if(match.includes(secondary)){
		if(channel){
			if(channel.id === message.channel.id){
				const m = await message.channel.send(`\`${message.channel.name}\` is already set as the selfassign channel.`);
				return await delMsg(client, message, m);
			}
		}
		const m = await message.channel.send(`Set \`${message.channel.name}\` to be the self assign channel?\n\`Yes\` / \`No\``);
		const response = ["y", "yes", "n", "no"];
		const messageFilter = x => x.author.id === message.author.id && response.includes(x.content.toLowerCase());
		const collected = await	message.channel.awaitMessages({ filter: messageFilter, max: 1, time: 15000, errors: ['time'] }).catch(() => {
			m.edit("Command Canceled").then(m => {
				delMsg(client, message, m);
				return undefined;
			});
		});
		if(!collected) return;
		const msg = collected.first();
		// Response was no
		match = ["no", "n"];
		if(match.includes(msg.content.toLowerCase())){
			await m.edit("Command Canceled.");
			return await delMsg(client, message, m);
		}
		// Response was yes
		match = ["yes", "y"];
		if(match.includes(msg.content.toLowerCase())){
			sqlRun(`UPDATE settings SET assignChannel = ? WHERE guild = ?`, message.channel.id, message.guild.id);
			await m.edit(`Auto-Assign channel has been set to \`${message.channel.name}\`.`);
			setTimeout(() => msg.delete(), 10000);
			return await delMsg(client, message, m);
		}
	}

	// Adding a new role to the list
	match = ["add", "addrole", "new", "newrole"];
	if(match.includes(secondary)){
		if(!channel) return message.channel.send(`The self assign channel has not been set, please use \`!selfassign set\` in the channel you wish to be used for self assign roles`);
		if(!args[1]) return message.channel.send("Usage: [selfassign](add) < role >", { code: "markdown" });
		const role = grabRole(args[1], message.guild);
		if(!role){
			const m = await message.channel.send("That's not a valid role. Please tag the role.");
			return await delMsg(client, message, m);
		}
		if(role.comparePositionTo(message.guild.me.roles.highest) >= 0){
			const m = await message.channel.send("That's quite a powerful role you got there, sadly, my powerlevel is inferior, so I can't assign that role to others.");
			return await delMsg(client, message, m);
		}
		if(roleData){
			if(roleData.includes(`(${role.id})`)){
				const m = await message.channel.send("That role is already set. If you'd like to update it, please delete it and re-add it.");
				return await delMsg(client, message, m);
			}
		}
		// Send a message and await a message reaction.
		const reactionFilter = (reaction, user) => reaction.emoji.name !== "⭐" && user.id === message.author.id;
		const m = await message.channel.send(`Please react to this message with the emoji you'd like to use for the \`${role.name}\` role.\nPlease note, it cannot be the :star: emoji.`);
		const collected = await m.awaitReactions({ filter: reactionFilter, max: 1, time: 30000, errors: ['time'] }).catch(() => {
			delMsg(client, message, m);
			return undefined;
		});
		if(!collected) return;
		const emoji = collected.first().emoji;
		let emojiInfo;
		if(emoji.id){
			if(!client.emojis.cache.get(emoji.id)){
				await m.edit("Woah hang on there bud, I don't have access to your fancy emoji. Try that command again.");
				return await delMsg(client, message, m);
			}
			emojiInfo = emoji.id;
		} else {
			emojiInfo = emoji.name;
		}

		// Add the data to the set if the set exists.
		let roleDataInfo = [`[${emojiInfo}](${role.id})`];
		let roleDataString = `[${emojiInfo}](${role.id})`;
		if(roleData){
			roleDataInfo = roleData.split("*");
			roleDataInfo.push(`[${emojiInfo}](${role.id})`);
			roleDataString = roleDataInfo.join("*");
		}

		// Split the emoji and role id to a more friendly format.
		const emojiRoles = [];
		roleDataInfo.forEach(x => {
			const emojiID = x.match(/\[(.*?)\]/)[0].replace(/[\][]/g, "");
			const roleID = x.match(/\((.*?)\)/)[0].replace(/[)(]/g, "");
			return emojiRoles.push({ emojiID, roleID });
		});

		await sqlRun(`UPDATE settings SET assignRoles = ? WHERE guild = ?`, roleDataString, message.guild.id);

		// Grab the emoji object and role name, add them to the embed.
		let i;
		let actualEmoji;
		for(i = 0; i < emojiRoles.length; i++){
			actualEmoji = emojiRoles[i].emojiID;
			if(client.emojis.cache.get(actualEmoji)) actualEmoji = client.emojis.cache.get(actualEmoji);
			embed.addField(`${actualEmoji} - ${grabRole(emojiRoles[i].roleID, message.guild.id).name}`, `\u200b`, false);
		}

		// Check if there is a reaction message already, if so edit it, otherwise send one.
		if(messageID){
			let msg = await channel.messages.fetch(messageID);
			if(!msg){
				msg = await channel.send({ embeds: [embed] });
				await sqlRun(`UPDATE settings SET assignMessage = ? WHERE guild = ?`, msg.id, message.guild.id);
				await saReact(msg);
				return await delMsg(client, message, m);
			} else {
				await msg.edit({ embeds: [embed] });
				await saReact(msg);
				return await delMsg(client, message, m);
			}
		} else {
			const msg = await channel.send({ embeds: [embed] });
			sqlRun(`UPDATE settings SET assignMessage = ? WHERE guild = ?`, msg.id, message.guild.id);
			saReact(msg);
			return await delMsg(client, message, m);
		}
	}

	// Removing a role from the list
	match = ["remove", "removerole", "delete", "deleterole"];
	if(match.includes(secondary)){
		if(!channel) return message.channel.send(`The self assign channel has not been set, please use \`!selfassign set\` in the channel you wish to be used for self assign roles`);
		if(!assignMessage) return message.channel.send(`The self assign message is not valid.`);
		if(!args[1]) return message.channel.send("Usage: [selfassign](remove) < role >", { code: "markdown" });
		const role = grabRole(args[1], message.guild);
		if(!role){
			const m = await message.channel.send("That's not a valid role. Please tag the role.");
			return await delMsg(client, message, m);
		}
		if(!roleData.includes(`(${role.id})`)){
			const m = await message.channel.send("That role is already not in the self assign roles.\nIf you deleted a role prior to updating the bot, you'll need to do `!selfassign reset`");
			return await delMsg(client, message, m);
		}

		// Find the role to delete, and don't add it to the new array.
		const updateRoles = [];
		const updateSQL = [];
		const splitRoles = roleData.split("*");
		splitRoles.forEach(y => {
			if(y.includes(`(${role.id})`)) return;
			updateSQL.push(y);

			const emojiID = y.match(/\[(.*?)\]/)[0].replace(/[\][]/g, "");
			const roleID = y.match(/\((.*?)\)/)[0].replace(/[)(]/g, "");

			return updateRoles.push({ emojiID, roleID });
		});
		const updateSQLString = updateSQL.join("*");

		// Create the embed
		let i;
		let actualEmoji;
		for(i = 0; i < updateRoles.length; i++){
			actualEmoji = updateRoles[i].emojiID;
			if(client.emojis.cache.get(actualEmoji)) actualEmoji = client.emojis.cache.get(actualEmoji);
			embed.addField(`${actualEmoji} - ${grabRole(updateRoles[i].roleID, message.guild.id).name}`, `\u200b`, false);
		}

		await sqlRun(`UPDATE settings SET assignRoles = ? WHERE guild = ?`, updateSQLString, message.guild.id);
		const msg = await channel.messages.fetch(messageID).catch(() => { return undefined; });
		if(!msg) return;
		await msg.edit({ embeds: [embed] });
		saReact(msg);
		return await message.delete();
	}

	// Completely remove all self assign data from the sql related to the guild. (Useful for if you delete a role without first updating the bot.)
	match = ["reset", "reload", "retry"];
	if(match.includes(secondary)){
		const m = await message.channel.send("This will remove **__ALL__** roles from the self assign message.\nAre you sure you wish to proceed?\n`Yes` / `No`");
		const response = ["y", "yes", "n", "no"]; // array
		const filter = x => x.author.id === message.author.id && response.includes(x.content.toLowerCase());

		const c = await message.channel.awaitMessages({ filter, max: 1, time: 15000, errors: ['time'] }).catch(() => { message.channel.send("Command Canceled."); return undefined; });
		if(!c) return;
		const msg = c.first();
		// Yes response
		let reply = ["yes", "y"];
		if(reply.includes(msg.content.toLowerCase())){
			const mssg = await message.channel.send(`Working...`);

			if(assignMessage) await assignMessage.delete().catch(e => { return undefined; }); // Remove the self assign message
			sqlRun(`UPDATE settings SET assignChannel = null, assignMessage = null, assignRoles = null WHERE guild = ?`, message.guild.id); // Remove the self assign data from the SQL

			mssg.edit("Done!");
			await delMsg(client, message, m);
			return await delMsg(client, msg, mssg);
		}
		// No response
		reply = ["no", "n"];
		if(reply.includes(msg.content.toLowerCase())){
			const mssg = await message.channel.send("Command Canceled.");
			await delMsg(client, message, m);
			return await delMsg(client, msg, mssg);
		}
	}


	const m = await message.channel.send("That doesn't appear to be a valid argument. Try again.");
	return await delMsg(client, message, m);
};

exports.conf = {
	enabled: true,
	allowDM: false,
	aliases: ["sa", "assign"],
	permLevel: 4
};

exports.help = {
	name: "selfassign",
	category: "Moderation",
	description: "Self assign roles via reactions",
	usage: "set/add/remove ..channel/role"
};
