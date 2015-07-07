define([
    "backbone",
    "marionette",
    "underscore"
], function(Backbone, Marionette, _) {

    var AppletConfig = {
        appletId: "progress_notes",
        resource: "patient-record-document",
        viewModel: {
            parse: function(response) {

                // Check 'codes' for LOINC codes and Standard test name.
                var lCodes = [];
                var testNames = [];
                if (response.codes) {
                    response.codes.forEach(function(code) {
                        if (code.system.indexOf("loinc") != -1) {
                            lCodes.push(" " + code.code);
                            testNames.push(" " + code.display);
                        }
                    });
                }
                response.loinc = lCodes;
                response.stdTestNames = testNames;
                return response;
            }
        }
    };

    return AppletConfig;
});
