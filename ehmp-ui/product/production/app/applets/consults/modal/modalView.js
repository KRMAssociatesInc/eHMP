define([
    'backbone',
    'marionette',
    'underscore',
    'hbs!app/applets/consults/modal/modalTemplate',
    'app/applets/documents/docUtils'
], function(Backbone, Marionette, _, modalTemplate, docUtils) {
    'use strict';

    function getViewModel(filterDocId) {
        var viewModel = {
            parse: function(response) {
                if(!response.activity || !docUtils.hasDocIdRecord(response.activity, filterDocId)) {
                    return;
                }
                consultModel.set(response);
                return response;
            }
        };
        return viewModel;
    }

    var ConsultModel = Backbone.Model.extend({
        setAttrsFromSummaryModel: function(summaryModel) {
            if(summaryModel) {
                this.set({
                    'summaryLocalTitle': summaryModel.get('localTitle'),
                    'summaryKind': summaryModel.get('kind'),
                    'summaryEntered': summaryModel.get('entered'),
                    'summaryAuthorDisplayName': summaryModel.get('authorDisplayName'),
                    'summaryStatusDisplayName': summaryModel.get('statusDisplayName'),
                    'summaryText': docUtils.getSummaryModelText(summaryModel)
                });
            }
        }
    });
    var consultModel = new ConsultModel();

    return Backbone.Marionette.ItemView.extend({
        template: modalTemplate,
        model: ConsultModel,

        initialize: function(options) {
            this.filterDocId = options && options.filterDocId;
            this.summaryModel = options && options.summaryModel;
            if(options.resourceTitle)
                this.resourceTitle = options.resourceTitle;
            consultModel.setAttrsFromSummaryModel(this.summaryModel);
            this.model = consultModel;
            var fetchOptions = {};
            fetchOptions.resourceTitle = this.resourceTitle;
            fetchOptions.viewModel = getViewModel(this.filterDocId);
            this.collection = ADK.PatientRecordService.fetchCollection(fetchOptions);
            console.log(this.collection);
            this.collection.on("sync", this.collectionSynced, this);
        },

        collectionSynced: function() {
            this.model.set(consultModel);
            this.render();
            $('#consultsLoadingDiv').fadeOut(1000);
        }
    });
});
