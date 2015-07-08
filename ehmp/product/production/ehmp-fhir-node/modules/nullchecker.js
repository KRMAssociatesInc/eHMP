module.exports.isNullish = function isNullish(value) {
	if (value === null) return true;
	else if (value === undefined) return true;
	else return false;
};
