const fs = require("fs");
const timeData = require("./modules/currentTime.js");
const Discord = require("discord.js");

/**
 * @name weatherData
 * @param {Discord.Client} client The discord client
 * @returns {Promise<Void>}
 * @description Gets the weather data and adds it to ./data/weather.csv
**/
function weatherData(client){

	if(process.platform === "win32") return;

	// Get the weather data using curl, and add it to ./data/weather.csv
	const command = `curl https://wttr.in/${client.config.weatherLoc}?format=j2`;
	require("child_process").exec(command, (error, result) => {
		// Error
		if(error) return client.output("error", `Failed to get weather data: ${error.message}`);

		// Success
		if(result){
			// Parse the JSON
			const weather = JSON.parse(result);

			const curTime = timeData();
			// Get the current date
			const iso = curTime.iso;

			// Weather Data
			const town = weather.nearest_area[0].areaName[0].value;
			const region = weather.nearest_area[0].region[0].value;
			const country = weather.nearest_area[0].country[0].value;

			const currentTemp = weather.current_condition[0].temp_C;
			const currentFeelsLike = weather.current_condition[0].FeelsLikeC;
			const currentHumidity = weather.current_condition[0].humidity;

			const precipitation = weather.current_condition[0].precipMM;
			const weatherDesc = weather.current_condition[0].weatherDesc[0].value;
			const currentWindSpeed = weather.current_condition[0].windspeedKmph;
			const currentWindDirection = weather.current_condition[0].winddir16Point;

			const maxTemp = weather.weather[0].maxtempC;
			const avgtemp = weather.weather[0].avgtempC;
			const minTemp = weather.weather[0].mintempC;
			const sunrise = weather.weather[0].astronomy[0].sunrise;
			const sunset = weather.weather[0].astronomy[0].sunset;

			const moonPhase = weather.weather[0].astronomy[0].moon_phase;

			// Create the CSV string
			// iso, currentTemp, feelsLike, minTemp, maxTemp, avgTemp, humidity, precipitation, weather, windSpeed, windDirection, sunrise, sunset, moonPhase
			const weatherData = `${iso},${town},${region},${country},${currentTemp},${currentFeelsLike},${minTemp},${maxTemp},${avgtemp},${currentHumidity},${precipitation},${weatherDesc},${currentWindSpeed},${currentWindDirection},${sunrise},${sunset}, ${moonPhase}`;

			// Append the CSV string to the file
			fs.appendFileSync("./data/weather.csv", weatherData);

			client.output("info", "Daily weather data has been recorded.");
		}
	});
}

module.exports = weatherData;

/*
	Example:
	{
		"current_condition": [
			{
				"FeelsLikeC": "20",
				"FeelsLikeF": "69",
				"cloudcover": "7",
				"humidity": "46",
				"localObsDateTime": "2023-04-25 10:02 AM",
				"observation_time": "12:02 AM",
				"precipInches": "0.0",
				"precipMM": "0.0",
				"pressure": "1026",
				"pressureInches": "30",
				"temp_C": "20",
				"temp_F": "69",
				"uvIndex": "6",
				"visibility": "10",
				"visibilityMiles": "6",
				"weatherCode": "113",
				"weatherDesc": [
					{
						"value": "Sunny"
					}
				],
				"weatherIconUrl": [
					{
						"value": ""
					}
				],
				"winddir16Point": "ESE",
				"winddirDegree": "109",
				"windspeedKmph": "25",
				"windspeedMiles": "15"
			}
		],
		"nearest_area": [
			{
				"areaName": [
					{
						"value": "Toowoomba"
					}
				],
				"country": [
					{
						"value": "Australia"
					}
				],
				"latitude": "-27.550",
				"longitude": "151.967",
				"population": "131258",
				"region": [
					{
						"value": "Queensland"
					}
				],
				"weatherUrl": [
					{
						"value": ""
					}
				]
			}
		],
		"request": [
			{
				"query": "Lat -27.56 and Lon 151.95",
				"type": "LatLon"
			}
		],
		"weather": [
			{
				"astronomy": [
					{
						"moon_illumination": "24",
						"moon_phase": "Waxing Crescent",
						"moonrise": "11:00 AM",
						"moonset": "09:12 PM",
						"sunrise": "06:14 AM",
						"sunset": "05:26 PM"
					}
				],
				"avgtempC": "17",
				"avgtempF": "62",
				"date": "2023-04-25",
				"maxtempC": "24",
				"maxtempF": "75",
				"mintempC": "12",
				"mintempF": "54",
				"sunHour": "10.5",
				"totalSnow_cm": "0.0",
				"uvIndex": "4"
			},
			{
				"astronomy": [
					{
						"moon_illumination": "32",
						"moon_phase": "Waxing Crescent",
						"moonrise": "11:51 AM",
						"moonset": "10:06 PM",
						"sunrise": "06:14 AM",
						"sunset": "05:25 PM"
					}
				],
				"avgtempC": "16",
				"avgtempF": "61",
				"date": "2023-04-26",
				"maxtempC": "24",
				"maxtempF": "75",
				"mintempC": "12",
				"mintempF": "54",
				"sunHour": "10.0",
				"totalSnow_cm": "0.0",
				"uvIndex": "4"
			},
			{
				"astronomy": [
					{
						"moon_illumination": "42",
						"moon_phase": "First Quarter",
						"moonrise": "12:37 PM",
						"moonset": "11:03 PM",
						"sunrise": "06:15 AM",
						"sunset": "05:25 PM"
					}
				],
				"avgtempC": "17",
				"avgtempF": "62",
				"date": "2023-04-27",
				"maxtempC": "22",
				"maxtempF": "71",
				"mintempC": "13",
				"mintempF": "56",
				"sunHour": "9.3",
				"totalSnow_cm": "0.0",
				"uvIndex": "4"
			}
		]
	}
*/
