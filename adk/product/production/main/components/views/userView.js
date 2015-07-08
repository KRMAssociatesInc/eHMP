define([
    "backbone",
    "marionette",
    "underscore",
    "hbs!main/components/views/userTemplate",
    "api/UserService"
], function(Backbone, Marionette, _, userTemplate, UserService) {
    'use strict';
    var userView = Backbone.Marionette.ItemView.extend({
        model: UserService.getUserSession(),
        template: userTemplate,
        tagName: 'a',
        className: 'dropdown-toggle',
        attributes: {
            "href": "#"
        }
    });
    return userView;
});
