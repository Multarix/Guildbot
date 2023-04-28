const ordinal = require('./ordinal.js');

const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const months = [
	'January',	 'February',
	'March',	 'April',
	'May', 		 'June',
	'July',	 	 'August',
	'September', 'October',
	'November',	 'December'
];

/**
 * @typedef {object} timeObject
 * @property {string} day The day of the week
 * @property {string} month The month of the year
 * @property {string} date The date in the format `DD/MM/YYYY`
 * @property {string} fullDate The date in the format `DDth of Month, YYYY`
 * @property {string} time The time in the format `HH:MM:SS`
 * @property {string} ISO The time in the format `YYYY-MM-DDTHH:MM:SS.MSSZ`
**/

/**
 * @name timeFormat
 * @param {Date} dateTime The date object to be used, defaults to the current time
 * @returns {timeObject} An object containing the time in different formats
 * @description Returns the current time in different formats
 * @example const time = timeFormat();
**/
function timeFormat(dateTime = new Date()){

	const day = weekdays[dateTime.getDay()];													// Tuesday
	const month = months[dateTime.getMonth()];													// August
	const date = `${dateTime.getDate()}/${dateTime.getMonth() + 1}/${dateTime.getFullYear()}`;	// 25/8/2023


	const ordinalDay = ordinal(dateTime.getDate().toString());
	const fullDate = `${ordinalDay} of ${month}, ${dateTime.getFullYear()}`;					// 25th of August, 2023


	let hour = dateTime.getHours().toString();
	if(dateTime.getHours() < 10) hour = "0" + dateTime.getHours();
	let minute = dateTime.getMinutes().toString();
	if(dateTime.getMinutes() < 10) minute = "0" + dateTime.getMinutes();
	let second = dateTime.getSeconds().toString();
	if(dateTime.getSeconds() < 10) second = "0" + dateTime.getSeconds();
	const time = `${hour}:${minute}:${second}`;													// 12:30:15

	return {
		day,
		month,
		date,
		fullDate,
		time,
		ISO: dateTime.toISOString()
	};
}

module.exports = timeFormat;