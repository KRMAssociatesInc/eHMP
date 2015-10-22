define([
    'backbone',
    'marionette',
    'underscore',
    "hbs!app/applets/addLabOrders/templates/addLabOrderTemplate",
    'hbs!app/applets/addLabOrders/templates/footerTemplate',
    'hbs!app/applets/addLabOrders/templates/visitRegionTemplate',
    "app/applets/visit/typeaheadView",
    "app/applets/addLabOrders/utils/labOrdersUtil",
    "app/applets/addLabOrders/utils/labSearchBloodhound"
], function(Backbone, Marionette, _, addLabOrderTemplate, footerTemplate, visitTemplate, Typeahead, LabOrdersUtil, labSearchBloodhound) {
    'use strict';

    var addLabOrderChannel = ADK.Messaging.getChannel('addALabOrdersRequestChannel'),
        visitChannel = ADK.Messaging.getChannel('visit'),
        currentAppletKey,
        modalView,
        currentModel;
    var viewInstance;
    var gridView;

    function handleChannel(appletKey, labOrdersModel) {
        var currentPatient = ADK.PatientRecordService.getCurrentPatient();
        currentAppletKey = appletKey;
        currentModel = labOrdersModel;

        // if(currentPatient.get('visit')){
        //    showSearchView(labOrdersModel);
        // }else {
        visitChannel.command('openVisitSelector', 'addLabOrders');
        //}

    }
    visitChannel.on('set-visit-success:addLabOrders', showSearchView);

    function showSearchView(model) {
        var modalOptions = {
            title: 'Add a Lab Order',
            footerView: FooterView,
            headerView: headerView
        };

        modalView = new ModalView({
            model: currentModel
        });

        var modal = new ADK.UI.Modal({
            view: modalView,
            options: modalOptions
        });
        modal.show();

        console.log("we got here!");
        e.preventDefault();
    }

    addLabOrderChannel.comply('openOrdersSearch', handleChannel);

    var FooterView = Backbone.Marionette.ItemView.extend({
        template: footerTemplate,
        events: {
            'click #btn-add-orders-accept': 'addAcceptOrder'
        },
        addAcceptOrder: function() {
            var labsOrderModel = {};
            LabOrdersUtil.save(labsOrderModel);
            console.log("order accept completed");
        }
    });

    var headerView = Backbone.Marionette.ItemView.extend({
        template: _.template('<button type="button" class="close" data-dismiss="modal"><span aria-hidden="true" aria-label="Close">×</span></button><h4 class="modal-title" id="mainModalLabel">Order a Lab Test</h4>')
    });

    function handleCollSamps(selectedLabTest) {
        $('#collection-sample-select').empty();
        var data;
        if (selectedLabTest.collSamps) {
            data = selectedLabTest.collSamps;
        } else {
            //get from mock data for now
            data = getAllCollSamps();
        }
        $.each(data, function(i, collSamps) {
            $('#collection-sample-select').append($('<option>').text(collSamps.collSamp).attr('value', collSamps.id));
        });
    }

    function handleSpecimens(selectedLabTest) {
        $('#specimen-select').empty();
        var data;
        if (selectedLabTest.specimens) {
            data = selectedLabTest.specimens;
        } else {
            data = getAllSpecimens();
        }
        $.each(data, function(i, specimens) {
            $('#specimen-select').append($('<option>').text(specimens.specimen).attr('value', specimens.id));
        });
    }

    function handleUrgency(selectedLabTest) {
        $('#urgency-select').empty();
        if (selectedLabTest.urgencies) {
            $.each(selectedLabTest.urgencies, function(i, urgencies) {
                $('#urgency-select').append($('<option>').text(urgencies.urgency).attr('value', urgencies.id));
            });
        } else {
            console.log("Need to show entire list");
        }
        if (selectedLabTest.defaultUrgency) {
            $('#urgency-select').prop("disabled", true);
            $('#urgency-select').append($('<option>').text(selectedLabTest.defaultUrgency.urgency).attr('value', selectedLabTest.defaultUrgency.id));
        } else {
            $('#urgency-select').prop("disabled", false);
        }
        //TO DO:  check if logic is correct.  for now, defaults to ROUTINE if it exists
        if ($('#urgency-select[name*="ROUTINE"]')) {
            $('#urgency-select').val(9);
        }
    }

    function handleReqCom(selectedLabTest) {
        if (selectedLabTest.reqCom && selectedLabTest.reqCom === "TDM (PEAK-TROUGH)") {
            $(".show-draw-time-options").show();
        } else {
            $(".show-draw-time-options").hide();
        }

        if (selectedLabTest.reqCom && selectedLabTest.reqCom === "ANTICOAGULATION") {
            $(".show-anticoagulant").show();
        } else {
            $(".show-anticoagulant").hide();
        }
    }

    function handleFrequency(selectedLabTest) {
        //TO DO: need logic on determining max days based on location
        $('#frequency-select').empty();
        var data = getAllFrequency();
        $.each(data, function(i, frequencies) {
            $('#frequency-select').append($('<option>').text(frequencies.frequency).attr('value', frequencies.id));
        });
        $('#frequency-select').val(28);
        $('#frequency-length').prop('disabled', true);
    }

    function handleCollType(selectedLabTest) {
        //TO DO: need logic on how to limit list.  for now, show all four
        $('#collection-type-select').empty();
        $('#collection-type-select').append($('<option>').text("Lab Collect").attr('value', "LC"));
        $('#collection-type-select').append($('<option>').text("Ward Collect").attr('value', "WC"));
        $('#collection-type-select').append($('<option>').text("Send Patient to Lab").attr('value', "SP"));
        $('#collection-type-select').append($('<option>').text("Immediate Collect").attr('value', "I"));
    }

    function handleDrawDoseTimes(selectedLabTest) {
        if (selectedLabTest.drawDoseTimes) {
            $(".show-last-draw-time").show();
        } else {
            $(".show-last-draw-time").hide();
        }
    }

    function handleNotificationMessage(selectedLabTest) {
        if (selectedLabTest.genWardInstructions) {
            $("#notification-box-message").html(selectedLabTest.genWardInstructions);
            $(".notification-box").show();
        } else {
            closeNotificationMessage();
        }
    }

    function handleCollDateTime(selectedLabTest) {
        $('#collection-datetime-select').empty();
        $('#collection-datetime-select').append($('<option>').text("Today").attr('value', 1));
    }

    function handleLabTestSelect(selectedLabTest) {
        $("#lab-test-form-itemid").val(selectedLabTest.itemId);
        handleCollSamps(selectedLabTest);
        handleUrgency(selectedLabTest);
        handleReqCom(selectedLabTest);
        handleFrequency(selectedLabTest);
        handleCollType(selectedLabTest);
        handleSpecimens(selectedLabTest);
        handleDrawDoseTimes(selectedLabTest);
        handleNotificationMessage(selectedLabTest);
        handleCollDateTime(selectedLabTest);
        handlePreviewText();
    }

    function closeNotificationMessage() {
        $("#notification-box-message").empty();
        $(".notification-box").hide();
    }

    function frequencyChanged(e) {
        var id = $(e.target).val();
        if (id === "26" || id === "27" || id === "28") {
            $('#frequency-length').prop('disabled', true).val("");
        } else {
            $('#frequency-length').prop('disabled', false).focus();
        }
    }

    function handlePreviewText() {
        var labTest = $("#lab-tests-form").val();
        var collSamp = $("#collection-sample-select :selected").text();
        collSamp = collSamp === "" ? "" : " " + collSamp;
        var collType = $("#collection-type-select").val();
        var specimen = $("#specimen-select :selected").text();
        specimen = specimen === "" ? "" : " " + specimen;
        collType = collType === "" ? "" : " " + collType;
        var preview = labTest + collSamp + specimen + collType;

        $("#previewOrder").html(preview);
    }

    var ModalView = Backbone.Marionette.LayoutView.extend({
        className: 'add-lab-orders-styles',
        template: addLabOrderTemplate,
        events: {
            'click #notification-close-button': function(e) {
                closeNotificationMessage();
            },
            'change #frequency-select': function(e) {
                frequencyChanged(e);
            },
            'change #collection-sample-select': function(e) {
                handlePreviewText();
            },
            'change #specimen-select': function(e) {
                handlePreviewText();
            },
            'change #collection-type-select': function(e) {
                handlePreviewText();
            }
        },
        initialize: function() {

        },
        onRender: function() {
            // this.updateVisit();

            var labSearch = labSearchBloodhound;
            labSearch.initialize();

            $(this.el).find('#lab-tests-form').typeahead({
                minLength: 1,
                highlight: true,
                hint: true
            }, {
                name: 'labTest-search-item',
                displayKey: 'testName',
                source: labSearch.ttAdapter()
            }).on('typeahead:selected', function(event, item) {
                handleLabTestSelect(item);
            });
        },
        showModal: function(event, GridView) {
            gridView = GridView;
            var options = {
                'title': 'Lab',
                'size': 'medium',
                'footerView': FooterView
            };
            
            var modal = new ADK.UI.Modal({
                view: this,
                options: options
            });
            modal.show();
        }

    });
    return ModalView;

    //TEMPORARY MOCK DATA
    function getAllCollSamps() {
        var list = [{
            id: 68,
            collSamp: "24 HR URINE",
            specimenId: 8755,
            specimen: "24 HR URINE"
        }, {
            id: 24,
            collSamp: "ABSCESS"
        }, {
            id: 75,
            collSamp: "AP SPECIMEN"
        }, {
            id: 49,
            collSamp: "ARTERIAL BLOOD",
            specimenId: 8728,
            specimen: "ARTERIAL BLOOD"
        }, {
            id: 25,
            collSamp: "ASPIRATE"
        }, {
            id: 47,
            collSamp: "BACTEC 1ST SET 70",
            specimenId: 1,
            specimen: "BLOOD"
        }, {
            id: 72,
            collSamp: "BACTEC 2ND SET 70 2ND SET",
            specimenId: 1,
            specimen: "BLOOD"
        }, {
            id: 58,
            collSamp: "BATH TEST RED & BLUE",
            specimenId: 1
        }, {
            id: 26,
            collSamp: "BIOPSY"
        }, {
            id: 20,
            collSamp: "BLOOD (BACTEC BTL.)"
        }, {
            id: 51,
            collSamp: "BLOOD (GREEN TOP)"
        }, {
            id: 56,
            collSamp: "BLOOD (NORMAL COAG)"
        }, {
            id: 57,
            collSamp: "BLOOD (ABNORM COAG)"
        }, {
            id: 60,
            collSamp: "BLOOD (RED TOP)"
        }, {
            id: 61,
            collSamp: "BLOOD"
        }, {
            id: 1,
            collSamp: "BLOOD (GOLD TOP)"
        }, {
            id: 2,
            collSamp: "BLOOD  (GRAY)"
        }, {
            id: 3,
            collSamp: "BLOOD  (LAVENDER)"
        }, {
            id: 5,
            collSamp: "BLOOD  (BLACK TOP)"
        }, {
            id: 7,
            collSamp: "BLOOD  (BLUE)"
        }, {
            id: 8,
            collSamp: "BLOOD  (RED)"
        }, {
            id: 67,
            collSamp: "BLOOD BANK (RED & LAV)"
        }, {
            id: 27,
            collSamp: "BONE"
        }, {
            id: 28,
            collSamp: "BONE MARROW"
        }, {
            id: 19,
            collSamp: "BOTH URINE & BLOOD"
        }, {
            id: 66,
            collSamp: "BRONX TUBE^"
        }, {
            id: 29,
            collSamp: "BRUSH"
        }, {
            id: 63,
            collSamp: "CAP SURVEY"
        }, {
            id: 65,
            collSamp: "CAPILLARY TUBE (BLUE STRIPE)"
        }, {
            id: 55,
            collSamp: "CATHETER TIP"
        }, {
            id: 30,
            collSamp: "CELLOPHANE TAPE"
        }, {
            id: 45,
            collSamp: "CHANCRE"
        }, {
            id: 9,
            collSamp: "CSF"
        }, {
            id: 69,
            collSamp: "Container C"
        }, {
            id: 31,
            collSamp: "DECUBITUS"
        }, {
            id: 32,
            collSamp: "DIALYSATE"
        }, {
            id: 52,
            collSamp: "DIGOXIN"
        }, {
            id: 76,
            collSamp: "DISCHARGE"
        }, {
            id: 59,
            collSamp: "DRAINAGE"
        }, {
            id: 33,
            collSamp: "EXUDATE"
        }, {
            id: 71,
            collSamp: "FINGERSTICK"
        }, {
            id: 34,
            collSamp: "FLUID JUICE"
        }, {
            id: 35,
            collSamp: "HAIR"
        }, {
            id: 23,
            collSamp: "KILLIT AMPULE"
        }, {
            id: 64,
            collSamp: "LAVENDER PLASMA"
        }, {
            id: 36,
            collSamp: "NAIL"
        }, {
            id: 10,
            collSamp: "PERICARDIAL/THORACIC FLUID"
        }, {
            id: 11,
            collSamp: "PERITONEAL/ASCITIC FLUID"
        }, {
            id: 12,
            collSamp: "PLEURAL"
        }, {
            id: 77,
            collSamp: "RLE"
        }, {
            id: 38,
            collSamp: "SECRETIONS"
        }, {
            id: 16,
            collSamp: "SEMINAL FLUID"
        }, {
            id: 54,
            collSamp: "SERUM"
        }, {
            id: 37,
            collSamp: "SKIN"
        }, {
            id: 22,
            collSamp: "SPORE STRIP"
        }, {
            id: 18,
            collSamp: "SPUTUM"
        }, {
            id: 53,
            collSamp: "STERILITY STRIP"
        }, {
            id: 39,
            collSamp: "STONE(CALCULUS)"
        }, {
            id: 17,
            collSamp: "STOOL"
        }, {
            id: 41,
            collSamp: "SUTURE"
        }, {
            id: 50,
            collSamp: "SWAB"
        }, {
            id: 13,
            collSamp: "SYNOVIAL"
        }, {
            id: 40,
            collSamp: "TISSUE"
        }, {
            id: 14,
            collSamp: "UNKNOWN"
        }, {
            id: 15,
            collSamp: "URINE"
        }, {
            id: 62,
            collSamp: "URINE, DRUG SCREEN"
        }, {
            id: 43,
            collSamp: "VALVE"
        }, {
            id: 74,
            collSamp: "VBECS - NO SPECIMEN REQUIRED"
        }, {
            id: 42,
            collSamp: "WATER"
        }, {
            id: 73,
            collSamp: "WHATEVER"
        }, {
            id: 21,
            collSamp: "WOUND"
        }, {
            id: 48,
            collSamp: "ZZ ARTERIAL"
        }, {
            id: 70,
            collSamp: "ZZBLOOD"
        }];
        return list;
    }

    function getAllSpecimens() {
        var list = [{
            id: 70,
            specimen: "BLOOD"
        }, {
            id: 71,
            specimen: "URINE"
        }, {
            id: 72,
            specimen: "SERUM"
        }, {
            id: 73,
            specimen: "PLASMA"
        }, {
            id: 74,
            specimen: "CEREBROSPINAL FLUID"
        }, {
            id: 76,
            specimen: "PERITONEAL FLUID"
        }, {
            id: 77,
            specimen: "PLEURAL FLUID"
        }, {
            id: 78,
            specimen: "SYNOVIAL FLUID"
        }, {
            id: 91,
            specimen: "PERICARDIAL FLUID"
        }, {
            id: 139,
            specimen: "FECES"
        }, {
            id: 360,
            specimen: "SPUTUM"
        }, {
            id: 999,
            specimen: "UNKNOWN"
        }, {
            id: 5864,
            specimen: "SEMINAL FLUID"
        }, {
            id: 8728,
            specimen: "ARTERIAL BLOOD"
        }, {
            id: 8752,
            specimen: "TEST SERUM"
        }, {
            id: 8753,
            specimen: "TEST-PLASMA NORM"
        }, {
            id: 8754,
            specimen: "TEST-PLASMA ABNORM"
        }, {
            id: 8755,
            specimen: "24 HR URINE"
        }, {
            id: 8756,
            specimen: "OTHER"
        }];
        return list;
    }

    function getAllFrequency() {
        var list = [{
            id: 90,
            frequency: "HOURLY",
            comp: 60
        }, {
            id: 26,
            frequency: "NOW",
            comp: 0
        }, {
            id: 27,
            frequency: "ONCE",
            comp: 0
        }, {
            id: 28,
            frequency: "ONE TIME",
            comp: 0
        }, {
            id: 70,
            frequency: "Q15MIN",
            comp: 15
        }, {
            id: 48,
            frequency: "Q2H",
            comp: 120
        }, {
            id: 88,
            frequency: "Q4HLR",
            comp: 240
        }, {
            id: 75,
            frequency: "Q6-8H",
            comp: 120
        }, {
            id: 51,
            frequency: "Q6H",
            comp: 360
        }, {
            id: 85,
            frequency: "Q6H-TEST",
            comp: 360
        }, {
            id: 58,
            frequency: "Q8H",
            comp: 480
        }, {
            id: 59,
            frequency: "Q8HR",
            comp: 480
        }, {
            id: 29,
            frequency: "QAM",
            comp: 1440
        }, {
            id: 30,
            frequency: "QD",
            comp: 1440
        }, {
            id: 31,
            frequency: "QH",
            comp: 60
        }, {
            id: 44,
            frequency: "QMON",
            comp: 43200
        }, {
            id: 64,
            frequency: "QMONTH",
            comp: 43200
        }, {
            id: 32,
            frequency: "QOD",
            comp: 2800
        }, {
            id: 33,
            frequency: "QW",
            comp: 10080
        }, {
            id: 84,
            frequency: "WEEKLY",
            comp: 10080
        }];
        return list;
    }
});