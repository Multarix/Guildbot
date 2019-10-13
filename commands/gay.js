exports.run = async (client, message, args) => {

	const tagged = await grabUser(args[0]);
	let geyPerson = message.author;
	if(tagged) geyPerson = tagged;

	if(geyPerson.id === "336709922647441409") return message.channel.send(`\`${geyPerson.username}\` is ${Math.floor(Math.random() * 100) + 100}% gey!`);
	const userArray = geyPerson.username.split("");
	let geyPercent = 0;
	userArray.forEach(char => {
		if(char.match(/[a-z]/)) return geyPercent += 1;
		if(char.match(/[A-Z]/)) return geyPercent += 2;
		if(char.match(/[1-9]/)) return geyPercent += parseInt(/[1-9]/.exec(char)[0]);
		return geyPercent += 5;
	});

	let idArray = geyPerson.id.split("").slice(1);
	let num = 0;
	while(num === 0){
		if(!idArray || idArray.length === 0){ num = 1; continue; }
		if(parseInt(idArray[0]) === 0){ idArray = idArray.slice(1); continue; }
		num = parseInt(idArray[0]);
	}
	geyPercent *= num;

	return message.channel.send(`\`${geyPerson.username}\` is ${geyPercent}% gey!`);
};

exports.conf = {
	enabled: true,
	allowDM: true,
	aliases: ["gey"],
	permLevel: 1,
};

exports.help = {
	name: "gay",
	category: "Misc",
	description: "See how gay you or someone else is",
	usage: "..user",
};
