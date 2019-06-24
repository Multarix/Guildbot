const ordinal = require("./ordinal.js");
module.exports = (client) => {
	const t = new Date();
	let hours = t.getHours();
	if(hours < 10) hours = "0" + hours;
	let minutes = t.getMinutes();
	if(minutes < 10) minutes = "0" + minutes;
	const monthArray = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
	const dayArray = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

	const dayNumber = t.getDate().toString();
	const daySuffix = ordinal(dayNumber);

	return {
		time : `${hours}:${minutes}`,
		day : `${dayArray[t.getDay()]}`,
		exactDate : `${t.getDate()}/${t.getMonth() + 1}/${t.getFullYear()}`,
		date : `${daySuffix} of ${monthArray[t.getMonth()]}`,
	};
};
