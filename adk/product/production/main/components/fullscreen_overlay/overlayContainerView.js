define([
    'backbone',
    'marionette',
    'jquery',
    'underscore'
], function(Backbone, Marionette, $, _) {
    var DivModel = Backbone.Model.extend({
        defaults: {
            'keyboard': true
        }
    });
    var Overlay = {
        generateDiv: function(OverlayView, overlayOptions) {
            var temp = Backbone.Marionette.LayoutView.extend({
                model: new DivModel(),
                initialize: function() {
                    this.overlayView = OverlayView;

                    if (overlayOptions.keyboard === false) {
                        this.model.set('keyboard', modalOptions.keyboard);
                    }
                    this.$el.attr({
                        'data-keyboard': this.model.get('keyboard')
                    });
                },
                onRender: function(){
                    this.overlayViewRegion.show(this.overlayView);
                },
                template: _.template('<div id="mainOverlayRegion"></div>'),
                className: 'overlay overlay-scale',
                tagName: 'div',
                attributes: {
                    'role': 'dialog',
                    'tabindex': '-1',
                    'aria-hidden': 'true',
                    'id': 'mainOverlay',
                    'data-backdrop': 'static'
                },
                regions: {
                    overlayViewRegion: '#mainOverlayRegion',
                },
            });
            return temp;
        }
    };
    return Overlay;
});
