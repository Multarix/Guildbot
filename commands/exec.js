exports.run = async (client, message, args) => {
	const joinArgs = args.join(" ");
	client.log(joinArgs, "Exec");
	require("child_process").exec(joinArgs, (error, result) => {
		if(error) return client.log(error.message, "Exec Output");
		if(result) return client.log(`${result}`, "Exec Output");
	});
};

exports.conf = {
	enabled: true,
	allowDM: true,
	aliases: ["cmd"],
	permLevel: 10,
};

exports.help = {
	name: "exec",
	category: "System",
	description: "Command Line Stuff",
	usage: "code",
};
