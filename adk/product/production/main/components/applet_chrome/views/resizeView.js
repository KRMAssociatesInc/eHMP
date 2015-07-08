define('main/components/applet_chrome/views/resizeView', [
    'backbone',
    'marionette',
    'jquery',
    'underscore',
    'hbs!main/components/applet_chrome/templates/maximizeTemplate',
    'hbs!main/components/applet_chrome/templates/minimizeTemplate'
], function(Backbone, Marionette, $, _, maximizeTemplate, minimizeTemplate) {
    'use strict';
    var ResizeView = Backbone.Marionette.ItemView.extend({
        tagName: 'span',
        getTemplate: function() {
            if (this.model.has('maximizeScreen')) {
                return maximizeTemplate;
            } else if (this.model.get('fullScreen') === true) {
                return minimizeTemplate;
            } else {
                return _.template('');
            }
        }
    });
    return ResizeView;
});
