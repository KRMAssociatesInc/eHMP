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
            var regionName = modalOptions.regionName || 'mainModalDialog',
                temp = Backbone.Marionette.LayoutView.extend({
                    model: new DivModel(),
                    initialize: function() {
                        if (modalOptions.keyboard === false) {
                            this.model.set('keyboard', modalOptions.keyboard);
                        }
                        if (modalOptions.backdrop === false || modalOptions.backdrop === 'static') {
                            this.model.set('backdrop', modalOptions.backdrop);
                        }

                        this.addRegion(regionName, '#' + regionName);
                        this.channel = modalOptions.channel;
                        this.model.set('regionName', regionName);
                        this.configureEvents(regionName);
                        this.modalLayoutView = new ModalLayoutView();
                    },
                    onRender: function() {
                        this.getRegion(regionName).show(this.modalLayoutView);
                    },
                    template: Handlebars.compile('<div id="{{regionName}}" class="modal fade" role="dialog" tabindex="-1" data-backdrop="{{backdrop}}" data-keyboard="{{keyboard}}" aria-hidden="true"></div>'),
                    tagName: 'div',
                    attributes: {
                        'id': 'mainModal',
                    },
                    configureEvents: function(regionName) { //this might be extraneous but it allows the use of events to control which item is shown
                        var show = this.show;
                        this.channel.comply('show:' + regionName, function(e) {
                            show(regionName);
                        });
                    },
                    hide: function(regionName) {
                        var el = this.getRegion(regionName).$el;
                        el.modal('hide');
                        //this.activeRegion = null;
                    },
                    show: function(regionName) {
                        var el = this.getRegion(regionName).$el,
                            channel = this.channel,
                            self = this;

                        if (this.activeRegion) {
                            this.getRegion(this.activeRegion).$el.one('hidden.bs.modal', function(e) {
                                el.modal('show', true);
                                self.activeRegion = regionName;
                            });
                            this.hide(this.activeRegion);
                        } else {
                            el.modal('show', true);
                            this.activeRegion = regionName;
                        }

                        el.one('shown.bs.modal', function(e) {
                            channel.trigger('shown:' + regionName);
                        });
                    }
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
                model: new Backbone.Model(),
                initialize: function() {
                    this.modalRegionView = ModalRegionView;
                    if (ModalButtonControlView) {
                        this.modalButtonControlView = new ModalButtonControlView();
                    } else {
                        this.modalButtonControlView = new ModalButtonControlViewDefault();
                    }
                    if (ModalHeaderView) {
                        this.modalHeaderView = new ModalHeaderView();
                    }
                    if (modalOptions.size === 'large') {
                        this.model.set('sizeClass', 'modal-lg');
                    } else if (modalOptions.size === 'xlarge') {
                        this.model.set('sizeClass', 'modal-xlg');
                    }
                    if (this.model.get('sizeClass')) {
                        this.$el.addClass(this.model.get('sizeClass'));
                    }
                },
                className: 'modal-dialog',
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
                    this.modalButtonControlRegion.show(this.modalButtonControlView);
                    if (this.modalHeaderView) {
                        this.modalHeaderRegion.show(this.modalHeaderView);
                    }
                    var el = this.$el;
                    this.$('[data-dismiss="modal"]').on('click', function(e) { //broadcast that we need to close all modals in this workflow
                        e.preventDefault();
                        el.trigger('close.bs.modal');
                    });
                    this.$('[data-dismiss="modal"]').on('keydown', function(e) { //508 for enter key on close triggers
                        if (e.which === 13 || e.keyCode === 13) {
                            e.preventDefault();
                            el.trigger('close.bs.modal');
                        }
                    });
                },
            });
            return ModalLayoutView;
        }
    };
    return Modal;
});
