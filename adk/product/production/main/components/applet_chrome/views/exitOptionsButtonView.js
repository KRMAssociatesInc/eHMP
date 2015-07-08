define('main/components/applet_chrome/views/exitOptionsButtonView', [
    'backbone',
    'marionette',
    'hbs!main/components/applet_chrome/templates/exitOptionsButtonTemplate'
], function(Backbone,Marionette,exitOptionsButtonTemplate) {
    'use strict';
    var ExitOptionsButtonView = Backbone.Marionette.ItemView.extend({
        tagName: 'span',
        template: exitOptionsButtonTemplate
    });
    return ExitOptionsButtonView;
});
