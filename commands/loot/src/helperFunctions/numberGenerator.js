/**
 * @typedef {(number|string)} numberLike
**/
/**
 * @name randomNumber
 * @param {numberLike} min The minimum number that should be returned
 * @param {numberLike} max The maximum number that should be returned
 * @returns {number} A random number between the min and max
*/
function numberGenerator(min, max){

	if(isNaN(parseInt(min))) throw new Error("'min' must be a number or a number-like string");
	if(isNaN(parseInt(max))) throw new Error("'max' must be a number or a number-like string");
	if(min === max) return min;
	if(min > max) throw new Error("'min' must be less than 'max'");

	return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default numberGenerator;