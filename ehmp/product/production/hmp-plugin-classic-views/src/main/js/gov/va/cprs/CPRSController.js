/**
 * Controls CPRSApp and subcomponents
 */
Ext.define('gov.va.cprs.CPRSController', {
    extend: 'gov.va.hmp.Controller',
    uses: [
        'gov.va.hmp.UserContext'
    ],
    refs:[
        {
            ref: 'tabs',
            selector: 'tabpanel'
        }
    ],
    init: function () {
        var me = this;
    }
});