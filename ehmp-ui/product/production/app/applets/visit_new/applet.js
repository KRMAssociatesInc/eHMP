define([
    'backbone',
    'marionette',
    'jquery',
    'async',
    'app/applets/visit_new/writeback/addselectVisit',
    './collectionHandler'
], function(Backbone, Marionette, $, Async, addselectVisit, collectionHandler) {
    // Channel constants
    var OPEN_VISIT_SELECTOR = 'openVisitSelector';
    var VISIT = 'visit_new';
    var visitChannel = ADK.Messaging.getChannel(VISIT),
        currentAppletKey;
    // *********************************************** MODEL ****************************************************
    var FormModel = Backbone.Model.extend({
        defaults: {
            encounterProvider: 'Not Specified',
            encounterLocation: 'Not Specified',
            visit: {}
        }
    });
    visitChannel.comply(OPEN_VISIT_SELECTOR, handleOpenVisit);
    // *********************************************** END OF MODEL *********************************************

    // function isVisitSet() {
    //     var currentPatient = ADK.PatientRecordService.getCurrentPatient();
    //     if (!currentPatient.get(VISIT)) return false;
    //     return true;
    // }

    function createForm() {
        // *********************************************** MODEL AND WORKFLOW INSTANCE ******************************
        var formModel = new FormModel();
        var workflowOptions = {
            size: "large",
            title: "Provider & Location for Current Activities",
            showProgress: false,
            keyboard: true,
            steps: [{
                view: addselectVisit,
                viewModel: formModel
            }]
        };
        var workflow = new ADK.UI.Workflow(workflowOptions);
        workflow.show();
        //************************************************ END MODEL AND WORKFLOW INSTANCE
    }

    function handleOpenVisit(appletKey, options) {
        createForm();

    }

    var applet = {
        id: "visit_new"
    };

    return applet;
});