import cron from "node-cron";

// import dailyWeather from "./dailyWeather.js";
import bookAlerts from "./bookAlerts.js";


async function cronEvents(client){
	if(!process.env.bookUpdateURL || process.env.bookUpdateURL === "jnovel json feed url") return client.log("error", "Book Update URL was not set, skipping cron events.");
	if(!process.env.bookUpdatesChannel || process.env.bookUpdatesChannel === "channel id") return client.log("error", "Book Update Channel was not set, skipping cron events.");
	cron.schedule("0/15 0-1 0-14 * * 2-6", bookAlerts.bind(null, client));
}


export default cronEvents;
