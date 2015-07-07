Ext.define('gov.va.cpe.order.Orderable', {
	extend: 'Ext.data.Model',
    requires: [
        'gov.va.cpe.order.Types',
        'gov.va.cpe.order.Dose',
        'gov.va.cpe.order.ImagingDetails',
        'gov.va.cpe.order.DialogAdditionalInformation',
        'gov.va.cpe.order.LabDetails'
    ],
    idProperty:'uid',
    fields: [
        {name: 'name', type: 'string'},
        {name: 'uid', type: 'string'},
        {name:'summary', type: 'string'},
        {name: 'internal', type: 'string'}
    ],
    hasMany  : [
        {model: 'gov.va.cpe.order.Types', name: 'types', associationKey: 'types'},
        {model: 'gov.va.cpe.order.Dose', name: 'possibleDosages', associationKey: 'possibleDosages'}
    ],
    hasOne: [
        {model: 'gov.va.cpe.order.ImagingDetails', name: 'imagingDetails'},
        {model: 'gov.va.cpe.order.DialogAdditionalInformation', name: 'dialogAdditionalInformation', associationKey: 'dialogAdditionalInformation'},
        {model: 'gov.va.cpe.order.LabDetails', name: 'labDetails'}
    ]
});