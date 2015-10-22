define([
    'backbone',
    'app/applets/appointments/util',
    'app/applets/appointments/modal/modalView',
    'app/applets/appointments/modal/modalHeaderView',
    'app/applets/appointments/toolBar/toolBarView',
    'hbs!app/applets/appointments/list/dateTimeCellTemplate'
], function(Backbone, Util, ModalView, modalHeader, ToolBarView, dateTimeTemplate) {
    'use strict';
    //Data Grid Columns
    var displayNameCol;
    var dateTimeCol = {
        name: 'dateTimeFormatted',
        label: 'Date',
        cell: 'string',
        sortValue: function(model, sortKey) {
            return model.get("dateTime");
        },
        hoverTip: 'visits_date'
    };
    var categoryCol = {
        name: 'formattedDescription',
        label: 'Description',
        cell: 'string',
        hoverTip: 'visits_description'
    };
    var locationCol = {
        name: 'locationName',
        label: 'Location',
        cell: 'string',
        hoverTip: 'visits_location'
    };
    var providerCol = {
        name: 'providerDisplayName',
        label: 'Provider',
        cell: 'string',
        hoverTip: 'visits_provider'
    };
    var facilityCol = {
        name: 'facilityMoniker',
        label: 'Facility',
        cell: 'string',
        hoverTip: 'visits_facility'
    };

    var typeCol = {
        name: 'formattedTypeName',
        label: 'Type',
        cell: 'string',
        hoverTip: 'visits_type'
    };

    var reasonCol = {
        name: 'reasonName',
        label: 'Reason',
        cell: 'string',
        hoverTip: 'visits_reason'
    };

    var summaryColumns = [dateTimeCol, categoryCol, locationCol, facilityCol];

    var fullScreenColumns = [dateTimeCol, categoryCol, locationCol, typeCol, providerCol, reasonCol, facilityCol];

    //Collection fetchOptions
    var fetchOptions = {
        pageable: true,
        resourceTitle: 'patient-record-appointment',
        // resourceTitle: 'visits-appointments',
        cache: true,
        criteria: {
            filter: 'ne(categoryName,"Admission")'
        },
        viewModel: {
            parse: function(response) {
                response = Util.getDateTimeFormatted(response);
                response = Util.getFacilityColor(response);
                response = Util.getProviderDisplayName(response);
                response = Util.getFormattedDisplayTypeName(response);
                response = Util.getFormattedDecription(response);
                if (response.reason && !response.reasonName) {
                    response.reasonName = response.reason;
                }
                return response;

            }
        }
    };

    var SiteMenuItem = Backbone.Model.extend({
        defaults: {
            "site": "ALL",
            "siteLabel": "All VA + DOD",
            "show": true,
            "active": true
        }
    });

    var SiteMenuItems = Backbone.Collection.extend({
        model: SiteMenuItem
    });

    var siteMenuItems = new SiteMenuItems([{
        "site": "LOCAL",
        "siteLabel": "Local VA",
        "show": true,
        "active": true
    }, {
        "site": "ALLVA",
        "siteLabel": "All VA",
        "show": true,
        "active": false
    }, {
        "site": "ALL",
        "siteLabel": "All VA + DOD",
        "show": true,
        "active": false
    }]);

    var deferred = new $.Deferred();
    var siteHash;

    var _super;
    var GridApplet = ADK.Applets.BaseGridApplet;

    var AppletLayoutView = GridApplet.extend({
        siteHash: null,
        initialize: function(options) {

            var self = this;
            var deferred = new $.Deferred();
            self.siteHash = ADK.UserService.getUserSession().get('site');
            deferred.resolve(self.siteHash);

            _super = GridApplet.prototype;
            var dataGridOptions = {};

            var toolBarView = new ToolBarView({
                collection: dataGridOptions.collection,
                filterValue: uidFilter,
                siteMenuItems: siteMenuItems,
            });

            if (this.columnsViewType === "expanded") {
                dataGridOptions.columns = fullScreenColumns;
                this.isFullscreen = true;
                dataGridOptions.toolbarView = toolBarView;
            } else if (this.columnsViewType === "summary") {
                dataGridOptions.columns = summaryColumns;
                this.isFullscreen = false;
            } else {
                dataGridOptions.summaryColumns = summaryColumns;
                dataGridOptions.fullScreenColumns = fullScreenColumns;
                this.isFullscreen = false;
            }
            dataGridOptions.enableModal = true;
            dataGridOptions.filterEnabled = true;

            dataGridOptions.filterDateRangeEnabled = true;
            dataGridOptions.filterDateRangeField = {
                name: "dateTime",
                label: "Date",
                format: "YYYYMMDD"
            };

            dataGridOptions.collection = ADK.PatientRecordService.createEmptyCollection(fetchOptions);

            this.listenTo(ADK.Messaging, 'globalDate:selected', function(dateModel) {
                self.dataGridOptions.collection.fetchOptions.criteria.filter = 'and(ne(categoryName,"Admission"),' + self.buildJdsDateFilter("dateTime") + ')';
                self.dataGridOptions.collection.fetchOptions.onSuccess = function(collection) {
                    if (self.isFullscreen) {
                        toolBarView.filterResultsDefault(collection);
                    }
                };
                var collection = self.dataGridOptions.collection;
                self.loading();
                self.dataGridView = ADK.Views.DataGrid.create(self.dataGridOptions);
                if (collection instanceof Backbone.PageableCollection) {
                    collection.fullCollection.reset();
                } else {
                    collection.reset();
                }
                ADK.PatientRecordService.fetchCollection(collection.fetchOptions, collection);
            });



            fetchOptions.criteria = {
                filter: this.buildJdsDateFilter('dateTime')
            };

            //Row click event handler
            dataGridOptions.onClickRow = function(model, event) {
                self.onClickRowHandler(model, event, dataGridOptions.collection);
            };
            self.dataGridOptions = dataGridOptions;
            _super.initialize.call(self, options);

            var uidFilter;
            deferred.done(function(siteHash) {
                uidFilter = ":" + siteHash + ":";

                fetchOptions.criteria = {
                    filter: 'and(ne(categoryName,"Admission"),' + self.buildJdsDateFilter("dateTime") + ')',
                    customFilter: 'and(ne(categoryName,"Admission"))'
                };

                fetchOptions.onSuccess = function(collection) {
                    if (self.isFullscreen) {
                        var siteItem = siteMenuItems.findWhere({
                            'active': true
                        });
                        var siteFilter = (siteItem.get('site'));
                        toolBarView.filterResults(siteFilter, collection, uidFilter);
                    }
                };

                ADK.PatientRecordService.fetchCollection(fetchOptions, self.dataGridOptions.collection);
                toolBarView.collection = dataGridOptions.collection;
                toolBarView.filterValue = uidFilter;

            });

        },
        onRender: function() {
            _super.onRender.apply(this, arguments);
        },
        onClickRowHandler: function(model, event, collection) {
            //event.preventDefault();
            var view = new ModalView({
                model: model,
                collection: collection
            });

            var modalOptions = {
                'title': Util.getModalTitle(model),
                'size': 'normal',
                'headerView': modalHeader.extend({
                    model: model,
                    theView: view
                })
            };

            var modal = new ADK.UI.Modal({
                view: view,
                options: modalOptions
            });
            modal.show();
        }
    });

    var applet = {
        id: 'appointments',
        viewTypes: [{
            type: 'summary',
            view: AppletLayoutView.extend({
                columnsViewType: "summary"
            }),
            chromeEnabled: true
        }, {
            type: 'expanded',
            view: AppletLayoutView.extend({
                columnsViewType: "expanded"
            }),
            chromeEnabled: true
        }],
        defaultViewType: 'summary'

    };

    return applet;
});
