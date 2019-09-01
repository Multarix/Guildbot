const Discord = require("discord.js");
const sql = require("sqlite");
exports.run = async (client, message, args, level) => {

	const secondary = args[0];
	if(!args[0]) return message.channel.send("Usage: [selfassign](<..set/add/remove>)", { code: "markdown" });

	const saData = await sql.get(`SELECT * FROM settings WHERE guild = "${message.guild.id}"`);
	let match = [];

	const roleData = saData.assignRoles;
	const channelID = saData.assignChannel;
	const messageID = saData.assignMessage;

	// Check if the channel exists, if it doesnt return the channel as null and update the database
	let channel = undefined;
	if(channelID) channel = grabChannel(channelID);
	if(channelID && !channel) {
		sql.run(`UPDATE settings SET assignChannel = null, assignMessage = null WHERE guild = "${message.guild.id}"`);
	}
	// Check if the message exists, if it doesnt, return the message as null and update the database
	let assignMessage = undefined;
	if(channel && messageID) assignMessage = channel.fetchMessage(messageID).catch(e => { return null; });
	if(messageID && !assignMessage) sql.run(`UPDATE settings SET assignMessage = null WHERE guild = "${message.guild.id}"`);

	// Embed variable
	const embed = new Discord.RichEmbed()
		.setTitle("Self Assignable Roles")
		.setDescription("React with one of the following emoji to recieve the corresponding role\n\u200b")
		.setColor(14487568)
		.setFooter(client.user.tag, client.user.displayAvatarURL);

	// Setting the self assign channel
	match = ["set", "channel"];
	if(match.includes(secondary)){
		if(channel){
			if(channel.id === message.channel.id){
				return message.channel.send(`\`${message.channel.name}\` is already set as the selfassign channel.`).then(m => {
					m.delete(15000);
					if(message.channel.memberPermissions(message.guild.me).has("MANAGE_MESSAGES")) message.delete();
				});
			}
		}
		return message.channel.send(`Set \`${message.channel.name}\` to be the self assign channel?\n\`Yes\` / \`No\``).then(m => {
			const response = ["y", "yes", "n", "no"];
			const messageFilter = m => m.author.id === message.author.id && response.includes(m.content.toLowerCase());
			message.channel.awaitMessages(messageFilter, { max: 1, time: 15000, errors: ['time'] }).then((collected) => {
				const msg = collected.first().content.toLowerCase();
				// Response was no
				match = ["no", "n"];
				if(match.includes(msg)) return message.channel.send("Command Canceled.");
				// Response was yes
				match = ["yes", "y"];
				if(match.includes(msg)){
					sql.run(`UPDATE settings SET assignChannel = "${message.channel.id}" WHERE guild = "${message.guild.id}"`);
					message.channel.send(`Auto-Assign channel has been set to \`${message.channel.name}\`.`).then(msng => {
						m.delete(15000);
						msng.delete(15000);
						if(message.channel.memberPermissions(message.guild.me).has("MANAGE_MESSAGES")) message.delete(15000);
					});
				}
			}).catch(e => {
				m.edit('Command Canceled.').then(m => {
					m.delete(15000);
					if(message.channel.memberPermissions(message.guild.me).has("MANAGE_MESSAGES")) message.delete(15000);
					return;
				});
			});
		});

	}

	// Adding a new role to the list
	match = ["add", "addrole", "new", "newrole"];
	if(match.includes(secondary)){
		if(!channel) return message.channel.send(`The self assign channel has not been set, please use \`!selfassign set\` in the channel you wish to be used for self assign roles`);
		if(!args[1]) return message.channel.send("Usage: [selfassign](add) < role >", { code: "markdown" });
		const role = grabRole(args[1], message.guild);
		if(!role){
			return message.channel.send("That's not a valid role. Please tag the role.").then(m => {
				m.delete(15000);
				if(message.channel.memberPermissions(message.guild.me).has("MANAGE_MESSAGES")) message.delete();
			});
		}
		if(role.comparePositionTo(message.guild.me.highestRole) >= 0){
			return message.channel.send("That's quite a powerful role you got there, sadly, my powerlevel is inferior, so I can't assign that role to others.").then(m => {
				m.delete(15000);
				if(message.channel.memberPermissions(message.guild.me).has("MANAGE_MESSAGES")) message.delete();
			});
		}
		if(roleData){
			if(roleData.includes(`(${role.id})`)){
				return message.channel.send("That role is already set. If you'd like to update it, please delete it and re-add it.").then(m => {
					m.delete(15000);
					if(message.channel.memberPermissions(message.guild.me).has("MANAGE_MESSAGES")) message.delete();
				});
			}
		}
		// Send a message and await a message reaction.
		const reactionFilter = (reaction, user) => reaction.emoji.name !== "⭐" && user.id === message.author.id;
		return message.channel.send(`Please react to this message with the emoji you'd like to use for the \`${role.name}\` role.\nPlease note, it cannot be the :star: emoji.`).then(m => {
			m.awaitReactions(reactionFilter, { max: 1, time: 30000, errors: ['time'] }).then(collected => {
				const emoji = collected.first().emoji;
				let emojiInfo;
				if(emoji.id){
					if(!client.emojis.get(emoji.id)){
						return m.edit("Woah hang on there bud, I don't have access to your fancy emoji. Try that command again.").then(m => {
							m.delete(15000);
							if(message.channel.memberPermissions(message.guild.me).has("MANAGE_MESSAGES")) message.delete();
						});
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

				sql.run(`UPDATE settings SET assignRoles = "${roleDataString}" WHERE guild = "${message.guild.id}"`);

				// Grab the emoji object and role name, add them to the embed.
				let i;
				let actualEmoji;
				for(i = 0; i < emojiRoles.length; i++) {
					actualEmoji = emojiRoles[i].emojiID;
					if(client.emojis.get(actualEmoji)) actualEmoji = client.emojis.get(actualEmoji);
					embed.addField(`${actualEmoji} - ${grabRole(emojiRoles[i].roleID, message.guild.id).name}`, `\u200b`, false);
				}

				// Check if there is a reaction message already, if so edit it, otherwise send one.
				if(messageID){
					return channel.fetchMessage(messageID).then(msg => {
						if(!msg){
							return channel.send({ embed }).then(msg => {
								sql.run(`UPDATE settings SET assignMessage = "${msg.id}" WHERE guild = "${message.guild.id}"`);
								m.delete();
								if(message.channel.memberPermissions(message.guild.me).has("MANAGE_MESSAGES")) message.delete();
								saReact(msg);
							});
						} else {
							return msg.edit({ embed }).then(msg => {
								m.delete();
								if(message.channel.memberPermissions(message.guild.me).has("MANAGE_MESSAGES")) message.delete();
								saReact(msg);
							});
						}
					});
				} else {
					return channel.send({ embed }).then(msg => {
						sql.run(`UPDATE settings SET assignMessage = "${msg.id}" WHERE guild = "${message.guild.id}"`);
						m.delete();
						if(message.channel.memberPermissions(message.guild.me).has("MANAGE_MESSAGES")) message.delete();
						saReact(msg);
					});
				}
			}).catch(e => {
				m.delete(15000);
				if(message.channel.memberPermissions(message.guild.me).has("MANAGE_MESSAGES")) message.delete(15000);
				return;
			});
		});
	}

	// Removing a role from the list
	match = ["remove", "removerole", "delete", "deleterole"];
	if(match.includes(secondary)){
		if(!channel) return message.channel.send(`The self assign channel has not been set, please use \`!selfassign set\` in the channel you wish to be used for self assign roles`);
		if(!assignMessage) return message.channel.send(`The self assign message is not valid.`);
		if(!args[1]) return message.channel.send("Usage: [selfassign](remove) < role >", { code: "markdown" });
		const role = grabRole(args[1], message.guild);
		if(!role){
			return message.channel.send("That's not a valid role. Please tag the role.").then(m => {
				m.delete(15000);
				if(message.channel.memberPermissions(message.guild.me).has("MANAGE_MESSAGES")) message.delete();
			});
		}
		if(!roleData.includes(`(${role.id})`)){
			return message.channel.send("That role is already not in the self assign roles.\nIf you deleted a role prior to updating the bot, you'll need to do `!selfassign reset`").then(m => {
				m.delete(15000);
				if(message.channel.memberPermissions(message.guild.me).has("MANAGE_MESSAGES")) message.delete();
			});
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
		for(i = 0; i < updateRoles.length; i++) {
			actualEmoji = updateRoles[i].emojiID;
			if(client.emojis.get(actualEmoji)) actualEmoji = client.emojis.get(actualEmoji);
			embed.addField(`${actualEmoji} - ${grabRole(updateRoles[i].roleID, message.guild.id).name}`, `\u200b`, false);
		}
		sql.run(`UPDATE settings SET assignRoles = "${updateSQLString}" WHERE guild = "${message.guild.id}"`);
		return channel.fetchMessage(messageID).then(msg => {
			msg.edit({ embed }).then(msg => {
				if(message.channel.memberPermissions(message.guild.me).has("MANAGE_MESSAGES")) message.delete();
				saReact(msg);
			});
		});
	}

	// Completely remove all roles from the list. (Useful for if you delete a role without first updating the bot.)
	match = ["reset", "reload", "retry"];
	if(match.includes(secondary)){
		return message.channel.send("This will remove **__ALL__** roles from the self assign message.\nAre you sure you wish to proceed?\n`Yes` / `No`").then(m => {
			const response = ["y", "yes", "n", "no"];
			const filter = m => m.author.id === message.author.id && response.includes(m.content.toLowerCase());

			message.channel.awaitMessages(filter, { max: 1, time: 15000, errors: ['time'] }).then(c => {
				const msg = c.first().content.toLowerCase();
				// Yes response
				let reply = ["yes", "y"];
				if(reply.includes(msg)){
					// Wipe all roles from sql
					sql.run(`UPDATE settings SET assignRoles = null WHERE guild = "${message.guild.id}"`);
					channel.fetchMessage(messageID).then(msg => {
						// Clear and remove all reactions from the message
						msg.edit({ embed });
						msg.clearReactions();
					});
					m.delete();
					if(message.channel.memberPermissions(message.guild.me).has("MANAGE_MESSAGES")) c.first().delete();
					message.delete();
				}
				// No response
				reply = ["no", "n"];
				if(reply.includes(msg)) return message.channel.send("Command Canceled.");

			}).catch(e => { message.channel.send("Command Canceled."); });
		});
	}

	return message.channel.send("That doesn't appear to be a valid argument. Try again.").then(m => {
		m.delete(15000);
		if(message.channel.memberPermissions(message.guild.me).has("MANAGE_MESSAGES")) message.delete();
	});
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: ["sa", "assign"],
	permLevel: 4,
};

exports.help = {
	name: "selfassign",
	category: "Moderation",
	description: "Self assign roles via reactions",
	usage: "set/add/remove ..channel/role",
};
