define([
    "backbone",
    "app/applets/activeMeds/medicationCollectionHandler"
], function(Backbone, CollectionHandler) {

    var gistConfiguration = {
        fetchOptions: {
            resourceTitle: 'patient-record-med',
            cache: true,
            viewModel: {
                parse: function(response) {
                    var ageData = ADK.utils.getTimeSince(response.lastAction);
                    response.age = response.lastAction;
                    response.ageDescription = ageData.timeSinceDescription;
                    return response;
                }
            },
            pageable: false,
            criteria: {
                filter: ''
            }
        },
        transformCollection: function(collection) {
            /* if collection is already transformed return collection */
            if (collection.models.length > 0 && collection.models[0].get('meds') !== undefined) {
                return collection;
            }
            var medGroupModel = Backbone.Model.extend({});
            var groups = collection.groupBy(function(med) {
                return CollectionHandler.getActiveMedicationGroupbyData(med).groupbyValue;
            });
            var medicationGroups = _.map(groups, function(medications, groupName) {
                return new medGroupModel({
                    groupName: groupName,
                    normalizedName: medications[0].get('normalizedName'),
                    meds: medications,
                    sig: medications[0].get('sig'),
                    facilityDisplay: medications[0].get('facilityName'),
                    uid: medications[0].get('uid'),
                    lastAction: medications[0].get('lastAction'),
                    age: medications[0].get('age'),
                    ageReadText: medications[0].get('ageDescription'),
                    calculatedStatus: medications[0].get('calculatedStatus'),
                    orders: medications[0].get('orders')
                });
            });

            _.each(medicationGroups, function(model) {
                CollectionHandler.afterGroupingParse(model.attributes);

            });

            collection.reset(medicationGroups);
            return collection;
        },
        gistHeaders: {
            name: {
                title: 'Medication',
                sortable: true,
                sortType: 'alphabetical',
                key: 'normalizedName',
                hoverTip: 'medications_medication'
            },
            description: {
                title: '',
                sortable: false
            },
            graphic: {
                title: 'Change',
                sortable: true,
                sortType: 'alphabetical',
                key: 'doseChange',
                hoverTip: 'medications_change'
            },
            age: {
                title: 'Last \u0394',
                sortable: true,
                sortType: 'date',
                key: 'lastAction',
                hoverTip: 'medications_last'
            },
            count: {
                title: 'Refills',
                sortable: true,
                sortType: 'numeric',
                key: 'totalFillsRemaining',
                hoverTip: 'medications_refills'
            }
        },
        gistModel: [{
            id: 'id',
            field: 'groupName'
        }, {
            id: 'name',
            field: 'normalizedName'
        }, {
            id: 'description',
            field: 'sig'
        }, {
            id: 'age',
            field: 'age'
        }, {
            id: 'ageReadText',
            field: 'ageReadText'
        }, {
            id: 'graphic',
            field: 'doseChange'
        }, {
            id: 'count',
            field: 'totalFillsRemaining'
        }],
        filterFields: ['normalizedName', 'age', 'totalFillsRemaining']
    };
    return gistConfiguration;
});
