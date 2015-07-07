define([
    "backbone",
    "app/applets/lab_panels/util",
    "app/applets/lab_panels/collectionHandler"
], function(Backbone, util, CollectionHandler) {

    var gistConfiguration = {
        fetchOptions: {
            resourceTitle: 'patient-record-lab',
            pageable: false,
            cache: true,
            criteria: {
                filter: ''
            },
            viewModel: {
                parse: function(response) {

                    var ageData = ADK.utils.getTimeSince(response.observed);
                    response.age = ageData.timeSince;
                    response.ageDescription = ageData.timeSinceDescription;
                    response.interpretationFlag = util.getFlag(response.interpretationCode);
                    //TO REMOVE: if it doesn't have a typeCode... we set as typeCode the LOINC code from cores array
                    if (!response.typeCode && response.codes && response.codes[1]) {
                        response.typeCode = response.codes[1].code;
                    }
                    if (!response.groupUid) {
                        response.groupUid = response.uid;
                    }
                    return response;

                }
            }
        },
        transformCollection: function(collection) {
            var LabPanelModel = Backbone.Model.extend({});
            var LabPanelGroupModel = Backbone.Model.extend({});
            var allLabPanelGroups = new Backbone.Collection();
            var labOrderGroups = collection.groupBy(function(labResult) {
                return labResult.get('groupUid');
            });
            var labOrderPanelGroups = [];
            _.each(labOrderGroups, function(labResults, groupId) {
                var panels = CollectionHandler.getPanels(labResults);
                _.each(panels, function(panel) {
                    labOrderPanelGroups.push(new LabPanelModel({
                        panelId: panel.id,
                        panelName: panel.name,
                        panelCodes: panel.codes,
                        results: labResults,
                        groupId: groupId,
                        panelFacility: labResults[0].get('facilityMoniker'),
                        panelDate: labResults[0].get('observed'),
                        panelAge: labResults[0].get('age'),
                        panelAgeDescription: labResults[0].get('ageDescription')
                    }));
                });
            });
            var labPanelGroups = _.groupBy(labOrderPanelGroups, function(labOrderPanel) {
                return labOrderPanel.get('panelName');
            });
            labPanelGroups = _.map(labPanelGroups, function(labPanels, groupName) {
                return new LabPanelGroupModel({
                    //Add applet_id to model (used in toolbarview to trigger detailview)
                    applet_id: 'lab_panels',
                    panelId: labPanels[0].get('panelId'),
                    panelName: groupName,
                    panels: labPanels,
                    currentResults: labPanels[0].get('results'),
                    currentFlags: util.getPanelFlags(labPanels[0].get('results'), labPanels[0].get('panelCodes')),
                    panelCodes: labPanels[0].get('panelCodes'),
                    panelAge: labPanels[0].get('panelAge'),
                    panelAgeDescription: labPanels[0].get('panelAgeDescription')
                });
            });
            _.each(labPanelGroups, function(model) {
                CollectionHandler.afterGroupingParse(model.attributes);
            });
            allLabPanelGroups.reset(labPanelGroups);

            return allLabPanelGroups;
        },

        gistHeaders: {
            name: {
                title: 'Lab Panel',
                sortable: true,
                sortType: 'alphabetical',
                key: 'panelName'
            },
            flags: {
                title: 'Flag',
                sortable: false
            },
            age: {
                title: 'Last',
                sortable: true,
                sortType: 'date',
                key: 'panelAge'
            }
        },

        gistModel: [{
            id: 'id',
            field: 'panelId'
        }, {
            id: 'name',
            field: 'panelName'
        }, {
            id: 'flags',
            field: 'currentFlags'
        }, {
            id: 'age',
            field: 'panelAge'
        }, {
            id: 'ageDescription',
            field: 'panelAgeDescription'
        }, {
            id: 'tooltip',
            field: 'tooltip'
        }],
        filterFields: ['name']
    };

    return gistConfiguration;
});