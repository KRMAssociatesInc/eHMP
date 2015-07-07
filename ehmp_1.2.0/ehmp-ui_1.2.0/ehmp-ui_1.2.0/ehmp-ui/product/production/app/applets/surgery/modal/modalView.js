define([
    'backbone',
    'marionette',
    'underscore',
    'hbs!app/applets/surgery/modal/modalTemplate',
    'app/applets/documents/docUtils'
], function(Backbone, Marionette, _, modalTemplate, docUtils) {
    'use strict';

    var SurgeryModel = Backbone.Model.extend({
    });
    var surgeryModel = new SurgeryModel();

    var SurgeryModalView = Backbone.Marionette.ItemView.extend({
        template: modalTemplate,
        model: SurgeryModel,

        initialize: function(options) {
            this.filterDocId = options && options.filterDocId;
            this.summaryModel = options && options.summaryModel;
            this.resourceTitle = options.resourceTitle;
            this.model = surgeryModel;
            var fetchOptions = {};
            fetchOptions.resourceTitle = this.resourceTitle;
            fetchOptions.viewModel = this.getViewModel(this);
            this.initialCollection = ADK.PatientRecordService.fetchCollection(fetchOptions);
            this.initialCollection.on("sync", this.initialCollectionSynced, this);
        },

        initialCollectionSynced: function() {
            this.model.set(this.surgeryModel);
            this.render();
        },

        associatedRecordSynced: function(collection) {
            if(collection && collection.models && collection.models.length) {
                var model = collection.models[0];
                var uid = model.get('uid');
                if(this && surgeryModel) {
                    var results = surgeryModel.get('results');
                    var len = results.length;
                    for(var i=0; i<len; i++){
                        if(results[i].uid === uid) {
                            results[i].entered = model.get('entered');
                            results[i].authorDisplayName = model.get('authorDisplayName');
                            results[i].statusDisplayName = model.get('statusDisplayName');
                            results[i].text = docUtils.getSummaryModelText(model);
                            var localTitle = results[i].localTitle || i;
                            results[i].hrefId = localTitle.replace(/ /g, '_');
                            results[i].linkId = 'LINK_' + results[i].hrefId;
                            this.render();
                            break;
                        }
                    }
                }
            }
            $('#surgeryLoadingDiv').fadeOut(1000);
        },

        getAssociatedResultRecords: function(aGroup) {
            var self = this;
            if(aGroup) {
                var pid = ADK.PatientRecordService.getCurrentPatient;
                var uids = _.pluck(aGroup, 'uid');
                _.each(uids, function(item) {
                    self.assocResults = [];
                    var obj = {uid: item, collection: {}};
                    self.assocResults.push(obj);
                    var fetchOptions = {};
                    fetchOptions.pid = pid;
                    fetchOptions.uid = item;
                    fetchOptions.criteria = {uid: item};
                    fetchOptions.resourceTitle = 'uid';
                    obj.collection = ADK.PatientRecordService.fetchCollection(fetchOptions);
                    obj.collection.on('sync', self.associatedRecordSynced, self);
                });
            }
        },

        getViewModel: function() {
            var self = this,
                filterDocId = this.filterDocId,
                viewModel = {
                    parse: function(response) {
                        if(!response.results || !docUtils.hasDocIdRecord(response.results, filterDocId)) {
                            return;
                        }
                        surgeryModel.set(response);
                        self.getAssociatedResultRecords(response.results, self);
                        return response;
                    }
                };
                return viewModel;
        },

        resultsAnchorClick: function(e) {
            e.preventDefault();
            e.stopPropagation();
            var $el = $(e.target);
            var target = $el.attr('target');
            var $scrollToMe = $('#' + target);
            var $modal = $('#mainModal');
            if($modal && $scrollToMe) {
                $modal.animate(
                    { scrollTop : $scrollToMe.offset().top }, 1000
                );
            }
        },

        resultsAnchorTopClick: function(e) {
            e.preventDefault();
            e.stopPropagation();
            var $modal = $('#mainModal');
            if($modal) {
                $modal.animate(
                    { scrollTop : 0 }, 1000
                );
            }
        },

        events: {
            'click .row .js-anchor': 'resultsAnchorClick',
            'click .row .js-anchor-top': 'resultsAnchorTopClick'
        }
    });

    return SurgeryModalView;
});
