define([
    "underscore",
    "backbone",
    "moment",
    'jquery',
    'app/applets/vitals/util',
    'app/applets/vitals/gistConfig',
    'hbs!app/applets/vitals/templates/tooltip'
], function(_, Backbone, moment, $, Util, gistConfiguration, tooltip) {
    var collectionHandler = {
        fetchVitalsCollection: function() {
            return this;
        },
        addTooltips: function(collection, limit) {
            for (var i = 0; i < collection.models.length; i++) {
                var attr = collection.models[i].attributes;
                if (attr.oldValues) {
                    attr.limitedoldValues = attr.oldValues.splice(1, limit);
                    if ((attr.oldValues.length - attr.limitedoldValues.length) > 0) {
                        attr.moreresultsCount = attr.oldValues.length - attr.limitedoldValues.length;
                    }
                }
                collection.models[i].attributes.tooltip = tooltip(attr);
            }
            collection.reset(collection.models);
        },
        parseModel: function(response) {
            response = Util.getObservedFormatted(response);
            response = Util.getFacilityColor(response);
            response = Util.getObservedFormattedCover(response);
            response = Util.getResultedFormatted(response);
            response = Util.getDisplayName(response);
            response = Util.getTypeName(response);
            response = Util.noVitlasNoRecord(response);
            response = Util.getFormattedHeight(response);
            response = Util.getResultUnits(response);
            response = Util.getMetricResultUnits(response);
            response = Util.getResultUnitsMetricResultUnits(response);
            response = Util.getReferenceRange(response);
            response = Util.getFormattedWeight(response);
            response = Util.getMetricResult(response);
            return response;
        },
        filterCollection: function(coll) {
            var KnownTypes = {
                expanded: ['BP', 'P', 'R', 'T', 'PO2', 'PN', 'WT', 'HT', 'BMI', 'CG'],
                summary: ['BP', 'P', 'R', 'T', 'PO2', 'PN', 'WT', 'BMI'],
                gist: ['BPS', 'BPD', 'P', 'R', 'T', 'PO2', 'PN', 'WT', 'HT', 'BMI']

            };
            var _self = this;
            var resultColl = [];
            var knownTypes = KnownTypes[this.appletConfig.viewType];

            if (coll.length === 0) {
                return Util.setNoRecords(resultColl, knownTypes, knownTypes);
            }
            coll.models.forEach(function(model) {
                model.set('applet_id', _self.dataGridOptions.appletId);
                model.attributes = collectionHandler.parseModel(model.attributes);
            });

            coll = Util.buildCollection(coll);

            coll.reset(_.filter(coll.models, function(model) {
                if (model.has('removed') && model.get('removed') === true)
                    return false;
                else
                    return true;
            }));

            var allTypes = $.unique(coll.pluck('displayName'));
            var displayTypes = knownTypes.filter(function(el) {
                return allTypes.indexOf(el) != -1;
            });
            var latestDate = 0;
            var observedDate;
            displayTypes.forEach(function(type) {
                var newColl = new Backbone.Collection(coll.where({
                    displayName: type
                }));

                if (newColl.length > 0) {
                    newColl.comparator = 'observed';
                    newColl.sort();
                    //add low,high,observationType to all models
                    _.each(newColl.models, function(model) {
                        var def = Util.defaults[type];
                        if (def) {
                            model.set('observationType',model.get('observationType') || def.observationType);
                        }
                    });

                    var displayModel = newColl.at(newColl.length - 1);
                    if (displayModel.has('observed')) {
                        observedDate = displayModel.get('observed').substring(0, 8);
                        displayModel.set('observedDate', observedDate);
                        if (latestDate === 0 || latestDate < observedDate) {
                            latestDate = observedDate;
                        }
                    }
                    if (newColl.length > 1) {
                        var previousDisplayModel = newColl.at(newColl.length - 2);
                        if (previousDisplayModel.has('result')) {
                            displayModel.set('previousResult', previousDisplayModel.get('result'));
                        }
                        displayModel.set('oldValues', newColl.models.reverse());
                    }
                    // if (!displayModel.has('low') && !displayModel.has('high')) {
                    switch (type) {
                        case 'WT':
                            displayModel.set('graphOptions', gistConfiguration.graphOptions.BMI());
                            break;
                        case 'BMI':
                            displayModel.set('graphOptions', gistConfiguration.graphOptions.BMI());
                            break;
                        case 'PN':
                            displayModel.set('graphOptions', gistConfiguration.graphOptions.PN());
                            break;
                        case 'PO2':
                            displayModel.set('graphOptions', gistConfiguration.graphOptions.PO2());
                            break;
                        case 'R':
                            displayModel.set('vitalsTypeName', 'Respiratory Rate');
                            displayModel.set('graphOptions', gistConfiguration.graphOptions);
                            break;
                        case 'HT':
                            displayModel.set('graphOptions', gistConfiguration.graphOptions.HT());
                            break;
                        default:
                            displayModel.set('graphOptions', gistConfiguration.graphOptions);
                    }
                    resultColl[knownTypes.indexOf(type)] = displayModel;
                }
            });
            _.each(resultColl, function(model) {
                if (typeof model === 'undefined' || model === null) {
                    return;
                }
                if (model.get('observedDate') === latestDate) {
                    model.set('observedDateLatest', 'latestVital');
                } else {
                    model.set('observedDateLatest', 'notLatestVital');
                }
            });


            var noRecordTypes = knownTypes.filter(function(el) {
                return displayTypes.indexOf(el) == -1;
            });

            if (noRecordTypes.length > 0) {
                resultColl = Util.setNoRecords(resultColl, noRecordTypes, knownTypes);
            }

            return resultColl;
        }

    };
    _.extend(collectionHandler, Backbone.Events);
    return collectionHandler;
});