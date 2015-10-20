define([
    "backbone",
    "underscore",
    'app/applets/vitals/util'
], function(Backbone, _, Util) {

    var gistConfiguration = {
        fetchOptions: {
            resourceTitle: 'patient-record-med',
            cache: true,
            viewModel: {
                parse: function(response) {
                    var ageData = ADK.utils.getTimeSince(response.lastAction);
                    response.age = response.lastAction;
                    response.ageDescription = ageData.timeSinceDescription;
                    return response;
                }
            },
            pageable: false,
            criteria: {
                filter: ''
            }
        },
        enableTileSorting: true,
        tileSortingUniqueId : 'typeName',
        gistHeaders: {
            header1: {
                title: 'Type',
                sortable: true,
                sortType: 'alphabetical',
                key: 'descriptionColumn',
                hoverTip: 'vitals_type'
            },
            header2: {
                title: 'Result',
                sortable: true,
                sortType: 'numeric',
                key: 'result',
                hoverTip: 'vitals_results'
            },
            header3: {
                title: '',
                sortable: false,
            },
            header4: {
                title: 'Last',
                sortable: true,
                sortType: 'date',
                key: 'observed',
                hoverTip: 'vitals_last'
            }
        },
        enableHeader: 'true',

        gistModel: [{            
            id: 'name',
            field: 'displayName'        
        }, {            
            id: 'result',
            field: 'result'        
        }, {            
            id: 'finalResult',
            field: 'finalResult'        
        }, {            
            id: 'interpretationField',
            field: 'interpretationField'        
        }, {            
            id: 'timeSince',
            field: 'timeSince'        
        }, {            
            id: 'low',
            field: 'low'        
        }, {            
            id: 'bmiValue',
            field: 'bmiValue'        
        }, {            
            id: 'high',
            field: 'high'        
        }, {            
            id: 'vitalColumns',
            field: 'vitalColumns'        
        }, {            
            id: 'previousResult',
            field: 'previousResult'        
        }, {            
            id: 'fullName',
            field: 'qualifiedName'        
        }, {            
            id: 'value',
            field: 'result'        
        }, {            
            id: 'referenceRange',
            field: 'referenceRange'        
        }, {            
            id: 'observedTime',
            field: 'observedFormatted'        
        }, {            
            id: 'observationType',
            field: 'observationType'        
        }, {            
            id: 'tooltip',
            field: 'tooltip'        
        }],
        filterFields: [''],
        defaultView: 'observation',
        viewColumns: 1,
        graphOptions: {
            height: '19', //defaults to 20
            width: '90', //defaults to 80
            id: '',
            abnormalRangeWidth: 22, //defaults to Math.floor(w / 4)
            //rhombusA: 6, //defaults to Math.floor(h / 2 * 0.7)
            //rhombusB: 3.5, //defaults to Math.floor(aw / 2 * 0.4)
            //radius: 3, //defaults to 2.5
            //hasCriticalInterpretation: true //hasCriticalInterpretation: false, defaults to false,
            BMI: function() {
                return graphOptions_BMI;
            },
            PN: function() {
                return graphOptions_PN;
            },
            PO2: function() {
                return graphOptions_PO2;
            },
            HT: function() {
                return graphOptions_HT;
            }
        },
    };

    var graphOptions_BMI = _.extend(_.clone(gistConfiguration.graphOptions), {
        ranges: [{
            high: 18.5,
            interpretations: [{
                flag: 'L',
                valueClass: 'abnormalValue',
                description: 'underweight'
            }],
            width: gistConfiguration.graphOptions.abnormalRangeWidth,
            rangeClass: 'abnormalRange lowRange',
            positionValues: 'center'
        }, {
            low: 18.5,
            includeLow: true,
            high: 25,
            interpretations: [{
                flag: 'N',
                valueClass: 'normalValue',
                description: 'normal'
            }],
            width: gistConfiguration.graphOptions.width - 2 * gistConfiguration.graphOptions.abnormalRangeWidth,
            rangeClass: 'normalRange',
            positionValues: 'scaled'
        }, {
            low: 25,
            includeLow: true,
            high: 30,
            interpretations: [{
                flag: 'H',
                valueClass: 'abnormalValue',
                description: 'overweight'
            }],
            width: gistConfiguration.graphOptions.abnormalRangeWidth / 2,
            rangeClass: 'abnormalRange highRange',
            positionValues: 'center'
        }, {
            low: 30,
            includeLow: true,
            interpretations: [{
                flag: 'H',
                valueClass: 'abnormalValue',
                description: 'obese'
            }],
            width: gistConfiguration.graphOptions.abnormalRangeWidth / 2,
            rangeClass: 'abnormalRange criticalHighRange',
            positionValues: 'center'
        }]
    });
    var graphOptions_PN = _.extend(_.clone(gistConfiguration.graphOptions), {
        ranges: [{
            high: 0,
            interpretations: [{
                flag: 'L',
                valueClass: 'abnormalValue',
                description: 'low'
            }],
            width: gistConfiguration.graphOptions.abnormalRangeWidth,
            rangeClass: 'abnormalRange hashedRange lowRange',
            positionValues: 'center'
        }, {
            low: 0,
            includeLow: true,
            high: 2,
            includeHigh: true,
            interpretations: [{
                flag: 'N',
                valueClass: 'normalValue',
                description: 'normal'
            }],
            width: gistConfiguration.graphOptions.width - 2 * gistConfiguration.graphOptions.abnormalRangeWidth,
            rangeClass: 'normalRange',
            positionValues: 'scaled'
        }, {
            low: 2,
            high: 5,
            interpretations: [{
                flag: 'H',
                valueClass: 'abnormalValue',
                description: 'high'
            }],
            width: gistConfiguration.graphOptions.abnormalRangeWidth / 4,
            rangeClass: 'abnormalRange highRange',
            positionValues: 'center'
        }, {
            low: 5,
            includeLow: true,
            high: 7,
            interpretations: [{
                flag: 'H',
                valueClass: 'abnormalValue',
                description: 'high'
            }],
            width: gistConfiguration.graphOptions.abnormalRangeWidth / 4,
            rangeClass: 'abnormalRange highRange',
            positionValues: 'center'
        }, {
            low: 7,
            includeLow: true,
            high: 9,
            interpretations: [{
                flag: 'H',
                valueClass: 'abnormalValue',
                description: 'critical high'
            }],
            width: gistConfiguration.graphOptions.abnormalRangeWidth / 4,
            rangeClass: 'abnormalRange criticalHighRange',
            positionValues: 'center'
        }, {
            low: 9,
            includeLow: true,
            interpretations: [{
                flag: 'H',
                valueClass: 'abnormalValue',
                description: 'critical high'
            }],
            width: gistConfiguration.graphOptions.abnormalRangeWidth / 4,
            rangeClass: 'abnormalRange criticalHighRange',
            positionValues: 'center'
        }]
    });
    var graphOptions_PO2 = _.extend(_.clone(gistConfiguration.graphOptions), {
        ranges: [{
            high: 90,
            interpretations: [{
                flag: 'L',
                valueClass: 'abnormalValue',
                description: 'critical low'
            }],
            width: gistConfiguration.graphOptions.abnormalRangeWidth / 2,
            rangeClass: 'abnormalRange criticalLowRange',
            positionValues: 'center'
        }, {
            low: 90,
            includeLow: true,
            high: 95,
            includeHigh: true,
            interpretations: [{
                flag: 'L',
                valueClass: 'abnormalValue',
                description: 'low'
            }],
            width: gistConfiguration.graphOptions.abnormalRangeWidth / 2,
            rangeClass: 'abnormalRange lowRange',
            positionValues: 'center'
        }, {
            low: 95,
            high: 100,
            includeHigh: true,
            interpretations: [{
                flag: 'N',
                valueClass: 'normalValue',
                description: 'normal'
            }],
            width: gistConfiguration.graphOptions.width - 2 * gistConfiguration.graphOptions.abnormalRangeWidth,
            rangeClass: 'normalRange',
            positionValues: 'scaled'
        }, {
            includeHigh: true,
            interpretations: [{
                flag: 'L',
                valueClass: 'abnormalValue',
                description: 'low'
            }],
            width: gistConfiguration.graphOptions.abnormalRangeWidth,
            rangeClass: 'abnormalRange hashedRange highRange',
            positionValues: 'center'
        }]
    });
    var graphOptions_HT = _.extend(_.clone(gistConfiguration.graphOptions), {
        ranges: [{
            high: 0,
            includeHigh: true,
            interpretations: [{
                flag: 'L',
                valueClass: 'abnormalValue',
                description: 'abnormal height'
            }],
            width: gistConfiguration.graphOptions.abnormalRangeWidth,
            rangeClass: 'abnormalRange lowRange hashedRange',
            positionValues: 'center'
        }, {
            low: 0,
            high: 118,
            interpretations: [{
                flag: 'N',
                valueClass: 'normalValue',
                description: 'normal'
            }],
            width: gistConfiguration.graphOptions.width - 2 * gistConfiguration.graphOptions.abnormalRangeWidth,
            rangeClass: 'normalRange',
            positionValues: 'scaled'
        }, {
            low: 118,
            includeLow: true,
            interpretations: [{
                flag: 'H',
                valueClass: 'abnormalValue',
                description: 'giant'
            }],
            width: gistConfiguration.graphOptions.abnormalRangeWidth ,
            rangeClass: 'abnormalRange criticalHighRange hashedRange',
            positionValues: 'center'
        }]
    });



    return gistConfiguration;
});