Ext.define('gov.va.hmp.ptselect.Location', {
    extend: 'Ext.data.Model',
    idProperty: 'uid',
    fields: [
        'uid', 'name', 'displayName', 'division', 'service', 'displayService', 'title', 'displayTitle'
    ]
});