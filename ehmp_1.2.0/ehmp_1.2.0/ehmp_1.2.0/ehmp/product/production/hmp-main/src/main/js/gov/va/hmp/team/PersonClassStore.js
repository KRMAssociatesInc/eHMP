Ext.define('gov.va.hmp.team.PersonClassStore', {
    extend: 'Ext.data.Store',
    storeId: 'personClasses',
    model: 'gov.va.hmp.team.PersonClass',
    groupField: 'providerType',
    proxy: {
        type: 'ajax',
        url: '/js/gov/va/hmp/team/person-classes.json',
        reader: {
            type: 'json',
            root: 'data.items',
            totalProperty: 'data.totalItems'
        }
    }
});