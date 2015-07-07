define('main/components/applet_chrome/views/refreshButtonView', [
    'backbone',
    'marionette',
    'hbs!main/components/applet_chrome/templates/refreshButtonTemplate'
], function(Backbone,Marionette,refreshButtonTemplate) {
    'use strict';
    var RefreshButtonView = Backbone.Marionette.ItemView.extend({
        tagName: 'span',
        template: refreshButtonTemplate
    });
    return RefreshButtonView;
});
