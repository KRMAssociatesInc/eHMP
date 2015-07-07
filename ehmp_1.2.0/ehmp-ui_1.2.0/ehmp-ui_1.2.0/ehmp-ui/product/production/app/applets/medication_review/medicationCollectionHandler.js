define([
    "app/applets/medication_review/appletHelper"
], function(appletHelper) {

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

    var medGroupModel = Backbone.Model.extend({
        initialize: function() {

            //type=Supplies or type=Clinic Orders is already formatted correctly in groupByType()
            var checkType = this.get('type').toUpperCase();
            if (checkType === 'O') {
                this.set('type', "Outpatient");
            } else if (checkType === 'I') {
                this.set('type', 'Inpatient');
            } else if (checkType === 'N') {
                this.set('type', 'Non-VA');
                this.set('isNonVa', 'true');
            }
        }
    });

    var medGroupGraphModel = Backbone.Model.extend({});

    var collectionHandler = {
        initialized: false,
        fetchAllMeds: function() {
            var dateModel = ADK.SessionStorage.getModel('globalDate');
            var self = this;
            var fetchOptions = {
                resourceTitle: 'patient-record-med',
                cache: false,
                criteria: {},
                viewModel: getMedicationViewModel()
            };

            fetchOptions.onSuccess = function(collection, resp) {
                self.resetCollections();
            };

            
            var overallStart = ADK.utils.formatDate(dateModel.get('fromDate'), 'YYYYMMDD', 'MM/DD/YYYY');
            if (dateModel.get('fromDate') && (dateModel.get('fromDate') !== 'null')) {
                fetchOptions.criteria.filter = 'or(' + 'gte(overallStart,"' + overallStart + '"),' + 'gte(lastFilled,"' + overallStart + '"),' + 'gte(lastAdmin,"' + overallStart + '"))';
            } else if (dateModel.get('selectedId') === 'all-range-global') {
                fetchOptions.criteria.filter = '';
            } else if (dateModel.get('selectedId') === 'custom-range-apply-global') {
                var overallStartCustom = ADK.utils.formatDate(dateModel.get('customFromDate'), 'YYYYMMDD', 'MM/DD/YYYY');
                var overallStopCustom = ADK.utils.formatDate(dateModel.get('customToDate'), 'YYYYMMDD', 'MM/DD/YYYY');
                fetchOptions.criteria.filter = 'and(or(' + 'gte(overallStart,"' + overallStart + '"),' + 'gte(lastFilled,"' + overallStart + '"),' + 'gte(lastAdmin,"' + overallStart + '")),lte(overallStop,"' + overallStopCustom + '"))';
            }
       

            this.allMedications = ADK.PatientRecordService.fetchCollection(fetchOptions);

            var orderValue = function(vaStatus) {
                var status = vaStatus.toUpperCase();
                switch (status) {
                    case "PENDING":
                        return 1;
                    case "ACTIVE":
                        return 2;
                    case "SUSPEND":
                        return 2;
                    case "HOLD":
                        return 2;
                    case "EXPIRED":
                        return 3;
                    case "DISCONTINUED/EDIT":
                        return 4;
                    case "DISCONTINUED":
                        return 5;
                    case "COMPLETE":
                        return 6;
                    default:
                        return 100;
                }
            };

            this.allMedications.comparator = function(first, second) {
                var sortOrder = ["O", "Supplies", "N", "Clinic Orders", "I"];
                var firstOrderNum = orderValue(first.get('vaStatus'));
                var secondOrderNum = orderValue(second.get('vaStatus'));
                var firstName = first.get('name');
                var secondName = second.get('name');

                var lvatype = first.get('groupType');
                var rvatype = second.get('groupType');

                var l = sortOrder.indexOf(lvatype);
                var r = sortOrder.indexOf(rvatype);

                if (first === second) {
                    return 0;
                }

                if (l === r) {

                    if (firstOrderNum == secondOrderNum) {
                        //Order by name, alphabetically
                        if (firstName === secondName) {
                            if (first.get('overallStart') < second.get('overallStart')) {
                                return 1;
                            } else if (first.get('overallStart') > second.get('overallStart')) {
                                return -1;
                            }
                            return 0;
                        } else if (firstName > secondName) {
                            return 1;
                        } else if (firstName < secondName) {
                            return -1;
                        }
                        return 0;
                    } else if (firstOrderNum > secondOrderNum) { //Order by vaStatus
                        return 1;
                    } else {
                        return -1;
                    }

                } else if (l < r) {
                    return -1;
                } else {
                    return 1;
                }
            };
        },

        initCollections: function() {
            this.allMedGroups = new Backbone.Collection();
            this.allGraphMedications = new Backbone.Collection();
            this.initialized = true;
        },

        resetCollections: function() {
            //if the patient is currently admitted as an inpatient, swap inpatient and outpatient
            var groups = this.allMedications.groupBy(function(med) {
                return med.get('groupType');
            });

            var medicationGroups = _.map(groups, function(medications, groupType) {
                return new medGroupModel({
                    type: groupType,
                    isNonVa: false,
                    meds: new Backbone.Collection(medications)
                });
            });

            this.allMedGroups.reset(medicationGroups);

            var medFilter = this.allMedications.filter(function(filterMed) {
                return (filterMed.get('groupType') !== "Clinic Orders") && (filterMed.get('groupType') !== "Supplies");
            });

            var namegroups = _.groupBy(medFilter, function(items) {
                if (items.get('qualifiedName')) {
                    return items.get('qualifiedName') + items.get('facilityName') + items.get('groupType');
                } else {
                    var nameGroup = items.get('name').split(",");
                    nameGroup = nameGroup[0].split(" ");
                    return nameGroup[0] + items.get('facilityName');
                }
            });

            var graphGroups = _.map(namegroups, function(medications, medication) {
                return new medGroupGraphModel({
                    name: medications[0].get('name'),
                    meds: new Backbone.Collection(medications)
                });
            });

            this.allGraphMedications.reset(graphGroups);
            ADK.Messaging.getChannel('medication_review').trigger('chartData_ready');
        }
    };
    return collectionHandler;
});
