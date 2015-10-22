define([
    'backbone',
    'marionette',
    'jquery',
    'underscore',
    'handlebars',
    'api/Messaging',
], function(Backbone, Marionette, $, _, Handlebars, Messaging) {
    var DivModel = Backbone.Model.extend({
        defaults: {
            'keyboard': true
        }
    });
    var OverlayView = Backbone.Marionette.LayoutView.extend({
        initialize: function(userOptions) {
            this.model = new DivModel();

            var overlayOptions = {
                'callShow': false
            };
            var passInModalOptions = userOptions.options || {};
            this.overlayOptions = _.defaults(passInModalOptions, overlayOptions);
            this.overlayView = userOptions.view;

            if (_.isBoolean(this.overlayOptions.keyboard) && !this.overlayOptions) {
                this.model.set('keyboard', this.overlayOptions.keyboard);
            }
            this.$el.attr({
                'data-keyboard': this.model.get('keyboard')
            });
        },
        onBeforeShow: function() {
            this.showChildView('overlayViewRegion', this.overlayView);
        },
        template: Handlebars.compile('<div id="mainOverlayRegion"></div>'),
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
        show: function() {
            var ADK_ModalRegion = Messaging.request('get:adkApp:region', 'modalRegion');

            ADK_ModalRegion.show(this);

            ADK_ModalRegion.currentView.$el.one('hidden.bs.modal', function(e) {
                $('body').removeClass('overlay-open');
                ADK.ADKApp.modalRegion.empty();
            });

            if (this.overlayOptions.callShow === true) {
                ADK_ModalRegion.currentView.$el.modal('show');
            }
            $('body').addClass('overlay-open');
        }
    });
    OverlayView.hide = function() {
        var currentView = Messaging.request('get:adkApp:region', 'modalRegion').currentView;
        if (currentView) {
            currentView.$el.modal('hide');
        }
    };
    return OverlayView;
});