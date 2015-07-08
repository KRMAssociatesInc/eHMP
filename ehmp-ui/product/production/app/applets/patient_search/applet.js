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

    var PatientSearchModel = Backbone.Model.extend({
        defaults: {}
    });

    var AppletLayoutView = Backbone.Marionette.LayoutView.extend({
        events: {
            'click #global': 'changePillsTemplate',
            'click #mySite': 'changePillsTemplate',
            'click #myCPRSList': 'changePillsTemplate'
        },
        className: 'searchApplet',
        template: patientSearchTemplate,
        regions: {
            closeButton: '#close-button-container',
            input: '#patient-search-input',
            tab: '#patient-search-tab',
            pills: '#patient-search-pills',
            searchMain: '#patient-search-main',
            confirmation: '#patient-search-confirmation'
        },
        initialize: function() {
            this.initializeViews();
            this.initializeListeners();
        },
        initializeViews: function() {
            this.closeButtonView = new CloseButtonView();
            this.inputView = new InputView();
            this.tabView = new TabView();
            this.pillsView = new PillsView();
            this.changePillsTemplate();
            this.searchMainView = new SearchMainView({
                searchApplet: this
            });
            this.confirmationView = new ConfirmationView({
                searchApplet: this
            });
        },
        initializeListeners: function() {
            this.listenTo(this.tabView.model, 'change:searchType', this.changeSearchInput);
            this.listenTo(this.pillsView.model, 'change:pillsType', this.changeSearchInput);
            this.listenTo(this.inputView.mySiteModel, 'change:searchString', this.executeSearch);
            this.listenTo(this.inputView.mySiteFilterModel, 'change:filterString', this.executeSearch);
            this.listenTo(this.inputView.myCPRSModel, 'change:filterString', this.executeSearch);
            this.listenTo(this.inputView.globalModel, 'change:globalSearchParameters', this.executeSearch);
            this.listenTo(this.inputView.globalModel, 'errorMessage', this.displayErrorMessage);
            this.listenTo(this.inputView.globalModel, 'newGlobalSearch', this.clearPreviousGlobalSearchResults);
        },
        onRender: function() {
            this.input.show(this.inputView);
            this.closeButton.show(this.closeButtonView);
            this.tab.show(this.tabView);
            this.pills.show(this.pillsView);
            this.searchMain.show(this.searchMainView);
            this.confirmation.show(this.confirmationView);
            this.confirmation.$el.addClass('hide');

        },
        onShow: function() {
            $('#patient-search-input input').first().focus();
        },
        displayErrorMessage: function(messagePayload) {
            this.searchMainView.clearErrorMessage();
            var searchType = messagePayload[0];
            var message = messagePayload[1];
            this.searchMainView.displayErrorMessage(searchType, message);
        },
        clearPreviousGlobalSearchResults: function() {
            this.searchMainView.clearPreviousGlobalSearchResults(this.tabView.model.get('searchType'));
        },
        patientSelected: function(patient) {
            this.confirmationView.updateSelectedPatientModel(patient);
        },
        changePillsTemplate: function(event) {
            this.pillsView.changeTemplate(this.tabView.model.get('searchType'));
            $('#patient-search-input input').first().focus(); //Comment Out Later
        },
        resetModels: function() {
            this.inputView.resetModels();
            this.pillsView.resetModels();
        },
        changeSearchInput: function() {
            this.confirmationView.updateTemplateToBlank();
            $("a.active").removeClass('active');
            this.inputView.changeView(this.tabView.model.get('searchType'), this.pillsView.model.get('pillsType'));
            this.updateSearchView();
            $('#patient-search-input input').first().focus();
        },
        updateSearchView: function() {
            this.searchMainView.changeView(this.tabView.model.get('searchType'), this.pillsView.model.get('pillsType'));
            if (this.tabView.model.get('searchType') == 'mySite') {
                this.executeSearch();
            }
        },
        executeSearch: function() {
            var searchType = this.tabView.model.get('searchType');
            var searchParameters = {};
            if (searchType == 'myCPRSList') {
                searchParameters.searchString = this.inputView.myCPRSModel.get('filterString');
            }
            if (searchType == 'mySite') {
                searchParameters.pillsType = this.pillsView.model.get('pillsType');
                if (searchParameters.pillsType === "all") {
                    searchParameters.searchString = this.inputView.mySiteModel.get('searchString');
                    this.inputView.mySiteFilterModel.set('filterString', searchParameters.searchString, {
                        silent: true
                    });
                } else {
                    searchParameters.searchString = this.inputView.mySiteFilterModel.get('filterString');
                    this.inputView.mySiteModel.set('searchString', searchParameters.searchString, {
                        silent: true
                    });
                }
            } else if (searchType == 'global') {
                this.inputView.globalModel.trigger("newGlobalSearch");
                searchParameters.globalSearchParameters = this.inputView.globalModel.get('globalSearchParameters');
            }

            this.confirmationView.updateTemplateToBlank();
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
