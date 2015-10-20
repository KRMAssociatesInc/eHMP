define(
	['handlebars'],
	function(Handlebars) {
		function isInArray(array, obj, options) {
			if (array.indexOf(obj) > -1) {
				return options.fn(this);
			}
			return options.inverse(this);
		}

		Handlebars.registerHelper('isInArray', isInArray);
		return isInArray;
	}
);