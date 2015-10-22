define([
    'jquery',
    'moment',
    'backbone',
    'marionette',
    'underscore',
    'app/applets/medication_review_v2/medicationResourceHandler',
    'app/applets/medication_review_v2/medicationCollectionHandler',
    'app/applets/medication_review_v2/charts/stackedGraphChartBuilder',
    'app/applets/medication_review_v2/charts/chartConfig',
    'app/applets/lab_results_grid/appletHelpers',
], function($, moment, Backbone, Marionette, _, MedsResource, CollectionHandler, ChartBuilder, GraphConfig, AppletHelper) {
    'use strict';

    var inpatient, outpatient;
    var buildchart;
    var medicationChartConfig;
    var stackedGraphModel;
    var stackedGraphObject;

    ADK.Messaging.getChannel('meds_review').reply('chartInfo', function(params) {
        var medicationGroups = MedsResource.getMedicationGroup(params.collection, params.typeName.toLowerCase());

        var stacked = function(medicationGroupType, groupType) {
            var inpatientGroup, outpatientGroup, group;
            if (medicationGroups.inpatientMeds) {
                inpatientGroup = medicationGroups.inpatientMeds.get('subMedsInternalGroupModels');
            }
            if (medicationGroups.outpatientMeds) {
                outpatientGroup = medicationGroups.outpatientMeds.get('subMedsInternalGroupModels');
            }
            if (groupType === "inpatientGroup") {
                group = inpatientGroup;
            } else if (groupType === "outpatientGroup") {
                group = outpatientGroup;
            }
            stackedGraphObject = {};
            buildchart = new ChartBuilder(medicationGroupType);
            medicationChartConfig = new GraphConfig(buildchart);
            stackedGraphModel = new Backbone.Model({
                resultUnits: buildchart.instructions,
                observed: undefined,
                typeName: params.typeName.toUpperCase(),
                graphType: params.graphType,
                applet_id: 'medication_review_v2',
                collection: params.collection,
                uid: buildchart.uid,
                subMedsInternalGroupModels: group,
                medicationGroupType: medicationGroupType,
                ChartBuilder: ChartBuilder,
                GraphConfig: GraphConfig
            });
            $.extend(true, stackedGraphObject, stackedGraphModel.attributes);
            stackedGraphObject.model = stackedGraphModel;
            stackedGraphObject.chart = medicationChartConfig;
            stackedGraphObject.requesterInstanceId = params.instanceId;
            ADK.Messaging.getChannel('stackedGraph').trigger('readyToChart', {
                response: stackedGraphObject
            });
            return stackedGraphObject;
        };

        if (medicationGroups.outpatientMeds) {
            outpatient = medicationGroups.outpatientMeds;
            stacked(outpatient, 'outpatientGroup');
        }

        if (medicationGroups.inpatientMeds) {
            inpatient = medicationGroups.inpatientMeds;
            stacked(inpatient, 'inpatientGroup');
        }
        if (!medicationGroups.inpatientMeds && !medicationGroups.outpatientMeds) {
            stackedGraphObject = {};
            stackedGraphModel = new Backbone.Model({
                resultUnits: '--',
                observed: undefined,
                typeName: params.typeName.toUpperCase(),
                graphType: params.graphType,
                applet_id: 'medication_review_v2',
                collection: params.collection,
                uid: null,
                noData: true
            });

            $.extend(true, stackedGraphObject, stackedGraphModel.attributes);
            stackedGraphObject.model = stackedGraphModel;
            stackedGraphObject.chart = AppletHelper.chartOptions;
            stackedGraphObject.requesterInstanceId = params.instanceId;
            ADK.Messaging.getChannel('stackedGraph').trigger('readyToChart', {
                response: stackedGraphObject
            });
        }
    });
});