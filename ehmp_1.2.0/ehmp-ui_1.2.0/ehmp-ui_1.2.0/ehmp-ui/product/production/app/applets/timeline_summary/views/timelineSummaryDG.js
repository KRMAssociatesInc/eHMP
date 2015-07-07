define([
    "jquery",
    "jquery.inputmask",
    "moment",
    "backbone",
    "marionette",
    "underscore",
    "hbs!app/applets/timeline_summary/views/timelineSummaryDGTemplate",
    "hbs!app/applets/newsfeed/summary/formatDateTemplate",
    "app/applets/newsfeed/summary/activityCell",
    "app/applets/newsfeed/newsfeedUtils"
], function($, InputMask, moment, Backbone, Marionette, _, timelineSummaryDGTemplate, formatDateTemplate, ActivityCell, newsfeedUtils) {
    'use strict';

    var currentModel, currentCollection, gridOptions = {},
        columns, mockData2, DataGridView, DataGridCollection, chartOptions, Chart, categories, data, fetchCollection = {},
        no_graph = true;


    DataGridCollection = Backbone.Collection.extend({});

    columns = [{
        name: 'activityDateTime',
        label: 'Date & Time',
        cell: 'handlebars',
        template: formatDateTemplate,
        groupable: true,
        groupableOptions: {
            primary: true,
            innerSort: "activityDateTime",
            groupByFunction: function(collectionElement) {
                return collectionElement.model.get("activityDateTime").substr(0, 6);
            },
            //this takes the item returned by the groupByFunction
            groupByRowFormatter: function(item) {
                return moment(item, "YYYYMM").format("MMMM YYYY");
            }
        }
    }, {
        name: 'activityDateTimeByIso',
        renderable: false,
        sortable: false
    }, {
        name: 'activityDateTimeByIsoWithSlashes',
        renderable: false,
        sortable: false
    }, {
        name: 'activity',
        label: 'Activity',
        cell: ActivityCell,
        sortable: false
    }, {
        name: 'displayType',
        label: 'Type',
        cell: 'string',
        groupable: true,
        groupableOptions: {
            innerSort: "activityDateTime"
        }
    }];

    gridOptions.columns = columns;
    gridOptions.appletConfig = {
        name: 'timeline_summary',
        id: 'timeline_summary'
    };

    var TimelineSummaryDG = Backbone.Marionette.LayoutView.extend({

        template: timelineSummaryDGTemplate,
        fetchOptions: {},
        initialize: function(options) {
            this.fetchTimelineData();
            this.listenTo(ADK.Messaging, 'globalDate:customDateRangeSelected', this.fetchTimelineData());
        },
        regions: {
            dataZone: '#timeline-summary-results'
        },
        onRender: function() {

        },
        onShow: function() {

        },
        fetchTimelineData: function() {
            var self = this;

            this.fetchOptions.criteria = {
                filter: 'or(eq(kind, "Visit"),eq(kind, "Immunization"),eq(kind, "Admission"),eq(kind, "Surgery"),eq(kind, "Procedure"),eq(kind, "Consult")),' +
                         'or('+ADK.ResourceService.buildJdsDateFilter('dateTime')+','+ADK.ResourceService.buildJdsDateFilter('administeredDateTime')+')',
                order: 'dateTime DESC'
            };

            this.fetchOptions.resourceTitle = 'patient-record-newsfeed';
            this.fetchOptions.viewModel = {
                parse: function(response) {
                    response.activityDateTime = newsfeedUtils.getActivityDateTime(response);
                    response.primaryProviderDisplay = newsfeedUtils.getPrimaryProviderDisplay(response);
                    response.displayType = newsfeedUtils.getDisplayType(response);
                    //exists to assist with filtering
                    response.activityDateTimeByIso = moment(response.activityDateTime, "YYYYMMDDHHmmss").format("YYYY-MM-DD HH:mm");
                    response.activityDateTimeByIsoWithSlashes = moment(response.activityDateTime, "YYYYMMDDHHmmss").format("YYYY/MM/DD HH:mm");
                    return response;
                }
            };


            this.fetchOptions.onSuccess = function(collection, response) {

                gridOptions.collection = collection;

                // currentModel = options.model;
                // self.model = options.model;
                // currentCollection = options.collection;

                self.dataGrid = ADK.Views.DataGrid.create(gridOptions);

                if (self.dataZone !== undefined && self.dataZone !== null) {
                    self.dataZone.reset();
                    self.dataZone.show(self.dataGrid);
                }

                gridOptions.collection = self.collection;

            }; // end of onSuccess

            ADK.PatientRecordService.fetchCollection(this.fetchOptions);

        },
    });

    return TimelineSummaryDG;


});
