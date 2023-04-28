const cron = require("node-cron");

async function cronEvents(client){
	// Book Alerts
	const bookAlerts = require("./bookAlerts.js");
	cron.schedule("37 0 0-14 * * 2-6", async () => {
		bookAlerts(client);
	});

	// Weather Data
	if(process.platform !== "win32"){
		const dailyWeather = require("./dailyWeather.js");
		cron.schedule("21 0 10 * * *", async () => {
			dailyWeather(client);
		});
	}
}

module.exports = cronEvents;