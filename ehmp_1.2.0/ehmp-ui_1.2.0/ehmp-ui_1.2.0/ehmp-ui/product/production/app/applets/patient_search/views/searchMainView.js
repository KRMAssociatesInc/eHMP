define([
    'backbone',
    'marionette',
    'app/applets/patient_search/views/myCPRSList/myCPRSListLayoutView',
    'app/applets/patient_search/views/mySite/all/mySiteAllSearchLayoutView',
    'app/applets/patient_search/views/mySite/clinics_wards/clinicsWardsSearchLayoutView',
    'app/applets/patient_search/views/global/globalSearchLayoutView',
    'hbs!app/applets/patient_search/templates/searchMainTemplate'
], function(Backbone, Marionette, MyCPRSListLayoutView, MySiteAllSearchLayoutView, ClinicsWardsSearchLayoutView, GlobalSearchLayoutView, searchMainTemplate) {

    var searchApplet;

    var SearchMainView = Backbone.Marionette.LayoutView.extend({
        template: searchMainTemplate,
        regions: {
            mainSearchMyCPRSList: "#main-search-my-cprs-list",
            mainSearchMySiteAllResults: "#main-search-mySiteAll-results",
            mainSearchMySiteClinics: "#main-search-mySiteClinics",
            mainSearchMySiteWards: "#main-search-mySiteWards",
            mainSearchGlobalResults: "#main-search-global-results"
        },
        initialize: function(options) {
            this.searchApplet = options.searchApplet;
            this.myCPRSListLayoutView = new MyCPRSListLayoutView({
                searchApplet: this.searchApplet
            });
            this.mySiteAllSearchLayoutView = new MySiteAllSearchLayoutView({
                searchApplet: this.searchApplet
            });
            this.mySiteClinicsSearchLayoutView = new ClinicsWardsSearchLayoutView({
                searchApplet: this.searchApplet,
                locationType: 'clinics'
            });
            this.mySiteWardsSearchLayoutView = new ClinicsWardsSearchLayoutView({
                searchApplet: this.searchApplet,
                locationType: 'wards'
            });
            this.globalSearchLayoutView = new GlobalSearchLayoutView({
                searchApplet: this.searchApplet
            });
        },
        onRender: function() {
            this.mySiteAllSearchLayoutView.searchApplet = this.searchApplet;
            this.globalSearchLayoutView.searchApplet = this.searchApplet;
            this.changeView('mySite', 'all');
        },
        changeView: function(searchType, pillsType) {
            this.hideAllResultViews();
            this.mainSearchMySiteClinics.$el.find('input').val('');
            this.mainSearchMySiteWards.$el.find('input').val('');
            if (searchType == "myCPRSList") {
                this.mainSearchMyCPRSList.$el.show();
                this.mainSearchMyCPRSList.show(this.myCPRSListLayoutView);
            }
            else if (searchType == "mySite") {
                if (pillsType == "all") {
                    this.mainSearchMySiteAllResults.$el.show();
                    this.mainSearchMySiteAllResults.show(this.mySiteAllSearchLayoutView);
                } else if (pillsType == "clinics") {
                    this.mainSearchMySiteClinics.$el.show();
                    this.mainSearchMySiteClinics.show(this.mySiteClinicsSearchLayoutView);
                } else if (pillsType == "wards") {
                    this.mainSearchMySiteWards.$el.show();
                    this.mainSearchMySiteWards.show(this.mySiteWardsSearchLayoutView);
                }
            } else if (searchType == "global") {
                this.mainSearchGlobalResults.$el.show();
                this.mainSearchGlobalResults.show(this.globalSearchLayoutView);
            } else {
                this.mainSearchResults.$el.hide();
            }
        },
        hideAllResultViews: function() {
            this.mainSearchMyCPRSList.$el.hide();
            this.mainSearchMySiteAllResults.$el.hide();
            this.mainSearchMySiteClinics.$el.hide();
            this.mainSearchMySiteWards.$el.hide();
            this.mainSearchGlobalResults.$el.hide();
            this.clearGlobalSearchErrorMessage();
        },
        clearErrorMessage: function(searchType) {
            if (searchType == "global") {
                this.globalSearchLayoutView.clearSearchResultsRegion();
            }
        },
        clearGlobalSearchErrorMessage: function() {
            // FLAG: [isGlobalSearchErrorMessageDisplayed] is defined on globalModel in inputView.js
            var refGlobalModel = this.searchApplet.inputView.globalModel;
            if (refGlobalModel.get('isGlobalSearchErrorMessageDisplayed'))
            {
                // Note reset All input fields.
                refGlobalModel.clear({
                    silent: true
                });
                this.globalSearchLayoutView.clearSearchResultsRegion();
                refGlobalModel.set('isGlobalSearchErrorMessageDisplayed', false);
            }
        },
        clearPreviousGlobalSearchResults: function(searchType) {
            if (searchType == "global") {
                this.globalSearchLayoutView.clearSearchResultsRegion();
            }
        },
        displayErrorMessage: function(searchType, message) {
            if (searchType == "global") {
                this.globalSearchLayoutView.displayErrorMessage(message);
            }
        },
        executeSearch: function(searchType, searchParameters) {
            if (searchType == "myCPRSList") {
                this.myCPRSListLayoutView.refineSearch(searchParameters.searchString);
            }
            else if (searchType == "mySite") {
                if (searchParameters.pillsType == "all") {
                    this.mySiteAllSearchLayoutView.executeSearch(searchParameters.searchString);
                } else if (searchParameters.pillsType == "clinics") {
                    this.mySiteClinicsSearchLayoutView.refineSearch(searchParameters.searchString, this.mySiteClinicsSearchLayoutView.patientSearchResults.currentView);
                } else if (searchParameters.pillsType == "wards") {
                    this.mySiteWardsSearchLayoutView.refineSearch(searchParameters.searchString, this.mySiteWardsSearchLayoutView.patientSearchResults.currentView);
                }
            } else if (searchType == "global") {
                this.globalSearchLayoutView.executeSearch(searchParameters.globalSearchParameters);
            } else {
                //
            }
        }
    });

    return SearchMainView;
});
