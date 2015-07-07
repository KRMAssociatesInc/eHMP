define([
    'backbone',
    'marionette',
    'underscore',
    "app/applets/vista_health_summaries/appletHelpers",
    'hbs!app/applets/vista_health_summaries/modal/modalTemplate'
], function(Backbone, Marionette, _, AppletHelper, modalTemplate) {
    'use strict';

    var dataCollection;

    var ModalView = Backbone.Marionette.LayoutView.extend({
        template: modalTemplate,
        fetchOptions: {},
        initialize: function(options) {
            var self = this;
            this.reportDetailLoadingView = ADK.Views.Loading.create();

            dataCollection = options.gridCollection;

            if (this.showNavHeader) {
                this.model.attributes.navHeader = true;
            }

            this.target = options.target;

            if (!this.model.get('detail')) {

                // fetch report detail from rdk resource
                this.fetchOptions.resourceTitle = 'healthsummaries-getReportContentByReportID';
                this.fetchOptions.viewModel = {
                    parse: AppletHelper.parseReportDetailResponse
                };
                this.fetchOptions.pageable = true;
                this.fetchOptions.cache = true;
                this.fetchOptions.criteria = {
                    siteid: this.model.get('siteKey'),
                    reportid:  this.model.get('reportID') + ';' + this.model.get('hsReport')
                };

                // on fetch error
                this.fetchOptions.onError =  function(model, resp) {
                    self.model.set('detail', 'Error : unable to run report');
                    self.render();
                };

                // on success
                // xxx: if (model.detail) don;t fetch again.
                this.fetchOptions.onSuccess = function(collection, response) {

                    var detail = collection.first().get('detail');
                    self.model.set('detail', detail);

                    self.render();
                };

                var data = ADK.PatientRecordService.fetchCollection(this.fetchOptions);

            } else {
                setTimeout(function() {
                    self.render();
                }, 500);
            }
        },
        regions: {
            reportDetail: '#vhs-report-detail',
        },
        onRender: function() {

        },
        onShow: function() {
            this.reportDetail.show(this.reportDetailLoadingView);
        }
    });
    return ModalView;
});
