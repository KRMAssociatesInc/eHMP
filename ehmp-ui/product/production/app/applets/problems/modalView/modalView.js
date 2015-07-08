define([
    'backbone',
    'marionette',
    'underscore',
    'app/applets/problems/util',
    'hbs!app/applets/problems/modalView/modalTemplate',
    'app/applets/problems/modalView/modalHeaderView',
    'app/applets/problems/modalView/modalFooterView'

], function(Backbone, Marionette, _, Util, modalTemplate, modalHeader, modalFooter) {
    'use strict';

    var modals = [],
        dataCollection;

    var ModalView = Backbone.Marionette.ItemView.extend({
        template: modalTemplate,
        initialize: function(options) {
            this.model = options.model;
            this.collection = options.collection;
            dataCollection = options.collection;
            this.getModals();
        },
        events: {
            'click .ccdNext': 'getNextModal',
            'click .ccdPrev': 'getPrevModal'
        },
        getNextModal: function(e) {
            var next = _.indexOf(modals, this.model) + 1;
            if (next >= modals.length) {

                this.getModals();
                next = 0;
            }
            var model = modals[next];
            this.setNextPrevModal(model);

        },
        getPrevModal: function(e) {

            var next = _.indexOf(modals, this.model) - 1;
            if (next < 0) {

                this.getModals();
                next = modals.length - 1;
            }
            var model = modals[next];

            this.setNextPrevModal(model);

        },
        getModals: function() {
            modals = dataCollection.models;
        },
        setNextPrevModal: function(model) {

            if (this.showNavHeader) {
                model.attributes.navHeader = true;
            }

            var view = new ModalView({
                model: model,
                collection: dataCollection
            });

            var siteCode = ADK.UserService.getUserSession().get('site'),
                pidSiteCode = model.get('pid') ? model.get('pid').split(';')[0] : '';

            var modalOptions;

            modalOptions = {
                'title': Util.getModalTitle(model),
                'size': 'normal',
                'headerView': modalHeader.extend({
                    model: model,
                    theView: view
                }),
                'footerView': modalFooter.extend({
                    model: model,
                    templateHelpers: function() {
                        if ((ADK.UserService.hasPermission('edit-patient-problem') || ADK.UserService.hasPermission('remove-patient-problem')) && pidSiteCode === siteCode) {
                            return {
                                data: true
                            };
                        } else {
                            return {
                                data: false
                            };
                        }
                    }
                })
            };


            ADK.showModal(view, modalOptions);
        }
    });

    return ModalView;
});
