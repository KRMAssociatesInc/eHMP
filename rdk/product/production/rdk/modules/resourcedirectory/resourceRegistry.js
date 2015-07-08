/*jslint node: true */
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

    resourceRegistry.getDirectory = function(baseUrl) {
        var directory = {
            link: []
        };
        _.each(registry, function(resourceDefinition) {
            var item = {};
            item.title = resourceDefinition.title;
            if(resourceRegistry.useRelativeHref) {
                item.href = resourceDefinition.path;
            } else {
                item.href = baseUrl + resourceDefinition.path;
            }
            item.parameters = resourceDefinition.parameters;
            item.description = resourceDefinition.description;
            directory.link.push(item);
        });
        return directory;
    };
}

module.exports = ResourceRegistry;
