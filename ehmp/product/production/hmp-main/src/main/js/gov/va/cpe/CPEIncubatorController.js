/**
 * Controls CPEIncubator and subcomponents
 */
Ext.define('gov.va.cpe.CPEIncubatorController', {
    extend: 'gov.va.hmp.Controller',
    uses: [
        'gov.va.hmp.PatientContext',
        'gov.va.hmp.UserContext'
    ],
    refs:[
        {
            ref: 'singlePtDisplay',
            selector: 'ptcontextcontainer'
        },
        {
            ref: 'patientPicker',
            selector: 'patientpicker'
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
        var ct = button.up('#singleMultiPtCt'),
            boardgrid = ct.down('boardgridpanel'),
            selModel = boardgrid.getSelectionModel();

        if (selModel.hasSelection()) {
            this.getPatientPicker().collapse(Ext.Component.DIRECTION_LEFT, false);
            var pid = selModel.getSelection()[0].get('pid');

            var task = new Ext.util.DelayedTask(function(){
                gov.va.hmp.PatientContext.setPatientContext(pid);
            });
            task.delay(300);
        }

        ct.getLayout().setActiveItem('singlePt');
    },
    onSwitchToMultiPatient:function(button, event) {
        var ct = button.up('#singleMultiPtCt'),
            boardgrid = ct.down('boardgridpanel'),
            selModel = boardgrid.getSelectionModel(),
            pid = gov.va.hmp.PatientContext.pid;

        selModel.deselectAll();
        var i = boardgrid.getStore().find('pid', pid);
        if (i != -1) {
            selModel.select(i, false, true);
            boardgrid.getView().focusRow(i);
        }

        ct.getLayout().setActiveItem('multiPt');
    },
    onPatientSelectionChange: function (cmp, patients) {
        if (patients && patients.length > 0) {
            var pid = patients[0].get('pid');
            gov.va.hmp.EncounterContext.setEncounterUid(pid, patients[0].data);
            gov.va.hmp.PatientContext.setPatientContext(pid);
        }
    }
});