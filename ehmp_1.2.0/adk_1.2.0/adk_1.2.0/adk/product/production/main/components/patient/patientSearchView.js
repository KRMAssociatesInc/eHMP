define([
    "backbone",
    "marionette",
    "underscore",
    "hbs!main/components/patient/patientSearchResultTemplate",
    "hbs!main/components/patient/patientSearchTemplate",
    "api/Messaging",
    "api/ResourceService",
    "main/Utils"
], function(Backbone, Marionette, _, PatientSearchResultTemplate, PatientSearchTemplate, Messaging, ResourceService, Utils) {
    'use strict';

    var PatientSearchResultView = Backbone.Marionette.ItemView.extend({
        tagName: "a",
        className: "list-group-item row-layout",
        template: PatientSearchResultTemplate,
        events: {
            "click": "selectPatient"
        },

        selectPatient: function(e) {
            e.preventDefault();
            e.stopPropigation();
            var patient = this.model;
            Messaging.trigger('patient:selected', patient);
            $("a.active").removeClass('active');
            $(event.currentTarget).addClass('active');
        }
    });

    var PatientSearchResultsView = Backbone.Marionette.CollectionView.extend({
        childView: PatientSearchResultView,
        tagName: "div",
        className: "list-group"
    });

    var AppletLayoutView = Backbone.Marionette.LayoutView.extend({
        template: PatientSearchTemplate,
        regions: {
            patientSearchResults: "#patient-search-results"
        },
        onRender: function() {
            this.loadSearchResults('');
        },
        events: {
            'keyup #patientSearchInput': 'search'
        },
        search: function() {
            if (patientSearchInput) {
                this.loadSearchResults(patientSearchInput.value);
            }
        },
        loadSearchResults: function(fullNameFilter) {
            var criteria = {
                "fullName": fullNameFilter,
                itemsPerPage: 20
            };

            var viewModel = {
                defaults: {
                    ageYears: 'Unk'
                },
                parse: function(response) {

                    //response.ageYears = Utils.getAge(response.birthDate);

                    return response;
                }
            };
            var searchOptions = {};
            searchOptions.resourceTitle = 'patient-search-full-name';
            searchOptions.viewModel = viewModel;
            searchOptions.criteria = criteria;
            var patients = ResourceService.fetchCollection(searchOptions);

            var patientsView = new PatientSearchResultsView({
                collection: patients
            });
            this.patientSearchResults.show(patientsView);
        }
    });

    return AppletLayoutView;
});