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

    // constants
    var MY_SITE = 'mySite';
    var NATIONWIDE = 'global';
    var MY_CPRS_LIST_TAB = 'myCprsList';
    var CLINICS_TAB = 'clinics';
    var WARDS_TAB = 'wards';
    var NO_TAB = 'none';
    var BLANK = '';
    var INPUT ='input';

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
                locationType: CLINICS_TAB
            });
            this.mySiteWardsSearchLayoutView = new ClinicsWardsSearchLayoutView({
                searchApplet: this.searchApplet,
                locationType: WARDS_TAB
            });
            this.globalSearchLayoutView = new GlobalSearchLayoutView({
                searchApplet: this.searchApplet
            });
        },
        onRender: function() {
            this.mySiteAllSearchLayoutView.searchApplet = this.searchApplet;
            this.globalSearchLayoutView.searchApplet = this.searchApplet;
            this.mainSearchMySiteAllResults.show(this.mySiteAllSearchLayoutView);
            this.changeView(MY_SITE, NO_TAB);
        },
        changeView: function(searchType, pillsType) {
            this.hideAllResultViews();
            this.mainSearchMySiteClinics.$el.find(INPUT).val(BLANK);
            this.mainSearchMySiteWards.$el.find(INPUT).val(BLANK);
            if (searchType == MY_SITE) {
                if (pillsType == MY_CPRS_LIST_TAB){
                    this.mainSearchMyCPRSList.$el.show();
                    this.mainSearchMyCPRSList.show(this.myCPRSListLayoutView);
                } else if (pillsType == CLINICS_TAB) {
                    this.mainSearchMySiteClinics.$el.show();
                    this.mainSearchMySiteClinics.show(this.mySiteClinicsSearchLayoutView);
                } else if (pillsType == WARDS_TAB) {
                    this.mainSearchMySiteWards.$el.show();
                    this.mainSearchMySiteWards.show(this.mySiteWardsSearchLayoutView);
                } else if (pillsType == NO_TAB) {
                    this.mainSearchMySiteAllResults.$el.show();
                    this.mainSearchMySiteAllResults.show(this.mySiteAllSearchLayoutView);
                }
                $('#patientSearchInput').focusout();
            } else if (searchType == NATIONWIDE) {
                this.mainSearchGlobalResults.$el.show();
                this.mainSearchGlobalResults.show(this.globalSearchLayoutView);
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
            if (searchType == NATIONWIDE) {
                this.globalSearchLayoutView.clearSearchResultsRegion();
            }
        },
        clearGlobalSearchErrorMessage: function() {
            // FLAG: [isGlobalSearchErrorMessageDisplayed] is defined on globalModel in inputView.js
            var refGlobalModel = this.searchApplet.patientSearchView.nationwideModel;
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
            if (searchType == NATIONWIDE) {
                this.globalSearchLayoutView.clearSearchResultsRegion();
            }
        },
        displayErrorMessage: function(searchType, message) {
            if (searchType == NATIONWIDE) {
                this.globalSearchLayoutView.displayErrorMessage(message);
            }
        },
        executeSearch: function(searchType, searchParameters) {
            if (searchType == MY_SITE) {
                this.mySiteAllSearchLayoutView.executeSearch(searchParameters.searchString);
            } else if (searchType == NATIONWIDE) {
                this.globalSearchLayoutView.executeSearch(searchParameters.globalSearchParameters);
            }
        }
    });

    return SearchMainView;
});
