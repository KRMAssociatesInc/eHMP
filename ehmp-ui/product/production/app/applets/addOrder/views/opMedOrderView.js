define([
    'jquery',
    'jquery.inputmask',
    'backbone',
    'marionette',
    'underscore',
    'hbs!app/applets/addOrder/templates/opMedOrderTemplate',
    'app/applets/addOrder/helpers/opDataUtil',
    'app/applets/addOrder/helpers/opMedModelUtil',
    'app/applets/addOrder/views/dosageView',
    'app/applets/addOrder/views/routeView',
    'app/applets/addOrder/views/scheduleView'
], function($, InputMask, Backbone, Marionette, _, opMedOrderTemplate, opDataUtil, util, DosageView, RouteView, ScheduleView) {
    'use strict';

    return Backbone.Marionette.LayoutView.extend({
        className: 'add-medication-styles',
        template: opMedOrderTemplate,

        /*
         ** @med required - backbone model of a medication including 'IEN' and 'name' attributes.
         */
        constructor: function(med) {
            // Verify med
            if (!med || typeof med.get != 'function' || !med.get('IEN') || !med.get('name')) {
                throw new Error('addMedication Constructor Argument Error:\nYou must pass in a backbone model of the medication with "IEN" and "name" attributes.');
            }
            this.setMed(med);
            opDataUtil.setMed(this.med);
            Backbone.Marionette.LayoutView.prototype.constructor.apply(this, arguments);

        },

        regions: {
            dosageInput: '#dosages',
            routeInput: '#routes',
            scheduleInput: '#schedules',
            previewOrder: '#previewOrder',
        },

        initialize: function() {
            opDataUtil.fetchOpData();
            var OpMedModel = util.getModel();
            JSON.stringify(OpMedModel);
            opDataUtil.model = new OpMedModel();


        },
        update: function() {
            util.update();
            this.buildPreview();
        },
        onShow: function() {

            $('#supply').inputmask('Regex', {
                regex: '^90$|^[1-8]\\d$|^\\d$',
                rightAlign: true
            });

            $('#quantity').inputmask({
                mask: ['9{0,9}.9{0,2}', '9{0,9}'],
                greedy: false,
                rightAlign: true
            });

            $('#refills').inputmask('Regex', {
                regex: '^0$|^\\d$|^10$|^11$',
                rightAlign: true
            });

            $('#comments').inputmask('Regex', {
                regex: '^.{0,150}$'
            });

            $('#previewOrder').inputmask('Regex', {
                regex: '^.{0,240}$'
            });

        },
        onRender: function() {
            this.dosageInput.show(new DosageView());
            this.routeInput.show(new RouteView());
            this.scheduleInput.show(new ScheduleView());
            $('#medicationName').text(this.med.get('name'));
            $('#btn-add-order-accept').removeAttr('disabled');
        },

        events: {
            'change #medication-form': 'update',
            'click #btn-add-order-accept': 'addOrder',
            'click .updnbtn' : 'changeValue'
        },

        changeValue: function(event) {
            var btnClicked = event.currentTarget.id;
            var oldValue;
            var newValue;
            switch(btnClicked) {
                case 'supply-up-btn':
                    oldValue = parseInt(this.$('#supply').val());
                    newValue = oldValue + 1;
                    //check if newValue is above allowed limit
                    this.$('#supply').val(newValue);
                    break;
                case 'supply-dn-btn':
                    oldValue = parseInt(this.$('#supply').val());
                    newValue = oldValue - 1;
                    if (oldValue > 0) {
                        this.$('#supply').val(newValue);
                    }
                    break;
                case 'quantity-up-btn':
                    oldValue = parseInt(this.$('#quantity').val());
                    newValue = oldValue + 1;
                    //check if newValue is above allowed limit
                    this.$('#quantity').val(newValue);
                    break;
                case 'quantity-dn-btn':
                    oldValue = parseInt(this.$('#quantity').val());
                    newValue = oldValue - 1;
                    if (oldValue > 0) {
                        this.$('#quantity').val(newValue);
                    }
                    break;
                case 'refills-up-btn':
                    oldValue = parseInt(this.$('#refills').val());
                    newValue = oldValue + 1;
                    //check if newValue is above allowed limit
                    this.$('#refills').val(newValue);
                    break;
                case 'refills-dn-btn':
                    oldValue = parseInt(this.$('#refills').val());
                    newValue = oldValue - 1;
                    if (oldValue > 0) {
                        this.$('#refills').val(newValue);
                    }
                    break;
            }
            this.update();
        },

        addOrder: function(evt) {
            evt.preventDefault();

            this.validateInputs();

            modelUtils.saveMed();
        },
        validateInputs: function() {
            console.log('start input validations');

        },
        buildPreview: function() {
            util.buildPreview();

        },

        setMed: function(med) {
            this.med = med;
        }
    });

});
