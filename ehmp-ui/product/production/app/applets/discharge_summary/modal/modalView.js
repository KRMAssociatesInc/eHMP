define([
    'backbone',
    'marionette',
    'underscore',
    'hbs!app/applets/discharge_summary/modal/modalTemplate'
], function(Backbone, Marionette, _, modalTemplate) {
    'use strict';


    var DischargeModel = Backbone.Model.extend({
        defaults: {},
    });

    var dischargeModel = new DischargeModel();


    return Backbone.Marionette.ItemView.extend({
        template: modalTemplate,
        model: DischargeModel,

        initialize: function(options) {
            //for intigration within the documents tab
            var toFilter = options && options.model,
                summaryStatusDisplayName = toFilter.get('statusDisplayName'),
                lcName = summaryStatusDisplayName.toLowerCase(),
                summaryStatusClass = '';

            if (lcName === 'completed') {
                summaryStatusClass = 'text-success';
            } else if (lcName === 'retracted') {
                summaryStatusClass = 'text-danger';
            }

            dischargeModel.set({
                'filterDocId': toFilter.get('uid'),
                'summaryFacilityName': toFilter.get('facilityName'),
                'summaryLocalTitle': toFilter.get('localTitle'),
                'summaryDateTime': toFilter.get('referenceDateTime'),
                'summaryKind': toFilter.get('kind'),
                'summaryEntered': toFilter.get('entered'),
                'summaryAuthorDisplayName': toFilter.get('authorDisplayName'),
                'summaryCosignerDisplayName': toFilter.get('cosignerDisplayName'),
                'summaryAttendingDisplayName': toFilter.get('attendingDisplayName'),
                'summaryStatusDisplayName': summaryStatusDisplayName,
                'summaryStatusClass': summaryStatusClass,
                'summaryText': toFilter.get('text')[0].content
            });

            this.model = dischargeModel;

        }

    });
});
