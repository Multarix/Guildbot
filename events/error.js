const { output } = require("../src/functions.js");


async function run(_client, error){
	output("error", `${error}`);
}


const info = {
	name: "error",
	description: "Emitted when the client encounters an error",
	enabled: true
};


module.exports = { run, info };