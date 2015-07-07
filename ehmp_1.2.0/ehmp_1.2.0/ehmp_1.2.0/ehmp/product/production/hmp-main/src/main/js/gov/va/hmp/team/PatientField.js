Ext.define('gov.va.hmp.team.PatientField', {
    extend:'gov.va.hmp.ux.InfiniteComboBox',
    requires: [
        'gov.va.hmp.ptselect.PatientStore'
    ],
    alias: 'widget.patientfield',
    displayField:'displayName',
    emptyText:'Search Patients',
    initComponent: function () {
        this.store = Ext.create("gov.va.hmp.ptselect.PatientStore");
        this.callParent(arguments);
    }
});