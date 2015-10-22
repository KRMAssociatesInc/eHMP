define([
    "backbone",
    "marionette",
    "underscore",
    "moment"
], function(Backbone, Marionette, _, Moment) {

    var callbacks = {
        error: function(model, resp) {
            //add error banner to modal
            console.log('error');
            console.log(resp);
            //ADK.UI.Modal.hide();
        },
        success: function(model, resp) {
            //close modal...we are done with it
            console.log('success');
            console.log(resp);
            //ADK.UI.Modal.hide();
            //setTimeout(function() {
                //gridView.refresh({});
                //ADK.Messaging.getChannel('vitals').request('refreshGridView');
            //}, 2000);
        }
    };

    var getSaveModel = function(labsModel) {
        var id = '';
        var patient = ADK.PatientRecordService.getCurrentPatient();

        if (patient.get("icn")) {
            id = patient.get("icn");
        } else if (patient.get("pid")) {
            id = patient.get("pid");
        } else {
            id = patient.get("id");
        }

        var url = ADK.ResourceService.buildUrl('orders-create', {
            pid: id
            //accessCode: 'mx1234',
            //verifyCode: 'mx1234!!',
            //site: '9E7A'
        });

        var dfn = ADK.PatientRecordService.getCurrentPatient().get('localId');

        var inputList = [
            { 'inputKey': '4', 'inputValue': $("#lab-test-form-itemid").val() }, //lab test
            { 'inputKey': '126', 'inputValue': $('#collection-sample-select').val() }, //collection sample??
            { 'inputKey': '127', 'inputValue': $('#specimen-select').val() }, //specimen
            { 'inputKey': '180', 'inputValue': $('#urgency-select').val() }, //urgency
            { 'inputKey': '28', 'inputValue': '"' + $('#collection-type-select').val() + '"' }, //collection type
            { 'inputKey': '6', 'inputValue': 'TODAY' }, //collection date time
            { 'inputKey': '29', 'inputValue': $('#frequency-select').val() } //frequency
        ];

        var postBody = {
            "dfn": dfn,
            "provider": "10000000231",
            "location": "285",
            "orderDialog": "LR OTHER LAB TESTS",
            "displayGroup": "6",
            "quickOrderDialog": "2",
            "inputList": inputList,
            "localId": "12519",
            "uid": "urn:va:order:9E7A:100615:12519",
            "kind": "Laboratory"
        };

        var save = new Backbone.Model(postBody);
        save.urlRoot = url;

        console.log(JSON.stringify(save));
        return save;
    };

    var saveLabOrder = function(labsModel) {
        var saveModel = getSaveModel(labsModel);
        saveModel.save(null,callbacks);
        ADK.UI.Modal.hide();
    };


    var labOrdersUtil = {
        enableLoadingIndicator: function(isEnabled) {
            if (isEnabled) {
                $("#labTestsLoadingIndicator").show();
            } else {
                $("#labTestsLoadingIndicator").hide();
                $('#labTestSearchInput').focus();
            }
        },

        /*
         * This function monitors the time between keystrokes of a target in
         * the provided <event>. If the time between the keystrokes is more
         * than the provided <timeThreshold>, then the <callback> function is
         * called. Additionally, a <characterThreshold> can be provided where
         * the user must type at least the <characterThreshold> amount of
         * characters before the <callback> function is called.
         *
         * @param event: The event that triggered the keystroke monitor
         * @param eventType: A string containing the event type. Used so that
         *                   if the event does not match the event type then
         *                   the function is returned
         * @param characterThreshold: An integer used to determine one minus the
         *                            minimum how many characters a user must
         *                            type to trigger the callback function
         * @param timeThreshold: Milliseconds as an integer used to set the
         *                       timeout between keystrokes
         * @param callback: The callback function to be executed once the
                            once the timeout has occurred
         */
        performActionWhileTyping: function(event, eventType, characterThreshold, timeThreshold, callback) {
            if (event.type !== eventType) {
                return;
            }

            if ($(event.target).val().length <= characterThreshold && typeof timeoutHandle !== 'undefined') {
                clearTimeout(timeoutHandle);
            } else if ($(event.target).val().length > characterThreshold) {
                if (typeof timeoutHandle === 'undefined') {
                    timeoutHandle = _.delay(callback, timeThreshold, event);
                } else {
                    clearTimeout(timeoutHandle);
                    timeoutHandle = _.delay(callback, timeThreshold, event);
                }
            }
        },
        save: function(labsModel) {
            saveLabOrder(labsModel);
        }
    };
    return labOrdersUtil;
});