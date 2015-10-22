define([
    'backbone',
    'marionette',
    'underscore',
    'hbs!app/applets/lab_results_grid/modal/headerTemplate',
    'app/applets/lab_results_grid/modal/modalView',
    'app/applets/lab_results_grid/appletUiHelpers'
], function(Backbone, Marionette, _, HeaderTemplate, ModalView, AppletUiHelpersUndef) {
    'use strict';

    var theView,
        modals = [],
        dataCollection,
        LabModalHeaderView;

    //Modal Navigation Item View
    LabModalHeaderView = Backbone.Marionette.ItemView.extend({
        events: {
            'click #labss-previous, #labss-next': 'navigateModal'
        },
        initialize: function(){
            dataCollection = this.dataCollection;
            this.getModals();
        },
        navigateModal: function(e) {
            var $target = $(e.currentTarget),
                id = $target.attr('id');
            //This ternary operator is never assigned
            id === 'labss-previous' ? this.getPrevModal() : this.getNextModal();
        },

        template: HeaderTemplate,
        getNextModal: function(e) {
            var next = _.indexOf(modals, this.model) + 1;
            if (next >= modals.length) {
                // console.log('>>>>>> Next Page');
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
            modals = [];
            _.each(dataCollection.models, function(m, key) {

                if (m.get('labs')) {
                    var outterIndex = dataCollection.indexOf(m);
                    // console.log('>>>>>outterIndex', outterIndex);
                    _.each(m.get('labs').models, function(m2, key) {
                        m2.set({
                            'inAPanel': true,
                            'parentIndex': outterIndex,
                            'parentModel': m
                        });
                        modals.push(m2);

                    });
                } else {
                    modals.push(m);
                }

            });
            //console.log(modals);
        },
        setNextPrevModal: function(model) {

            if (this.showNavHeader) {
                model.attributes.navHeader = true;
            }
            if (model.get('inAPanel')) {
                var tr = $('#data-grid-lab_results_grid > tbody>tr.selectable').eq(model.get('parentIndex'));
                if (!tr.data('isOpen')) {
                    tr.trigger('click');
                }
                $('#data-grid-lab_results_grid > tbody>tr.selectable').not(tr).each(function() {
                    var $this = $(this);
                    if ($this.data('isOpen')) {
                        $this.trigger('click');
                    }

                });

            }

            // var view =  new ModalView({
            //     model: model,
            //     gridCollection: dataCollection,
            //     navHeader: this.showNavHeader
            // });
            // var modalOptions = {
            //     'title': model.get('typeName') + ' - ' + model.get('specimen'),
            //     'size': 'large',
            //     'headerView': LabModalHeaderView.extend({
            //         model: model,
            //         theView: view,
            //         dataCollection: dataCollection
            //     })
            // };

            // ADK.UI.Modal.show(view, modalOptions);
            var AppletUiHelper = require('app/applets/lab_results_grid/appletUiHelpers');
            AppletUiHelper.getDetailView(model, null, dataCollection, true, AppletUiHelper.showModal, AppletUiHelper.showErrorModal);
        }

    });
    return LabModalHeaderView;

});
