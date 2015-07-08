Ext.define('gov.va.hmp.team.Team', {
    extend: 'Ext.data.Model',
    requires: [
        'gov.va.hmp.team.TeamAssignment',
        'gov.va.hmp.team.TeamCategory'
    ],
    idProperty: 'uid',
    fields: [
        {
            name: 'uid',
            type: 'string'
        },
        {
            name: 'displayName',
            type: 'string'
        },
        {
            name: 'ownerUid',
            type: 'string'
        },
        {
            name: 'ownerName',
            type: 'string'
        },
        {
            name: 'draft',
            type: 'auto'
        },
        {
            name: 'description',
            type: 'string'
        },
        {
            name: 'rosterId',
            type: 'int'
        },
        {
            name: 'totalStaff',
            type: 'int',
            convert: function(v, record) {
                var totalStaff = record.staff().getCount()
                if (totalStaff == 0 && Ext.isDefined(record.raw.staff)) {
                    return record.raw.staff.length;
                } else {
                    return totalStaff;
                }
            }
        }
    ],
    hasMany: [
        {
            associationKey: 'staff',
            model: 'gov.va.hmp.team.TeamAssignment',
            name: 'staff'
        },
        {
            associationKey: 'categories',
            model: 'gov.va.hmp.team.TeamCategory',
            name: 'categories'
        }
    ]
});