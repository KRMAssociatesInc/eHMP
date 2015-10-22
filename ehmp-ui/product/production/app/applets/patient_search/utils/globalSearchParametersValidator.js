define([
    "backbone",
    "marionette",
    "underscore"
], function(Backbone, Marionette, _) {
    var globalSearchParametersValidator = {

        validateGlobalSearchParameterConfiguration: function(data) {
            if (data['name.last'].trim() === "") {
                return "lastNameRequiredFailure";
            } else if ((data['name.first'].trim() === "") && (data['date.birth'] === "") && (data.ssn === "")) {
                return "twoFieldsRequiredFailure";
            } else {
                return "success";
            }
        },

        validateGlobalSearchParameterFormatting: function(data) {
            var namePattern = /^[- ,A-Z']+$/;
            var ssnPattern = /^(\d{3})-?(\d{2})-?(\d{4})$/;
            var dobPattern = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/;

            if (((data['name.last'].trim() !== "") && (data['name.last'].match(namePattern) === null)) || ((data['name.first'].trim() !== "") && (data['name.first'].match(namePattern) === null))) {
                return "nameFormatFailure";
            } else if ((data['date.birth'].trim() !== "") && (data['date.birth'].match(dobPattern) === null)) {
                return "dobFormatFailure";
            } else if ((data.ssn.trim() !== "") && (data.ssn.match(ssnPattern) === null)) {
                return "ssnFormatFailure";
            } else {
                return "success";
            }
        }
    };
    return globalSearchParametersValidator;
});
