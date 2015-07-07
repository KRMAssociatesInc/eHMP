define([
     "backbone",
     "marionette",
     "underscore",
     "app/applets/patient_search/views/common/searchResultsCollectionView",
     "hbs!app/applets/patient_search/templates/myCPRSList/myCPRSListResultsTemplate"
 ], function(Backbone, Marionette, _, SearchResultsCollectionView, myCPRSListResultsTemplate) {

    var MyCPRSListLayoutView = Backbone.Marionette.LayoutView.extend({
         searchApplet: undefined,
         template: myCPRSListResultsTemplate,
         regions: {
             myCPRSSearchResultsRegion: "#my-cprs-search-results"
         },
         initialize: function(options) {
             this.searchApplet = options.searchApplet;
         },
         onRender: function() {
             this.executeSearch();
         },
         displayErrorMessage: function(message) {
             var patientsView = new SearchResultsCollectionView({
                 searchApplet: this.searchApplet
             });
             patientsView.setEmptyMessage(message);
             this.myCPRSSearchResultsRegion.show(patientsView);
         },
         executeSearch: function(myCPRSSearchString) {

             var patientsView = new SearchResultsCollectionView({
                 searchApplet: this.searchApplet
             });
             this.myCPRSSearchResultsRegion.show(patientsView);

             //the entire custom viewModel may be totally unnecessary
             var viewModel = {
                 defaults: {
                     ageYears: 'Unk'
                 }
             };
             var searchOptions = {
                 resourceTitle: 'search-default-search',
                 viewModel: viewModel,
                 cache: false
             };

             searchOptions.onError = function(model, resp) {
                 patientsView.setEmptyMessage("Unknown error.");
                 patientsView.render();
             };
             searchOptions.onSuccess = function(resp) {
                 if (patientsCollection.length === 0) {
                     patientsView.setEmptyMessage("No patient record found. Please make sure your CPRS Default Search is configured properly.");
                 } else {
                     patientsView.collection = patientsCollection;
                     patientsView.originalCollection = patientsCollection;
                 }
                 patientsView.render();
             };
             var patientsCollection = ADK.ResourceService.fetchCollection(searchOptions);
         },
         refineSearch: function(filterString) {
             this.clearErrorMessage();
             if ((filterString !== undefined) && (filterString !== '')) {
                 var self = this;
                 this.patientsView.collection = new Backbone.Collection().reset(_.filter(this.patientsView.originalCollection.models, function(model) {
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
                 if (this.patientsView.collection.length === 0) {
                     this.displayErrorMessage("No patient record found. Please make sure your CPRS Default Search is configured properly.");
                 }
             } else {
                 this.patientsView.collection = this.patientsView.originalCollection;
             }
             this.patientsView.render();
         },
         modelAttributeContainsFilterString: function(model, attribute, filterString) {
             if ((model.attributes[attribute] !== undefined) && (model.attributes[attribute].toLowerCase().indexOf(filterString.toLowerCase()) >= 0)) {
                 return true;
             } else {
                 return false;
             }
         }
     });

     return MyCPRSListLayoutView;
 });
