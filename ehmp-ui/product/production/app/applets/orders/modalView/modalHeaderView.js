define([
    'main/ADK',
    'backbone',
    'marionette',
    'underscore',
    'handlebars',
    'hbs!app/applets/orders/modalView/headerTemplate',
    'app/applets/orders/writeback/writebackUtils'
    ], function(ADK, Backbone, Marionette, _, Handlebars, HeaderTemplate, Utils) {
    'use strict';

    var AlertItemView = Backbone.Marionette.ItemView.extend({
        template: Handlebars.compile([
        '<h3>The following orders will be discontinued</h3>',
        '<p>{{summary}}</p>'
        ].join('\n')),
    });

    var enableOrDisableBtn = function(statusName){
        var status = _.contains(['UNRELEASED', 'UNSIGNED'], statusName) ? '' : 'disabled';
        return status;
    };

    var AlertFooterItemView = Backbone.Marionette.ItemView.extend({
    template: Handlebars.compile([
        '{{ui-button "Cancel" classes="btn-default alert-cancel" title="Click to cancel"}}',
        '{{ui-button "Discontinue" classes="btn-danger alert-continue" title="Click to Discontinue" }}'
    ].join('\n')),
    events: {
        'click .alert-cancel': 'alertCancel',
        'click .alert-continue': 'alertContinue'
    },
    alertCancel: function() {
        ADK.UI.Alert.hide();
    },
    alertContinue: function() {
            var discontinueOrderModel = new Backbone.Model({id: 1});
            var patient = ADK.PatientRecordService.getCurrentPatient();

            var session = ADK.UserService.getUserSession();
            var siteCode = session.get('site');
            var provider = session.get('duz')[siteCode];

            var orderId = this.model.attributes.orderNumber + ';1';
            var url = '/resource/write-health-data/patient/' + patient.get("pid") + '/orders/' + orderId + '?site=' + siteCode + '&pid=' + patient.get("pid");
            discontinueOrderModel.url = url;

            discontinueOrderModel.set({'orderId': orderId});
            discontinueOrderModel.set({'pid': patient.get("pid")});
            discontinueOrderModel.set('provider', provider);
            discontinueOrderModel.set('location', '23');
            Utils.discontinue(discontinueOrderModel);
            ADK.UI.Alert.hide();
            ADK.UI.Modal.hide();
        },
    });

    //Modal Navigation Item View
     return Backbone.Marionette.ItemView.extend({

        template: HeaderTemplate,

        events: {
            'click #orders-previous, #orders-next': 'navigateResults',
            'keydown #orders-previous, #orders-next': 'accessibility',
            'click #orders-change-order': 'openOrdersPopup',
            'click #orders-discontinue-order':'showAlert'
        },

        modelEvents: {
            "change": "render"
        },


        //treat spacebar press as Enter key - 508 requirement
        accessibility: function(event) {
            if (event.keyCode === 32) {
                this.$('#' + event.currentTarget.id).trigger('click');
            }
        },
        showAlert: function(e){
            e.preventDefault();
            var alertView = new ADK.UI.Alert({
                title: "Discontinue / Cancel Orders",
                //icon: "fa-info",
                messageView: AlertItemView.extend({
                    'model':this.model
                }),
                footerView: AlertFooterItemView.extend({
                    'model': this.model
                })
            });
            alertView.show();
        },
        openOrdersPopup: function(e){
            e.preventDefault();
                    var writebackView = ADK.utils.appletUtils.getAppletView('orders', 'writeback');
                    var formModel = new Backbone.Model();
                    formModel.orderModel = this.model;
                var workflowOptions = {
                    size: "large",
                    title: "Edit a Lab Test",
                    showProgress: false,
                    keyboard: true,
                    steps: [{
                        view: writebackView,
                        viewModel: formModel,
                        stepTitle: 'Step 1'
                    }]
                };
            var workflowView = new ADK.UI.Workflow(workflowOptions);
            workflowView.show();
        },
        navigateResults: function(event) {
            //the collection.prev and collection.next gets the current model and finds
            //the prev or next for it. If none found, it returns the current model back.
            //we save the initial model (currentModel) in the initialize function
            //so that we can use it as the starting point.
            if (event.currentTarget.id === 'orders-previous') {

                if (this.modelIndex > 0) {
                    this.modelIndex--;
                    if (this.pageable) {
                        this.currentModel = this.collection.fullCollection.at(this.modelIndex);
                    } else {
                        this.currentModel = this.collection.at(this.modelIndex);
                    }
                    this.currentModel.attributes.enableOrDisableClass = enableOrDisableBtn(this.currentModel.attributes.statusName);
                    this.model.clear();
                    this.model.set(this.currentModel.attributes);
                }

            } else { //orders-next clicked

                var modelCount = (this.pageable) ? this.collection.fullCollection.length-1 : this.collection.length-1;
                if (this.modelIndex < modelCount) {
                    this.modelIndex++;
                    if (this.pageable) {
                        this.currentModel = this.collection.fullCollection.at(this.modelIndex);
                    } else {
                        this.currentModel = this.collection.at(this.modelIndex);
                    }
                    this.currentModel.attributes.enableOrDisableClass = enableOrDisableBtn(this.currentModel.attributes.statusName);
                    this.model.clear();
                    this.model.set(this.currentModel.attributes);
                }

            }

            //After rendering we maintain focus on the button that was clicked - 508 requirement
            this.$('#' + event.currentTarget.id).focus();
        }

    });

});
