define([
    "backbone",
    "marionette",
    "app/applets/patient_search/views/common/loadingView",
    "app/applets/patient_search/views/common/patientSearchResultView",
    'hbs!app/applets/patient_search/templates/patientSearchResultWrapper',
    'hbs!app/applets/patient_search/templates/patientSearchResultsWrapper_clinics',
    'hbs!app/applets/patient_search/templates/patientSearchResultsWrapper_roomBedIncluded'
], function(Backbone, Marionette, LoadingView, PatientSearchResultView, PatientSearchResultWrapper, patientSearchResultsWrapper_clinics, patientSearchResultsWrapper_roomBedIncluded) {
    var SearchResultsCollectionView = Backbone.Marionette.CompositeView.extend({
        searchApplet: undefined,
        source: '',
        initialize: function(options) {
            this.searchApplet = options.searchApplet;
            this.source = options.source;
            this.collection = new Backbone.Collection();
            if (options.templateName){
                this.templateName = options.templateName;
            }
        },
        getTemplate: function(){
            if (this.templateName && (this.templateName === 'clinics')){
                return patientSearchResultsWrapper_clinics;
            } else if (this.templateName && (this.templateName === 'roomBedIncluded')){
                return patientSearchResultsWrapper_roomBedIncluded;
            } else {
                return PatientSearchResultWrapper;
            }
        },
        emptyView: LoadingView,
        setEmptyMessage: function(errorMessage) {
            this.emptyView = Backbone.Marionette.ItemView.extend({
                template: _.template('<p class="error-message padding" role="alert" tabindex="0">' + errorMessage + '</p>'),
                tagName: "p"
            });
        },
        childView: PatientSearchResultView,
        childViewOptions: function() {
            return {
                searchApplet: this.searchApplet,
                templateName: this.templateName,
                source: this.source
            };
        },
        tagName: "div",
        className: "results-table",
        childViewContainer: ".list-group"
    });

    return SearchResultsCollectionView;
});
