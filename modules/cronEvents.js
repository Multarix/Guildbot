import cron from "node-cron";

// import dailyWeather from "./dailyWeather.js";
import bookAlerts from "./bookAlerts.js";


async function cronEvents(client){
	if(!process.env.bookUpdateURL || process.env.bookUpdateURL === "jnovel json feed url") return console.error("Book Update URL was not set, skipping cron events.");
	if(!process.env.bookUpdatesChannel || process.env.bookUpdatesChannel === "channel id") return console.error("error", "Book Update Channel was not set, skipping cron events.");

	cron.schedule("0 0-15 * * 2-6", async () => {
		await bookAlerts(client);
	});
}


export default cronEvents;
