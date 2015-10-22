define([
    'backbone',
    'marionette',
    'underscore',
    'hbs!app/applets/addOrder/templates/addOrderTemplate',
    'hbs!app/applets/addOrder/templates/visitTemplate',
    'hbs!app/applets/addOrder/templates/footerTemplate',
    'app/applets/addOrder/views/opMedManagerView',
    'app/applets/addOrder/views/orderTypeView',
    'app/applets/addOrder/helpers/opMedModelUtil'

], function(Backbone, Marionette, _, addOrderTemplate, visitTemplate, footerTemplate, OutpatientMedView, OrderTypeView, modelUtils) {
    'use strict';

    var sharedModel;

    var FooterView = Backbone.Marionette.ItemView.extend({
        template: footerTemplate,
        events: {
            'click #btn-add-order-accept': 'addOrder'
        },

        addOrder: function(event) {

            $(event.currentTarget).html("<i class='fa fa-spinner fa-spin'></i> <span> Saving Order Record ...</span>");
            $(event.currentTarget).addClass('disabled').attr('disabled');
            event.preventDefault();
            modelUtils.saveMed();
        }
    });

    var VisitView = Backbone.Marionette.ItemView.extend({
        template: visitTemplate,
        events: {
            'click #change-visit-btn': 'selectVisit',
        },

        selectVisit: function() {
            var visitChannel = ADK.Messaging.getChannel('visit');
            var gridView = this;
            visitChannel.command('openVisitSelector', 'visit_select', {
                oid: modelUtils.getVisitModel(),
                gridView: gridView
            });
        },
        initialize: function() {
            var visit = this.model.get('visit');
        },
    });

    return Backbone.Marionette.LayoutView.extend({
        className: 'add-order-styles',
        template: addOrderTemplate,
        regions: {
            errorRegion: '#error-container',
            visitRegion: '#visit-region',
            orderTypeRegion: '#order-type-region',
            orderRegion: '#order-form-region'
        },

        initialize: function() {
            sharedModel = new Backbone.Model();
            sharedModel.set('visit', ADK.PatientRecordService.getCurrentPatient().get('visit'));
            this.model = sharedModel;
        },

        onRender: function() {
            var visitView = new VisitView({
                model: this.model
            });
            this.visitRegion.show(visitView);

            var orderTypeView = new OrderTypeView({
                model: this.model
            });
            this.orderTypeRegion.show(orderTypeView);
        },

        modelEvents: {
            'change': 'modelChanged'
        },

        modelChanged: function(e) {
            if (e.changed.hasOwnProperty('orderType') && this.model.get('orderType') === 'outpatientMeds') {
                var orderView = new OutpatientMedView({
                    model: sharedModel
                });
                this.orderView = orderView;
                this.orderRegion.show(orderView);
            }
            $('#mainModalLabel').text('Add ' + this.model.get('orderTypeText'));
            this.orderTypeRegion.reset();
        },

        showModal: function(event, GridView) {
            if (sharedModel.get('visit') === undefined) {
                var visitChannel = ADK.Messaging.getChannel('visit');
                var gridView = this;
                visitChannel.command('openVisitSelector', 'visit_select', {
                    oid: modelUtils.getVisitModel(),
                    gridView: gridView
                });
            } else {
                var options = {
                    'size': 'medium',
                    'footerView': FooterView
                };

                var modal = new ADK.UI.Modal({
                    view: this,
                    options: options
                });
                modal.show();
            }
        }
    });

});