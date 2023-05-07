import dailyWeather from "./dailyWeather.mjs";
import bookAlerts from "./bookAlerts.mjs";

import { createRequire } from "module";
const require = createRequire(import.meta.url);

const cron = require("node-cron");

async function cronEvents(client){
	// Book Alerts
	cron.schedule("0/15 0-1 0-14 * * 2-6", async () => {
		bookAlerts(client);
	});

	// Weather Data
	try {
		cron.schedule("21 0 10 * * *", async () => {
			dailyWeather(client);
		});
	} catch (err){
		console.log("Failed to load dailyWeather.mjs");
	}

}


export default cronEvents;