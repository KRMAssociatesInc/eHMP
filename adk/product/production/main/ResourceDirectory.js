define([
    "backbone"
], function(Backbone) {
    'use strict';

    var Resource = Backbone.Model.extend({
        defaults: {
            "rel": "external",
            "title": "",
            "href": "",
            "id": ""
        },
        initialize: function() {
            this.id = this.get('title');
        }
    });

    var ResourceDirectoryCollection = Backbone.Collection.extend({
        model: Resource,
        parse: function(response) {
            return response.data.link;
        }
    });

    var ResourceDirectory = (function() {
        var singleInstance;

        function init() {
            return new ResourceDirectoryCollection();
        }

        return {
            instance: function() {
                if (!singleInstance) {
                    singleInstance = init();
                }
                return singleInstance;
            }
        };
    })();

    return ResourceDirectory;
});
