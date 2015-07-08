define([], function() {
    'use strict';

    var MedsCollection = Backbone.Collection.extend({
        url: ADK.ResourceService.buildUrl('med-op-data-searchlist')
    });

    return MedsCollection;

});
