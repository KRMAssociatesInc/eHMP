/*jslint node: true, nomen: true, unparam: true */
/*global jquery, $, _, define, Marionette, jqm, describe, it, expect, beforeEach, spyOn */
'use strict';

define([
    "underscore",
    "backbone",
    "moment",
    "app/applets/lab_panels/panels",
    "hbs!app/applets/lab_panels/templates/tooltip",
    "hbs!app/applets/lab_panels/templates/panel8"
], function(_, Backbone, moment, panels, tooltip, panel8Template) {

    var collectionHandler = {
        initialized: false,
        initCollections: function() {
            this.initialized = true;
        },
        resetCollections: function() {},
        getGroupbyData: function(labPanelModel) {
            var groupbyValue,
                groupbyField;

            groupbyField = 'labOrderId';
            groupbyValue = labPanelModel.get(groupbyField);

            return {
                groupbyValue: groupbyValue,
                groupbyField: groupbyField
            };
        },
        getPanels: function(labResults) {
            var panelsFound = _.filter(panels, function(p) {
                return _.every(p.codes, function(c) {
                    return _.some(labResults, function(lr) {
                        return lr.get('typeCode') === c.code;
                    }, c);
                }, labResults);
            }, labResults);
            return panelsFound;
        },
        afterGroupingParse: function(response) {
            if (response) {
                response.tooltip = tooltip(response);
                _.each(response.currentResults, function(currentResult) {
                    var replaceTypeCode = function(labResult) {
                        return labResult.get('typeCode') === currentResult.get('typeCode');
                    };
                    for (var i = 1; i < response.panels.length; i++) {
                        if (response.panels[i]) {
                            var previousResult = _.find(response.panels[i].get('results'), replaceTypeCode);
                            if (previousResult) {
                                if (currentResult.get('result') < previousResult.get('result')) {
                                    currentResult.set('trend', '<i class="fa fa-sort-desc"></i>'); //decrease
                                }
                                if (currentResult.get('result') > previousResult.get('result')) {
                                    currentResult.set('trend', '<i class="fa fa-sort-asc"></i>'); //increase
                                }
                                break;
                            }
                        }
                    }
                });
                response.panelPreview = panel8Template(response);
            }
            return response;
        }

    };
    _.extend(collectionHandler, Backbone.Events);
    return collectionHandler;
});