import cron from "node-cron";

import dailyWeather from "./dailyWeather.js";
// import bookAlerts from "./bookAlerts.mjs";


async function cronEvents(client){
	// Book Alerts
	cron.schedule("0/15 0-1 0-14 * * 2-6", async () => {
		bookAlerts(client);
	});

	// Weather Data
	try {
		cron.schedule("0 5 10 * * *", async () => {
			dailyWeather(client);
		});
	} catch (err){
		console.log("Failed to load dailyWeather.mjs");
	}

}


export default cronEvents;
