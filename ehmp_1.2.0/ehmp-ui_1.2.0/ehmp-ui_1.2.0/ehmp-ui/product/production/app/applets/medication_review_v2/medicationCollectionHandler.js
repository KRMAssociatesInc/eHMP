define([
    "app/applets/medication_review_v2/appletHelper",
    "app/applets/medication_review_v2/medicationCollectionFormatHelper"
], function(appletHelper, medicationCollectionFormatHelper) {

    function getMedicationViewModel() {
        var medicationViewModel = {
            defaults: {
                "fillsAllowed": "Unk"
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
    var medSubGroupModel = Backbone.Model.extend({
        initialize: function() {}
    });

    var medGroupGraphModel = Backbone.Model.extend({});

    var collectionHandler = {
        initialized: false,
        fetchAllMeds: function(useGlobalDateFilter, callback) {
            var self = this;
            var fetchOptions = {
                resourceTitle: 'patient-record-med',
                cache: false,
                criteria: {},
                viewModel: getMedicationViewModel(),
                collectionConfig: {
                    groupCollectionModels: self.groupCollectionModels,
                    parent: self,
                    useGlobalDateFilter: useGlobalDateFilter,
                    collectionParse: self.resetCollections
                },
                patient: ADK.PatientRecordService.getCurrentPatient()
            };

            fetchOptions.onSuccess = function(collection, resp) {
                if(!_.isUndefined(callback) && typeof callback === 'function'){
                    callback(collection);
                }
            };

            return ADK.PatientRecordService.fetchCollection(fetchOptions);
        },
        resetCollections: function(collection) {
            //var test = medicationCollectionFormatHelper.getGroupedMedsForStackedGraphs(collection);
            //console.log(test);
            _.each(collection.models, function(model) {
                model.attributes = appletHelper.parseMedResponse(model.attributes);
            });
            var filteredModels = _.filter(collection.models, function(model) {

                var dateModel = ADK.SessionStorage.getModel('globalDate');
                var GDFStart = moment(dateModel.get('fromDate'), "MM/DD/YYYY").valueOf();
                var overallStart = moment(model.get('overallStart'), "YYYYMMDDHHmm").valueOf();
                var overallStop = moment(model.get('stopped'), "YYYYMMDDHHmm").valueOf();
                var lastFilled = moment(model.get('lastFilled'), "YYYYMMDDHHmm").valueOf();
                var lastAdmin = moment(model.get('lastAdmin'), "YYYYMMDDHHmm").valueOf();
                var name = model.get('qualifiedName');

                if(dateModel.get('selectedId') === 'all-range-global' || !this.useGlobalDateFilter){
                    return true;
                }else if (dateModel.get('fromDate') && (dateModel.get('fromDate') !== 'null')) {
                    var filter1 = (overallStart >= GDFStart || lastFilled >= GDFStart || lastAdmin >= GDFStart || overallStop >= GDFStart);
                    return filter1;
                } else if (dateModel.get('selectedId') === 'custom-range-apply-global') {
                    var startCustom = moment(dateModel.get('customFromDate'), 'MM/DD/YYYY').valueOf();
                    var stopCustom = moment(dateModel.get('customToDate'), 'MM/DD/YYYY').valueOf();
                    var filter2 = ((overallStart >= startCustom || lastFilled >= startCustom || lastAdmin >= startCustom) && overallStop <= stopCustom);
                    return filter2;

                } else {
                    return true;
                }
            });
            var filteredCollection = new Backbone.Collection(filteredModels);

            var dateModel = ADK.SessionStorage.getModel('globalDate');

            var startTime,
                endTime, stoppedDate;
            if (dateModel.get('selectedId') === 'all-range-global' || !this.useGlobalDateFilter) {
                var sortDate = function(a, b) {
                    var c = new Date(a);
                    var d = new Date(b);
                    return (c - d) * -1;
                };

                var allStartDates = [];

                _.each(filteredCollection.models, function(med) {
                    if (_.isUndefined(med.get('stopped')) || med.get('stopped') === "") {
                        stoppedDate = moment().add(6, 'months');
                    } else {
                        stoppedDate = med.get('stopped');
                    }
                    if (!_.isUndefined(med.get('overallStart'))) {
                        allStartDates.push(moment(med.get('overallStart'), 'YYYYMMDDHHmm').valueOf());
                        allStartDates.push(moment(med.get('stopped'), 'YYYYMMDDHHmm').valueOf());
                    }
                });

                allStartDates.sort(function(a, b) {
                    return sortDate(a, b);
                });

                var uniqueYears = _.unique(allStartDates);
                startTime = _.last(uniqueYears);
                endTime = _.first(uniqueYears);

            } else {
                startTime = moment(dateModel.get('fromDate'), "MM/DD/YYYY").valueOf();
                endTime = moment(dateModel.get('toDate'), "MM/DD/YYYY").valueOf();
            }

            _.each(collection.models, function(model) {
                model.set('graphRelativeityNewestTime', endTime);
                model.set('graphRelativeityOldestTime', startTime);
            });

            this.parent.shadowCollection = collection.clone();
            return this.groupCollectionModels(collection, this.useGlobalDateFilter);
        },
        groupCollectionModels: function(collection, useGlobalDateFilter) {
            var sortOrderValue = function(firstGroupByValue) {
                var patientClass = ADK.PatientRecordService.getCurrentPatient().get('patientStatusClass');
                if (patientClass.toLowerCase() === 'inpatient') {
                    if (firstGroupByValue.toLowerCase() === 'inpatient') {
                        return 1;
                    } else {
                        return 0;
                    }
                } else if (patientClass.toLowerCase() === 'outpatient') {
                    if (firstGroupByValue.toLowerCase() === 'outpatient') {
                        return 1;
                    } else {
                        return 0;
                    }
                }
            };
            var emptyInpatientModel = new Backbone.Model({
                type: 'inpatient',
                isNonVa: false,
                meds: new Backbone.Collection(),
                sortOrderValue: sortOrderValue('inpatient'),
                firstModel: ADK.PatientRecordService.getCurrentPatient().get('patientStatusClass'),
                groupNames:[]
            });
            var emptyOutpatientModel = new Backbone.Model({
                type: 'outpatient',
                isNonVa: false,
                meds: new Backbone.Collection(),
                sortOrderValue: sortOrderValue('outpatient'),
                firstModel: ADK.PatientRecordService.getCurrentPatient().get('patientStatusClass'),
                groupNames:[]
            });

            var self = this;
            var groups = collection.groupBy(function(med) {
                return med.get('firstGroupByValue');
            });

            var medicationGroups = _.map(groups, function(medications, firstGroupByValue) {
                return new medGroupModel({
                    type: firstGroupByValue,
                    isNonVa: false,
                    meds: new medicationCollectionFormatHelper.medsCollection(medications),
                    sortOrderValue: sortOrderValue(firstGroupByValue),
                    firstModel: ADK.PatientRecordService.getCurrentPatient().get('patientStatusClass')
                });
            });
            _.each(medicationGroups, function(model) {
                var patientType = model.get('type');
                var groupedMeds = medicationCollectionFormatHelper.groupByMedicationNameThenByFacility(model.get("meds"), useGlobalDateFilter);
                //console.log(groupedMeds.groupNames);
                model.set("groupNames", groupedMeds.groupNames);
                model.get("meds").reset(groupedMeds.medicationSubGroups);
            });

            var patientClass = ADK.PatientRecordService.getCurrentPatient().get('patientStatusClass');
            if (medicationGroups.length === 0) {
                if (patientClass.toLowerCase() === 'inpatient') {
                    medicationGroups = [emptyInpatientModel, emptyOutpatientModel];
                } else {
                    medicationGroups = [emptyOutpatientModel, emptyInpatientModel];
                }

            } else if (medicationGroups.length === 1) {
                if (patientClass.toLowerCase() === 'inpatient') {
                    if (medicationGroups[0].get('type').toLowerCase() === 'inpatient') {
                        medicationGroups[1] = emptyOutpatientModel;
                    } else {
                        medicationGroups[1] = medicationGroups[0];
                        medicationGroups[0] = emptyInpatientModel;
                    }
                } else {
                    if (medicationGroups[0].get('type').toLowerCase() === 'outpatient') {
                        medicationGroups[1] = emptyInpatientModel;
                    } else {
                        medicationGroups[1] = medicationGroups[0];
                        medicationGroups[0] = emptyOutpatientModel;
                    }
                }

            } else if (medicationGroups.length === 2) {

                if (medicationGroups[0].get('type').toLowerCase() !== patientClass.toLowerCase()) {
                    var tempModel = medicationGroups[0];
                    medicationGroups[0] = medicationGroups[1];
                    medicationGroups[1] = tempModel;
                }
            }
            medicationGroups[0].set('expandOnInitialRender', true);

            collection.comparator = function(first, second) {
                if (first.get('sortOrderValue') > second.get('sortOrderValue')) {
                    return 0;
                } else {
                    return 1;
                }
            };
            return medicationGroups;

        }
    };
    return collectionHandler;
});