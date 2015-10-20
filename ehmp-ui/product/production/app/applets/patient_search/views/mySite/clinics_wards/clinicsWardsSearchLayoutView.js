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

    var APPOINTMENT_DATE_FORMAT = 'MMDDYYYYHHmmss';

    var LocationsListFilterViewWards = Backbone.Marionette.ItemView.extend({

        template: Handlebars.compile("<input id='wardFilter' type='text' placeholder='Filter {{locationType}}' class='form-control padding'></input>"),
        model: locationsListFilterModel,
        initialize: function(options) {
            this.model.set('locationType', options.locationType);
        },
        events: {
            'keyup input': 'updateWardsListResults',
            'keydown input': 'updateWardsListResults',
            'keypress input': 'updateWardsListResults',
            'change': 'updateWardsListResults'
        },
        updateWardsListResults: function(event) {
            var self = this;
            if (event.currentTarget.id == 'wardFilter') {
                self.model.set({
                    'filterString': $(event.currentTarget).val()
                });
            }
        }
    });
    var LocationsListFilterViewClinics = Backbone.Marionette.LayoutView.extend({
        template: Handlebars.compile("<input id='clinicFilter' type='text' placeholder='Filter {{locationType}}' class='form-control padding'></input><div id='locationDateRange'></div>"),
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
            'keypress input': 'updateClinicListResults',
            'change': 'updateClinicListResults'
        },
        updateClinicListResults: function(event) {
            if (this.setModel) clearTimeout(this.setModel);
            var self = this;
            var target = event.target.id;
            if (target == 'clinicFilter') {
                this.setModel = setTimeout(function() {
                    self.model.set({
                        'filterString': $(event.target).val()

                    });
                }, 200);
            }
        }
    });

    var SearchLayoutView = Backbone.Marionette.LayoutView.extend({
        searchApplet: undefined,
        template: SearchViewTemplate,
        regions: {
            patientSearchResults: "#patient-search-results",
            locationListFilterRegion: "#location-list-filter-input",
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
                this.locationsListFilterView = new LocationsListFilterViewWards({
                    locationType: options.locationType
                });
            }
            this.locationListResultsView = new LocationsListResultsView({
                searchView: this,
                searchApplet: this.searchApplet,
                locationListFilterView: this.locationsListFilterView,
                locationType: options.locationType
            });
        },
        onRender: function() {
            this.locationListFilterRegion.show(this.locationsListFilterView);
            this.locationListResultsRegion.show(this.locationListResultsView);
            var self = this;
            this.$el.find('#location-list-results').on('scroll', function(event) {
                self.locationListResultsView.fetchRows(event);
            });
        },
        locationSelected: function(locationModel) {
            var criteria;
            if (this.locationType === 'clinics') {
                criteria = {
                    "uid": locationModel.attributes.uid
                };
            } else {
                criteria = {
                    "ref.id": locationModel.attributes.refId,
                    "uid": locationModel.attributes.uid
                };
            }
            this.searchApplet.removePatientSelectionConfirmation();
            this.executeSearch(criteria);
        },
        executeSearch: function(criteria) {
            this.searchApplet.removePatientSelectionConfirmation();
            if (this.patientsView) {
                this.patientsView.remove = function() {
                    this.collection.on('sync', function() {});
                };
                this.patientsView.remove();
            }
            if (this.locationType === 'clinics') {
                this.patientsView = new SearchResultsCollectionView({
                    searchApplet: this.searchApplet,
                    templateName: 'clinics'
                });
            } else if (this.locationType === 'wards') {
                this.patientsView = new SearchResultsCollectionView({
                    searchApplet: this.searchApplet,
                    templateName: 'roomBedIncluded'
                });
            } else {
                this.patientsView = new SearchResultsCollectionView({
                    searchApplet: this.searchApplet
                });
            }

            this.patientSearchResults.show(this.patientsView);

            if (this.locationType === 'clinics') {
                criteria['date.start'] = this.locationsListFilterView.locationDateRangeView.model.get('date.start');
                criteria['date.end'] = this.locationsListFilterView.locationDateRangeView.model.get('date.end');
                
                if (this.$el.find('#filter-from-date-clinic').val() !== '' && this.$el.find('#filter-to-date-clinic').val() !== '') {
                    this.$el.find('button').removeClass('active-range');
                } else {
                    this.$el.find('#filter-from-date-clinic').val('');
                    this.$el.find('#filter-to-date-clinic').val('');
                }
            }

            var searchOptions = {
                resourceTitle: 'locations-' + this.locationType + '-search',
                criteria: criteria,
                cache: true
            };

            var self = this;

            searchOptions.onError = function(model, resp) {
                if (resp.status === 200) {
                    self.patientsView.setEmptyMessage("No results found.");
                } else {
                    self.patientsView.setEmptyMessage("Error: Unknown");
                }
                self.patientsView.render();
            };
            searchOptions.onSuccess = function(resp) {
                self.patientsView.setEmptyMessage("No results found.");
                if (patientsCollection.length === 1 &&
                    patientsCollection.at(0).attributes.message) {
                    patientsCollection.reset();
                }

                //If this is a clinic, sort the collection by appointmentTime
                if (patientsCollection.length > 0 &&
                    patientsCollection.at(0).attributes.appointmentTime) {
                    patientsCollection.comparator = function(collectionA, collectionB) {
                        var start = moment(collectionA.attributes.appointmentTime, APPOINTMENT_DATE_FORMAT, true);
                        var end = moment(collectionB.attributes.appointmentTime, APPOINTMENT_DATE_FORMAT, true);

                        if (start.isBefore(end)) {
                            return -1;
                        } else if (start.isSame(end)) {
                            return 0;
                        } else return 1;
                    };

                    patientsCollection.sort();
                }

                self.patientsView.collection = patientsCollection;
                self.patientsView.originalCollection = patientsCollection;
                self.patientsView.render();
            };

            var patientsCollection = ADK.ResourceService.fetchCollection(searchOptions);
        },
        refineSearch: function(filterString, view) {
            if (view && view.originalCollection && !view.originalCollection.isEmpty()) {
                if (filterString !== '') {
                    var self = this;
                    view.collection = new Backbone.Collection();
                    var filteredSet = _.filter(view.originalCollection.models, function(model) {
                        if (self.modelAttributeContainsFilterString(model, 'fullName', filterString)) {
                            return model;
                        }
                        if (self.modelAttributeContainsFilterString(model, 'ssn', filterString)) {
                            return model;
                        }
                        if (self.modelAttributeContainsFilterString(model, 'birthDate', filterString)) {
                            return model;
                        }
                    });
                    view.collection.reset(filteredSet);
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