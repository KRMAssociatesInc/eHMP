define([
    'underscore',
    'main/ADK',
    'backbone',
    'marionette',
    'hbs!main/components/patient/detail/quickview/patientAddressTableTemplate',
    'hbs!main/components/patient/detail/quickview/patientAddressRowTemplate',
    'hbs!main/components/patient/detail/quickview/patientPhoneTableTemplate',
    'hbs!main/components/patient/detail/quickview/patientPhoneRowTemplate',
    'hbs!main/components/patient/detail/quickview/patientEmailTableTemplate',
    'hbs!main/components/patient/detail/quickview/patientEmailRowTemplate',
    'hbs!main/components/patient/detail/quickview/emContactTableTemplate',
    'hbs!main/components/patient/detail/quickview/nokContactTableTemplate',
    'hbs!main/components/patient/detail/quickview/emContactRowTemplate',
    'hbs!main/components/patient/detail/quickview/nokContactRowTemplate',
], function(_, ADK, Backbone, Marionette, patientAddressTable, patientAddressRow, patientPhoneTable, patientPhoneRow, patientEmailTable, patientEmailRow, emContactTable, nokContactTable, emContactRow, nokContactRow) {

    var PatientAddressQV = Marionette.CompositeView.extend({
        template: patientAddressTable,
        childView: Backbone.Marionette.ItemView.extend ({
            template: patientAddressRow,
            tagName: 'tr'
        }),
        childViewContainer: "#pt-address-row-container",
        templateHelpers: function() {
            return { items: this.collection.toJSON() };
        },
         onRender: function() {
            this.$('.demographic-data').each(function(i) {
                if ($(this).data('diff')){
                    $(this).addClass('demographic-group-diff-text');
                } else {
                    $(this).removeClass('demographic-group-diff-text');
                }
            });
        },
    });

    var PatientPhoneQV = Marionette.CompositeView.extend({
        template: patientPhoneTable,
        childView: Backbone.Marionette.ItemView.extend ({
            template: patientPhoneRow,
            tagName: 'tr'
        }),
        childViewContainer: "#pt-phone-row-container",
        templateHelpers: function() {
            return { items: this.collection.toJSON() };
        },
         onRender: function() {
            this.$('.demographic-data').each(function(i) {
                if ($(this).data('diff')){
                    $(this).addClass('demographic-group-diff-text');
                } else {
                    $(this).removeClass('demographic-group-diff-text');
                }
            });
        },
    });
    var PatientEmailQV = Marionette.CompositeView.extend({
        template: patientEmailTable,
        childView: Backbone.Marionette.ItemView.extend ({
            template: patientEmailRow,
            tagName: 'tr'
        }),
        childViewContainer: "#pt-email-row-container",
        templateHelpers: function() {
            return { items: this.collection.toJSON() };
        },
         onRender: function() {
            this.$('.demographic-data').each(function(i) {
                if ($(this).data('diff')){
                    $(this).addClass('demographic-group-diff-text');
                } else {
                    $(this).removeClass('demographic-group-diff-text');
                }
            });
        },
    });
    var EmContactQV = Marionette.CompositeView.extend({
        template: emContactTable,
        childView: Backbone.Marionette.ItemView.extend ({
            template: emContactRow,
            tagName: 'tr'
        }),
        childViewContainer: "#em-contact-row-container",
        templateHelpers: function() {
            return { items: this.collection.toJSON() };
        },
         onRender: function() {
            this.$('.demographic-data').each(function(i) {
                if ($(this).data('diff')){
                    $(this).addClass('demographic-group-diff-text');
                } else {
                    $(this).removeClass('demographic-group-diff-text');
                }
            });
        },
    });
    var NokContactQV = Marionette.CompositeView.extend({
        template: nokContactTable,
        childView: Backbone.Marionette.ItemView.extend ({
            template: nokContactRow,
            tagName: 'tr'
        }),
        childViewContainer: "#nok-contact-row-container",
        templateHelpers: function() {
            return { items: this.collection.toJSON() };
        },
         onRender: function() {
            this.$('.demographic-data').each(function(i) {
                if ($(this).data('diff')){
                    $(this).addClass('demographic-group-diff-text');
                } else {
                    $(this).removeClass('demographic-group-diff-text');
                }
            });
        },
    });


    var demoQV = {
        ptAddressQV: PatientAddressQV,
        ptPhoneQV: PatientPhoneQV,
        ptEmailQV: PatientEmailQV,
        emContactQV: EmContactQV,
        nokContactQV: NokContactQV,
    };
    return demoQV;

});
