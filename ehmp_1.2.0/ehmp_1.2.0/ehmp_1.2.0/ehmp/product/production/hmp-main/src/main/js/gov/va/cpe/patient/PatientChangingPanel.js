Ext.define('gov.va.cpe.patient.PatientChangingPanel', {
    extend: 'gov.va.cpe.patient.TransitoryPatientContextContainer',
    alias: 'widget.patientchangingpanel',
    layout: {
        type: 'vbox',
        align: 'center'
    },
    items: [
        {
            xtype: 'component',
            autoEl: 'h4',
            html: 'Changing Patients'
        },
        {
            xtype: 'image',
            src: '/images/spinner-32.gif',
            maxHeight: 32,
            maxWidth: 32
        }
    ]
});