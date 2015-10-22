define([
    "backbone",
    "marionette",
    "app/applets/patient_search/views/common/searchResultsCollectionView",
    "hbs!app/applets/patient_search/templates/mySite/all/mySiteAllSearchResultsTemplate",
    "app/applets/patient_search/views/common/blankView"
], function(Backbone, Marionette, SearchResultsCollectionView, mySiteAllSearchResultsTemplate, BlankView) {

    var MySiteAllLayoutView = Backbone.Marionette.LayoutView.extend({
        searchApplet: undefined,
        template: mySiteAllSearchResultsTemplate,
        regions: {
            patientSearchResults: "#patient-search-results"
        },
        initialize: function(options) {
            this.searchApplet = options.searchApplet;
        },
        clearSearchResultsRegion: function() {
            this.patientSearchResults.show(new BlankView());
        },
        executeSearch: function(fullNameFilter) {
            if (fullNameFilter && fullNameFilter !== '') {
                if (fullNameFilter.length < 3) {
                    this.patientSearchResults.show(new BlankView());
                    this.searchApplet.inputView.$el.find('.instructions p span').removeClass('hidden');
                } else {
                    var patientsView = new SearchResultsCollectionView({
                        searchApplet: this.searchApplet
                    });
                    this.patientSearchResults.show(patientsView);
                    var criteria = {
                        "last5": fullNameFilter
                    };

                    var viewModel = {
                        defaults: {
                            ageYears: 'Unk'
                        }
                    };
                    var searchOptions = {
                        resourceTitle: 'patient-search-last5',
                        viewModel: viewModel,
                        criteria: criteria,
                        cache: false
                    };

                    searchOptions.onError = function(model, resp) {
                        if (resp.status == 406) {
                            patientsView.setEmptyMessage("Too many results have returned. Please be more specific in your search criteria.");
                        } else {
                            patientsView.setEmptyMessage("An error has occurred.");
                        }
                        patientsView.render();
                    };
                    searchOptions.onSuccess = function(resp) {
                        if ((resp.url.indexOf("full-name") !== -1)) {
                            if (patientsCollection.length === 0) {
                                patientsView.setEmptyMessage("No patient record found. Please make sure your search criteria is correct.");
                            }
                        }
                        patientsView.collection = patientsCollection;
                        patientsView.render();
                    };

                    var patientsCollection = ADK.ResourceService.fetchCollection(searchOptions);

                    patientsCollection.once('sync', function() {
                        if (this.length === 0) {
                            criteria = {
                                "name.full": fullNameFilter,
                                "rows.max": 100
                            };
                            searchOptions.resourceTitle = 'patient-search-full-name';
                            searchOptions.criteria = criteria;
                            ADK.ResourceService.fetchCollection(searchOptions, this);
                        }
                    });
                }
            }
        }
    });

    return MySiteAllLayoutView;
});
