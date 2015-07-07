define([
    'backbone',
    'marionette',
    'jquery',
    'underscore',
    'handlebars',
    "hbs!main/components/modal/bootstrapModalTemplate",
    "hbs!main/components/modal/bootstrapModalHeaderTemplate"
], function(Backbone, Marionette, $, _, Handlebars, BootstrapModalTemplate, BootstrapModalHeaderTemplate) {
    var DivModel = Backbone.Model.extend({
        defaults: {
            'sizeClass': '',
            'backdrop': true,
            'keyboard': true
        }
    });
    var Modal = {
        generateDiv: function(modalOptions, ModalLayoutView) {
            var temp = Backbone.Marionette.LayoutView.extend({
                model: new DivModel(),
                initialize: function() {
                    if (modalOptions.keyboard === false) {
                        this.model.set('keyboard', modalOptions.keyboard);
                    }
                    if (modalOptions.backdrop === false || modalOptions.backdrop === 'static') {
                        this.model.set('backdrop', modalOptions.backdrop);
                    }
                    this.$el.attr({
                        'data-backdrop': this.model.get('backdrop'),
                        'data-keyboard': this.model.get('keyboard')
                    });

                    if (modalOptions.size === 'large') {
                        this.model.set('sizeClass', 'modal-lg');
                    } else if (modalOptions.size === 'xlarge') {
                        this.model.set('sizeClass', 'modal-xlg');
                    }
                    this.modalLayoutView = new ModalLayoutView();
                },
                onRender: function(){
                    this.modalDialogRegion.show(this.modalLayoutView);
                },
                template: Handlebars.compile('<div id="mainModalDialog" class="modal-dialog {{sizeClass}}"></div>'),
                className: 'modal fade',
                tagName: 'div',
                attributes: {
                    'role': 'dialog',
                    'tabindex': '-1',
                    'aria-hidden': 'true',
                    'id': 'mainModal'
                },
                regions: {
                    modalDialogRegion: '#mainModalDialog',
                },
            });
            return temp;
        },
        generateLayout: function(ModalRegionView, modalOptions) {
            var modalTitle = modalOptions.title,
                modalHeader = modalOptions.headerView,
                ModalButtonControlView = modalOptions.footerView;
            if (modalTitle || modalHeader) {
                var ModalHeaderView;
                if (modalHeader) {
                    ModalHeaderView = modalHeader.extend({
                        className: 'modal-header'
                    });
                } else {
                    var ModalModel = Backbone.Model.extend({
                        defaults: {
                            'modal-title': modalTitle
                        }
                    });
                    var modalModel = new ModalModel();
                    ModalHeaderView = Backbone.Marionette.ItemView.extend({
                        template: BootstrapModalHeaderTemplate,
                        model: modalModel,
                        className: 'modal-header'
                    });
                }
            }

            var ModalButtonControlViewDefault = Backbone.Marionette.ItemView.extend({
                template: _.template("Close"),
                className: 'btn btn-default',
                tagName: 'button',
                attributes: {
                    'type': 'button',
                    'data-dismiss': 'modal',
                    'id': 'modal-close-button'
                }
            });

            var ModalLayoutView = Backbone.Marionette.LayoutView.extend({
                template: BootstrapModalTemplate,
                initialize: function() {
                    this.modalRegionView = ModalRegionView;
                    if (ModalButtonControlView && ModalButtonControlView !== 'none') {
                        this.modalButtonControlView = new ModalButtonControlView();
                    } else {
                        this.modalButtonControlView = new ModalButtonControlViewDefault();
                    }
                    if (modalTitle) {
                        this.modalHeaderView = new ModalHeaderView();
                    }
                },
                events: {
                    'keydown input': function(e) {
                        if (e.which === 13) { //Prevent IE bug which issues data-dismiss in a modal on enter key
                            e.preventDefault();
                        }
                    }
                },
                regions: {
                    modalHeaderRegion: '#modal-header',
                    modalRegion: '#modal-body',
                    modalButtonControlRegion: '#modal-footer'
                },
                onRender: function() {
                    this.modalRegion.show(this.modalRegionView);
                    if (ModalButtonControlView === 'none'){
                        this.$('#modal-footer').addClass('hidden');
                    } else {
                        this.modalButtonControlRegion.show(this.modalButtonControlView);
                    }
                    if (this.modalHeaderView) {
                        this.modalHeaderRegion.show(this.modalHeaderView);
                    }
                }
            });
            return ModalLayoutView;
        }
    };
    return Modal;
});
