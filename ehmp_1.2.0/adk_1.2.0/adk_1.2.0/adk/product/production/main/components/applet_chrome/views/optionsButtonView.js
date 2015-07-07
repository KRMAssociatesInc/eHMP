define('main/components/applet_chrome/views/optionsButtonView', [
    'backbone',
    'marionette',
    'jquery',
    'underscore',
    'hbs!main/components/applet_chrome/templates/optionsButtonTemplate',
    'hbs!main/components/applet_chrome/templates/exitOptionsButtonTemplate'
], function(Backbone,Marionette,$, _, optionsButtonTemplate, exitOptionsButtonTemplate) {
    'use strict';
    var OptionsButtonView = Backbone.Marionette.ItemView.extend({
        tagName: 'span',
        modelEvents: {
            'change openContext': 'render'
        },
        getTemplate: function() {
            if (this.model.get('openContext')) {
                return exitOptionsButtonTemplate;
            }
            return optionsButtonTemplate;
        }
    });
    return OptionsButtonView;
});
