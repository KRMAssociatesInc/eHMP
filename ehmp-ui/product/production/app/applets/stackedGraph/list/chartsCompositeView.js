define([
    'backbone',
    'marionette',
    'underscore',
    'highcharts',
    'hbs!app/applets/stackedGraph/list/chartsCompositeViewTemplate',
    'app/applets/stackedGraph/utils/utils',
    'app/applets/stackedGraph/list/rowItemView',
    'app/applets/lab_results_grid/applet',
    'app/applets/vitals/applet',
    'typeahead',
    'highcharts-more'

], function(Backbone, Marionette, _, Highcharts, ChartsCompositeViewTemplate, Utils, RowItemView) {

    function makeString(object) {
        if (object === null) {
            return '';
        }
        return '' + object;
    }

    function capitalize(str, lowercaseRest) {
        str = makeString(str);
        var remainingChars = !lowercaseRest ? str.slice(1) : str.slice(1).toLowerCase();

        return str.charAt(0).toUpperCase() + remainingChars;
    }

    function titleize(str) {
        return makeString(str).toLowerCase().replace(/(?:^|\s|-)\S/g, function(c) {
            return c.toUpperCase();
        });
    }

    var ChartsCompositeView = Backbone.Marionette.CompositeView.extend({
        template: ChartsCompositeViewTemplate,
        childViewContainer: '.collectionContainer',
        childView: RowItemView,
        initialize: function(options) {
            this.instanceId = options.instanceId;
            this.allReadyAdded = options.options.allReadyAdded;
            this.childViewOptions = {
                activeCharts: options.activeCharts,
                timeLineCharts: options.timeLineCharts
            };

        },
        onShow: function() {
            var self = this;

            this.$noGraph = self.$('.noGraph');

            var interval = setInterval(function() {
                if (self.$el.parents('.panel.panel-primary').find('#pickList').find('#typeahead').length > 0) {
                    clearInterval(interval);
                    var theTypeahead = self.$el.parents('.panel.panel-primary').find('#pickList').find('#typeahead');
                    var substringMatcher = function(strs, type) {
                        return function findMatches(q, cb) {
                            var matches, substrRegex;

                            // an array that will be populated with substring matches
                            matches = [];

                            // regex used to determine if a string contains the substring `q`
                            substrRegex = new RegExp(q, 'i');

                            // iterate through the pool of strings and for any string that
                            // contains the substring `q`, add it to the `matches` array
                            $.each(strs, function(i, str) {
                                if (substrRegex.test(str)) {
                                    // the typeahead jQuery plugin expects suggestions to a
                                    // JavaScript object, refer to typeahead docs for more info
                                    var match = {
                                        value: str,
                                        type: type
                                            // displayKey: capitalize(str)
                                    };
                                    var displayValue = str;
                                    if (str === 'LDL CHOLESTEROL') {
                                        displayValue = 'LDL ' + titleize('CHOLESTEROL');
                                    } else if (str !== 'BMI' && str !== 'HDL') {
                                        displayValue = titleize(str);
                                    }
                                    match.displayValue = displayValue;
                                    if (_.indexOf(self.allReadyAdded, str) === -1) {
                                        match.allReadyAdded = false;
                                    } else {
                                        match.allReadyAdded = true;
                                    }

                                    matches.push(match);

                                }
                            });

                            cb(matches);
                        };
                    };

                    var vitalDeferred = $.Deferred();
                    var labDeferred = $.Deferred();
                    var medDeferred = $.Deferred();

                    var vitalFetchOptions = {
                        resourceTitle: 'operational-data-type-vital',
                        onSuccess: function(collection) {
                            vitalDeferred.resolve({
                                coll: collection
                            });
                        }
                    };

                    ADK.ResourceService.fetchCollection(vitalFetchOptions);

                    var labFetchOptions = {
                        resourceTitle: 'operational-data-type-laboratory',
                        onSuccess: function(collection) {
                            labDeferred.resolve({
                                coll: collection
                            });
                        }
                    };

                    ADK.ResourceService.fetchCollection(labFetchOptions);

                    var medFetchOptions = {
                        resourceTitle: 'operational-data-type-medication',
                        onSuccess: function(collection) {
                            medDeferred.resolve({
                                coll: collection
                            });
                        }
                    };

                    // ADK.ResourceService.fetchCollection(medFetchOptions);

                    var sortFunc = function(a, b) {
                        if (a < b) {
                            return -1;
                        }

                        if (a > b) {
                            return 1;
                        }

                        // a must be equal to b
                        return 0;
                    };

                    $.when(vitalDeferred, labDeferred/*, medDeferred*/).done(
                        function(vitalPickListCollection, labPickListCollection, medPickListCollection) {
                            var vitalPickList = vitalPickListCollection.coll.pluck('name');
                            vitalPickList.push('BMI');
                            vitalPickList.sort(sortFunc);

                            var labPickList = labPickListCollection.coll.pluck('name');
                            labPickList.sort(sortFunc);

                            // var medPickList = medPickListCollection.coll.pluck('name');
                            // medPickList.sort(sortFunc);

                            var pickListItemTemplate = '<div style="margin: 0px -15px; width: 271px; display: flex;"><p class="text-capitalize"><div style="width: 228px"><%= displayValue %> <i class="text-muted"><%= type %></i></div><div style="width: 42px"><span class="text-muted small"><% if(!allReadyAdded){ %><i class="fa fa-plus"></i> Add</span></div><% } else{ %><i class="fa fa-minus"></i> Delete</span></div><% } %></p></div>';
                            theTypeahead.typeahead({
                                    hint: false,
                                    highlight: true,
                                    minLength: 3
                                }, {
                                    name: 'vitals',
                                    displayKey: 'displayValue',
                                    source: substringMatcher(vitalPickList, 'Vitals'),
                                    templates: {
                                        suggestion: _.template(pickListItemTemplate)
                                    }
                                }, {
                                    name: 'labs',
                                    displayKey: 'displayValue',
                                    source: substringMatcher(labPickList, 'Lab Tests'),
                                    templates: {
                                        suggestion: _.template(pickListItemTemplate)
                                    }
                                }/*, {
                                    name: 'meds',
                                    displayKey: 'displayValue',
                                    source: substringMatcher(medPickList, 'Medications'),
                                    templates: {
                                        suggestion: _.template(pickListItemTemplate)
                                    }
                                }*/)
                                .on('typeahead:opened', function() {
                                    var ttDrop = theTypeahead.parents('.twitter-typeahead').find('.tt-dropdown-menu');
                                    if (ttDrop.find('.youTyped').length === 0) {
                                        ttDrop.prepend($('<p/>', {
                                            'class': 'youTyped text-muted',
                                            'text': 'Hello'
                                        }));
                                    }
                                })
                                .on('typeahead:selected', function(e, suggestion, dataset) {

                                    if (suggestion.allReadyAdded) {

                                        var model = self.collection.find(function(model) {
                                            return model.get('typeName') === suggestion.value;
                                        });


                                        ADK.Messaging.getChannel('stackedGraph').trigger('delete', {
                                            model: model
                                        });

                                    } else {

                                        var params = {
                                            typeName: suggestion.value,
                                            instanceId: self.instanceId,
                                            graphType: suggestion.type
                                        };

                                        var pickListPersistanceFetchOptions = {
                                            resourceTitle: 'user-defined-stack',
                                            fetchType: 'POST',
                                            criteria: {
                                                id: ADK.ADKApp.currentScreen.config.id,
                                                instanceId: self.instanceId,
                                                graphType: suggestion.type,
                                                typeName: suggestion.value
                                            }
                                        };

                                        ADK.ResourceService.fetchCollection(pickListPersistanceFetchOptions);

                                        $(this).typeahead('val', '');
                                        var channel;
                                        if (suggestion.type === 'Vitals') {
                                            channel = ADK.Messaging.getChannel('vitals');
                                            deferredResponse = channel.request('chartInfo', params);
                                        } else if (suggestion.type === 'Lab Tests') {
                                            channel = ADK.Messaging.getChannel('lab_results_grid');
                                            deferredResponse = channel.request('chartInfo', params);

                                        }
                                        //end of else
                                    }



                                })
                                .click(function(e) {
                                    e.stopPropagation();
                                })
                                .on('keyup keydown', function(e) {
                                    if (e.keyCode === 32) {
                                        e.stopPropagation();
                                    }
                                })
                                .on('keyup', function(e) {
                                    var val = $(this).val();
                                    theTypeahead.parents('.twitter-typeahead').find('.tt-dropdown-menu .youTyped').text('Search for ' + val);
                                });

                        });
                    theTypeahead.parents('.dropdown').on('hidden.bs.dropdown', function() {
                        theTypeahead.typeahead('val', '');
                    });

                }

            }, 500);

        }
    });

    return ChartsCompositeView;

});