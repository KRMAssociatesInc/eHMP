define([
    "backbone",
    "marionette",
    "hbs!app/applets/medication_review/list/medicationGroup",
    "app/applets/medication_review/list/medicationView",
    "app/applets/medication_review/appletHelper",
    "app/applets/medication_review/medicationCollectionHandler"
], function(Backbone, Marionette, medicationGroupTemplate, MedicationItemView, appletHelper, medicationCollectionHandler) {

    var LoadingView = Backbone.Marionette.ItemView.extend({
        template: _.template('<h5 id="medsLoadingDiv"><i class="fa fa-spinner fa-spin"></i> Loading...</h5>')
    });

    var EmptyView = Backbone.Marionette.ItemView.extend({
        template: _.template('<span class="col-layout-md"><strong>No Records</strong></span>')
    });

    var MedicationGroupView = Backbone.Marionette.CompositeView.extend({
        template: medicationGroupTemplate, //groups into NonVa, Outpt, etc
        className: "list-group", //Non-va is one list-group
        childView: MedicationItemView, //defined in medicationView.js,
        childViewContainer: '.panel-body', //div that contains all the MedicationItemViews
        initialize: function(options) {
            this.collection = options.model.get('meds'); //A collection of all medications
            this.groupByName(this.collection);
        },

        groupByName: function() {

            var groups = this.collection.groupBy(function(items) {
                var groupValue = appletHelper.getMedicationGroupbyData(items).groupbyValue + appletHelper.getMedicationGroupbyData(items).groupbyFacility;
                return groupValue;
            });

            var medicationNameGroups = _.map(groups, function(medications, medName) {
                return new Backbone.Model({
                    type: medName,
                    meds: new Backbone.Collection(medications),
                    name: medications[0].get('name'),
                    sig: medications[0].get('sig'),
                    dose: medications[0].get('dose'),
                    dosagesUnits: medications[0].get('dosagesUnits'),
                    routeName: medications[0].get('routeName'),
                    scheduleName: medications[0].get('scheduleName'),
                    overallStop: medications[0].get('overallStop'),
                    vaStatus: medications[0].get('vaStatus'),
                    instructions: medications[0].get('instructions'),

                    detailId: medications[0].get('detailId'),
                    lastDate: medications[0].get('lastDate'),
                    lastDatePrefix: medications[0].get('lastDatePrefix'),
                    lastFillStyle: medications[0].get('lastFillStyle'),
                    lastFillDetails: medications[0].get('lastFillDetails'),
                    dailyOrScheduledDosePrefix: medications[0].get('dailyOrScheduledDosePrefix'),
                    dailyOrScheduledDose: medications[0].get('dailyOrScheduledDose'),
                    summaryViewDate: medications[0].get('summaryViewDate'),
                    expirationLabel: medications[0].get('expirationLabel'),
                    standardizedVaStatus: medications[0].get('standardizedVaStatus'),
                    standardizedFacilityCode: medications[0].get('standardizedFacilityCode'),
                    subcategory: medications[0].get('subcategory'),

                    initialize: function() {
                        this.type = medName;
                        this.meds = medications;
                    }
                });
            });
            this.collection.reset(medicationNameGroups);
        }
    });

    var MedicationCollectionView = Backbone.Marionette.CollectionView.extend({
        id: "medicationsAccordion",
        className: "panel-group",
        childView: MedicationGroupView,
        emptyView: LoadingView,
        initialize: function() {
            this.collection = new Backbone.Collection();

            this.listenTo(medicationCollectionHandler.allMedGroups, 'reset', function() {
                this.collection.reset(medicationCollectionHandler.allMedGroups.models);
                if (this.collection.length <= 0) {
                    this.emptyView = EmptyView;
                    this.render();
                }
            });
        }

    });

    return MedicationCollectionView;
});
