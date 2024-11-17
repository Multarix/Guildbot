import { output } from "../src/functions.js";


async function run(_client, error){
	output(client, "error", `${error}`);
}


const info = {
	name: "error",
	description: "Emitted when the client encounters an error",
	enabled: true
};


export { run, info };