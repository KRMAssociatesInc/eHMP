Ext.define('gov.va.hmp.team.CurrentUserTeamStore', {
    extend: 'gov.va.hmp.team.TeamStore',
    storeId: 'currentUserTeams',
    proxy: {
        type: 'ajax',
        url: '/teamMgmt/v1/team/list',
        extraParams: {
            forCurrentUser: true
        },
        reader: {
            type: 'json',
            root: 'data.items',
            totalProperty: 'data.totalItems'
        }
    }
});