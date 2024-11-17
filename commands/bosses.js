import { SlashCommandBuilder, Client, Message, ChatInputCommandInteraction } from "discord.js";

const Day = {
	MONDAY: 8,
	TUESDAY: 2,
	WEDNESDAY: 3,
	THURSDAY: 4,
	FRIDAY: 5,
	SATURDAY: 6,
	SUNDAY: 7
};

/**
 * @name ping
 * @param {Client} client The discord client
 * @param {Message|ChatInputCommandInteraction} element The message or interaction that was created
 * @param {String[]} [_args] The arguments passed to the command
 * @returns {Promise<void>}
**/
async function run(client, element, args = []){
	const d = new Date();

	// Base everything off of UTC so dayshit time doesn't affect things (Seriously, just abolish DST already, anyone who uses it afterwards should be thrown in prison)
	const utcDate = d.getUTCDate();
	const utcDay = d.getUTCDay();

	d.setUTCDate(utcDate + (((Day["SUNDAY"] - utcDay) % 7) || 7));
	d.setUTCHours(1); // Army time hours here as a reminder
	d.setUTCMinutes(30);
	d.setUTCSeconds(0);
	d.setUTCMilliseconds(0);

	const secondGuild = (!args[0]) ? "" : "<@&1271901756451983491>";

	const timestamp = Math.floor(d.getTime() / 1000);
	const staticMessage = `<@&1169466975064424458> ${secondGuild}
	Guild bosses on Balenos 3 <t:${timestamp}:R>, aka at <t:${timestamp}:t>.

	A platoon will be formed up to 15-30mins prior, depending on how spicy we are feeling.
	At the specified time, a CTG (Call to Gather) will be sent out. If your contract is expired, you're inside a mapless zone (Magoria, Valencia Desert) or the incorrect channel, you will not be able to accept it. If you're on your horse when the CTG goes out, it will be teleported with you.

	If you do not have a fast horse (T8 Courser+) some of us will have T9 Dooms with two seater, or T10 Dooms that you can jump on.

	You do not lose crystals/ xp on death to guild bosses.
	There is no level or gear restriction (but we recommend at least being level 60 with full PEN Tuvala)

	Boss Order:
	Puturum -> Ferrid -> Mudster -> Khan
	*A permanent version of this message can be found in #guild-bosses*`.replace(/\t/g, "");

	const blockified = "```md\n{content}\n```";
	element.reply(blockified.replace("{content}", staticMessage));
}


const info = {
	name: "bosses",
	altNames: ["guildboss", "guild"],
	description: "Creates a message for the next guild boss time",
	usage: "bosses",
	enabled: true,
	dmCompatible: true,
	permLevel: 0,
	category: "misc"
};


/**
 * @name slash
 * @param {Client} client The discord client
 * @param {Boolean} [funcs] Whether to return the functions or the data
 * @returns {Object} The slash command data or functions
**/
function slash(client, funcs = false){
	if(!funcs){ // We want to get the slash command data
		return {
			data: new SlashCommandBuilder()
				.setName(info.name)
				.setDescription(info.description)
				.setDMPermission(info.dmCompatible)
				.addBooleanOption(option => option.setRequired(false)
					.setName("altguild")
					.setDescription("If the second guild should be pinged or not")
				)
		};
	}

	return {
		/**
		 * @name execute
		 * @param {ChatInputCommandInteraction} interaction The interaction that was created
		 * @description The function that is called when the slash command is used
		**/
		execute: async function execute(interaction){
			const args = [];
			const altguild = interaction.options.getBoolean("altguild");
			if(altguild) args.push(altguild);

			await run(client, interaction, args);
		}
	};
}

export { run, slash, info };