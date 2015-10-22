'use strict';

var _ = require('underscore');

function ResourceRegistry(useRelativeHref) {
    if (!(this instanceof ResourceRegistry)) {
        return new ResourceRegistry();
    }

    var resourceRegistry = this;
    var registry = [];
    resourceRegistry.useRelativeHref = useRelativeHref;

    resourceRegistry.healthcheck = {};

    resourceRegistry.register = function(resourceDefinition) {
        //todo: need to check to see that definition is valid
        if (!resourceDefinition.title) {
            throw new Error('resourceDefinition requires title');
        }

        if (!resourceDefinition.path) {
            throw new Error('resourceDefinition requires path');
        }

        registry.push(resourceDefinition);
    };

    resourceRegistry.getResources = function() {
        return registry;
    };

    resourceRegistry.getDirectory = function(baseUrl, basePath) {
        basePath = basePath || '';
        var directory = {};
        directory.link = _.map(registry, function(resourceDefinition) {
            var item = {};
            item.title = resourceDefinition.title;
            if(baseUrl) {
                item.href = baseUrl + basePath + resourceDefinition.path;
            } else {
                item.href = basePath + resourceDefinition.path;
            }
            item.rel = resourceDefinition.rel;
            item.parameters = resourceDefinition.parameters;
            item.description = resourceDefinition.description;
            return item;
        });
        return directory;
    };
}

module.exports = ResourceRegistry;
