define([
    'backbone',
    'marionette',
    'underscore',
    'hbs!app/applets/documents/detail/addendaTemplate'
], function(Backbone, Marionette, _, addendaTemplate) {
    'use strict';

    var AddendaView = Backbone.Marionette.ItemView.extend({
        template: addendaTemplate
    });

    return AddendaView;
});
