define([
    "jquery",
    "underscore",
    "main/ADK",
    "backbone",
    "main/Utils",
    'main/components/applets/baseDisplayApplet/baseDisplayAppletItem',
    'main/components/applets/baseDisplayApplet/baseGistView',
    "hbs!main/components/views/appletViews/eventsGistView/templates/eventsGistLayout",
    "hbs!main/components/views/appletViews/eventsGistView/templates/eventsGistChild",
    "api/ResourceService",
    "api/Messaging",
    'api/UserDefinedScreens',
    "main/components/appletToolbar/appletToolbarView",
    "main/components/views/appletViews/TileSortManager",
    "highcharts",
    "main/components/views/appletViews/eventsGistView/views/eventsBarGraphConfiguration"
], function($, _, ADK, Backbone, Utils, BaseAppletItem, BaseGistView, eventsGistLayoutTemplate, eventsGistChildTemplate, ResourceService, Messaging, UserDefinedScreens, ToolbarView, TileSortManager, highcharts, EventGistGraph) {
    'use strict';

    var EventGistItem = BaseAppletItem.extend({
        template: eventsGistChildTemplate,
        onDomRefresh: function() {
            //highcharts can't be rendered without the dom being completely loaded.
            //render highcharts
            var config = this.options.binningOptions;
            var chartConfig = new EventGistGraph(this.model.get('graphData'));
            this.chartPointer = this.$('#graph_' + this.model.get('id'));
            if (config) {
                config.chartWidth = (this.chartPointer).width();
                config.chartWidth = config.chartWidth === 0 ? 100 : config.chartWidth;
                chartConfig.series[0].data = Utils.chartDataBinning(this.model.get('graphData'), config);
            }
            this.chartPointer.highcharts(chartConfig);

            // needed to disable ie11 508 tab focus on svg in gistItem
            this.$('svg').attr('focusable', 'false');
        },
        onBeforeDestroy: function() {
            if (this.chartPointer && this.chartPointer.length > 0) {
                var chart = this.chartPointer.highcharts();
                if (chart) {
                    chart.destroy();
                }
            }
        },
        initialize: function() {
            var buttonTypes = [];
            var tlbrOpts = {
                targetElement: this,
            };
            var toolbarView;

            if (this._enableTileSorting) {
                buttonTypes.push('tilesortbutton');
            }

            if (this.options.showInfoButton) {
                buttonTypes.push('infobutton'); //'infobutton'
            }

            buttonTypes.push('detailsviewbutton');
            buttonTypes.push('quicklookbutton');

            if (this.options.showLinksButton) {
                buttonTypes.push('submenubutton');
                tlbrOpts.submenuItems = [];
                tlbrOpts.submenuTitle = 'Select Associated Workspace';
                if (!_.isUndefined(this.model.get('snomedCode'))) {
                    UserDefinedScreens.getScreenBySnomedCt(this.model.get('snomedCode')).done(function(filteredScreenList) {
                        if (filteredScreenList.length > 0) {
                            _.each(filteredScreenList, function(filteredScreen) {
                                var scrnObj = {
                                    displayText: filteredScreen.title,
                                    url: ('#' + filteredScreen.routeName)
                                };
                                tlbrOpts.submenuItems.push(scrnObj);
                            });
                        }
                    });
                }
            }

            tlbrOpts.buttonTypes = buttonTypes;
            this.toolbarOptions = tlbrOpts;
        }
    });

    var EventGist = BaseGistView.extend({
        template: eventsGistLayoutTemplate,
        childView: EventGistItem.extend({}),
        initialize: function(options) {
            this.childViewOptions = {
                AppletID: this.AppletID,
                binningOptions: options.binningOptions,
                appletOptions: options,
                showInfoButton: options.showInfoButton === false ? false : true,
                showLinksButton: options.showLinksButton || false
            };
            this.collectionParser = options.collectionParser || function(collection) {
                return collection;
            };
            this.collection = options.collection;
            this.gistModel = options.gistModel;
            //this is the model for the outer part of the composite view
            this.model = new Backbone.Model();
            this.model.set('gistHeaders', options.gistHeaders || {
                name: '',
                description: '',
                grapic: 'Dose',
                age: 'Age',
                count: 'Count'
            });

            this.gistModel = options.gistModel;
            this.model.set('appletID', this.AppletID);
            this.childViewContainer = "#" + this.AppletID + "-event" + "-gist-items";
        },
    });

    var EventGistView = {
        create: function(options) {
            var eventGistView = new EventGist(options);
            return eventGistView;
        },
        getView: function() {
            return EventGist;
        }
    };

    return EventGistView;
});