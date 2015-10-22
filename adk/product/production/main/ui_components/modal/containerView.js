define([
    'backbone',
    'marionette',
    'jquery',
    'underscore',
    'handlebars'
], function(Backbone, Marionette, $, _, Handlebars) {

    var DivModel = Backbone.Model.extend({
        defaults: {
            'sizeClass': '',
            'backdrop': true,
            'keyboard': true
        }
    });

    var ModalContainerView = Backbone.Marionette.LayoutView.extend({
        template: Handlebars.compile('<div id="mainModalDialog" class="modal-dialog {{sizeClass}}"></div>'),
        initialize: function(options) {
            this.model = new DivModel();
            var modalView= options.view;
            var modalOptions = modalView.modalOptions;
            if (!modalOptions.keyboard) {
                this.model.set('keyboard', modalOptions.keyboard);
            }
            if (modalOptions.backdrop === false || modalOptions.backdrop === 'static') {
                this.model.set('backdrop', modalOptions.backdrop);
            }

            if (modalOptions.size === 'large') {
                this.model.set('sizeClass', 'modal-lg');
            } else if (modalOptions.size === 'xlarge') {
                this.model.set('sizeClass', 'modal-xlg');
            }
            this.modalLayoutView = modalView;
        },
        className: 'modal fade',
        attributes: {
            'role': 'dialog',
            'tabindex': '-1',
            'aria-hidden': 'true',
            'id': 'mainModal'
        },
        regions: {
            modalDialogRegion: '#mainModalDialog'
        },
        onBeforeShow: function() {
            this.showChildView('modalDialogRegion', this.modalLayoutView);
        },
        onRender: function() {
            this.$el.attr({
                'data-backdrop': this.model.get('backdrop'),
                'data-keyboard': this.model.get('keyboard')
            });
        }
    });
    return ModalContainerView;
});