define([
    'typeahead'
], function(TwitterTypeahead){

    var siteCode = ADK.UserService.getUserSession().get('site');
    //TO DO: change to the lab order URL
    var problemSearchURL = ADK.ResourceService.buildUrl('problems-getProblems', {
            "site.code": siteCode,
            limit: 10
        });
    return new Bloodhound({
              datumTokenizer: function (datum) {
                    return Bloodhound.tokenizers.whitespace(datum.value);
              },
              queryTokenizer: Bloodhound.tokenizers.whitespace,
              remote:{
                    url:  problemSearchURL,
                    replace: function (url, query) {
                        if($('#uncodedNew').prop('checked')){
                            url += '&uncoded=1';
                        }
                        url+= '&query=' + query;

                        return url;
                    },
                    filter: function (data) {
                            var mockData = getMockData();
                            return mockData;
                        /*
                        if(data && data.data.items !== 'No data'){
                            return $.map(data.data.items, function (problemItem) {
                                return {
                                    value: problemItem.problem,
                                    problemNumber: problemItem.problemNumber,
                                    icd: problemItem.icd,
                                    lexiconCode: problemItem.lexiconCode,
                                    snomed: problemItem.snomed,
                                    problemText: problemItem.problemText
                                };
                            });
                        } else {
                            return {};
                        }
                        */
                    },
                    ajax: {
                        beforeSend: function(){
                            $('#labTestSearchSpinner').show();
                        },
                        complete: function(){
                            $('#labTestSearchSpinner').hide();
                        }
                    }
                }
            });

    function getMockData() {
        data = [
            {
                testName: "FIO2",
                itemId: "196",
                oiMessage: "TEST OF GENERAL WARD INSTRUCTIONS FIELD!!!!",
                collSamps: [
                    { id: 1,
                        collSamp: "BLOOD (GOLD TOP)",
                        specimen: "SERUM" },
                    { id: 2,
                        collSamp: "URINE",
                        specimen: "URINE" },
                    { id: 3,
                        collSamp: "PERITONEAL/ASCITIC FLUID",
                        specimen: "PERITONEAL FLUID" },
                    { id: 4,
                        collSamp: "PLEURAL",
                        specimen: "PLEURAL FLUID" },
                    { id: 5,
                        collSamp: "PERICARDIAL/THORACIC FLUID",
                        specimen: "PERICARDIAL FLUID" },
                    { id: 6,
                        collSamp: "SYNOVIAL",
                        specimen: "SYNOVIAL FLUID" },
                    { id: 7,
                        collSamp: "FLUID JUICE",
                        },
                    { id: 8,
                        collSamp: "CSF",
                        specimen: "CEREBROSPINAL FLUID",
                        message: "TEST OF WARD REMARKS FIELD !!!" }],
                defaultCollSamp: 1,
                genWardInstructions: "TEST OF GENERAL WARD INSTRUCTIONS FIELD !!!!!",
                labCollSamp: 1,
                specimens: [
                    { id: 71,
                        specimen: "URINE" },
                    { id: 72,
                        specimen: "SERUM" },
                    { id: 73,
                        specimen: "PLASMA" },
                    { id: 74,
                        specimen: "CEREBROSPINAL FLUID" },
                    { id: 76,
                        specimen: "PERITONEAL FLUID" },
                    { id: 77,
                        specimen: "PLEURAL FLUID" },
                    { id: 78,
                        specimen: "SYNOVIAL FLUID" },
                    { id: 91,
                        specimen: "PERICARDIAL FLUID" }],
                urgencies: [
                    { id: 1,
                        urgency: "STAT" },
                    { id: 2,
                        urgency: "ASAP" },
                    { id: 3,
                        urgency: "PRE-OP" },
                    { id: 4,
                        urgency: "CALL RESULT" },
                    { id: 5,
                        urgency: "ADMIT" },
                    { id: 6,
                        urgency: "OUTPATIENT" },
                    { id: 7,
                        urgency: "PURPLE TRIANGLE" },
                    { id: 9,
                        urgency: "ROUTINE" }]
            },
            {
                testName: "ARBOVIRUS EEE TITER",
                itemId: "1104",
                urgencies: [
                    { id: 2,
                        urgency: "ASAP" },
                    { id: 3,
                        urgency: "PRE-OP" },
                    { id: 4,
                        urgency: "CALL RESULT" },
                    { id: 5,
                        urgency: "ADMIT" },
                    { id: 6,
                        urgency: "OUTPATIENT" },
                    { id: 7,
                        urgency: "PURPLE TRIANGLE" },
                    { id: 9,
                        urgency: "ROUTINE" }
            ]
            },
            /*
            {
                testName: "24 HR URINE CALCIUM",
                itemId: "5083",
                collSamps: [
                    { id: 69,
                        collSamp: "Container C",
                        specimen: "24 GURINE" }

                ],
                defaultCollSamp: 1,
                urgencies: [
                    { id: 9,
                    urgency: "ROUTINE" }]
            },
            */
            {
                testName: "FROZEN SECTION",
                itemId: "1310",
                collSamps: [
                    { id: 69,
                        collSamp: "BLOOD (GOLD TOP)",
                        specimen: "SERUM",
                        message: "Please note if specimen is Random,Trough,or Peak on both tube and order slip."
                    }],
                defaultCollSamp: 1,
                reqCom: "TDM (PEAK-TROUGH)",
                uniqueCollSamp: 1,
                urgencies: [
                    { id: 1,
                        urgency: "STAT" },
                    { id: 2,
                        urgency: "ASAP" },
                    { id: 3,
                        urgency: "PRE-OP" },
                    { id: 4,
                        urgency: "CALL RESULT" },
                    { id: 5,
                        urgency: "ADMIT" },
                    { id: 6,
                        urgency: "OUTPATIENT" },
                    { id: 7,
                        urgency: "PURPLE TRIANGLE" },
                    { id: 9,
                        urgency: "ROUTINE" }]
            },
            {
                testName: "ANTITHROMBIN",
                itemId: "211",
                collSamps: [
                    { id: 69,
                        collSamp: "BLOOD (GOLD TOP)",
                        specimen: "SERUM"
                    }],
                drawDoseTimes: true, //doesn't match RPC call -- temp solution
                defaultCollSamp: 1,
                labCollSamp: 1,
                specimens: [
                    { id: 72,
                        specimen: "SERUM" }],
                uniqueCollSamp: 1,
                urgencies: [
                    { id: 2,
                        urgency: "ASAP" },
                    { id: 3,
                        urgency: "PRE-OP" },
                    { id: 4,
                        urgency: "CALL RESULT" },
                    { id: 5,
                        urgency: "ADMIT" },
                    { id: 6,
                        urgency: "OUTPATIENT" },
                    { id: 7,
                        urgency: "PURPLE TRIANGLE" },
                    { id: 9,
                        urgency: "ROUTINE" }]
            },
            {
                testName: "PLASMA CELLS",
                itemId: "468",
                collSamps: [
                    { id: 69,
                        collSamp: "BLOOD (BLUE)",
                        specimen: "PLASMA",
                        message: "Please note if specimen is Random,Trough,or Peak on both tube and order slip."
                    }],
                defaultCollSamp: 1,
                reqCom: "ANTICOAGULATION",
                specimens: [
                    { id: 73,
                        specimen: "PLASMA" },
                    { id: 8753,
                        specimen: "PLASMA NORM" },
                    { id: 8754,
                        specimen: "PLASMA ABNORM" }],
                urgencies: [
                    { id: 2,
                        urgency: "ASAP" },
                    { id: 3,
                        urgency: "PRE-OP" },
                    { id: 4,
                        urgency: "CALL RESULT" },
                    { id: 5,
                        urgency: "ADMIT" },
                    { id: 6,
                        urgency: "OUTPATIENT" },
                    { id: 7,
                        urgency: "PURPLE TRIANGLE" },
                    { id: 9,
                        urgency: "ROUTINE" }]
            }
        ];
        return data;
    }
});
