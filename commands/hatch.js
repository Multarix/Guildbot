exports.run = (client, message, args) => {
	const Discord = require('discord.js');
	const embed = new Discord.MessageEmbed()
		.setTitle(`Masuda Method Breeding`)
		.setFooter(client.user.tag, client.user.displayAvatarURL())
		.setTimestamp();

	let num = parseInt(args[0]);
	let rounds = parseInt(args[1]);

	if(!num) return message.channel.send("Not a Number, please try again");
	if(!rounds) rounds = 1;


	if(num > 5000) num = 5000;
	if(rounds > 21) rounds = 21;

	embed.setDescription(`Eggs Per Attempt: ${num}\nTotal Eggs: ${num * rounds}`);

	let average = 0;
	let totalShinyCount = 0;
	for(let i = 0; i < rounds; i++){
		let shinyCount = 0;
		let shinyMessage = "";

		for(let ii = 0; ii < num; ii++){

			const shinyCheck = Math.floor(Math.random() * 512 + 1);
			if(shinyCheck === 1){
				shinyCount += 1;
				shinyMessage += `Shiny #${shinyCount}: Egg #${ii + 1}\n`;
			}
		}
		average += shinyCount;
		embed.addField(`Round #${i + 1}`, `Shinies \:star:: ${shinyCount}`, true); /* eslint-disable-line no-useless-escape */
	}
	totalShinyCount = average;
	average = Math.round((average * 100) / rounds) / 100;
	embed.addField("Stats", `Average: ${average}\:star:\n Total: ${totalShinyCount}\:star:`, false); /* eslint-disable-line no-useless-escape */

	message.channel.send({ embed });
};


exports.conf = {
	enabled: true,
	allowDM: true,
	aliases: ["eh", "hatch"],
	permLevel: 1
};

exports.help = {
	name: "hatch",
	category: "Fun",
	description: "Hatches pokemon eggs using Masuda Method + Shiny Charm calculations",
	usage: "Amount-Of-Eggs Attempts"
};
