exports.run = async (client, message, args) => {

	if(!args[0]) return message.channel.send("Usage: [temp](<..type> <..temperature)", { code: "markdown" });

	const celArry = ["c", "celsius"];
	const farArray = ["f", "fahrenheit"];

	let temp1Type;
	let temp2Type;
	let tempConversion;

	switch(args[0]){
		case "f":
		case "fahrenheit":
			temp1Type = "°F";
			temp2Type = "°C";
			tempConversion = "f";
			break;
		case "c":
		case "celsius":
			temp1Type = "°C";
			temp2Type = "°F";
			tempConversion = "c";
			break;
		default:
			temp1Type = false;
			temp2Type = false;
			tempConversion = false;
	}

	if(!tempConversion) return message.channel.send("Invalid temperature type\nUsage: [temp](<..type> <..temperature)", { code: "markdown" });

	const temp = parseInt(args[1]);
	if(isNaN(temp)) return message.channel.send("The 2nd argument is not a number, please try again");

	const round = (num) => {
		const multiplier = Math.pow(10, 2);
		return Math.round(num * multiplier) / multiplier;
	};

	const convertFromCelsius = (num) => round(((num / 5) * 9) + 32);
	const convertToCelsius = (num) => round(((num - 32) * 5) / 9);

	const convertedTemp = (tempConversion === "c") ? convertToCelsius(temp) : convertFromCelsius(temp);
	return message.channel.send(`${temp}${temp1Type} is ${convertedTemp}${temp2Type}`);
};

exports.conf = {
	enabled: true,
	allowDM: true,
	aliases: ["temperature"],
	permLevel: 0
};

exports.help = {
	name: "temp",
	category: "Misc",
	description: "Convert temperatures between celsius and fahrenheit or vice versa",
	usage: "type ..temperature"
};
