define([
    "backbone",
    "marionette",
    "handlebars",
    "app/applets/patient_search/views/common/searchResultsCollectionView",
    "app/applets/patient_search/views/common/errorMessageView",
    "app/applets/patient_search/views/common/blankView",
    "app/applets/patient_search/views/mySite/clinics_wards/siteResultsCollectionView",
    "hbs!app/applets/patient_search/templates/mySite/clinics_wards/searchViewTemplate",
    "app/applets/patient_search/views/mySite/clinics_wards/dateRangeSelectorView"
], function(Backbone, Marionette, Handlebars, SearchResultsCollectionView, ErrorMessageView, BlankView, LocationsListResultsView, SearchViewTemplate, DateRangeSelectorView) {

    var LocationsListFilterModel = Backbone.Model.extend({
        defaults: {
            'filterString': '',
            'locationType': ''
        }
    });
    var locationsListFilterModel = new LocationsListFilterModel();
    var locationsListFilterModelClinics = new LocationsListFilterModel();

    var LocationsListFilterView = Backbone.Marionette.ItemView.extend({
        template: Handlebars.compile("<input type='text' placeholder='Filter {{locationType}}' class='form-control padding'></input>"),
        model: locationsListFilterModel,
        initialize: function(options) {
            this.model.set('locationType', options.locationType);
        },
        events: {
            'keyup input': 'updateClinicListResults',
            'keydown input': 'updateClinicListResults',
            'keypress input': 'updateClinicListResults'
        },
        updateClinicListResults: function(event) {
            this.model.set({
                'filterString': $(event.currentTarget).val()
            });
        }
    });
    var LocationsListFilterViewClinics = Backbone.Marionette.LayoutView.extend({
        template: Handlebars.compile("<input type='text' placeholder='Filter {{locationType}}' class='form-control padding'></input><div id='locationDateRange'></div>"),
        model: locationsListFilterModelClinics,
        regions: {
            locationDateRange: "#locationDateRange"
        },
        initialize: function(options) {
            this.model.set('locationType', options.locationType);
            this.locationDateRangeView = new DateRangeSelectorView({
                parent: options.parent
            });
        },
        onRender: function() {
            this.locationDateRange.show(this.locationDateRangeView);
        },
        events: {
            'keyup input': 'updateClinicListResults',
            'keydown input': 'updateClinicListResults',
            'keypress input': 'updateClinicListResults'
        },
        updateClinicListResults: function(event) {
            this.model.set({
                'filterString': $(event.currentTarget).val()
            });
        }
    });

    var SearchLayoutView = Backbone.Marionette.LayoutView.extend({
        searchApplet: undefined,
        template: SearchViewTemplate,
        regions: {
            patientSearchResults: "#patient-search-results",
            locationListFilterRegion: "#location-list-filter-input",
            locationsListErrorRegion: "#location-list-error-message",
            locationListResultsRegion: "#location-list-results"
        },
        initialize: function(options) {
            this.searchApplet = options.searchApplet;
            this.locationType = options.locationType;
            if (this.locationType === 'clinics') {
                this.locationsListFilterView = new LocationsListFilterViewClinics({
                    locationType: options.locationType,
                    parent: this
                });
            } else {
                this.locationsListFilterView = new LocationsListFilterView({
                    locationType: options.locationType
                });
            }
            this.locationListResultsView = new LocationsListResultsView({
                searchView: this,
                locationListFilterView: this.locationsListFilterView,
                locationType: options.locationType
            });
        },
        onRender: function() {
            this.locationListFilterRegion.show(this.locationsListFilterView);
            this.locationListResultsRegion.show(this.locationListResultsView);
        },
        locationSelected: function(locationModel) {
            var criteria;
            if (this.locationType === 'clinics') {
                criteria = {
                    "locationUid": locationModel.attributes.uid
                };
            } else {
                criteria = {
                    "refId": locationModel.attributes.refId,
                    "locationUid": locationModel.attributes.uid
                };
            }
            this.searchApplet.confirmationView.updateTemplateToBlank();
            this.executeSearch(criteria);
        },
        executeSearch: function(criteria) {
            if (patientsView) {
                console.log("here");
                patientsView.remove = function() {
                    this.collection.on('sync', function() {});
                };
                patientsView.remove();
            }
            var patientsView = new SearchResultsCollectionView({
                searchApplet: this.searchApplet
            });
            this.patientSearchResults.show(patientsView);

            if (this.locationType === 'clinics') {
                criteria.startDate = this.locationsListFilterView.locationDateRangeView.model.get('fromDate');
                criteria.stopDate = this.locationsListFilterView.locationDateRangeView.model.get('toDate');
            }

            var searchOptions = {
                resourceTitle: 'locations-' + this.locationType + '-search',
                criteria: criteria,
                cache: true
            };

            var self = this;

            searchOptions.onError = function(model, resp) {
                if (resp.status === 200) {
                    patientsView.setEmptyMessage("No results found.");
                } else {
                    patientsView.setEmptyMessage("Error: Unknown");
                }
                patientsView.render();
            };
            searchOptions.onSuccess = function(resp) {
                patientsView.setEmptyMessage("No results found.");
                patientsView.collection = patientsCollection;
                patientsView.originalCollection = patientsCollection;
                self.refineSearch(self.searchApplet.inputView.filterModel.get('filterString'), patientsView);
                patientsView.render();
            };

            var patientsCollection = ADK.ResourceService.fetchCollection(searchOptions);
        },
        refineSearch: function(filterString, view) {
            if (view.originalCollection && !view.originalCollection.isEmpty()) {
                if (filterString !== '') {
                    var self = this;
                    view.collection = new Backbone.Collection().reset(_.filter(view.originalCollection.models, function(model) {
                        if (self.modelAttributeContainsFilterString(model, 'fullName', filterString)) {
                            return model;
                        }
                        if (self.modelAttributeContainsFilterString(model, 'ssn', filterString)) {
                            return model;
                        }
                        if (self.modelAttributeContainsFilterString(model, 'birthDate', filterString)) {
                            return model;
                        }
                    }));
                } else {
                    view.collection = view.originalCollection;
                }
                view.render();
            }
        },
        modelAttributeContainsFilterString: function(model, attribute, filterString) {
            if ((model.attributes[attribute] !== undefined) && (model.attributes[attribute].toLowerCase().indexOf(filterString.toLowerCase()) >= 0)) {
                return true;
            } else {
                return false;
            }
        }
    });

    return SearchLayoutView;
});
