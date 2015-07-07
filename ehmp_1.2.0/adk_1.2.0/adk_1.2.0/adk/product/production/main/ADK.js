//ADK is moved to the global namespace in order to facilitate better seperation between ehmp-ui and adk.
var ADK = {};

define([
    'backbone',
    'marionette',
    'jquery',
    'underscore',
    'api/CCOWService',
    'api/ResourceService',
    'api/UserService',
    'main/Session',
    'main/Utils',
    'api/Messaging',
    'api/Navigation',
    'api/AutoLogoff',
    "api/SessionStorage",
    "api/ErrorMessaging",
    'api/UserDefinedScreens',
    'main/backgrid/datagrid',
    'main/backgrid/filter',
    'main/backgrid/paginator',
    "main/components/views/appletControllerView",
    "main/components/applets/grid_applet/gridAppletView",
    "main/components/modal/modalView",
    "main/components/modal/workflowModalView",
    "main/components/fullscreen_overlay/overlayContainerView",
    "main/components/views/loadingView",
    "main/components/views/errorView",
    "main/components/views/serverSideErrorView",
    "main/components/views/appletViews/eventsGistView/views/eventsGistView",
    "main/components/views/appletViews/pillsGistView/views/pillGistView",
    "main/components/views/appletViews/interventionsGistView/views/interventionsGistView",
    "main/components/views/appletViews/observationsGistView/views/observationsGistView",
    "main/components/views/appletViews/panelsGistView/views/panelsGistView",
    "main/components/applets/baseDisplayApplet/view",
    "main/components/views/appletViews/gridView/view",
    "main/components/views/appletViews/pillsGistView/view",
    "main/components/views/appletViews/interventionsGistView/view",
    "main/components/views/appletViews/eventsGistView/view",
    "main/components/views/appletViews/observationsGistView/view",
    "main/components/views/appletViews/panelsGistView/view",
    "main/components/appletToolbar/toolbarView",
    'main/components/applet_chrome/chromeView',
    "main/components/popup/popup",
    "main/components/views/appletViews/TileSortManager",
    "main/ADKApp"
    ], function(Backbone, Marionette, $, _, CCOWService, resourceService, userService, session, utils, messaging, navigation, autoLogoff, sessionStorage, errorMessaging, UserDefinedScreens, DataGrid, Filter, Paginator, AppletControllerView, GridAppletView, ModalView, WorkflowModalView, FullscreenOverlayView, LoadingView, ErrorView, ServerSideErrorView, EventsGistView, PillGistView, InterventionsGistView, ObservationsGist, PanelsGistView, baseDisplayApplet, gridView, pillsGistView, interventionsGistView, eventsGistView, ObservationsGistView, panelsGistView, ToolbarView, ChromeView, Popup, tileSortManager, ADKApp) {
    'use strict';
    ADK = {
        AutoLogoff: autoLogoff,
        ResourceService: resourceService,
        PatientRecordService: resourceService.patientRecordService,
        UserService: userService,
        Messaging: messaging,
        Navigation: navigation,
        utils: utils,
        SessionStorage: sessionStorage,
        ErrorMessaging: errorMessaging,
        TileSortManager: tileSortManager,
        ADKApp: ADKApp,
        UserDefinedScreens: UserDefinedScreens,
        CCOWService: CCOWService
    };

    ADK.Applets = {
        BaseGridApplet: GridAppletView,
        BaseDisplayApplet: baseDisplayApplet
    };

    //ADK View Components
    ADK.Views = {
        AppletControllerView: AppletControllerView,
        DataGrid: DataGrid,
        CollectionFilter: Filter,
        Paginator: Paginator,
        Loading: LoadingView,
        Error: ErrorView,
        ServerSideError: ServerSideErrorView,
        EventGist: EventsGistView,
        PillGist: PillGistView,
        InterventionsGist: InterventionsGistView,
        VitalsGist: ObservationsGist,
        LabresultsGist: ObservationsGist,
        LabpanelsGist: PanelsGistView,
        ToolbarView: ToolbarView
    };

    ADK.AppletViews = {
        GridView: gridView,
        ChromeView: ChromeView,
        PillsGistView: pillsGistView,
        InterventionsGistView: interventionsGistView,
        EventsGistView: eventsGistView,
        ObservationsGistView: ObservationsGistView,
        PanelsGistView: panelsGistView
    };
    ADK.AppletViews.GridView.ADK = ADK;

    ADK.getAppletRegionLayoutView = function() {
        return ADK.ADKApp.centerRegion.currentView.appletRegion;
    };

    // { appletId: string, resource: string, viewModel: Backbone.Model, tableTemplate: handleBarsTemplate, rowTemplate: handleBarsTemplate}
    ADK.createSimpleApplet = function(appletDefinition) {

        var applet = {
            id: appletDefinition.appletId,
            hasCSS: appletDefinition.hasCSS,
            getRootView: function() {
                return ADK.AppletLayout.single(appletDefinition);
            }
        };

        return applet;
    };


    ADK.AppletLayout = {
        single: function(appletDefinition) {
            var singleLayoutView = Backbone.Marionette.LayoutView.extend({
                initialize: function() {
                    if (appletDefinition.itemView) {
                        if (appletDefinition.compositeView) {
                            this.appletCompositeView = ADK.CustomCompositeView(appletDefinition);
                        } else {
                            this.appletCompositeView = ADK.CustomItemView(appletDefinition);
                        }
                    } else {
                        this.appletCompositeView = ADK.TableCompositeView(appletDefinition, appletDefinition.rowTemplate, appletDefinition.tableTemplate);
                    }
                },
                onRender: function() {
                    this.appletMain.show(this.appletCompositeView);
                },
                template: _.template('<div id="applet-main"></div>'),
                regions: {
                    appletMain: '#applet-main'
                }
            });



            return singleLayoutView;
        }
    };



    ADK.TableCompositeView = function(appletDefinition, rowTemplate, tableTemplate) {
        var ItemView = Backbone.Marionette.ItemView.extend({
            tagName: 'tr',
            template: rowTemplate
        });

        var CompositeView = Backbone.Marionette.CompositeView.extend({
            initialize: function() {
                var fetchOptions = {};
                fetchOptions.resourceTitle = appletDefinition.resource;
                fetchOptions.viewModel = appletDefinition.viewModel;
                var domainCollection = ADK.PatientRecordService.fetchCollection(fetchOptions);
                this.collection = domainCollection;
            },
            childView: ItemView,
            childViewContainer: 'tbody',
            template: tableTemplate,
            className: 'panel panel-info'
        });
        return new CompositeView();
    };



    ADK.CustomCompositeView = function(appletDefinition) {
        var CompositeView = appletDefinition.compositeView;
        return new CompositeView();
    };


    ADK.CustomItemView = function(appletDefinition) {
        var ItemView = appletDefinition.itemView;

        var CompositeView = Backbone.Marionette.CompositeView.extend({
            initialize: function() {
                var fetchOptions = {};
                fetchOptions.resourceTitle = appletDefinition.resource;
                fetchOptions.viewModel = appletDefinition.viewModel;
                var domainCollection = ADK.PatientRecordService.fetchCollection(fetchOptions);
                this.collection = domainCollection;
            },
            childView: ItemView,
            childViewContainer: 'tbody',
            template: appletDefinition.tableTemplate,
            className: 'panel panel-info'
        });
        return new CompositeView();


    };
    ADK.showModal = function(ModalRegionView, options) {
        var modalOptions = {
            'title': '',
            'size': '',
            'headerView': '',
            'footerView': '',
            'callShow': true
        };

        var $triggerElem = $(':focus');

        _.extend(modalOptions, options);

        var ModalLayoutView = ModalView.generateLayout(ModalRegionView, modalOptions);
        if (this.ADKApp.modalRegion.$el && this.ADKApp.modalRegion.$el.children().length === 0) {
            var ModalDivView = ModalView.generateDiv(modalOptions, ModalLayoutView);
            var modalDivView = new ModalDivView();
            this.ADKApp.modalRegion.show(modalDivView);
        } else {
            this.ADKApp.modalRegion.currentView.modalDialogRegion.show(new ModalLayoutView());
        }

        $('#mainModal').one('hidden.bs.modal', function(e) {
            ADK.ADKApp.modalRegion.empty();
            $triggerElem.focus();
        });

        if (modalOptions.callShow === true) {
            $('#mainModal').modal('show');
        }
        return this.ADKApp.modalRegion.currentView.modalDialogRegion.currentView;
    };
    ADK.hideModal = function() {
        $('#mainModal').modal('hide');
        ADK.closeWorkflow(); //in case someone calls hideModal on a workflow this will ensure no memory leaks are created
    };
    ADK.showWorkflowItem = function(ModalRegionView, modalOptions) {
        var options = {
                'title': '',
                'size': '',
                'headerView': '',
                'footerView': '',
                'replaceContents': false,
                'channel': ADK.Messaging.getChannel('workflowChannel'),
                'regionName': 'modalDialogRegions',
                //'backdrop': 'static',
                'callShow': true
            },
            regionName,
            region,
            currentView,
            replaceContents,
            ModalLayoutView;

        _.extend(options, modalOptions);
        regionName = options.regionName;
        replaceContents = options.replaceContents;

        if (this.ADKApp.modalRegion.$el && this.ADKApp.modalRegion.$el.children().length === 0) {
            //we need to append the parent layout view if one does not yet exist
            ModalLayoutView = WorkflowModalView.generateLayout(ModalRegionView, options);
            var ModalDivView = WorkflowModalView.generateDiv(options, ModalLayoutView);
            this.ADKApp.modalRegion.show(new ModalDivView());
            currentView = this.ADKApp.modalRegion.currentView;
        } else {
            currentView = this.ADKApp.modalRegion.currentView;
            region = currentView.getRegion(regionName);
            if (!region) {
                //we don't have this region available so we need to create it and add an element to DOM to render it
                currentView.$el.append(currentView.template({
                    regionName: regionName,
                    sizeClass: currentView.model.get('sizeClass'),
                    keyboard: currentView.model.get('keyboard'),
                    backdrop: currentView.model.get('backdrop')
                }));
                currentView.addRegion(regionName, '#' + regionName);
                currentView.configureEvents(regionName);
                region = currentView.getRegion(regionName);
                replaceContents = true;
            }
            if (replaceContents === true) {
                ModalLayoutView = WorkflowModalView.generateLayout(ModalRegionView, options);
                region.show(new ModalLayoutView());
            } else if (ModalRegionView instanceof Backbone.View) {
                //Possible mem leak
                //If someone were to pass in an instance rather than prototype and we aren't using we have to destroy it
                if (region.currentView.getRegion('modalRegion').currentView !== ModalRegionView) {
                    ModalRegionView.destroy();
                }
            }

            currentView.show(regionName);
        }

        $('#mainModal').on('close.bs.modal', function(e) {
            //if any of them trigger we need to close the whole workflow
            $('#mainModal').one('hidden.bs.modal', function(e) {
                ADK.ADKApp.modalRegion.empty();
            });
            currentView.getRegion(regionName).$el.modal('hide');
        });

        if (options.callShow === true && currentView.activeRegion !== regionName) {
            currentView.show(regionName);
        }

        return currentView.getRegion(regionName).currentView;
    };
    ADK.closeWorkflow = function() {
        $('#mainModal').trigger('close.bs.modal');
    };
    ADK.showFullscreenOverlay = function(OverlayView, overlayOptions) {
        if (!overlayOptions) {
            overlayOptions = {
                'callShow': false
            };
        }
        var OverlayDivView = FullscreenOverlayView.generateDiv(OverlayView, overlayOptions);
        var overlayDivView = new OverlayDivView();
        this.ADKApp.modalRegion.show(overlayDivView);

        $('#mainOverlay').one('hidden.bs.modal', function(e) {
            $('body').removeClass('overlay-open');
            ADK.ADKApp.modalRegion.empty();
        });

        if (overlayOptions.callShow === true) {
            $('#mainOverlay').modal('show');
        }
        $('body').addClass('overlay-open');
        return this.ADKApp.modalRegion.currentView.overlayViewRegion.currentView;
    };
    ADK.hideFullscreenOverlay = function() {
        $('#mainOverlay').modal('hide');

    };

    return ADK;
});
