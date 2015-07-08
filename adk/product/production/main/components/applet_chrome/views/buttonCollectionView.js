define([
    'jquery',
    'underscore',
    'handlebars'
], function($, _, Handlebars) {
    'use strict';

    var ButtonChildView = Backbone.Marionette.LayoutView.extend({
        template: Handlebars.compile('<span class="grid-{{id}}"></span>'),
        regions: {
            mainRegion: 'span'
        },
        onShow: function() {
            this.mainRegion.show(this.model.get('view'));
        },
        tagName: 'span'

    });
    var ButtonCollectionView = Backbone.Marionette.CollectionView.extend({
        childView: ButtonChildView
    });

    return ButtonCollectionView;
});