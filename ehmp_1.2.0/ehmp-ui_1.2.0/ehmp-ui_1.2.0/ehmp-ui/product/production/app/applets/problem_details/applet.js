define([
  "backbone",
  "marionette",
  "hbs!app/applets/problem_details/show/appTable",
  "hbs!app/applets/problem_details/show/appRowTemplate",
  "hbs!app/applets/problem_details/show/problemDetailTemplate",
  "app/applets/problem_details/eventHandlers/problemDetailEventHandlers",
  "app/applets/problem_details/eventHandlers/appEventHandlers"
], function(Backbone, Marionette, tableTemplate, rowTemplate, detailTemplate, ProblemDetailEventHandlers, AppEventHandlers) {

  var itemView = Backbone.Marionette.ItemView.extend({
    tagName: "tr",
    template: rowTemplate,
    events: {
      'click': 'rowClicked'
    },
    rowClicked: function(event) {
      ProblemDetailEventHandlers.showProblemDetails(event, this.$el, this.model, this);
    }
  });

  var detailItemView = Backbone.Marionette.ItemView.extend({
    tagName: "tr",
    template: detailTemplate
  });

  var CompositeView = Backbone.Marionette.CompositeView.extend({
    initialize: function() {
      var fetchOptions = {};
      fetchOptions.resourceTitle = appletDefinition.resource;
      fetchOptions.viewModel = appletDefinition.viewModel;
      var domainCollection = ADK.PatientRecordService.fetchCollection(fetchOptions);
      this.collection = domainCollection;
    },
    childView: itemView,
    childViewContainer: "tbody",
    template: tableTemplate,
    className: "panel panel-info sort-ascending-summary",
    events: {
      'click th#summary': 'sortSummary',
      'click th#facility': 'sortFacility',
      'click th#entered': 'sortEnteredDate',
      'click th#provider': 'sortProviderName'
    },
    sortSummary: function(event) {
      AppEventHandlers.sortCollection(event, this.$el, this.collection, 'summary', 'alphanumerical');
    },
    sortFacility: function(event) {
      AppEventHandlers.sortCollection(event, this.$el, this.collection, 'facilityName', 'alphanumerical');
    },
    sortEnteredDate: function(event) {
      AppEventHandlers.sortCollection(event, this.$el, this.collection, 'entered', 'date');
    },
    sortProviderName: function(event) {
      AppEventHandlers.sortCollection(event, this.$el, this.collection, 'providerName', 'alphanumerical');
    }
  });

  var appletDefinition = {
    appletId: "problem_details",
    resource: "patient-record-problem",
    itemView: itemView,
    compositeView: CompositeView
  };

  return ADK.createSimpleApplet(appletDefinition);
  
});
