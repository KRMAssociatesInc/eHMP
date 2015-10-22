define([
    'backbone',
    'marionette',
    'underscore',
    'hbs!app/applets/addVitals/templates/addVitalsTemplate',
    'hbs!app/applets/addVitals/templates/visitRegionTemplate',
    'hbs!app/applets/addVitals/templates/footerTemplate',
    'app/applets/addVitals/dateTimeView',
    'app/applets/addVitals/vitalsCollectionView',
    'app/applets/addVitals/utils/modelUtils',
    'app/applets/addVitals/utils/dateTimeUtil',
    'app/applets/addVitals/utils/saveUtil',
    'app/applets/addVitals/utils/viewHelper'
], function(Backbone, Marionette, _, addVitalsTemplate, visitTemplate, footerTemplate, DateTimeView, VitalsCollectionView, modelUtils, dateUtil, SaveUtil, viewHelper) {
    'use strict';

    // Channel constants
    var ADD_VITALS_REQUEST_CHANNEL = 'addVitalsRequestChannel';
    var ADD_VITALS_MODAL = 'addVitalsModal';
    var VISIT = 'visit';
    var CHANGE_VISIT = 'changeVisit';
    var ADD_VITALS = 'addVitals';

    var SET_VISIT_SUCCES_ADD_VITALS = 'set-visit-success:addVitals';
    var SET_VISIT_CANCEL_ADD_VITALS = 'set-visit-cancel:addVitals';
    var viewInstance;
    var util = modelUtils;
    var helper = viewHelper;
    var saveUtil = SaveUtil;
    var gridView;
    var visitChannel = ADK.Messaging.getChannel(VISIT);
    var FooterView = Backbone.Marionette.ItemView.extend({
        template: footerTemplate,
        events: {
            "click #btn-add-vital-accept": function(e) {
                this.clearErrors(e);
                this.addVitals(e);
            },
            "click button[data-dismiss='modal']": "clearErrors",
            "click #visit-btn": 'selectVisit',

        },
        clearErrors: function() {
            util.errorView.clearErrors();
        },

        addVitals: function(evt) {
            evt.preventDefault();
            $('#btn-add-vital-accept').html("<i class='fa fa-spinner fa-spin'></i> <span> Saving...</span>");
            $('#btn-add-vital-accept').addClass('disabled').attr('disabled');
            saveUtil.save(util.getVitalsModel(), gridView);
        }
    });

    var VisitView = Backbone.Marionette.ItemView.extend({
        tagName: 'div',
        template: visitTemplate,
        initialize: function() {
            var visit = this.model.get('visit');
            if (visit) {
                var locationUid = visit.locationUid;
                if (locationUid) {
                    var locIEN = locationUid.split(':').pop();
                    util.getVitalsModel().setLocation(locIEN);
                }
            }
        },
    });

    function openVitalsAddModal() {
        var channel = ADK.Messaging.getChannel(ADD_VITALS_REQUEST_CHANNEL),
            deferredResponse = channel.request(ADD_VITALS_MODAL);
        deferredResponse.done(function(response) {
            var addVitalsApplet = response.view;
            addVitalsApplet.showModal();
        });
    }

    return Backbone.Marionette.LayoutView.extend({
        className: 'add-vitals-styles',
        template: addVitalsTemplate,
        events: {
            "click #add-vital-visit-btn": "selectVisit",
        },
        regions: {
            visitRegion: '#visit-region',
            dateTimeRegion: '#date-time-region',
            vitalsRegion: '#vitals-tbl-container',
            errorRegion: '#error-container'
        },


        initialize: function() {
            util.initVitalsModel();
            this.model = util.getVitalsModel();

            this.items = this.model.get('items');
            util.errorView = new ADK.Views.ServerSideError();

            var that = this;

            this.items.bind("change:error", function(model, attributes) {

                that.model.updateError(model.get('sname'), model.isError());
            });
            this.items.bind("change:min-reqs", function(model, attributes) {
                that.model.updateVitalMinReqs(model.get('sname'), model.hasMinReqs());
            });

            this.items.bind("change:qual-1-error", function(model, attributes) {
                that.model.updateError(model.get('sname') + '-qual-1', model.isQual1Error());
            });

            this.items.bind("change:qual-2-error", function(model, attributes) {
                that.model.updateError(model.get('sname') + '-qual-2', model.isQual2Error());
            });

            this.items.bind("change:qual-3-error", function(model, attributes) {
                that.model.updateError(model.get('sname') + '-qual-3', model.isQual3Error());
            });

            this.items.bind("change:qual-4-error", function(model, attributes) {
                that.model.updateError(model.get('sname') + '-qual-4', model.isQual4Error());
            });

            this.model.on('change:min-reqs', this.toggleSave, this);
        },

        onRender: function() {
            this.updateVisit();

            var dateTimeView = new DateTimeView({
                model: this.model
            });
            this.dateTimeView = dateTimeView;
            this.dateTimeRegion.show(dateTimeView);
            var vitalsView = new VitalsCollectionView({
                collection: this.items
            });
            this.vitalsView = vitalsView;
            this.vitalsRegion.show(vitalsView);
            this.errorRegion.show(util.errorView);
        },
        selectVisit: function() {
            viewInstance = this;
            visitChannel.command(CHANGE_VISIT, ADD_VITALS, {
                channel: ADD_VITALS_REQUEST_CHANNEL,
                command: ADD_VITALS_MODAL,
                callback: viewInstance.showModal
            });
            visitChannel.on(SET_VISIT_SUCCES_ADD_VITALS, function() {
                viewInstance.updateVisit();
            });
        },
        updateVisit: function() {
            var visitView = new VisitView({
                model: util.getVisitModel()
            });
            this.visitView = visitView;
            this.visitRegion.show(visitView);
        },
        toggleSave: function() {
            if (this.model.get('min-reqs')) {
                helper.enableItem($('#btn-add-vital-accept'), true);
            } else {
                helper.enableItem($('#btn-add-vital-accept'), false);
            }
        },

        showModal: function(event, GridView) {
            //event.preventDefault();
            var currentPatient = ADK.PatientRecordService.getCurrentPatient();
            gridView = GridView;
            var options = {
                'title': 'Add Vital Signs',
                'size': 'medium',
                'footerView': FooterView,
                'regionName': 'addVitalsDialog'
            };

            var modal = new ADK.UI.Modal({
                view: this,
                options: options
            });
            modal.show();
        }

    });

});
