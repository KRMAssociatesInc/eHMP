define([
    "backbone",
    "marionette",
    "main/AppletBuilder",
    "main/components/patient/patientSearchView",
    "main/components/patient/patientHeaderView",
    "main/components/navigation/navigationView",
    "main/components/nav/navView",
    "main/components/adk_nav/navView",
    "main/components/applet-tester-nav/navView",
    "main/components/blankNav/navView",
    "main/components/footer/footerView",
    "main/components/navSearch/navView",
    "main/components/applet_header/navView",
    "main/components/patient/patientSidebarInfoView"
], function(Backbone, Marionette, AppletBuilder, PatientSearchView, PatientHeaderView, NavigationView,
    NavView, AdkNavView, TesterNavView, BlankNavView, FooterView, NavSearchView, AppletNavigationView, PatientSidebarInfoView) {

    var ComponentLoader = {};

    ComponentLoader.load = function(marionetteApp, TopRegionView, CenterRegionView, currentScreenConfig, patient) {

        //Load Top Region
        var headerRegion = TopRegionView.header_region;
        switch(currentScreenConfig.appHeader) {
            case "nav":
                loadComponent(headerRegion, NavView);
                break;
            case "adkNav":
                loadComponent(headerRegion, AdkNavView);
                break;
            case "searchNav":
                loadComponent(headerRegion, NavSearchView);
                break;
            case "appletTesterNav":
                loadComponent(headerRegion, TesterNavView);
                break;
            case "blankNav":
                loadComponent(headerRegion, BlankNavView);
                break;
            case "none":
                headerRegion.empty();
                break;
            default:
                loadComponent(headerRegion, NavView);
        }

        if (currentScreenConfig.patientRequired === true) {
            var patientDemographicRegion = TopRegionView.patientDemographic_region;
            if (patientDemographicRegion.currentView === undefined || !(patientDemographicRegion.currentView instanceof PatientHeaderView)) {
                patientDemographicRegion.show(new PatientHeaderView({
                    model: patient
                }));
            }
            var navigationRegion = TopRegionView.navigation_region;
            var showGlobalDatepicker = (typeof currentScreenConfig.globalDatepicker === "undefined" ? true : currentScreenConfig.globalDatepicker);
            if (navigationRegion.currentView === undefined || !(navigationRegion.currentView instanceof AppletNavigationView)) {
                navigationRegion.show(new AppletNavigationView({
                    model: new Backbone.Model({
                        'currentScreen': currentScreenConfig,
                        'globalDatepicker': showGlobalDatepicker
                    })
                }));
            } else {
                navigationRegion.currentView.model.set({
                    'currentScreen': currentScreenConfig,
                    'globalDatepicker': showGlobalDatepicker
                });
                navigationRegion.currentView.updateWorkspaceList();
            }
        }

        //Load Bottom Region
        var bottomRegion = marionetteApp.bottomRegion;
        var footerOptions = {'currentScreen' : currentScreenConfig};
        switch(currentScreenConfig.appFooter) {
            case "footer":
                if (bottomRegion.currentView === undefined || !(bottomRegion.currentView instanceof FooterView)) {
                    bottomRegion.show(new FooterView(footerOptions));
                    break;
                }
                bottomRegion.currentView.model.set('currentScreen',  currentScreenConfig);
                break;
            case "none":
                bottomRegion.empty();
                break;
            default:
                if (bottomRegion.currentView === undefined || !(bottomRegion.currentView instanceof FooterView)) {
                    bottomRegion.show(new FooterView(footerOptions));
                    break;
                }
                bottomRegion.currentView.model.set('currentScreen',  currentScreenConfig);
        }

        //Load Left Region
        if (currentScreenConfig.content_left && currentScreenConfig.content_left != "none" && currentScreenConfig.contentRegionLayout === 'fixed_left') {
            var leftRegion = CenterRegionView.content_sidebarLeft_region;

            if (currentScreenConfig.appLeft == "patientSearch") {
                loadComponent(region, PatientSearchView);
            } else if (currentScreenConfig.appLeft == "patientInfo") {
                if (leftRegion.currentView === undefined || !(leftRegion.currentView instanceof PatientSidebarInfoView)) {
                    leftRegion.show(new PatientSidebarInfoView({
                        model: patient
                    }));
                }
            } else {
                if (leftRegion.currentView === undefined || !(leftRegion.currentView instanceof PatientSidebarInfoView)) {
                    leftRegion.show(new PatientSidebarInfoView({
                        model: patient
                    }));
                }
            }
        }

    };

    function loadComponent(region, View) {
        if (region.currentView === undefined || !(region.currentView instanceof View)) {
            region.show(new View());
        }
    }

    return ComponentLoader;
});
