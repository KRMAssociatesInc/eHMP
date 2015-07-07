define([
    "app/applets/medication_review_v2/appletHelper",
    "app/applets/medication_review_v2/charts/chartBuilder"
], function(appletHelper, chartBuilder) {
    var hasOverLappingMeds = function(medArray) {
        if (medArray.length === 1) {
            return false;
        }
        for (var first = 0; first < medArray.length - 1; first++) {
            var firstMed = medArray[first];

            for (var second = first + 1; second < medArray.length; second++) {
                var secondMed = medArray[second];
                var firstDateStop = moment(firstMed.get('stopped'), 'YYYYMMDD');
                var firstDateStart = moment(firstMed.get('overallStart'), 'YYYYMMDD');
                var secondDateStart = moment(secondMed.get('overallStart'), 'YYYYMMDD');
                var secondDateStop = moment(secondMed.get('stopped'), 'YYYYMMDD');
                var firstFacility = firstMed.get('facilityName');
                var secondFacility = secondMed.get('facilityName');

                var secondStopGTEFirstStartLTEFirstStop = (secondDateStop >= firstDateStart && secondDateStop <= firstDateStop);
                var secondStartLTEFirstStopGTEFirstStart = (secondDateStart <= firstDateStart && secondDateStart >= firstDateStop);
                var firstStopGTESecondStartLTESecondStop = (firstDateStart >= secondDateStop && firstDateStop <= secondDateStop);
                var firstStartLTESecondStopGTESecondStart = (firstDateStart <= secondDateStop && firstDateStop >= secondDateStart);
                if ((secondStopGTEFirstStartLTEFirstStop ||
                        secondStartLTEFirstStopGTEFirstStart ||
                        firstStopGTESecondStartLTESecondStop ||
                        firstStartLTESecondStopGTESecondStart)) {
                    return true;
                }
            }

        }
        return false;
    };
    var splitOverLappingMeds = function(medArray) {
        if (medArray.length === 1) {
            return [medArray];
        }
        for (var first = 0; first < medArray.length - 1; first++) {
            var firstMed = medArray[first];

            for (var second = first + 1; second < medArray.length; second++) {
                var secondMed = medArray[second];
                var firstDateStop = moment(firstMed.get('stopped'), 'YYYYMMDD').valueOf();
                var firstDateStart = moment(firstMed.get('overallStart'), 'YYYYMMDD').valueOf();
                var secondDateStart = moment(secondMed.get('overallStart'), 'YYYYMMDD').valueOf();
                var secondDateStop = moment(secondMed.get('stopped'), 'YYYYMMDD').valueOf();

                var secondStopGTEFirstStartLTEFirstStop = (secondDateStop >= firstDateStart && secondDateStop <= firstDateStop);
                var secondStartLTEFirstStopGTEFirstStart = (secondDateStart <= firstDateStart && secondDateStart >= firstDateStop);
                var firstStopGTESecondStartLTESecondStop = (firstDateStart >= secondDateStop && firstDateStop <= secondDateStop);
                var firstStartLTESecondStopGTESecondStart = (firstDateStart <= secondDateStop && firstDateStop >= secondDateStart);

                if ((secondStopGTEFirstStartLTEFirstStop ||
                        secondStartLTEFirstStopGTEFirstStart ||
                        firstStopGTESecondStartLTESecondStop ||
                        firstStartLTESecondStopGTESecondStart)) {
                    var splitArray1 = medArray.splice(0, second);
                    var splitArray2 = medArray;
                    return [splitArray1, splitArray2];
                }
            }

        }
        return [medArray];
    };
    var splitOverLappingMedsConcat = function(medArray) {
        var checkForMoreOverlappingMeds = true;
        var concatArray = [];
        var splitArray = splitOverLappingMeds(medArray);
        while (checkForMoreOverlappingMeds) {
            concatArray.push(splitArray[0]);
            if (splitArray.length === 1) {
                checkForMoreOverlappingMeds = false;
                break;
            } else {
                splitArray = splitOverLappingMeds(splitArray[1]);
            }
        }

        return concatArray;
    };
    var removeDuplicateMedsIfPresent = function(models) {
        var newModels = _.filter(models, function(model, index) {
            /* tests if the model has a duplicate in the rest of the modles by uid */
            for (index += 1; index < models.length; index += 1) {
                if (_.isEqual(model.get('uid'), models[index].get('uid'))) {
                    return false;
                }
            }
            return true;
        });
        return newModels;
    };

    var groupByMedication = function(collection, useGlobalDateFilter) {
        var subGroups = collection.groupBy(function(med) {
            return med.get('groupbyValue');
        });

        var medicationSubGroups = _.map(subGroups, function(subMedications, subMedication) {
            /* get all attributes of the first med in the group and then append the sub group collection */
            var medSubGroupModel = new Backbone.Model();
            var noDuplicateSubMedications = removeDuplicateMedsIfPresent(subMedications);
            medSubGroupModel.set('submeds', new subMedsCollection(noDuplicateSubMedications));

            _.each(medSubGroupModel.get('submeds').models, function(model) {
                model.set('greenLineDate', medSubGroupModel.get('submeds').models[medSubGroupModel.get('submeds').models.length - 1].get('overallStart'));
            });
            var unfilteredModelsForGraph = medSubGroupModel.get('submeds').models;
            var AllDateModel = ADK.SessionStorage.getModel('globalDate');
            var filteredModels = medSubGroupModel.get('submeds').models;

            if (AllDateModel.get('selectedId') !== 'all-range-global' && useGlobalDateFilter) {

                filteredModels = _.filter(medSubGroupModel.get('submeds').models, function(model) {
                    var dateModel = ADK.SessionStorage.getModel('globalDate');
                    var GDFStart = moment(dateModel.get('fromDate'), "MM/DD/YYYY").valueOf();
                    var overallStart = moment(model.get('overallStart'), "YYYYMMDD").valueOf();
                    var overallStop = moment(model.get('stopped'), "YYYYMMDD").valueOf();
                    var lastFilled = moment(model.get('lastFilled'), "YYYYMMDD").valueOf();
                    var lastAdmin = moment(model.get('lastAdmin'), "YYYYMMDD").valueOf();

                    if (dateModel.get('fromDate') && (dateModel.get('fromDate') !== 'null')) {
                        var filter1 = (overallStart >= GDFStart || lastFilled >= GDFStart || lastAdmin >= GDFStart || overallStop >= GDFStart);
                        return filter1;
                    } else if (dateModel.get('selectedId') === 'custom-range-apply-global' ||
                        dateModel.get('selectedId') === 'custom-range-apply-global') {
                        var startCustom = moment(dateModel.get('customFromDate'), 'MM/DD/YYYY');
                        var stopCustom = moment(dateModel.get('customToDate'), 'MM/DD/YYYY');

                        var filter2 = ((overallStart >= startCustom || lastFilled >= startCustom || lastAdmin >= startCustom) && overallStop <= stopCustom);
                        return filter2;

                    } else {
                        return true;
                    }
                });
            }
            modelToReturn = medSubGroupModel.get('submeds').models[0];

            medSubGroupModel.get('submeds').reset(filteredModels);
            modelToReturn.set("submeds", new subMedsCollection(filteredModels));
            modelToReturn.set("unfilteredCollectionToGraph", new subMedsCollection(unfilteredModelsForGraph));

            return modelToReturn;
        });
        var filteredOutEmptySubGroups = _.filter(medicationSubGroups, function(subGroup) {
            return (subGroup.get('submeds').models.length > 0);
        });
        return filteredOutEmptySubGroups;
    };
    var groupByFacility = function(collection, showOverLappingMeds) {
        var facilityGroups = collection.groupBy(function(subGroupInternalMed) {
            if (!showOverLappingMeds) {
                return 'key';
            }
            return subGroupInternalMed.get('facilityName');
        });
        var completeFacilityGroups = {};
        var completeFacilityGroupsSets = _.map(facilityGroups, function(value, key) {
            return {
                key: key,
                sets: splitOverLappingMedsConcat(value)
            };
        });

        _.each(completeFacilityGroupsSets, function(groupsSet) {

            var newKey = groupsSet.key;

            for (var index = 0; index < groupsSet.sets.length; index++) {
                var nextKey = newKey + index.toString();
                if (index === 0) {
                    nextKey = newKey + '_topFacilityRow';
                }

                completeFacilityGroups[nextKey] = groupsSet.sets[index];
            }
        });

        var facilityGroupModels = _.map(completeFacilityGroups, function(subFacilityMedications, key) {

            var topBorderClass = '';
            if (key.indexOf('_topFacilityRow') >= 0) {
                topBorderClass = 'grayTopBorder';
            }
            subFacilityMedications[0].set('topBorderClass', topBorderClass);
            var facilityModel = new Backbone.Model({
                topBorderClass: topBorderClass,
                firstFacilityMed: subFacilityMedications[0],
                facilityName: subFacilityMedications[0].get('facilityName'),
                facilityMoniker: subFacilityMedications[0].get('facilityMoniker'),
                facilityMeds: new Backbone.Collection(subFacilityMedications)
            });

            /* check for change in dose */
            if (facilityModel.get('facilityMeds').models.length > 1) {
                facilityModel.set('secondFacilityMed', facilityModel.get('facilityMeds').models[1]);
                var bothHaveDose = (facilityModel.get('secondFacilityMed').get('dosages') &&
                    facilityModel.get('secondFacilityMed').get('dosages')[0] !== undefined &&
                    facilityModel.get('secondFacilityMed').get('dosages')[0].dose !== undefined &&
                    facilityModel.get('firstFacilityMed').get('dosages') &&
                    facilityModel.get('firstFacilityMed').get('dosages')[0] !== undefined &&
                    facilityModel.get('firstFacilityMed').get('dosages')[0].dose !== undefined);
                if (bothHaveDose) {

                    if (parseFloat(facilityModel.get('firstFacilityMed').get('dosages')[0].dose) > parseFloat(facilityModel.get('secondFacilityMed').get('dosages')[0].dose)) {
                        facilityModel.get('firstFacilityMed').set('changeInMedicationDoseClass', 'fa fa-arrow-up');
                        facilityModel.set('ariaLabelAdditionalText', ' There was an increase in dosage from ' +
                            facilityModel.get('secondFacilityMed').get('dosages')[0].instructions + " to " + facilityModel.get('firstFacilityMed').get('dosages')[0].instructions);
                    } else if (parseFloat(facilityModel.get('firstFacilityMed').get('dosages')[0].dose) < parseFloat(facilityModel.get('secondFacilityMed').get('dosages')[0].dose) + ".") {
                        facilityModel.get('firstFacilityMed').set('changeInMedicationDoseClass', 'fa fa-arrow-down');
                        facilityModel.set('ariaLabelAdditionalText', ' There was a decrease in dosage from ' +
                            facilityModel.get('secondFacilityMed').get('dosages')[0].instructions + " to " + facilityModel.get('firstFacilityMed').get('dosages')[0].instructions + ".");
                    }
                }
            }
            return facilityModel;
        });

        facilityGroupModels[0].set('topBorderClass', '');
        return facilityGroupModels;
    };
    var groupByMedicationNameThenByFacility = function(collection, useGlobalDateFilter) {

        var medicationSubGroups = groupByMedication(collection, true);
        var groupNames = [];
        _.each(medicationSubGroups, function(subGroupModel) {
            groupNames.push(subGroupModel.get("displayName"));
            var showOverLappingMeds = hasOverLappingMeds(subGroupModel.get('submeds').models);

            var facilityGroupModels = groupByFacility(subGroupModel.get('submeds'), showOverLappingMeds);
            var graphText = appletHelper.getGraphTextInfo(facilityGroupModels);
            _.each(facilityGroupModels, function(model) {
                model.set('graphInfoText', graphText);
            });
            subGroupModel.set('subMedsInternalGroupModels', new Backbone.Collection(facilityGroupModels));
            subGroupModel.get('subMedsInternalGroupModels').models[0].set("isFirstOverlappingMed", true);

            var AllDateModel = ADK.SessionStorage.getModel('globalDate');

            var unfilteredCollectionToGraphFacilityGroupModels = facilityGroupModels;
            if (AllDateModel.get('selectedId') !== 'all-range-global' && useGlobalDateFilter) {
                unfilteredCollectionToGraphFacilityGroupModels = groupByFacility(subGroupModel.get('unfilteredCollectionToGraph'));
            }
            subGroupModel.set('unfilteredCollectionToGraph', new Backbone.Collection(unfilteredCollectionToGraphFacilityGroupModels));
            subGroupModel.set('hasOverLappingMeds', true);


        });
        return {
            medicationSubGroups: medicationSubGroups,
            groupNames: groupNames
        };
    };
    var self = this;
    var statusRanks = {
        'ACTIVE': 1,
        'UNRELEASED': 1,
        'PENDING': 2,
        'EXPIRED': 3,
        'DISCONTINUED': 4
    };
    var medsCollection = Backbone.Collection.extend({
        comparator: function(modelA, modelB) {
            var modelAStatus = statusRanks[modelA.get('standardizedVaStatus')] || 100;
            var modelBStatus = statusRanks[modelB.get('standardizedVaStatus')] || 100;
            if (modelAStatus !== modelBStatus) {
                return modelAStatus - modelBStatus;
            } else {
                var modelAName = modelA.get('displayName');
                var modelBName = modelB.get('displayName');
                return modelAName < modelBName ? -1 : modelAName === modelBName ? 0 : 1;
            }
        }
    });
    var subMedsCollection = Backbone.Collection.extend({
        comparator: function(model) {
            return -moment(model.get("overallStart"), 'YYYYMMDD').valueOf();
        }
    });
    var getMedicationGroup = function(collection, groupName) {
        var mainGroup = {};
        _.each(collection.models, function(model) {
            var group = null;
            for (var medsIndex = 0; medsIndex < model.get('meds').models.length; medsIndex++) {
                if (model.get('meds').models[medsIndex].get('displayName') === groupName) {
                    group = model.get('meds').models[medsIndex].get('subMedsInternalGroupModels');
                    break;
                }
            }
            if (model.get("type").toLowerCase() === 'inpatient') {
                mainGroup.inpatientMeds = group;
            } else {
                mainGroup.outpatientMeds = group;
            }
        });
        return mainGroup;
    };
    var getMedicationGroupNames = function(collection) {
        var groupNames = [];
        _.each(collection.models, function(model) {
            groupNames = groupNames.concat(model.get("groupNames"));
        });
        var uniqueNames = _.unique(groupNames);
        return (uniqueNames);
    };

    return {
        hasOverLappingMeds: hasOverLappingMeds,
        splitOverLappingMeds: splitOverLappingMeds,
        splitOverLappingMedsConcat: splitOverLappingMedsConcat,
        removeDuplicateMedsIfPresent: removeDuplicateMedsIfPresent,
        groupByMedication: groupByMedication,
        groupByFacility: groupByFacility,
        groupByMedicationNameThenByFacility: groupByMedicationNameThenByFacility,
        medsCollection: medsCollection,
        subMedsCollection: subMedsCollection,
        getMedicationGroup: getMedicationGroup,
        getMedicationGroupNames: getMedicationGroupNames
    };

});