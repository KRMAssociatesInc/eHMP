Ext.define('gov.va.hmp.ptselect.PatientStore', {
    extend: 'Ext.data.Store',
    requires: [
        'gov.va.hmp.ptselect.PatientSelect'
    ],
    model: 'gov.va.hmp.ptselect.PatientSelect',
    pageSize: 100,
    storeId: 'ptSelectStore',
    proxy: {
        type: 'ajax',
        url: '/patientselect/v1/patients',
        reader: {
            type: 'json',
            root: 'data.items',
            totalProperty: 'data.totalItems'
        }
    }
});
