async function run(client, error){
	client.output("error", error);
}

const info = {
	name: "error",
	description: "Emitted when the client encounters an error",
	enabled: true
};

module.exports = { run, info };