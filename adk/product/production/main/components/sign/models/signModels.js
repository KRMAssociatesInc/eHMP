define([
    "backbone"
], function(Backbone) {
    //Comment orders or notes in order to open the sign form
    var ordersVPR = [
    // {
    //         "content": "11-DEOXYCORTISOL BLOOD   SERUM SP *UNSIGNED*\r\n",
    //         "entered": "20150721114900",
    //         "kind": "Laboratory",
    //         "lastUpdateTime": "20150721154959",
    //         "localId": "38747",
    //         "pid": "9E7A;8",
    //         "providerDisplayName": "Ehmp,Uatfour",
    //         "providerName": "EHMP,UATFOUR",
    //         "stampTime": "20150721154958",
    //         "statusName": "UNRELEASED",
    //         "summary": "DEMO 11-DEOXYCORTISOL BLOOD   SERUM SP *UNSIGNED*\r\n",
    //         "uid": "urn:va:order:9E7A:8:38747",
    //         "uidHref": "http://10.4.4.105:8888/resource/patient/record/uid?pid=9E7A%3B8&uid=urn%3Ava%3Aorder%3A9E7A%3A8%3A38747"
    //     }
        ];
    var notesVPR = [
    {
        "derivReferenceDate": "07/09/2015",
        "derivReferenceTime": "12:58",
        "formStatus": {
            "status": "pending",
            "message": "sending......"
        },
        "author": "KHAN,VIHAAN",
        "authorDisplayName": "KHAN,VIHAAN",
        "authorUid": "10000000257",
        "documentClass": "PROGRESS NOTES",
        "documentDefUid": "urn:va:doc-def:9E7A:8",
        "documentTypeName": "Progress Note",
        "encounterName": "7A GEN MED Aug 14, 2014",
        "encounterUid": "urn:va:visit:9E7A:3:11420",
        "entered": "20150520140113",
        "facilityCode": "998",
        "facilityName": "ABILENE (CAA)",
        "isInterdisciplinary": "false",
        "lastUpdateTime": "2015-07-09T09:58:32.499Z",
        "localId": "11581",
        "localTitle": "ADVANCE DIRECTIVE",
        "nationalTitle": {
            "name": "SURGERY RESIDENT NOTE",
            "vuid": "urn:va:vuid:4695458"
        },
        "patientIcn": "10110V004877",
        "pid": "9E7A;8",
        "referenceDateTime": "20150709125800",
        "signedDateTime": null,
        "signer": null,
        "signerDisplayName": null,
        "signerUid": null,
        "status": "UNSIGNED",
        "statusDisplayName": "Unsigned",
        "summary": "DEMO GENERAL SURGERY RESIDENT NOTE  ",
        "text": [{
            "author": "KHAN,VIHAAN",
            "authorDisplayName": "KHAN,VIHAAN",
            "authorUid": "10000000257",
            "content": "nota 4",
            "dateTime": "201505201418",
            "signer": null,
            "signerDisplayName": null,
            "signerUid": null,
            "status": "UNSIGNED"
        }],
        "facilityDisplay": "Bay Pines CIO Test",
        "facilityMoniker": "BAY"
    }
    ];
    var SignListModel = Backbone.Model.extend({});
    var orders = new SignListModel({});
    orders.set('items', ordersVPR);
    var notes = new SignListModel({});
    notes.set('items', notesVPR);
    var mixed = new SignListModel({});
    mixed.set('items', ordersVPR.concat(notesVPR));

    return {
        orders: orders,
        notes: notes,
        mixed: mixed
    };
});