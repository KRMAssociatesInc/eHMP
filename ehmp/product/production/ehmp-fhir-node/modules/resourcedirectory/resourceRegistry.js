var registry = [];
var _ = require('underscore');

// a resource definition contains:
// title: 
// href: 
// healthchecks: 
// documentation-href: {href: , document: }

module.exports = function() {
	var registry = [];

	this.register = function(resourceDefinition) {
		//todo: need to check to see that definition is valid
		if (!resourceDefinition.title) throw new Error("resourceDefinition requires title");
		if (!resourceDefinition.href) throw new Error("resourceDefinition requires href");

		registry.push(resourceDefinition);
	};

	this.getResources = function() {
		return registry;
	};

	this.getDirectory = function(baseUrl) {
		var directory = [];
		_.each(registry, function(resourceDefinition) {
			var item = {};
			item.title = resourceDefinition.title;
			item.href = baseUrl + resourceDefinition.href;
			directory.push(item);
		});
		return directory;
	};
};
