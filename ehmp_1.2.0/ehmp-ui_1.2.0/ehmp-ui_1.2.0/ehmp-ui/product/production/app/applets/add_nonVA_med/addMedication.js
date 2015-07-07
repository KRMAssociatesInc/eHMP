define([
    "backbone",
    "marionette",
    "underscore",
    "moment",
    "hbs!app/applets/add_nonVA_med/addMedicationTemplate",
    'hbs!app/applets/add_nonVA_med/visitRegionTemplate',
    "app/applets/add_nonVA_med/opData/opDataUtil",
    "app/applets/add_nonVA_med/utils/util",
    "app/applets/add_nonVA_med/opData/dosageView",
    "app/applets/add_nonVA_med/opData/routeView",
    "app/applets/add_nonVA_med/opData/scheduleView"
], function(Backbone, Marionette, _, Moment, addMedicationTemplate, visitTemplate, opDataUtil, util, DosageView, RouteView, ScheduleView) {
    'use strict';

    // Channel constants
    var CHANGE_VISIT = 'changeVisit';
    var ADD_NON_VA_MED = 'add-nonVA-med';
    var SET_VISIT_SUCCES_ADD_NON_VA_MED = 'set-visit-success:add-nonVA-med';
    var SET_VISIT_CANCEL_ADD_NON_VA_MED = 'set-visit-cancel:add-nonVA-med';
    var ADD_NON_VA_MED_MODAL = 'addNonVaMedModal';
    var ADD_NON_VA_MED_REQUEST_CHANNEL = 'medicationChannel';

    var viewInstance;
    var siteCode, pidSiteCode, isNew;
    var visitChannel = ADK.Messaging.getChannel('visit');
    var VisitView = Backbone.Marionette.ItemView.extend({
        tagName: 'div',
        template: visitTemplate,
    });


    return Backbone.Marionette.LayoutView.extend({
        className: 'add-medication-styles',
        template: addMedicationTemplate,

        /*
         ** @med required - backbone model of a medication including 'IEN' and 'name' attributes.
         ** [@isEdit] - set to true if editting a medication. Defaults to false.
         */
        constructor: function(med, isEdit) {
            // Verify med
            if (!med || typeof med.get != 'function' || !med.get('IEN') || !med.get('name')) {
                throw new Error('addMedication Constructor Argument Error:\nYou must pass in a backbone model of the medication with "IEN" and "name" attributes.');
            }
            this.isEdit = isEdit || false;
            isNew = !isEdit;
            util.setIsEdit(this.isEdit);
            this.setMed(med);
            opDataUtil.setMed(this.med);
            Backbone.Marionette.LayoutView.prototype.constructor.apply(this, arguments);
        },

        regions: {
            visitRegion: '#visit-region',
            dosageInput: '#dosages',
            routeInput: '#routes',
            scheduleInput: '#schedules',
            previewOrder: '#previewOrder',
            errorContainer: '#error-container'
        },
        enableLoadingIndicator: function(isEnabled) {
            if (isEnabled) {
                this.$el.find("#edit-meds-loading-indicator").show();
            } else {
                this.$el.find("#edit-meds-loading-indicator").hide();
                this.$el.find('#edit-meds-loading-indicator').focus();
            }
        },

        initialize: function() {
            opDataUtil.errorView = new ADK.Views.ServerSideError();
            siteCode = ADK.UserService.getUserSession().get('site');
            pidSiteCode = this.med.get('pid') ? this.med.get('pid').split(';')[0] : '';
            if (!this.isEdit) {
                opDataUtil.fetchOpData();
                var NonVAModel = util.getModel();
                opDataUtil.model = new NonVAModel();
            } else {
                opDataUtil.resetFetch();
                opDataUtil.fetchScheduleOpData();
            }
        },

        update: function() {
            util.update();
            this.buildPreview();
        },


        updateData: function(updateModel) {
            var medName = updateModel.get('orderable').values.external,
                ien = updateModel.get('orderable').values.internal;
            this.med.set({
                name: medName,
                IEN: ien,
                savedMed: updateModel
            });

            opDataUtil.setMed(this.med);
            opDataUtil.fetchDefaultsOpData();
            var ready;
            var that = this;
            ready = setInterval(function() {
                if (opDataUtil.fetchDone()) {
                    clearInterval(ready);
                    if (!that.isDestroyed) {
                        that.loadData();
                    }
                }
            }, 200);
        },

        loadData: function() {
            var NonVAModel = util.getModel();
            opDataUtil.model = new NonVAModel();
            var visitModel = util.getVisitModel(),
                visitView = new VisitView({
                    model: visitModel
                }),
                dpicker;

            this.dosageInput.show(new DosageView());
            this.routeInput.show(new RouteView());
            this.scheduleInput.show(new ScheduleView());
            this.errorContainer.show(opDataUtil.errorView);
            dpicker = this.$('#startDate');
            ADK.utils.dateUtils.datepicker(dpicker, {
                'endDate': new Moment().format(ADK.utils.dateUtils.defaultOptions().placeholder)
            });
            dpicker.parent().find('.glyphicon-calendar').on('click', function() {
                dpicker.datepicker('show');
            });

            opDataUtil.updateInput(this.$el);
            util.update();
            //only enable if eligible for edit
            if (ADK.UserService.hasPermission('edit-patient-med') && pidSiteCode === siteCode) {
                this.$el.find('#medication-form :input[type=text]').removeAttr('readonly');
                this.$el.find('#medication-form :input[type=radio]').removeAttr('disabled');
                this.$el.find('#medication-form :input[type=checkbox]').removeAttr('disabled');
                this.$el.find('textarea').removeAttr('readonly');
                this.$el.find('#medication-form :button').removeAttr('disabled');
                this.visitRegion.show(visitView);
            }
            this.enableLoadingIndicator(false);
        },

        selectVisit: function(event) {
            viewInstance = this;
            visitChannel.command(CHANGE_VISIT, ADD_NON_VA_MED, {
                channel: ADD_NON_VA_MED_REQUEST_CHANNEL,
                command: ADD_NON_VA_MED_MODAL,
                callback: showAddNonVaMed
            });
            visitChannel.once(SET_VISIT_SUCCES_ADD_NON_VA_MED, function() {
                viewInstance.updateVisit();
            });
        },
        updateVisit: function() {
            var visitModel = util.getVisitModel(),
                visitView = new VisitView({
                    model: visitModel
                });

            this.visitRegion.show(visitView);
        },

        onRender: function() {
            var that = this,
                dpicker;

            this.updateVisit(this);

            if (!this.isEdit) {
                this.enableLoadingIndicator(false);
                //this.visitRegion.show(visitView);
                this.dosageInput.show(new DosageView());
                this.routeInput.show(new RouteView());
                this.scheduleInput.show(new ScheduleView());
                this.errorContainer.show(opDataUtil.errorView);

                dpicker = this.$('#startDate');
                ADK.utils.dateUtils.datepicker(dpicker, {
                    'endDate': new Moment().format(ADK.utils.dateUtils.defaultOptions().placeholder)
                });
                dpicker.parent().find('.glyphicon-calendar').on('click', function() {
                    dpicker.datepicker('show');
                });

                opDataUtil.updateInput(this.$el);
            } else {
                this.enableLoadingIndicator(true);
                this.$el.find('#medication-form :input[type=text]').attr('readonly', 'readonly');
                this.$el.find('#medication-form :input[type=radio]').attr('disabled', 'disabled');
                this.$el.find('#medication-form :input[type=checkbox]').attr('disabled', 'disabled');
                this.$el.find('textarea').attr('readonly', 'readonly');
                this.$el.find('#medication-form :button').attr('disabled', 'disabled');
            }
        },

        events: {
            'change #medication-form': 'update',
            'click #add-non-va-med-btn': 'selectVisit'
        },

        buildPreview: function() {
            util.buildPreview();

        },
        updateView: function() {
            var channel = ADK.Messaging.getChannel(ADD_NON_VA_MED_REQUEST_CHANNEL);
            var deferredResponse = channel.request(ADD_NON_VA_MED_MODAL);
            deferredResponse.done(function(response) {
                var addNonVaMedApplet = response.view;
                addNonVaMedApplet.handleChangeVisit(viewInstance);
            });

        },
        setMed: function(med) {
            this.med = med;
        },
        templateHelpers: {
            isLocal: function() {
                if (ADK.UserService.hasPermission('edit-patient-med') && pidSiteCode === siteCode) {
                    return true;
                } else if (isNew === true) {
                    return true;
                } else {
                    return false;
                }
            }
        }
    });
    /*
     ** @VisitApplet Save or Cancel update addMedication view.
     */
    function showAddNonVaMed() {
        if (viewInstance) {
            viewInstance.updateView();
        }
    }

});
