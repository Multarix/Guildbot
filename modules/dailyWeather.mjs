import fetch from "node-fetch";

import { createRequire } from "module";
const require = createRequire(import.meta.url);

const fs = require("fs");
const { output, timeFormat } = require("../src/functions.js");


/**
 * @name getWeather
 * @param {*} client
 * @returns {void}
**/
async function getWeather(client){
	const weatherLoc = client.config.weatherLoc;
	if(!weatherLoc) return output("error", "No weather location has been set! Please set one in the config file.");
	try {
		fs.readFileSync("./data/weather.csv", { encoding: "utf8" });
		const response = await fetch(`https://wttr.in/${weatherLoc}?format=j2`);
		const text = await response.text();

		/**
		 * @name weather
		 * @type {weatherDesc}
		 * @description The returned weather data
		**/
		const weather = JSON.parse(text);

		const curTime = timeFormat();
		// Get the current date
		const iso = curTime.ISO;

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
		const weatherData = `\n${iso},${town},${region},${country},${currentTemp},${currentFeelsLike},${minTemp},${maxTemp},${avgtemp},${currentHumidity},${precipitation},${weatherDesc},${currentWindSpeed},${currentWindDirection},${sunrise},${sunset}, ${moonPhase}`;

		// Append the CSV string to the file
		fs.appendFileSync("./data/weather.csv", weatherData, { encoding: "utf8" });

		output("info", "Daily weather data has been recorded.");

	} catch (err){
		output("error", `Failed to get weather data!`);
		console.log(err);
	}
}

export default getWeather;

/**
 * @typedef {object} weatherDesc
 * @property {object[]} current_condition
 * @property {string} current_condition.FeelsLikeC
 * @property {string} current_condition.FeelsLikeF
 * @property {string} current_condition.cloudcover
 * @property {string} current_condition.humidity
 * @property {string} current_condition.localObsDateTime
 * @property {string} current_condition.observation_time
 * @property {string} current_condition.precipInches
 * @property {string} current_condition.precipMM
 * @property {string} current_condition.pressure
 * @property {string} current_condition.pressureInches
 * @property {string} current_condition.temp_C
 * @property {string} current_condition.temp_F
 * @property {string} current_condition.uvIndex
 * @property {string} current_condition.visibility
 * @property {string} current_condition.visibilityMiles
 * @property {string} current_condition.weatherCode
 * @property {object[]} current_condition.weatherDesc
 * @property {string} current_condition.weatherDesc.value
 * @property {object[]} current_condition.weatherIconUrl
 * @property {string} current_condition.weatherIconUrl.value
 * @property {string} current_condition.winddir16Point
 * @property {string} current_condition.winddirDegree
 * @property {string} current_condition.windspeedKmph
 * @property {string} current_condition.windspeedMiles
 * @property {object[]} nearest_area
 * @property {object[]} nearest_area.areaName
 * @property {string} nearest_area.areaName.value
 * @property {object[]} nearest_area.country
 * @property {string} nearest_area.country.value
 * @property {string} nearest_area.latitude
 * @property {string} nearest_area.longitude
 * @property {string} nearest_area.population
 * @property {object[]} nearest_area.region
 * @property {string} nearest_area.region.value
 * @property {object[]} nearest_area.weatherUrl
 * @property {string} nearest_area.weatherUrl.value
 * @property {object[]} request
 * @property {string} request.query
 * @property {string} request.type
 * @property {object[]} weather
 * @property {object[]} weather.astronomy
 * @property {string} weather.astronomy.moon_illumination
 * @property {string} weather.astronomy.moon_phase
 * @property {string} weather.astronomy.moonrise
 * @property {string} weather.astronomy.moonset
 * @property {string} weather.astronomy.sunrise
 * @property {string} weather.astronomy.sunset
 * @property {string} weather.avgtempC
 * @property {string} weather.avgtempF
 * @property {string} weather.date
 * @property {string} weather.maxtempC
 * @property {string} weather.maxtempF
 * @property {string} weather.mintempC
 * @property {string} weather.mintempF
 * @property {string} weather.sunHour
 * @property {string} weather.totalSnow_cm
 * @property {string} weather.uvIndex
**/