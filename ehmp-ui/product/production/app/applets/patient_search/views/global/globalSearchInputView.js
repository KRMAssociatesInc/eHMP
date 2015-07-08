define([
    "jquery",
    "jquery.inputmask",
    "backbone",
    "marionette",
    "app/applets/patient_search/utils/globalSearchParametersValidator",
    "hbs!app/applets/patient_search/templates/global/globalSearchInputTemplate"
], function($, InputMask, Backbone, Marionette, searchParamsValidator, globalSearchInputTemplate) {

    var ENTER_KEY = 13; // find a home for these
    var SPACE_KEY = 32;

    var GlobalSearchInputView = Backbone.Marionette.ItemView.extend({
        template: globalSearchInputTemplate,
        events: {
            'keyup #globalSearchInputGroup': 'updateSearchInputView', //try keydown?
            'keydown #globalSearchInputGroup': 'updateGlobalSearchParameters',
            'click #globalSearchButton': 'updateGlobalSearchParameters',
            'keydown #globalSearchButton': 'updateGlobalSearchParameters'
        },
        onRender: function() {
            this.$el.find(".input-group").focusin(function() {
                $(this).addClass("hasFocus");
            }).focusout(function() {
                $(this).removeClass("hasFocus");
            });

            this.applyInputMasking();
            this.updateSearchInputView();
            this.$el.find('#mySite a').attr('tabindex', '0');
            console.log('onRender:Global: Begin');
            console.log( (this.$el.find("#mySite a")).attr("tabindex", 0) );
            console.log('onRender:Global: End');
        },
        applyInputMasking: function() {
            // Backslash is the escape character. Javascript weirdness: you have to escape square brackets with TWO backslashes
            this.$el.find('#globalSearchLastName').inputmask("Regex", {
                regex: "[^^\"\\\\`~!@#$%&*()_+=|}{/?:;.<>0-9\\[\\]]+"
            });
            this.$el.find('#globalSearchFirstName').inputmask("Regex", {
                regex: "[^^\"\\\\`~!@#$%&*()_+=|}{/?:;.<>0-9\\[\\]]+"
            });
            this.$el.find('#globalSearchDob').inputmask("m/d/y");
            this.$el.find('#globalSearchSsn').inputmask("999[-]99[-]9999");

        },
        updateSearchInputView: function() {
            this.updateRequiredSearchFieldMarkers();
            this.updateGlobalSearchButtonStatus();
        },
        updateRequiredSearchFieldMarkers: function() {

            var lname = this.$el.find('#globalSearchLastName').val();
            var fname = this.$el.find('#globalSearchFirstName').val();
            var dob = this.$el.find('#globalSearchDob').val();
            var ssn = this.$el.find('#globalSearchSsn').val();

            var fieldsToMarkArray = [];

            if (lname !== "") {
                if ((fname === "") && (dob === "") && (ssn === "")) {
                    fieldsToMarkArray.push(this.$el.find('#globalSearchFirstName'));
                    fieldsToMarkArray.push(this.$el.find('#globalSearchDob'));
                    fieldsToMarkArray.push(this.$el.find('#globalSearchSsn'));
                } else {

                    var dobLength = dob.replace(/\D/g, '').length;
                    var ssnLength = ssn.replace(/\D/g, '').length;

                    if (dobLength !== 8 && dobLength !== 0) {
                        fieldsToMarkArray.push(this.$el.find('#globalSearchDob'));
                    }
                    if (ssnLength !== 9 && ssnLength !== 0) {
                        fieldsToMarkArray.push(this.$el.find('#globalSearchSsn'));
                    }
                }

                if (fieldsToMarkArray.length > 0) {
                    this.markInvalidInputFields(fieldsToMarkArray);
                } else {
                    this.markAllInputFieldsValid();
                }
            } else {
                this.markInvalidInputFields([this.$el.find('#globalSearchLastName')]);
            }
        },
        updateGlobalSearchButtonStatus: function() {
            var params = this.retrieveGlobalSearchParameters();

            var validatorResponseCode = searchParamsValidator.validateGlobalSearchParameterConfiguration(params);

            if ((validatorResponseCode === "lastNameRequiredFailure") || (validatorResponseCode === "twoFieldsRequiredFailure")) {
                this.disableGlobalSearchButton();
            } else {
                this.enableGlobalSearchButton();
            }
        },
        disableGlobalSearchButton: function() {
            this.$el.find('#globalSearchButton').addClass('disabled');
            this.$el.find('#globalSearchButton').attr('disabled', 'disabled');
        },
        enableGlobalSearchButton: function() {
            this.$el.find('#globalSearchButton').removeClass('disabled');
            this.$el.find('#globalSearchButton').removeAttr('disabled');
        },
        updateGlobalSearchParameters: function(event) {
            if ((event.keyCode !== undefined) && (event.keyCode != ENTER_KEY && event.keyCode != SPACE_KEY)) {
                return;
            }
            if (this.$el.find('#globalSearchButton').attr('disabled')) {
                return;
            }

            // this.triggerNewGlobalSearchEvent();

            var params = this.retrieveGlobalSearchParameters();

            var configValidatorResponseCode = searchParamsValidator.validateGlobalSearchParameterConfiguration(params);

            if (configValidatorResponseCode === "lastNameRequiredFailure") {
                this.triggerErrorMessage("global", "Error: The patient's last name is a required field.");
                this.markInvalidInputFields([this.$el.find('#globalSearchLastName')]);
                return;
            } else if (configValidatorResponseCode === "twoFieldsRequiredFailure") {
                this.triggerErrorMessage("global", "Error: Enter the patient's last name and at least one other field to display results.");
                this.markInvalidInputFields([this.$el.find('#globalSearchFirstName'), this.$el.find('#globalSearchDob'), this.$el.find('#globalSearchSsn')]);
                return;
            }

            var formattingValidatorResponseCode = searchParamsValidator.validateGlobalSearchParameterFormatting(params);

            if (formattingValidatorResponseCode === "nameFormatFailure") {
                this.triggerErrorMessage("global", "Error: Names may not contain numbers or special characters other than commas, apostrophes, or hyphens.");
                this.markInvalidInputFields([this.$el.find('#globalSearchLastName'), this.$el.find('#globalSearchFirstName')]);
                return;
            } else if (formattingValidatorResponseCode === "dobFormatFailure") {
                this.triggerErrorMessage("global", "Error: DOB must be entered in MM/DD/YYYY format.");
                this.markInvalidInputFields([this.$el.find('#globalSearchDob')]);
                return;
            } else if (formattingValidatorResponseCode === "ssnFormatFailure") {
                this.triggerErrorMessage("global", "Error: SSN must match the format: 123-45-6789 or 123456789.");
                this.markInvalidInputFields([this.$el.find('#globalSearchSsn')]);
                return;
            }

            this.model.set({
                'globalSearchParameters': params
            });
        },
        retrieveGlobalSearchParameters: function() {
            var params = {
                'name-last': this.$el.find('#globalSearchLastName').val().trim().toUpperCase(),
                'name-first': this.$el.find('#globalSearchFirstName').val().trim().toUpperCase(),
                dob: this.$el.find('#globalSearchDob').val(),
                ssn: this.$el.find('#globalSearchSsn').val()
            };
            return params;
        },
        validateGlobalSearchParameters: function(params) {
            this.markAllInputFieldsValid();

            if (searchParamsValidator.validateGlobalSearchParameterConfiguration(params)) {
                return true;
            } else {
                return false;
            }
        },
        triggerErrorMessage: function(searchType, message) {
            this.model.trigger("errorMessage", [searchType, message]);
            // FLAG: [isGlobalSearchErrorMessageDisplayed] is defined on globalModel in inputView.js
            this.model.set('isGlobalSearchErrorMessageDisplayed', true);
        },
        triggerNewGlobalSearchEvent: function() {
            this.model.trigger('newGlobalSearch');
        },
        markAllInputFieldsValid: function() {
            this.$el.find('#globalSearchLastName').removeClass('alert-danger aria-invalid');
            this.$el.find('#globalSearchFirstName').removeClass('alert-danger aria-invalid');
            this.$el.find('#globalSearchDob').removeClass('alert-danger aria-invalid');
            this.$el.find('#globalSearchSsn').removeClass('alert-danger aria-invalid');
        },
        markInvalidInputFields: function(fieldsToMarkArray) {
            this.markAllInputFieldsValid();
            fieldsToMarkArray.forEach(function(field) {
                field.addClass('alert-danger aria-invalid');
            });
        }
    });

    return GlobalSearchInputView;
});
