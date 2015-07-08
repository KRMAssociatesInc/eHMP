define([
    "backbone",
    "marionette",
    'underscore',
    "hbs!app/applets/lab_results_grid/list/dateTemplate",
    "hbs!app/applets/lab_results_grid/list/labTestCoverSheetTemplate",
    "hbs!app/applets/lab_results_grid/list/labTestSinglePageTemplate",
    "hbs!app/applets/lab_results_grid/list/resultTemplate",
    "hbs!app/applets/lab_results_grid/list/siteTemplate",
    "hbs!app/applets/lab_results_grid/list/flagTemplate",
    "hbs!app/applets/lab_results_grid/list/referenceRangeTemplate"
], function(Backbone, Marionette, _, dateTemplate, labTestCSTemplate, labTestSPTemplate, resultTemplate, siteTemplate, flagTemplate, referenceRangeTemplate) {
    function customFlagSort(model, sortKey) {
        var code = model.attributes.interpretationCode;
        if (code !== undefined) {
            var flag = model.attributes.interpretationCode.split(":").pop();

            if (flag === 'H*') {
                return -4;
            }
            if (flag === 'L*') {
                return -3;
            }
            if (flag === 'H') {
                return -2;
            }
            if (flag === 'L') {
                return -1;
            }
        }
        return 0;
    }

    return {
        //Data Grid Columns
        dateCol: function(){
            return {
                name: "observed",
                label: "Date",
                template: dateTemplate,
                cell: "handlebars",
                hoverTip: 'labresults_date'
            };
        },
        testCol: function(){
            return{
                name: "typeName",
                label: "Lab Test",
                template: labTestCSTemplate,
                cell: "handlebars",
                hoverTip: 'labresults_labtest'
            };
        },
        flagCol: function(){
            return {
                name: "flag",
                label: "Flag",
                template: flagTemplate,
                cell: "handlebars",
                sortValue: customFlagSort,
                hoverTip: 'labresults_flag'
            };
        },
        resultAndUnitCol: function(){
            return {
                name: "result",
                label: "Result",
                template: resultTemplate,
                cell: "handlebars",
                hoverTip: 'labresults_result'
            };
        },
        resultNoUnitCol: function(){
            return {
                name: "result",
                label: "Result",
                cell: "string",
                hoverTip: 'labresults_result'
            };
        },
        unitCol: function(){
            return {
                name: "units",
                label: "Unit",
                cell: "string",
                hoverTip: 'labresults_unit'
            };
        },
        refCol: function(){
            return {
                name: "referenceRange",
                label: "Ref Range",
                template: referenceRangeTemplate,
                cell: "handlebars",
                hoverTip: 'labresults_refrange'
            };
        },
        facilityCol: function(){
            return {
                name: "facilityMoniker",
                label: "Facility",
                template: siteTemplate,
                cell: "handlebars",
                hoverTip: 'labrestuls_facility'
            };
        }
    };
});