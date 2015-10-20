define([
    'backbone',
    'marionette',
    'jquery',
    'underscore',
    'handlebars',
    'api/Messaging',
    "hbs!main/ui_components/modal/bootstrapModalTemplate",
    "hbs!main/ui_components/modal/bootstrapModalHeaderTemplate",
    "main/ui_components/modal/containerView"
], function(Backbone, Marionette, $, _, Handlebars, Messaging, BootstrapModalTemplate, BootstrapModalHeaderTemplate, ContainerView) {

    var ModalButtonControlViewDefault = Backbone.Marionette.ItemView.extend({
        template: _.template("Close"),
        className: 'btn btn-default',
        tagName: 'button',
        attributes: {
            'type': 'button',
            'data-dismiss': 'modal',
            'id': 'modal-close-button',
            'title': 'To close the modal, select the close button.'
        }
    });

    var ModalLayoutView = Backbone.Marionette.LayoutView.extend({
        template: BootstrapModalTemplate,
        initialize: function(userOptions) {
            var modalOptions = {
                'title': '',
                'size': '',
                'headerView': '',
                'footerView': '',
                'keyboard': false,
                'callShow': true
            };
            var passInModalOptions = userOptions.options || {};
            this.modalOptions = _.defaults(passInModalOptions, modalOptions);

            this.modalTitle = this.modalOptions.title;
            this.modalHeader = this.modalOptions.headerView;
            this.ModalButtonControlView = this.modalOptions.footerView;
            if (this.modalTitle || this.modalHeader) {
                var ModalHeaderView;
                if (this.modalHeader) {
                    ModalHeaderView = this.modalHeader.extend({
                        className: 'modal-header'
                    });
                } else {
                    var ModalModel = Backbone.Model.extend({
                        defaults: {
                            'modal-title': this.modalTitle
                        }
                    });
                    var modalModel = new ModalModel();
                    ModalHeaderView = Backbone.Marionette.ItemView.extend({
                        template: BootstrapModalHeaderTemplate,
                        model: modalModel,
                        className: 'modal-header'
                    });
                }
                this.modalHeaderView = new ModalHeaderView();
            }

            this.modalRegionView = userOptions.view;
            if (this.ModalButtonControlView && this.ModalButtonControlView !== 'none') {
                if (_.isFunction(this.ModalButtonControlView)) {
                    this.modalButtonControlView = new this.ModalButtonControlView();
                } else {
                    this.modalButtonControlView = this.ModalButtonControlView;
                }
            } else {
                this.modalButtonControlView = new ModalButtonControlViewDefault();
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
        onBeforeShow: function(){
            this.showChildView('modalRegion', this.modalRegionView);
            if (this.ModalButtonControlView === 'none') {
                this.$('#modal-footer').addClass('hidden');
            } else {
                this.showChildView('modalButtonControlRegion', this.modalButtonControlView);
            }
            if (this.modalHeaderView) {
                this.showChildView('modalHeaderRegion', this.modalHeaderView);
            }
        },
        show: function() {
            var $triggerElem = $(':focus');

            var ADK_ModalRegion = Messaging.request('get:adkApp:region', 'modalRegion');
            if (ADK_ModalRegion.$el && ADK_ModalRegion.$el.children().length === 0) {
                var modalContainerView = new ContainerView({view: this});
                ADK_ModalRegion.show(modalContainerView);
            } else {
                ADK_ModalRegion.currentView.modalDialogRegion.show(this);
            }

            ADK_ModalRegion.currentView.$el.one('hidden.bs.modal', function(e) {
                ADK_ModalRegion.empty();
                $triggerElem.focus();
            });

            if (_.isBoolean(this.modalOptions.callShow) && this.modalOptions.callShow) {
                ADK_ModalRegion.currentView.$el.modal('show');
            }
        }
    });
    ModalLayoutView.hide = function() {
        var currentView = Messaging.request('get:adkApp:region', 'modalRegion').currentView;
        if (currentView) {
            currentView.$el.modal('hide');
        }
    };
    return ModalLayoutView;
});