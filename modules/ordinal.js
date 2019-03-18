module.exports = (num) => {
	// Ordinal indicators (1st, 2nd, 3rd, 4th.. etc.)
	if(isNaN(num)) return NaN;
	num = num.toString();
	if(num.endsWith("1") && !num.endsWith("11")) return `${num}st`;
	if(num.endsWith("2") && !num.endsWith("12")) return `${num}nd`;
	if(num.endsWith("3") && !num.endsWith("13")) return `${num}rd`;
	return `${num}th`;
};
