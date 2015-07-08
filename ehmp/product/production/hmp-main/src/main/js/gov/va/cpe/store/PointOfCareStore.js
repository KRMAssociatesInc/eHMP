Ext.define('gov.va.cpe.store.PointOfCareStore', {
	requires: ['gov.va.cpe.model.PointOfCareModel'],
	extend: 'Ext.data.Store',
	storeId: 'pocStore',
	model: 'gov.va.cpe.model.PointOfCareModel',
    sorters: ['displayName'],
	proxy: {
		type: 'ajax',
		url: '/nonPatientDomain/list?domain=pointOfCare',
		reader: {
			type: 'json',
			root: 'data'
		},
		displayField: 'displayName',
		valueField: 'uid'
	}
});