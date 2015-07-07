define([
    'backbone',
    'marionette',
    'underscore',
    'hbs!app/applets/documents/modal/unknownDocumentModalTemplate'
], function(Backbone, Marionette, _, modalTemplate) {
    'use strict';
    return Backbone.Marionette.ItemView.extend({
        template: modalTemplate
    });
});
