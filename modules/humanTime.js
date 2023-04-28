/**
 * @name humanTime
 * @param {Number} ms The number of milliseconds to convert
 * @param {String} [format] The format to convert the time to, defaults to "\\h hours \\m minutes \\s seconds"
 * @returns {String} The converted time
 * @description Convert milliseconds to human readable formats
 * - `\\S` = Miliseconds
 * - `\\s` = Seconds
 * - `\\m` = Minutes
 * - `\\h` or `\\H` = Hours
 * - `\\d` or `\\D` = Days
 * - `\\w` = Weeks
 * @example const format = humanTime(951000, "\\m minutes \\s seconds");
 * console.log(format); // 15 minutes 51 seconds
**/
function humanTime(ms, format = "\\h hours \\m minutes \\s seconds"){

	if(!format) return `${ms}ms`;

	let milliseconds = ms;
	let seconds = Math.floor(milliseconds / 1000);
	let minutes = Math.floor(seconds / 60);
	let hours = Math.floor(minutes / 60);
	let days = Math.floor(hours / 24);
	const weeks = Math.floor(days / 7);

	if(format.includes("\\s")) milliseconds = milliseconds % 1000;
	if(format.includes("\\m")) seconds = seconds % 60;
	if(format.includes("\\h") || format.includes("\\H")) minutes = minutes % 60;
	if(format.includes("\\d") || format.includes("\\D")) hours = hours % 24;
	if(format.includes("\\w")) days = days % 7;

	const duration = format.replace(/\\S/, milliseconds)
		.replace(/\\s/, seconds)
		.replace(/\\m/, minutes)
		.replace(/\\h/, hours)
		.replace(/\\H/, hours)
		.replace(/\\d/, days)
		.replace(/\\D/, days)
		.replace(/\\W/, weeks);

	return duration;
}

module.exports = humanTime;