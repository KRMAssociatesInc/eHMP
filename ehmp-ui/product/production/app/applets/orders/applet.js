//----------------------------------------
// Name:        Orders Applet
// Version:     1.0
// Date:        2014-10-20
// Team:        Andromeda
// Description: Display orders grid on cover sheet, single page, and modal window.
// Modified:    2014-11-01
//              1. Change filter buttons to drop-down menu
//              2. Remove nurse, chart, clerk columns
//              3. Add order date as first column
//              4. Default sort by order type, order date descending
//              5. Use global date view for date filtering
//              6. Use sessionStorage to persist the search text
//              2014-11-15
//              1. Use sessionStorage to persist active menu selection
//----------------------------------------
define([
    'main/ADK',
    'underscore',
    'backbone',
    'marionette',
    'moment',
    'app/applets/orders/modalView/modalContentView',
    'app/applets/orders/modalView/modalHeaderView',
    'hbs!app/applets/orders/list/orderDateTemplate',
    'hbs!app/applets/orders/list/orderStatusTemplate',
    'hbs!app/applets/orders/list/siteTemplate',
    'hbs!app/applets/orders/list/startDateTemplate',
    'hbs!app/applets/orders/list/stopDateTemplate',
    'hbs!app/applets/orders/list/orderSummaryTemplate',
    'app/applets/orders/toolBar/toolBarView',
    'hbs!app/applets/orders/toolBar/ordersFilterTemplate',
    'app/applets/orders/detailCommunicator',
    'app/applets/orders/util',
    'app/applets/orders/writeback/addOrders',
    'app/applets/visit_new/writeback/addselectVisit'
], function(ADK, _, Backbone, Marionette, moment, ModalView, ModalHeaderView, orderDateTemplate, orderStatusTemplate, siteTemplate, startDateTemplate, stopDateTemplate, orderSummaryTemplate, ToolBarView, ordersFilterTemplate, DetailCommunicator, Util, addOrders, addselectVisit) {
    'use strict';

    var summaryColumns, shortSummaryColumn, fullScreenColumns, fetchOptions, _super, GridApplet, AppletLayoutView, applet, statusColumn, nameColumn,
        enteredColumn, orderType, facilityCodeColumn, providerNameColumn, summaryColumn, orderTypeColumn,
        startColumn, stopColumn, nurseColumn, clerkColumn, chartColumn;

    //define grid columns for cover sheet and single page
    statusColumn = {
        name: 'statusName',
        label: 'Status',
        cell: 'handlebars',
        template: orderStatusTemplate,
        hoverTip: 'orders_status'
    };

    nameColumn = {
        name: 'name',
        label: 'Order',
        cell: 'string',
        hoverTip: 'orders_order'
    };

    shortSummaryColumn = {
        name: 'summary',
        label: 'Order',
        cell: 'handlebars',
        template: orderSummaryTemplate,
        hoverTip: 'orders_order'
    };

    summaryColumn = {
        name: 'summary',
        label: 'Order',
        cell: 'string',
        hoverTip: 'orders_order'
    };

    enteredColumn = {
        name: 'entered',
        label: 'Order Date',
        cell: 'handlebars',
        template: orderDateTemplate,
        hoverTip: 'orders_orderdate'
    };

    startColumn = {
        name: 'start',
        label: 'Start Date',
        cell: 'handlebars',
        template: startDateTemplate,
        hoverTip: 'orders_startdate'
    };

    stopColumn = {
        name: 'stop',
        label: 'Stop Date',
        cell: 'handlebars',
        template: stopDateTemplate,
        hoverTip: 'orders_stopdate'
    };

    orderType = {
        name: 'kind',
        label: 'Type',
        cell: 'string',
        hoverTip: 'orders_type'
    };

    nurseColumn = {
        name: 'nurse',
        label: 'Nurse',
        cell: 'string'
    };

    clerkColumn = {
        name: 'clerk',
        label: 'Clerk',
        cell: 'string'
    };

    chartColumn = {
        name: 'chart',
        label: 'Chart',
        cell: 'string'
    };

    facilityCodeColumn = {
        name: 'facilityMoniker',
        label: 'Facility',
        cell: 'handlebars',
        template: siteTemplate,
        hoverTip: 'orders_facility'
    };

    providerNameColumn = {
        name: 'providerDisplayName',
        label: 'Provider Name',
        cell: 'string',
        hoverTip: 'orders_providername'
    };

    //Data Grid Columns - summary for coversheet, fullscreen for single page
    summaryColumns = [enteredColumn, statusColumn, shortSummaryColumn, facilityCodeColumn];
    fullScreenColumns = [enteredColumn, statusColumn, summaryColumn, orderType, providerNameColumn, startColumn, stopColumn, facilityCodeColumn];

    //Collection fetchOptions
    fetchOptions = {
        resourceTitle: 'patient-record-order',
        cache: false,
        pageable: true
    };

    GridApplet = ADK.AppletViews.GridView;

    var MenuItem = Backbone.Model.extend({
        defaults: {
            'service': 'ALL',
            'kind': 'All',
            'show': true
        }
    });

    var MenuItems = Backbone.Collection.extend({
        model: MenuItem
    });

    //These are the drop-down menu selections
    //items with show=false will be filtered out of the collection and the menu will not show them
    var menuItems = new MenuItems([{
        "service": "ALL",
        "kind": "All",
        "show": true
    }, {
        "service": "GMRA",
        "kind": "Allergy/Adverse Reaction",
        "show": false //allergy orders will be excluded from the collection
    }, {
        "service": "GMRC",
        "kind": "Consult",
        "show": true
    }, {
        "service": "FH",
        "kind": "Dietetics Order",
        "show": true
    }, {
        "service": "LR",
        "kind": "Laboratory",
        "show": true
    }, {
        "service": "PSIV",
        "kind": "Medication, Infusion", // "IV Fluids",
        "show": true
    }, {
        "service": "PSJ",
        "kind": "Medication, Inpatient",
        "show": true
    }, {
        "service": "PSH",
        "kind": "Medication, Non-VA",
        "show": true
    }, {
        "service": "PSO",
        "kind": "Medication, Outpatient",
        "show": true
    }, {
        "service": "OR",
        "kind": "Nursing Order",
        "show": true
    }, {
        "service": "RA",
        "kind": "Radiology",
        "show": true
    }, {
        "service": "GMRV",
        "kind": "Vitals",
        "show": false //vitals orders will be excluded from the collection
    }]);

    var collection;
    var dateFilter;
    var fetchFilter;
    var exclude;
    var service;
    var gridView;
    var ordersChannel = ADK.Messaging.getChannel('orders');
    //the following model is shared between the applet and the toolbar view
    var SharedModel = Backbone.Model.extend({
        defaults: {
            service: 'ALL'
        }
    });


    AppletLayoutView = GridApplet.extend({
        className: 'app-size-2',
        initialize: function(options) {
            var toolBarView, onClickRow, sharedModel, onClickAdd, enableOrDisableBtn;
            var dataGridOptions = {};

            service = ADK.SessionStorage.getAppletStorageModel('orders', 'activeMenuItem', false) || 'ALL';
            if (this.sharedModel === undefined) {
                this.sharedModel = new SharedModel({
                    service: service
                });
            }
            this.listenTo(this.sharedModel, 'change:service', this.sharedModelChanged);

            _super = GridApplet.prototype;

            var self = this;

            //filter out items that are set not to show in the menu [show: false]
            //this is used in the fetchOptions.criteria and the date filter
            if (ADK.SessionStorage.getAppletStorageModel('orders', 'excludeMenuItems', false) === undefined) {
                exclude = [];
                for (var i = 0; i < menuItems.models.length; i++) {
                    if (!menuItems.models[i].get('show')) {
                        exclude.push(menuItems.models[i].get('service'));
                    }
                }
                ADK.SessionStorage.setAppletStorageModel('orders', 'excludeMenuItems', exclude, false);
            } else {
                exclude = ADK.SessionStorage.getAppletStorageModel('orders', 'excludeMenuItems', false);
            }

            dateFilter = 'nin("service",[' + exclude.toString() + '])';
            fetchFilter = 'and(' + this.buildJdsDateFilter("entered") + ',nin("service",[' + exclude.toString() + ']))';

            var isOverrideGlobalDate = false;
            this.listenTo(ADK.Messaging, 'globalDate:selected', function(dateModel) {
                self.dateRangeRefresh('entered', {
                    customFilter: dateFilter
                });
            });

            fetchOptions.criteria = {

                filter: fetchFilter

            };

            fetchOptions.collectionConfig = {
                //sort the collection by order type ascending, and entered date descending
                comparator: function(item) {
                    var entered = moment().diff(moment(item.get('entered'), 'YYYYMMDDHHmmssSSS'));
                    return [item.get('kind'), entered];
                },
                //parse the collection and filter out the excluded types
                collectionParse: self.filterCollection
            };

            fetchOptions.onSuccess = function(collection) {
                if (service !== 'ALL') {
                    ADK.utils.filterCollectionByValue(collection, 'service', service);
                }
            };
            collection = ADK.PatientRecordService.fetchCollection(fetchOptions);

            toolBarView = new ToolBarView({
                collection: collection,
                menuItems: menuItems,
                sharedModel: this.sharedModel
            });

            gridView = this;
            onClickAdd = function(e){
                 // var addOrdersChannel = ADK.Messaging.getChannel('addALabOrdersRequestChannel');
                 // //addOrdersChannel.trigger('addLabOrdersModal', event, gridView);
                 // addOrdersChannel.command('openOrdersSearch');
                 //** New Writeback code added from ADK documentation **//
                       e.preventDefault();
                    var writebackView = ADK.utils.appletUtils.getAppletView('orders', 'writeback');
                    var formModel = new Backbone.Model();
                    var vm_formModel = new Backbone.Model({
                        encounterProvider: 'Not Specified',
                        encounterLocation: 'Not Specified',
                        visit: {}
                    });
                    var workflowOptions = {
                        size: "large",
                        title: "Order a Lab Test",
                        showProgress: false,
                        keyboard: true,
                        steps: []
                    };

                    //check if visit context is already set
                    var visit = ADK.PatientRecordService.getCurrentPatient().get('visit');
                    //console.log(visit);
                    if (!visit) {
                        workflowOptions.steps.push({
                            view: addselectVisit,
                            viewModel: vm_formModel
                        });
                    }
                    workflowOptions.steps.push({
                        view: addOrders,
                        viewModel: formModel
                    });
                    var workflowView = new ADK.UI.Workflow(workflowOptions);
                    workflowView.show();
                },

            enableOrDisableBtn = function(statusName){
                var status = _.contains(['UNRELEASED', 'UNSIGNED'], statusName) ? '' : 'disabled';
                return status;
            };

            //Row click event handler - display the Modal window
            onClickRow = function(model, event) {
                var ModalModel = Backbone.Model.extend({});

                model.attributes.enableOrDisableClass = enableOrDisableBtn(model.attributes.statusName);

                var modalModel = new ModalModel(model.attributes);

                var modelIndex = this.collection.indexOf(model);
                var view = new ModalView({
                    model: modalModel,
                    collection: dataGridOptions.collection,
                    modelIndex: modelIndex,
                    pageable: !options.appletConfig.fullScreen
                });

                var modalOptions = {
                    'size': 'normal',
                    'title': model.get('summary')
                };

                modalOptions.headerView = ModalHeaderView.extend({
                    model: modalModel,
                    theView: view,
                    collection: dataGridOptions.collection,
                    modelIndex: modelIndex,
                    pageable: !options.appletConfig.fullScreen
                });

                var modal = new ADK.UI.Modal({
                    view: view,
                    options: modalOptions
                });
                modal.show();

                this.model = model;
            },

            dataGridOptions = {
                summaryColumns: summaryColumns,
                fullScreenColumns: fullScreenColumns,
                enableModal: true,
                toolbarView: toolBarView,
                collection: collection,
                onClickRow: onClickRow,
                onClickAdd: onClickAdd,
                filterFields: ['statusName', 'summary', 'entered', 'kind', 'start', 'stop', 'providerDisplayName', 'facilityMoniker'],
                filterDateRangeEnabled: true,
                filterDateRangeField: {
                    name: "entered",
                    label: "Date",
                    format: "YYYYMMDD"
                },

                formattedFilterFields: {
                    'entered': function(model, key) {
                        var val = model.get(key);
                        val = val.replace(/(\d{4})(\d{2})(\d{2})/, '$2/$3/$1');
                        return val;
                    }
                }
            };
            if (this.columnsViewType === "summary") {
                dataGridOptions.columns = summaryColumns;
            } else if (this.columnsViewType === "expanded") {
                dataGridOptions.columns = fullScreenColumns;
            }

            this.appletOptions = dataGridOptions;

            _super.initialize.apply(this, arguments);

        },

        //this function filters out excluded types and calls the model parse utility
        filterCollection: function(collection) {
            return collection.filter(function(model) {
                if (exclude.indexOf(model.get("service")) === -1) {
                    model.set(Util.parseOrderResponse(model.attributes, service));
                    return true;
                } else {
                    return false;
                }
            });

        },

        onRender: function() {
            _super.onRender.apply(this, arguments);
        },

        //this function handles the change event in the sharedModel
        sharedModelChanged: function(model) {
            var self = this;
            service = model.get('service');
            dateFilter = 'nin("service",[' + exclude.toString() + '])';
            var isOverrideGlobalDate = false;
            this.listenTo(ADK.Messaging, 'globalDate:selected', function(dateModel) {
                self.dateRangeRefresh('entered', {
                    customFilter: dateFilter
                });
            });

            if (service !== 'ALL') {
                ADK.utils.filterCollectionByValue(collection, 'service', service);
            } else {
                ADK.utils.resetCollection(collection);
            }
            this.refresh();
        },
    });

    applet = {
        id: 'orders',
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
        }, {
            //new writeback code added from ADK documentation
            type: 'writeback',
            view: addOrders,
            chromeEnabled: false
        }
        ],
        defaultViewType: 'summary'
    };

    // expose detail view through messaging
    var channel = ADK.Messaging.getChannel(applet.id);
    channel.reply('detailView', function(params) {

        var fetchOptions = {
            criteria: {
                "uid": params.uid
            },
            patient: new Backbone.Model({
                icn: params.patient.icn,
                pid: params.patient.pid
            }),
            resourceTitle: 'uid',
            viewModel: {
                parse: AppletHelper.parseLabResponse
            }
        };

        var response = $.Deferred();

        var data = ADK.PatientRecordService.fetchCollection(fetchOptions);
        data.on('sync', function() {
            var detailModel = data.first();

            var onSuccess = function(detailView) {
                response.resolve({
                    view: detailView,
                    title: AppletHelper.getModalTitle(detailModel)
                });
            };
            var onFail = function(errorMsg) {
                response.reject(errorMsg);
            };

            AppletUiHelper.getDetailView(detailModel, null, data, false, onSuccess, onFail);
        }, this);

        return response.promise();
    });

    DetailCommunicator.initialize(applet.id, fetchOptions.resourceTitle);

    return applet;
});
