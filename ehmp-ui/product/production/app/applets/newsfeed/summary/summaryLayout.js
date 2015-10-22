define([
    "app/applets/newsfeed/newsfeedUtils",
    "app/applets/newsfeed/visitDetail/visitDetailView",
    "hbs!app/applets/newsfeed/summary/formatDateTemplate",
    "app/applets/newsfeed/summary/activityCell",
    "app/applets/newsfeed/collectionHandler",
    "app/applets/newsfeed/eventHandlers"
], function(newsfeedUtils, VisitDetailView, formatDateTemplate, ActivityCell, CollectionHandler, EventHandlers) {

    var summaryColumns = [{
        name: 'activityDateTime',
        label: 'Date & Time',
        cell: 'handlebars',
        template: formatDateTemplate,
        groupable: true,
        groupableOptions: {
            primary: true,
            innerSort: "activityDateTime",
            groupByFunction: function(collectionElement) {
                if(collectionElement.model.get('activityDateTime')){
                    return collectionElement.model.get("activityDateTime").toString().substr(0, 6);
                }
            },
            //this takes the item returned by the groupByFunction
            groupByRowFormatter: function(item) {
                return moment(item, "YYYYMM").format("MMMM YYYY");
            }
        },
        hoverTip: 'encounters_datetime'
    }, {
        name: 'activity',
        label: 'Activity',
        cell: ActivityCell,
        sortable: false,
        hoverTip: 'encounters_activity'
    }, {
        name: 'displayType',
        label: 'Type',
        cell: 'string',
        groupable: true,
        groupableOptions: {
            innerSort: "activityDateTime"
        },
        hoverTip: 'encounters_type'
    }];

    var fullScreenColumns = summaryColumns.concat([{
        name: "primaryProviderDisplay",
        cell: "string",
        label: 'Entered By',
        groupable: true,
        groupableOptions: {
            innerSort: "activityDateTime"
        },
        hoverTip: 'encounters_enteredby'
    }, {
        name: 'facilityName',
        label: 'Facility',
        groupable: true,
        groupableOptions: {
            innerSort: "activityDateTime"
        },
        hoverTip: 'encounters_facility'
    }]);

    var DefaultDetailView = Backbone.Marionette.ItemView.extend({
        template: _.template('<div>A detail view for this domain is not yet implemented.</div>')
    });

    var detailAppletChannels = {
        // mapping of domain --> appletId
        "immunization": "immunizations",
        "surgery": "documents",
        "procedure": "documents",
        "consult": "documents",
        "lab": "labresults_timeline_detailview"
    };

    var generateDataGridOptions = function(instanceId) {
        return {
            appletConfig: {
                id: 'newsfeed',
                instanceId: instanceId
            },
            filterFields: ['activityDateTime', 'activityDateTimeByIso', 'activityDateTimeByIsoWithSlashes', 'activity', 'summary', 'typeDisplayName', 'stopCodeName', 'locationDisplayName', 'displayType', 'primaryProviderDisplay', 'facilityName'],
            summaryColumns: summaryColumns,
            fullScreenColumns: fullScreenColumns,
            enableModal: true,
            collection: undefined,
            groupable: true,
            onClickRow: function(model, event) {
                event.preventDefault();
                //ugh, why is this needed?? Is it?? The detailed modals should grab this if need be
                var currentPatient = ADK.PatientRecordService.getCurrentPatient();
                var channelObject = {
                    model: model,
                    uid: model.get("uid"),
                    patient: {
                        icn: currentPatient.attributes.icn,
                        pid: currentPatient.attributes.pid
                    }
                };
                if (newsfeedUtils.isVisit(model)) {
                    channelObject.channelName = "visitDetail";
                }

                var domain = channelObject.uid.split(":")[2],
                    channelName = detailAppletChannels[domain] || channelObject.channelName;

                if (channelName) {

                    var modal = new ADK.UI.Modal({
                        view: ADK.Views.Loading.create(),
                        options:  {
                            size: "large",
                            title: "Loading..."
                        }
                    });
                    modal.show();

                    var channel = ADK.Messaging.getChannel(channelName),
                        deferredResponse = channel.request('detailView', channelObject);

                    deferredResponse.done(function(response) {

                        var modal = new ADK.UI.Modal({
                            view: response.view,
                            options:  {
                                size: "large",
                                title: response.title
                            }
                        });
                        modal.show();

                    });
                } else {

                    var modalView = new ADK.UI.Modal({
                        view: new DefaultDetailView(),
                        options:  {
                            size: "large",
                            title: "Detail - Placeholder"
                        }
                    });
                    modalView.show();
                }
            }
        };
    };

    var SummaryLayout = ADK.AppletViews.GridView.extend({
        initialize: function(options) {
            var appletType = options.appletType || 'standard';
            this._super = ADK.AppletViews.GridView.prototype;

            var instanceId = '';
            if (appletType === 'standard') {
                instanceId = 'newsfeed';
            } else if (appletType === 'gdt') {
                instanceId = 'newsfeed-gdt';
            }

            var appletOptions = generateDataGridOptions(instanceId);

            appletOptions.collection = ADK.PatientRecordService.createEmptyCollection({
                pageable: true
            });

            //this.setupCollectionHandlerListener();
            CollectionHandler.queryCollection(this, undefined, appletOptions.collection);

            if (appletType === 'standard') {
                this.setupGlobalDateListener();
            } else if (appletType === 'gdt') {
                this.setupGDTListener();
            }


            this.appletOptions = appletOptions;
            this._super.initialize.apply(this, arguments);
        },
        setupGlobalDateListener: function() {
            var self = this;

            this.listenTo(ADK.Messaging, 'globalDate:selected', function(dateModel) {
                var options = {};
                if (dateModel !== undefined) {
                    options.isOverrideGlobalDate = true;
                    options.fromDate = dateModel.get('fromDate');
                    options.toDate = dateModel.get('toDate');
                }
                options.customFilter = 'or(' + this.buildJdsDateFilter('administeredDateTime', options) + ',' + this.buildJdsDateFilter('observed', options) + ')';
                options.operator = 'or';

                self.dateRangeRefresh('dateTime', options);

            });

        },
        setupGDTListener: function() {
            var self = this;

            this.listenTo(ADK.Messaging, 'globalDate:updateTimelineSummaryViewOnly', function(dateModel) {

                var options = {};
                if (dateModel !== undefined) {
                    options.isOverrideGlobalDate = true;
                    options.fromDate = dateModel.from;
                    options.toDate = dateModel.to;
                }
                options.customFilter = 'or(' + this.buildJdsDateFilter('administeredDateTime', options) + ',' + this.buildJdsDateFilter('observed', options) + ')';
                options.operator = 'or';
                options.instanceId = self.appletOptions.instanceId;

                self.dateRangeRefresh('dateTime', options);
            });
        },
        setupCollectionHandlerListener: function() {

        },
        onRender: function() {
            this._super.onRender.apply(this, arguments);
        },
    });

    return SummaryLayout;
});
