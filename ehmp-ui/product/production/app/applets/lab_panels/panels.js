/*jslint node: true, nomen: true, unparam: true */
/*global jquery, $, _, define, Marionette, jqm, describe, it, expect, beforeEach, spyOn */
'use strict';
define(function() {
    var Panels = [{
        id: 'CHEM7',
        name: 'CHEM7',
        view: 'panel7',
        codes: [{
            display: 'CO2',
            code: 'urn:va:ien:60:179:72'
        }, {
            display: 'CREAT',
            code: 'urn:va:ien:60:173:72'
        }, {
            display: 'CL',
            code: 'urn:va:ien:60:178:72'
        }, {
            display: 'K',
            code: 'urn:va:ien:60:177:72'
        }, {
            display: 'NA',
            code: 'urn:va:ien:60:176:72'
        }, {
            display: 'BUN',
            code: 'urn:va:ien:60:174:72'
        }, {
            display: 'GLUCOSE',
            code: 'urn:va:ien:60:175:72'
                // }, {
                //     display: 'CA',
                //     code: 'urn:va:ien:60:180:72'
        }]
    }, {
        id: 'CUSTOM1',
        name: 'CUSTOM1',
        view: 'panel8',
        codes: [{
            display: 'CHOL',
            code: 'urn:va:ien:60:183:72'
        }, {
            display: 'MB',
            code: 'urn:va:ien:60:440:72'
        }, {
            display: 'CKMB%',
            code: 'urn:va:ien:60:443:72'
        }, {
            display: 'LDH',
            code: 'urn:va:ien:60:189:72'
        }, {
            display: 'GLUCOSE',
            code: 'urn:va:ien:60:175:72'
        }, {
            display: 'BUN',
            code: 'urn:va:ien:60:174:72'
        }, {
            display: 'CREAT',
            code: 'urn:va:ien:60:173:72'
        }, {
            display: 'NA',
            code: 'urn:va:ien:60:176:72'
                // }, {
                //     display: 'TROPNIN',
                //     code: 'urn:va:ien:60:5093:72'
                // }, {
                //     display: 'CPK',
                //     code: 'urn:va:ien:60:197:72'
                // }, {
                //     display: 'K',
                //     code: 'urn:va:ien:60:177:72'
                // }, {
                //     display: 'CL',
                //     code: 'urn:va:ien:60:178:72'
                // }, {
                //     display: 'CO2',
                //     code: 'urn:va:ien:60:179:72'
                // }, {
                //     display: 'HDL',
                //     code: 'urn:va:ien:60:244:72'
        }]
    }, {
        id: 'CUSTOM2',
        name: 'CUSTOM2',
        view: 'panel4',
        codes: [{
                display: 'PT',
                code: 'urn:va:ien:60:467:73'
            }, {
                display: 'INR',
                code: 'urn:va:ien:60:5110:73'
            }]
            // }, {
            //     id: 'CUSTOM3',
            //     name: 'CUSTOM3',
            //     codes: [{
            //         display: 'GLUCOSE',
            //         code: 'urn:va:ien:60:175:72'
            //     }]
    }, {
        id: 'CUSTOM4',
        name: 'CUSTOM4',
        codes: [{
            display: 'Potassium [Moles/volume] in Serum or Plasma',
            code: '2823-3'
        }]
    }];
    return Panels;
});