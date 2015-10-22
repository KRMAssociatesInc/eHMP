define([
    'backbone',
    'marionette',
    'underscore',
    'hbs!app/applets/patient_search/templates/patientSearchTemplate',
    'app/applets/patient_search/views/tabView',
    'app/applets/patient_search/views/inputView',
    'app/applets/patient_search/views/pillsView',
    'app/applets/patient_search/views/searchMainView',
    'app/applets/patient_search/views/confirmationView',
    'app/applets/patient_search/views/closeButtonView'
], function(Backbone, Marionette, _, patientSearchTemplate, TabView, InputView, PillsView, SearchMainView, ConfirmationView, CloseButtonView) {

    // constants
    var MY_SITE = 'mySite';
    var NATIONWIDE = 'global';
    var BLANK = '';

    var PatientSearchModel = Backbone.Model.extend({
        defaults: {}
    });

    var AppletLayoutView = Backbone.Marionette.LayoutView.extend({
        events: {
            'click #global': 'changePatientSearchScope',
            'click #mySite': 'changePatientSearchScope',
            'click #patient-search-input': 'setupPatientSearch'
        },
        className: 'searchApplet',
        template: patientSearchTemplate,
        regions: {
            closeButton: '#close-button-container',
            patientSearchInput: '#patient-search-input',
            searchType: '#patient-search-tab',
            mySiteTabs: '#patient-search-pills',
            searchMain: '#patient-search-main',
            patientSelectionConfirmation: '#patient-search-confirmation'
        },
        initialize: function() {
            this.initializeViews();
            this.initializeListeners();
        },
        initializeViews: function() {
            this.closeButtonView = new CloseButtonView();
            this.patientSearchView = new InputView();
            this.searchTypeView = new TabView();
            this.mySiteTabsView = new PillsView();
            this.searchMainView = new SearchMainView({
                searchApplet: this
            });
            this.patientSelectionConfirmationView = new ConfirmationView({
                searchApplet: this
            });
        },
        initializeListeners: function() {
            this.listenTo(this.searchTypeView.model, 'change:searchType', this.changeSearchInput);
            this.listenTo(this.mySiteTabsView.model, 'change:pillsType', this.changeSubTab);
            this.listenTo(this.patientSearchView.mySiteModel, 'change:searchString', this.executeSearch);
            this.listenTo(this.patientSearchView.nationwideModel, 'change:globalSearchParameters', this.executeSearch);
            this.listenTo(this.patientSearchView.nationwideModel, 'errorMessage', this.displayErrorMessage);
            this.listenTo(this.patientSearchView.nationwideModel, 'newGlobalSearch', this.clearPreviousGlobalSearchResults);
        },
        onRender: function() {
            this.patientSearchInput.show(this.patientSearchView);
            this.closeButton.show(this.closeButtonView);
            this.searchType.show(this.searchTypeView);
            this.mySiteTabs.show(this.mySiteTabsView);
            this.searchMain.show(this.searchMainView);
            this.patientSelectionConfirmation.show(this.patientSelectionConfirmationView);
            this.patientSelectionConfirmation.$el.addClass('hide');
        },
        onShow: function() {
            $("#patient-search-input input").first().focus();
            $('ul a[role="tab"]').attr('tabindex',0);
        },
        displayErrorMessage: function(messagePayload) {
            this.searchMainView.clearErrorMessage();
            var scope = messagePayload[0];
            var message = messagePayload[1];
            this.searchMainView.displayErrorMessage(scope, message);
        },
        setupPatientSearch: function() {
            this.mySiteTabsView.clearAllTabs();
            this.patientSearchView.$('#patientSearchInput').focus();
        },
        clearPreviousGlobalSearchResults: function() {
            this.searchMainView.clearPreviousGlobalSearchResults(this.searchTypeView.model.get('searchType'));
        },
        getPatientPhoto: function(patient,imageFetchOptions) {
            var self = this;
            var patientImageUrl;
            patientImageUrl = ADK.ResourceService.buildUrl('patientphoto-getPatientPhoto', imageFetchOptions);
                var response = $.ajax({
                url: patientImageUrl,
                success: function(data, statusMessage, xhr) {
                    base64PatientPhoto = 'data:image/jpeg;base64,'+ data +'';
                    patient.set({
                        patientImage: base64PatientPhoto
                    });
                },
                error: function(xhr, statusMessage, error) {
                  console.info("There was an issue retrieving the patient image " + xhr.status);
                },
                async: true
            });
        },
        patientSelected: function(patient) {
            this.patientSelectionConfirmationView.updateSelectedPatientModel(patient);
        },
        changePatientSearchScope: function(event) {
            this.patientSearchView.changeView(this.searchTypeView.model.get('searchType'));
        },
        changeSubTab: function(event) {
            $('#patient-search-input input').first().val(BLANK);
            this.patientSearchView.mySiteModel.set('searchString', BLANK);
            this.searchMainView.changeView(this.searchTypeView.model.get('searchType'), this.mySiteTabsView.getTabType());
            this.searchMainView.mySiteAllSearchLayoutView.clearSearchResultsRegion();
            $("#patientSearchInput").blur();
        },
        changeSearchInput: function() {
            this.patientSelectionConfirmationView.updateTemplateToBlank();
            $('a.active').removeClass('active');
            var scope = this.searchTypeView.model.get('searchType');
            this.patientSearchView.changeView(scope);
            this.mySiteTabsView.changeTemplate(scope);
            this.searchMainView.changeView(scope, this.mySiteTabsView.getTabType());
            $('#patient-search-input input').first().focus();
        },
        removePatientSelectionConfirmation: function() {
            this.patientSelectionConfirmationView.updateTemplateToBlank();
        },
        resetModels: function() {
            this.mySiteTabsView.resetModels();
            this.patientSearchView.resetModels();
        },
        executeSearch: function() {
            var searchType = this.searchTypeView.model.get('searchType');
            var searchParameters = {};

            if (searchType == MY_SITE) {
                searchParameters.tabType = this.mySiteTabsView.getTabType();
                if (searchParameters.tabType === 'none') {
                    searchParameters.searchString = this.patientSearchView.mySiteModel.get('searchString');
                    this.patientSearchView.mySiteModel.set('searchString', searchParameters.searchString, {
                        silent: true
                    });
                }
            } else if (searchType == NATIONWIDE) {
                searchParameters.globalSearchParameters = this.patientSearchView.nationwideModel.get('globalSearchParameters');
            }

            this.patientSelectionConfirmationView.updateTemplateToBlank();
            this.searchMainView.clearErrorMessage(searchType);
            this.searchMainView.executeSearch(searchType, searchParameters);
        }
    });

    var applet = {
        id: 'patient_search',
        getRootView: function() {
            return AppletLayoutView;
        }
    };

    return applet;
});
