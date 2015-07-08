define([
    "app/applets/medication_review/appletHelper",
    "underscore",
    "backbone",
    "app/applets/activeMeds/appUtil",
    "moment",
    "hbs!app/applets/activeMeds/templates/tooltip"
], function(appletHelper, _, Backbone, util, moment, tooltip) {


    var collectionHandler = {
        initialized: false,
        fetchMedsCollection: function(partialFetchOptions, viewType) {
            var patientType = ADK.PatientRecordService.getCurrentPatient().get('patientStatusClass');
            if (patientType.toUpperCase() === 'INPATIENT') {
                filterOptions = 'or(eq(vaType, "I"), eq(vaType, "IV"), eq(vaType, "V"))';
            } else if (patientType.toUpperCase() === 'OUTPATIENT') {
                filterOptions = 'or(eq(vaType, "O"), eq(vaType, "N"))';
            }

            var self = this;
            var fetchOptions = partialFetchOptions;
            fetchOptions.criteria.filter = filterOptions;
            fetchOptions.patient = ADK.PatientRecordService.getCurrentPatient();
            fetchOptions.collectionConfig = {
                collectionParse: function(collection) {

                    var filterFunction = function(model) {
                        var isActiveOrRecent = false;
                        var status = model.get('calculatedStatus').toUpperCase();
                        //var status = model.get('vaStatus').toUpperCase();
                        if (status === 'EXPIRES' || status === 'START' || model.get('recent') === true) {
                            isActiveOrRecent = true;
                        }

                        return isActiveOrRecent;
                    };

                    var filteredCollection = ADK.ResourceService.filterCollection(collection, filterFunction);
                    return filteredCollection;
                }
            };
            this.allMedications = ADK.PatientRecordService.fetchCollection(fetchOptions);

            this.allMedications.comparator = function(first, second) {
                var firstDate = moment(first.get("lastAction"), 'YYYYMMDDHHmmssSSS');
                var secondDate = moment(second.get("lastAction"), 'YYYYMMDDHHmmssSSS');
                if (firstDate < secondDate) {
                    return 1;
                } else if (firstDate > secondDate) {
                    return -1;
                }
                return 0;
            };

            this.allMedications.on('sync', function(collections) {
                //collections.model.set('infobuttonContext', 'MLREV');
                _.each(collections.models, function(mod) {
                    mod.set('infobuttonContext', 'MLREV');
                });
            });

            return this.allMedications;

        },
        initCollections: function() {
            //this.allMedGroups = new Backbone.Collection();
            //this.allMedications = new Backbone.Collection();
            // this.allMedications.on('sync', this.resetCollections, this);

            this.initialized = true;
        },
        resetCollections: function() {},
        getActiveMedicationGroupbyData: function(medModel) {
            var groupbyValue,
                groupbyField;

            if (medModel.get('qualifiedName')) {
                groupbyField = 'qualifiedName';
                groupbyValue = medModel.get(groupbyField);
            } else {
                //get the first word from 'name' with no commas or spaces
                groupbyField = 'name';
                groupbyValue = medModel.get(groupbyField).split(",")[0].toUpperCase();
                groupbyValue = groupbyValue.split(" ")[0].toUpperCase();
            }

            return {
                groupbyValue: groupbyValue,
                groupbyField: groupbyField
            };
        },
        getFirstFiveMeds: function(meds) {
            firstFiveMeds = [];
            if (meds[0] !== undefined) {
                firstFiveMeds.push(meds[0]);
            }
            if (meds[1] !== undefined) {
                firstFiveMeds.push(meds[1]);
            }
            if (meds[2] !== undefined) {
                firstFiveMeds.push(meds[2]);
            }
            if (meds[3] !== undefined) {
                firstFiveMeds.push(meds[3]);
            }
            if (meds[4] !== undefined) {
                firstFiveMeds.push(meds[4]);
            }
            return firstFiveMeds;
        },
        afterGroupingParse: function(response) {
            var subMed = response;
            response.doseArrowClass = "";
            response.popoverMeds = this.getFirstFiveMeds(response.meds);
            var numberOfMedsNotShownInPopover = response.meds.length - response.popoverMeds.length;
            if (numberOfMedsNotShownInPopover > 0) {
                response.numberOfMedsNotShownInPopover = numberOfMedsNotShownInPopover;
            }
            if (response.meds !== undefined) {
                subMed = response.meds[0].attributes;
                response.doseChange = 'NONE';
                if (response.meds.length > 1) {
                    var subMedPrev = response.meds[1].attributes;
                    if (subMedPrev.dosages !== undefined && subMedPrev.dosages[0] !== undefined &&
                        subMed.dosages !== undefined && subMed.dosages[0] !== undefined) {
                        if (parseFloat(subMed.dosages[0].dose) > parseFloat(subMedPrev.dosages[0].dose)) {
                            response.doseChange = "UPARROW";
                        } else if (parseFloat(subMed.dosages[0].dose) < parseFloat(subMedPrev.dosages[0].dose)) {
                            response.doseChange = "DOWNARROW";
                        }
                    }
                }
            }
            if (subMed.calculatedStatus.toUpperCase() === 'PENDING') {
                response.doseChange = 'NEW';
            } else if (subMed.calculatedStatus.toUpperCase() === 'EXPIRED') {
                response.doseChange = 'EXPIRED';
            } else if (subMed.calculatedStatus.toUpperCase() === 'DISCONTINUED' || subMed.calculatedStatus.toUpperCase() === 'CANCELLED') {
                response.doseChange = 'EXCLAMATION-CIRCLE';
            }
            var startDate = moment(subMed.lastAction, 'YYYYMMDDHHmmssSSS');
            var endDate = moment();
            if (subMed.calculatedStatus.toUpperCase() === 'DISCONTINUED') {
                console.log(startDate.toDate());
                console.log(endDate.toDate());
            }

            var duration = moment.duration(endDate.diff(startDate));
            var days = parseFloat(duration.asDays());
            if (response.meds !== undefined) {

                _.each(response.meds, function(med) {
                    med.set('overallStartFormat', ADK.utils.formatDate(med.get('lastAction')));
                });
            }
            var isExpiredCancelledOrDiscontinued = false;
            if (subMed.calculatedStatus.toUpperCase() === 'DISCONTINUED' || subMed.calculatedStatus.toUpperCase() === 'CANCELLED' || subMed.calculatedStatus.toUpperCase() === 'EXPIRED') {
                isExpiredCancelledOrDiscontinued = true;
                response.totalFillsRemaining = '0';
            }
            if (subMed.vaType.toUpperCase() === 'I' || subMed.vaType.toUpperCase() === 'V') {
                response.totalFillsRemaining = '-1';
            } else if (subMed.calculatedStatus.toUpperCase() === 'PENDING') {
                if (subMed.orders[0].fillsAllowed !== undefined) {
                    response.totalFillsRemaining = subMed.orders[0].fillsAllowed.toString();
                } else {
                    response.totalFillsRemaining = '-1';
                }
            } else if (!isExpiredCancelledOrDiscontinued) {

                if (subMed.expirationDate !== undefined && subMed.orders[0].daysSupply) {
                    response.effectiveFillsRemaining = util.getCalculatedEffectiveFillsRemaining(subMed.expirationDate, subMed.orders[0].daysSupply, subMed.orders[0].fillsRemaining, subMed.calculatedStatus);
                } else {
                    response.effectiveFillsRemaining = subMed.orders[0].fillsRemaining;
                }
                response.totalFillsRemaining = response.effectiveFillsRemaining;
            }
            response.tooltip = tooltip(response);

            response.infobuttonContext = 'MLREV';

            return response;
        }

    };
    _.extend(collectionHandler, Backbone.Events);
    return collectionHandler;
});