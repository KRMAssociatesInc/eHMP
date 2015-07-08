/*jslint node: true, nomen: true, unparam: true */
/*global jquery, $, _, define, Marionette, jqm, describe, it, expect, beforeEach, spyOn */

'use strict';

define(["jquery", "backbone", "marionette", "jasminejquery", "app/applets/medication_review/appletHelper"],
    function($, Backbone, Marionette, jasminejquery, appletHelper) {

        var testMedData = {
            'dose':'',
            'facilityCode':'',
            'lastFilled': '',
            'lastAdmin': '',
            'scheduleFreq':'',
            'scheduleName':'',
            'scheduleType':'',
            'stopped': '',
            'supply': '',
            'units': '',
            'vaType': '',
            'vaStatus': "",
            'orders': [{
                'daysSupply': null,
                'fillsRemaining': null,
                'fillsAllowed': null,
                'ordered': null,
            }],
            'routing': '',
            'sig': ''
        };

        beforeEach(function() {
            testMedData.dose = '';
            testMedData.facilityCode = '';
            testMedData.lastFilled = '';
            testMedData.lastAdmin = '';
            testMedData.scheduleFreq = '';
            testMedData.scheduleName = '';
            testMedData.scheduleType = '';
            testMedData.stopped = '';
            testMedData.supply = '';
            testMedData.units = '';
            testMedData.vaType = '';
            testMedData.vaStatus = "";
            testMedData.orders.daysSupply = null;
            testMedData.orders.fillsRemaining = null;
            testMedData.orders.fillsAllowed = null;
            testMedData.orders.ordered = null;
            testMedData.routing = null;
            testMedData.sig = '';

        });

        //Tests for .isPRN()
        describe("Determine if a medication is a PRN type", function(){
            it("Should return true if the string 'AS NEEDED' appears in the sig field", function(){
                testMedData.sig = "Take as needed";
                expect(appletHelper.isPRN(testMedData)).toBe(true);
            });

            it("Should return true if the dosage.scheduleType field equals PRN", function(){
                testMedData.scheduleType = "PRN";
                expect(appletHelper.isPRN(testMedData)).toBe(true);
            });

            it("Should return true if the string 'PRN' appears in the scheduleName field", function(){
                testMedData.scheduleName = "BO PQ PRN";
                expect(appletHelper.isPRN(testMedData)).toBe(true);
            });

            it("Should return false if the string 'AS NEEDED' does not appear in the sig field, and PRN is not in the scheduleType or scheduleName", function(){
                testMedData.sig = "Take once a day";
                testMedData.scheduleType = "BO";
                testMedData.scheduleName = "BO PQ";
                expect(appletHelper.isPRN(testMedData)).toBe(false);
            });
        });

        //Tests for .hasFillDetail()
        describe("Determine if the medication has fill info to disply", function() {
            it("Should return true if it is an Outpatient med with fillsAllowed data", function() {
                testMedData.vaType="O";
                testMedData.orders[0].fillsAllowed=1;
                expect(appletHelper.hasFillDetail(testMedData)).toBe(true);
            });

            it("Should return false if it is an Outpatient med without fillsAllowed data", function() {
                testMedData.vaType="O";
                testMedData.orders[0].fillsAllowed=null;
                expect(appletHelper.hasFillDetail(testMedData)).toBe(false);
            });

            it("Should return true if it is a Supply med with fillsAllowed data", function() {
                testMedData.supply=true;
                testMedData.orders[0].fillsAllowed=1;
                expect(appletHelper.hasFillDetail(testMedData)).toBe(true);
            });

            it("Should return false if it is a Supply med without fillsAllowed data", function() {
                testMedData.supply=true;
                testMedData.orders[0].fillsAllowed=null;
                expect(appletHelper.hasFillDetail(testMedData)).toBe(false);
            });

            it("Should return false if it is not and Outpatient med", function() {
                testMedData.vaType="I";
                expect(appletHelper.hasFillDetail(testMedData)).toBe(false);
            });


        });

        //Tests for .hasScheduledTimes() (incomplete!)
        describe("Determine if the medication has Scheduled Times info to display", function(){
            it("Should return false if the medication is an Outpatient", function(){
                testMedData.vaType="O";
                expect(appletHelper.hasScheduledTimes(testMedData)).toBe(false);
            });

            // !!! add a case for Inpatients, once you have the data !!!

        });

        //Tests for .hasDailyDoseInfo() 
        describe("Determine if the medication has daily dose data", function(){
            it("Should return false if there is no 'scheduleFreq' field", function(){
                testMedData.scheduleFreq=null;
                expect(appletHelper.hasDailyDoseInfo(testMedData)).toBe(false);
            });

            it("Should return false if there is data in the 'scheduleFreq' field but no data in the 'dose' field", function(){
                testMedData.scheduleFreq=1;
                testMedData.dose=null;
                expect(appletHelper.hasDailyDoseInfo(testMedData)).toBe(false);
            });

            it("Should return false if there is data in the 'scheduleFreq' and 'dose fields but it is not an Outpatient med or Supply", function(){
                testMedData.scheduleFreq=1;
                testMedData.dose=40;
                testMedData.vaType="I";
                expect(appletHelper.hasDailyDoseInfo(testMedData)).toBe(false);
            });

            it("Should return true if there is data in the 'scheduleFreq' and 'dose fields and it is an Outpatient med", function(){
                testMedData.scheduleFreq=1;
                testMedData.dose=40;
                testMedData.vaType="O";
                expect(appletHelper.hasDailyDoseInfo(testMedData)).toBe(true);
            });

            it("Should return true if there is data in the 'scheduleFreq' and 'dose fields and it is a Non-VA med", function(){
                testMedData.scheduleFreq=1;
                testMedData.dose=40;
                testMedData.vaType="N";
                expect(appletHelper.hasDailyDoseInfo(testMedData)).toBe(true);
            });
        });

        //Test for .getDailyOrScheduledDosePrefix()
        describe("Retrieve the correct prefix for the dose info", function(){
            // it("Should return 'Scheduled Times' if the med is an Inpatient and it has scheduled times info", function(){
            //     testMedData.vaType = "I";
            // });

            it("Should return 'Total Daily' if it is an Outpatient med with daily dose info", function(){
                testMedData.vaType = "O";
                testMedData.scheduleFreq=1;
                testMedData.dose=40;
                expect(appletHelper.getDailyOrScheduledDosePrefix(testMedData)).toBe("Total Daily");
            });

            it("Should return 'Total Daily' if it is a Non-VA med with daily dose info", function(){
                testMedData.vaType = "N";
                testMedData.scheduleFreq=1;
                testMedData.dose=40;
                expect(appletHelper.getDailyOrScheduledDosePrefix(testMedData)).toBe("Total Daily");
            });

            it("Should return false if it is an Outpatient med that has no daily dose info", function(){
                testMedData.vaType = "O";
                testMedData.scheduleFreq = null;
                expect(appletHelper.getDailyOrScheduledDosePrefix(testMedData)).toBe(false);
            });

            it("Should return false if it is a Supply med that has no daily dose info", function(){
                testMedData.supply = true;
                testMedData.scheduleFreq = null;
                expect(appletHelper.getDailyOrScheduledDosePrefix(testMedData)).toBe(false);
            });
        });

        //Test for getDailyOrScheduledDose()
        describe("Retrieve the dose data, scheduled dose or daily dose, if it exists", function(){
            //write a test for inpatient once you have the data

            it("Should return a formatted string if it is an Outpatient medication with daily dose info", function(){
                testMedData.vaType = "O";
                testMedData.scheduleFreq=30;
                testMedData.dose=40;
                testMedData.units = "MG";
                expect(appletHelper.getDailyOrScheduledDose(testMedData)).toBe("1920 MG");
            });

            it("Should return a formatted string if it is a Non-VA medication with daily dose info", function(){
                testMedData.vaType = "N";
                testMedData.scheduleFreq=30;
                testMedData.dose=40;
                testMedData.units = "MG";
                expect(appletHelper.getDailyOrScheduledDose(testMedData)).toBe("1920 MG");
            });

            it("Should return false if it is an Outpatient medication with no daily dose info", function(){
                testMedData.vaType = "O";
                testMedData.scheduleFreq=null;
                expect(appletHelper.getDailyOrScheduledDose(testMedData)).toBe(false);
            });

            it("Should return false if it is a Non-VA medication with no daily dose info", function(){
                testMedData.vaType = "N";
                testMedData.scheduleFreq=null;
                expect(appletHelper.getDailyOrScheduledDose(testMedData)).toBe(false);
            });
        });

        //Test for .getExpirationLabel()
        describe("Determine if the medication should be labeled active, expried, etc", function(){
            it("Should return an empty string if the medication is pending", function(){
                testMedData.vaStatus = "pending";
                expect(appletHelper.getExpirationLabel(testMedData)).toBe("");
            });

            it("Should return 'Expires' if the medication is active", function(){
                testMedData.vaStatus = "active";
                expect(appletHelper.getExpirationLabel(testMedData)).toBe("Expires");
            });

            it("Should return 'Orderd' if the medication is suspended", function(){
                testMedData.vaStatus = "suspend";
                expect(appletHelper.getExpirationLabel(testMedData)).toBe("Ordered");
            });

            it("Should return 'Orderd' if the medication is on hold", function(){
                testMedData.vaStatus = "hold";
                expect(appletHelper.getExpirationLabel(testMedData)).toBe("Ordered");
            });

            it("Should return 'Expired' if the medication is expired", function(){
                testMedData.vaStatus = "expired";
                expect(appletHelper.getExpirationLabel(testMedData)).toBe("Expired");
            });

            it("Should return 'Discontinued' if the medication is discontinued", function(){
                testMedData.vaStatus = "discontinued";
                expect(appletHelper.getExpirationLabel(testMedData)).toBe("Discontinued");
            });

            it("Should return 'Discontinued' if the medication is discontinued/edit", function(){
                testMedData.vaStatus = "discontinued/edit";
                expect(appletHelper.getExpirationLabel(testMedData)).toBe("Discontinued");
            });
        });

        //Test for .getLastDatePrefix()
        describe("Determine Last Admin or Last Filled prefix", function() {

            it("Should return no prefix for Non-Va", function() {
                testMedData.vaType = "N";
                expect(appletHelper.getLastDatePrefix(testMedData)).toBe(false);
            });

            it("Should return 'Last admin' for Inpatients", function() {
                testMedData.vaType = "I";
                expect(appletHelper.getLastDatePrefix(testMedData)).toBe("Last admin");
            });

            it("Should return 'Last filled' for Medications with a 'lastFilled' field", function() {
                testMedData.lastFilled = "19990901";
                expect(appletHelper.getLastDatePrefix(testMedData)).toBe("Last filled");
            });

            it("Should return 'Last filled' for Medications with a true 'supply' field", function() {
                testMedData.supply = true;
                expect(appletHelper.getLastDatePrefix(testMedData)).toBe("Last filled");
            });

            it("Should return false for any other condition", function() {
                expect(appletHelper.getLastDatePrefix(testMedData)).toBe(false);
            });
        });

        //Test for .getLastDate()
        describe("Determine the date associated with the last fill or admin", function() {
            it("Should return empty string for Non-Va", function() {
                testMedData.vaType = "N";
                expect(appletHelper.getLastDate(testMedData)).toBe("");
            });

            // it("Should return empty string for Inpatient", function() { //this will change
            //     testMedData.vaType = "I";
            //     expect(appletHelper.getLastDate(testMedData)).toBe("");
            // });

            it("Should return 'lastFilled' date string for Outpatient", function() {
                testMedData.vaType = "O";
                testMedData.lastFilled = "19990901";
                expect(appletHelper.getLastDate(testMedData)).toBe(testMedData.lastFilled);
            });

            it("Should return 'lastFilled' date string for Supply meds", function() {
                testMedData.supply = true;
                testMedData.lastFilled = "19990901";
                expect(appletHelper.getLastDate(testMedData)).toBe(testMedData.lastFilled);
            });
        });

        //Test for .getLastFillStyle()
        describe("Determine what class name will be returned for the Outpatient 'Last filled' area ", function() {
            it("Should return an empty string if vaType is not Outpatient", function(){
                testMedData.vaType="I";
                expect(appletHelper.getLastFillStyle(testMedData)).toBe('');
            });

            it("Should return 'noFillsRemain' if there are zero fillsRemaining", function() {
                testMedData.vaType="O";
                testMedData.orders[0].fillsAllowed=true;
                testMedData.orders[0].fillsRemaining = 0;
                expect(appletHelper.getLastFillStyle(testMedData)).toBe("noFillsRemain");
            });

            it("Should return 'fewFillsRemain' if there are three fillsRemaining", function() {
                testMedData.vaType="O";
                testMedData.orders[0].fillsAllowed=true;
                testMedData.orders[0].fillsRemaining = 3;
                expect(appletHelper.getLastFillStyle(testMedData)).toBe("fewFillsRemain");
            });

            it("Should return 'fewFillsRemain' if there are less than three fillsRemaining, but more than zero", function() {
                testMedData.vaType="O";
                testMedData.orders[0].fillsAllowed=true;
                testMedData.orders[0].fillsRemaining = 2;
                expect(appletHelper.getLastFillStyle(testMedData)).toBe("fewFillsRemain");
            });
        });

        //Test for .getLastFillDetails()
        describe("Retrieve the last filled medication details, if they exist", function(){
            it("Should return an empty string if the medication is not and Outpatient or Supply", function(){
                testMedData.vaType = "I";
                expect(appletHelper.getLastFillDetails(testMedData)).toBe("");
            });

            it("Should return an empty string if the medication is an Outpatient but does not have fill detail info", function(){
                testMedData.vaType = "O";
                testMedData.orders[0].fillsAllowed=null;
                expect(appletHelper.getLastFillDetails(testMedData)).toBe("");
            });

            it("Should return an empty string if the medication is a Supply but does not have fill detail info", function(){
                testMedData.supply = true;
                testMedData.orders[0].fillsAllowed=null;
                expect(appletHelper.getLastFillDetails(testMedData)).toBe("");
            });

            it("Should return a formatted string if the medication is an Outpatient and does have fill detail info", function(){
                testMedData.vaType = "O";
                testMedData.orders[0].fillsAllowed=true;
                testMedData.orders[0].fillsRemaining = 1;
                testMedData.orders[0].daysSupply = 90;
                expect(appletHelper.getLastFillDetails(testMedData)).toBe("1 Refills (90 days each)");
            });

            it("Should return an empty string if the medication is a Supply", function(){
                testMedData.supply = true;
                expect(appletHelper.getLastFillDetails(testMedData)).toBe("");
            });
        });

        //test for .getPickUpType() ()
        describe("Determine if a medication was picked up from the window or by mail", function(){
            it("Should return 'Window' if the routing field is 'W'", function(){
                testMedData.routing="W";
                expect(appletHelper.getPickUpType(testMedData)).toBe("Window");
            });

            it("Should return 'Mail' if the routing field is 'M'", function(){
                testMedData.routing="M";
                expect(appletHelper.getPickUpType(testMedData)).toBe("Mail");
            });

            it("Should return false if the routing field is not 'M' or 'W'", function(){
                testMedData.routing=null;
                expect(appletHelper.getPickUpType(testMedData)).toBe(false);
            });
        });

        //Test for .getStandardizedVaStatus()
        describe("Standardize the vaStatus field to be all upper case", function(){
            it("Should return 'ACTIVE' if vaStatus='active'", function(){
                testMedData.vaStatus = "active";
                testMedData.overallStop = "20200312";
                testMedData.stopped = "20160101";
                expect(appletHelper.getStandardizedVaStatus(testMedData)).toBe("ACTIVE");
            });

            it("Should return 'EXPIRED' if vaStatus='expired'", function(){
                testMedData.vaStatus = "expired";
                testMedData.overallStop = "20080122";
                expect(appletHelper.getStandardizedVaStatus(testMedData)).toBe("EXPIRED");
            });

            it("Should return 'DISCONTINUED' if vaStatus='discontinued'", function() {
                testMedData.vaStatus = "discontinued";
                testMedData.overallStop = "20160122";
                expect(appletHelper.getStandardizedVaStatus(testMedData)).toBe("DISCONTINUED");
            });

            it("Should return 'DISCONTINUED' if vaStatus='discontinued/edit'", function() {
                testMedData.vaStatus = "discontinued/edit";
                testMedData.overallStop = "20160122";
                expect(appletHelper.getStandardizedVaStatus(testMedData)).toBe("DISCONTINUED");
            });

            it("Should return 'PENDING' if vaStatus='pending'", function() {
                testMedData.vaStatus = "pending";
                testMedData.overallStop = "20160122";
                expect(appletHelper.getStandardizedVaStatus(testMedData)).toBe("PENDING");
            });
        });

        //Test for .getStandarizedFacilityCode()
        describe("Determine if a medications is from a DOD or NCH facility", function(){
            it("Should return an empty string if it is not from a DOD or VA associated facility", function(){
                testMedData.facilityCode="Not VA or DOD";
                expect(appletHelper.getStandarizedFacilityCode(testMedData)).toBe("");
            });

            it("Should return a string of 'DOD' if it is from a DOD", function(){
                testMedData.facilityCode="DOD";
                expect(appletHelper.getStandarizedFacilityCode(testMedData)).toBe("DOD");
            });

            it("Should return a string of 'NCH' if it is from a VA associated facility", function(){
                testMedData.facilityCode="500";
                expect(appletHelper.getStandarizedFacilityCode(testMedData)).toBe("NCH");
            });
        });

        //Test for .getSubcategory()
        describe("Determine what subcategory, if any, the medication falls under", function(){
            it("Should return 'PRN' if .isPRN() is true", function(){
                testMedData.sig = "Take as needed";
                expect(appletHelper.getSubcategory(testMedData)).toBe("PRN");
            });

            it("Should return 'IV' if vaType is 'V'", function(){
                testMedData.vaType = "V";
                expect(appletHelper.getSubcategory(testMedData)).toBe("IV");
            });

            it("Should return false if the medication is not PRN or IV", function(){
                testMedData.vaType = "O";
                testMedData.sig = "Once a day";
                expect(appletHelper.getSubcategory(testMedData)).toBe(false);
            });
        });

        //Test for .getSummaryViewDate()
        describe("Return the relevant stop date for the medication. Changes if the med expired, discontinued, has just been ordered, etc...", function(){
            it("Should return the overallStop field if the medication has expired on time", function(){
                testMedData.overallStop = "19980729";
                testMedData.vaStatus = "Expired";
                expect(appletHelper.getSummaryViewDate(testMedData)).toBe("19980729");
            });

            it("Should return the overallStop field if the medication's vaStatus is ACTIVE", function(){
                testMedData.overallStop = "19980729";
                testMedData.vaStatus = "Active";
                expect(appletHelper.getSummaryViewDate(testMedData)).toBe("19980729");
            });

            it("Should return the stopped field if the medication is discontinued", function(){
                testMedData.stopped = "20050317";
                testMedData.vaStatus = "Discontinued";
                expect(appletHelper.getSummaryViewDate(testMedData)).toBe("20050317");
            });

            it("Should return the stopped field if the medication is discontinued/edit", function(){
                testMedData.stopped = "20050317";
                testMedData.vaStatus = "Discontinued/edit";
                expect(appletHelper.getSummaryViewDate(testMedData)).toBe("20050317");
            });

            it("Should return the first ordered field if the medication is suspended", function(){
                testMedData.orders[0].ordered = "20000211";
                testMedData.vaStatus = "suspend";
                expect(appletHelper.getSummaryViewDate(testMedData)).toBe("20000211");
            });

            it("Should return the first ordered field if the medication is on hold", function(){
                testMedData.orders[0].ordered = "20000211";
                testMedData.vaStatus = "hold";
                expect(appletHelper.getSummaryViewDate(testMedData)).toBe("20000211");
            });

            it("Should return false if the vaStatus is anything else, such as 'Pending'", function(){
                testMedData.vaStatus = "pending";
                expect(appletHelper.getSummaryViewDate(testMedData)).toBe(false);
            });
        });

    });
