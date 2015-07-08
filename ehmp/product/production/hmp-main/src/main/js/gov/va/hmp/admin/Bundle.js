Ext.define('gov.va.hmp.admin.Bundle', {
    extend: 'Ext.data.Model',
    idProperty: 'bundleId',
    fields: [
        'bundleId', 'name', 'symbolicName', 'version', 'description', 'vendor', 'category', 'stateRaw', 'state', 'docUrl', 'services'
    ]
});