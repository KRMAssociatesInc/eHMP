define([
    'backbone',
    'marionette',
    'underscore',
    'app/applets/appointments/util',
    'hbs!app/applets/appointments/modal/modalTemplate',
    'app/applets/appointments/modal/modalHeaderView'

], function(Backbone, Marionette, _, Util, modalTemplate, modalHeader) {
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
                // if (dataCollection.hasNextPage()) {
                //     dataCollection.getNextPage();
                // } else {
                //     dataCollection.getFirstPage();
                // }

                this.getModals();
                next = 0;
            }
            var model = modals[next];
            this.setNextPrevModal(model);

        },
        getPrevModal: function(e) {

            var next = _.indexOf(modals, this.model) - 1;
            if (next < 0) {
                // if (dataCollection.hasPreviousPage()) {
                //     dataCollection.getPreviousPage();
                // } else {
                //     dataCollection.getLastPage();
                // }

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

            var modalOptions = {
                'title': Util.getModalTitle(model),
                'size': 'normal',
                'headerView': modalHeader.extend({
                    model: model,
                    theView: view
                })
            };

            var modal = new ADK.UI.Modal({
                view: view,
                options: modalOptions
            });
            modal.show();
        },
    });

    return ModalView;
});
