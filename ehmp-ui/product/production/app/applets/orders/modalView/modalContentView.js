define([
    'backbone',
    'marionette',
    'underscore',
    'hbs!app/applets/orders/modalView/defaultTemplate',
    'hbs!app/applets/orders/modalView/consultTemplate',
    'hbs!app/applets/orders/modalView/radiologyTemplate',
    'hbs!app/applets/orders/modalView/laboratoryTemplate',
    'hbs!app/applets/orders/modalView/medicationTemplate',
    'hbs!app/applets/orders/modalView/allergyTemplate',
    'hbs!app/applets/orders/modalView/dieteticTemplate',
    'hbs!app/applets/orders/modalView/nursingTemplate',
    'hbs!app/applets/orders/modalView/infusionTemplate',
    'app/applets/orders/util'
], function(Backbone, Marionette, _, DefaultTemplate, ConsultTemplate, RadTemplate, LabTemplate, MedTemplate, AllergyTemplate, DietTemplate, NursingTemplate, InfusionTemplate, Util) {
    'use strict';

    //Modal Content Item View
    return Backbone.Marionette.ItemView.extend({

        modelEvents: {
            "change": "render"
        },

        //The template changes based on the Order Type ('kind')
        getTemplate: function() {
            switch (this.model.get('kind')) {
                case 'Consult':
                    return ConsultTemplate;
                case 'Radiology':
                    return RadTemplate;
                case 'Laboratory':
                    return LabTemplate;
                    // Added by PG - US 2756
                case 'Medication, Infusion':
                    return InfusionTemplate;
                    // End by PG - US 2756
                case 'Medication, Outpatient':
                case 'Medication, Inpatient':
                case 'Medication, Non-VA':
                    return MedTemplate;
                case 'Allergy':
                case 'Allergy/Adverse Reaction':
                    return AllergyTemplate;
                case 'Dietetics':
                case 'Dietetics Order':
                    return DietTemplate;
                case 'Nursing Order':
                    return NursingTemplate;
                default:
                    return DefaultTemplate;
            }
        },

        updateAdditionalModalData: function() {

            if (this.model.get('kind') == 'Laboratory') {
                // Get the new Params:
                var ssList = Util.parseLabSampleString(this.model.get('summary'));
                // Add the params.
                this.model.set('collectionType', ssList[0]);
                this.model.set('collectionSample', ssList[1]);
                this.model.set('collectionSpecimen', ssList[2]);

                // Added by PG for DE421.
                this.model.set('labNumber', Util.parseForOrderNumber(this.model.get('summary'), true) );
            }
            this.model.set('orderNumber', this.model.get('localId') );

            // using a JSON object -- un-necessary huge object loads in ui.
            var signatureDetails = Util.parseForSignature(this.model.get('clinicians'));
            this.model.set('signatureByName', signatureDetails.byName);
            this.model.set('signatureOnDate', signatureDetails.onDate);

        },

        onBeforeRender: function() {
            this.updateAdditionalModalData();
        }

    });

});
