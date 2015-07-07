define([
    "backbone",
    "marionette",
    "underscore",
    "hbs!app/applets/medication_review/list/medicationListTemplate",
    "hbs!app/applets/medication_review/charts/graphTemplate",
    "app/applets/medication_review/eventHandlers",
    "app/applets/medication_review/appletHelper",
    "app/applets/medication_review/list/medicationListView",
    "app/applets/medication_review/medicationCollectionHandler",
    "app/applets/medication_review/charts/medications",
    "app/applets/medication_review/list/detailController"
], function(Backbone, Marionette, _, medicationListTemplate, graphTemplate, EventHandlers, appletHelper, MedicationListView, medicationCollectionHandler, MedicationGraphItemView, DetailController) {

    var MedReviewModel = Backbone.Model.extend({
        defaults: {
            "recentDaysFilter": "1825"
        }
    });

    var medReviewModel = new MedReviewModel();

    var AppletLayoutView = Backbone.Marionette.LayoutView.extend({
        initialize: function() {
            if (!medicationCollectionHandler.initialized) {
                medicationCollectionHandler.initCollections();
            }

            medicationCollectionHandler.fetchAllMeds();

            var self = this;
            this.listenTo(ADK.Messaging, 'globalDate:selected', function(dateModel) {
                self.globalDateSelected();
            });

            this.medicationListView = new MedicationListView();
            this.medicationGraphItemView = new MedicationGraphItemView();
        },
        globalDateSelected: function() {
            this.medicationListView.collection.reset();
            medicationCollectionHandler.fetchAllMeds();
        },
        onRender: function() {
            this.appletMain.show(this.medicationListView);
            this.graph.show(this.medicationGraphItemView);
        },
        template: medicationListTemplate,
        model: medReviewModel,
        className: 'medReviewApp',
        regions: {
            appletMain: "#med-review-applet-main",
            graph: "#timelineTab"
        },
        events: {
            'click #name': 'sortByName',
            'click #vatype': 'sortByType',
            'click #status': 'sortByStatus',
            'click #add-non-va-med-btn': 'launchAddNonVaMedModal',
            'click #add-med-order-btn': 'launchAddMedOrderModal',
            'keydown #medGroupType': 'onEnter',
            'keydown #medGroupItem': 'onEnter',
            'click #med-timeline-view-btn': 'resetWidth'
        },
        templateHelpers: {
            inVista: function() {
                return ADK.PatientRecordService.isPatientInPrimaryVista();
            }
        },
        onEnter: function(event) {
            if (event.which == 13 || event.which == 32) {
                $(event.target).click();
            }
        },
        launchAddNonVaMedModal: function(event) {
            event.preventDefault();
            var addNonVaMedChannel = ADK.Messaging.getChannel("medicationChannel");
            addNonVaMedChannel.trigger('addNonVaMed:clicked', event);
        },
        launchAddMedOrderModal: function(event) {
            event.preventDefault();
            var addMedOrderChannel = ADK.Messaging.getChannel("medicationChannel");
            addMedOrderChannel.trigger('addOrder:clicked', event);
        },
        resetWidth: function() {
            var graphInterval = setInterval(function() {
                clearInterval(graphInterval);
                $(window).trigger('resize');
            }, 200);

        }
    });

    function getMedicationViewModel() {
        var medicationViewModel = {
            defaults: {
                "fillsAllowed": "Unk"
            },
            parse: function(response) {
                return appletHelper.parseMedResponse(response);
            }
        };
        return medicationViewModel;
    }

    var applet = {
        id: "medication_review",
        viewTypes: [{
            type: 'expanded',
            view: AppletLayoutView
        }],
        defaultViewType: 'expanded'
    };


    // Add message listener
    (function initMessaging() {
        var channel = ADK.Messaging.getChannel('medicationChannel');
        channel.reply('refresh', function(parameters) {
            var view = applet.getRootView();
            var response = $.Deferred();
            response.resolve({
                medicationCollectionHandler: medicationCollectionHandler
            });

            return response.promise();
        });
    })();
    DetailController.initialize(applet.id);

    return applet;
});
