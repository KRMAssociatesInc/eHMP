define('main/components/applet_chrome/views/helpButtonView', [
    'backbone',
    'marionette',
    'hbs!main/components/applet_chrome/templates/helpButtonTemplate'
], function(Backbone,Marionette,helpButtonTemplate) {
    'use strict';
    var HelpButtonView = Backbone.Marionette.ItemView.extend({
        tagName: 'span',
        template: helpButtonTemplate
    });
    return HelpButtonView;
});
