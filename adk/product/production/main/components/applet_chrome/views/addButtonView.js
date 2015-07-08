define('main/components/applet_chrome/views/addButtonView', [
    'backbone',
    'marionette',
    'hbs!main/components/applet_chrome/templates/addButtonTemplate'
], function(Backbone,Marionette,addButtonTemplate) {
    'use strict';
    var AddButtonView = Backbone.Marionette.ItemView.extend({
        tagName: 'span',
        template: addButtonTemplate
    });
    return AddButtonView;
});
