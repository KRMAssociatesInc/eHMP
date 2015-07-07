/**
 * Controls CPEApp and subcomponents
 */
Ext.define('gov.va.cpe.CPEController', {
    extend: 'gov.va.hmp.Controller',
    uses: [
        'gov.va.hmp.PatientContext',
        'gov.va.hmp.EncounterContext',
        'gov.va.hmp.UserContext'
    ],
    refs: [
        {
            ref: 'singleMultiContainer',
            selector: '#singleMultiPtCt'
        },
        {
            ref: 'singlePtDisplay',
            selector: 'ptcontextcontainer'
        },
        {
            ref: 'previousButton',
            selector: '#prev'
        },
        {
            ref: 'nextButton',
            selector: '#next'
        }
    ],
    init: function () {
        var me = this;
        this.control({
            '#prev': {
                click: me.onSwitchToMultiPatient
            },
            '#next': {
                click: me.onSwitchToSinglePatient
            },
            'patientpicker': {
                selectionchange: me.onPatientSelectionChange
            }
        });
    },
    onSwitchToSinglePatient:function(button, event) {
        this.getSingleMultiContainer().getLayout().setActiveItem('singlePt');
        this.postCpeActiveItem('singlePt');
    },
    onSwitchToMultiPatient:function(button, event) {
        this.getSingleMultiContainer().getLayout().setActiveItem('multiPt');
        this.postCpeActiveItem('multiPt');
    },
    postCpeActiveItem:function(activeItem) {
        Ext.Ajax.request({
            url: "/app/cpeActiveItem/"+activeItem,
            method: "POST"
        });
    },
    onPatientSelectionChange: function (cmp, patients) {
        if (patients && patients.length > 0) {
            var pid = patients[0].get('pid');
            gov.va.hmp.EncounterContext.setEncounterUid(pid, patients[0].data);
            gov.va.hmp.PatientContext.setPatientContext(pid);
        }
    }
});