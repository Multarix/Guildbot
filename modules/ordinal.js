/**
 * @name ordinal
 * @param {number} num The number to be converted to an ordinal format
 * @returns {string} The number in ordinal format
 * @description Convert a number to an ordinal format (1st, 2nd, 3rd, 4th.. etc.)
 * @example const ord = ordinal(53);
 * console.log(ord); // 53rd
**/
function ordinal(num){
	// Ordinal indicators (1st, 2nd, 3rd, 4th.. etc.)
	if(isNaN(num)) return 'NaN';

	const ord = num.toString();
	if(ord.endsWith("1") && !ord.endsWith("11")) return `${ord}st`;
	if(ord.endsWith("2") && !ord.endsWith("12")) return `${ord}nd`;
	if(ord.endsWith("3") && !ord.endsWith("13")) return `${ord}rd`;

	return `${ord}th`;
}

module.exports = ordinal;