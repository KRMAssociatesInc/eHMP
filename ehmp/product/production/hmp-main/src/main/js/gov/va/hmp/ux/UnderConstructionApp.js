Ext.define('gov.va.hmp.ux.UnderConstructionApp', {
    extend: 'gov.va.hmp.Application',
    requires: [
        'gov.va.hmp.ux.UnderConstruction'
    ],
    autoCreateViewport: true,
    launch: function () {
        var viewport = Ext.ComponentQuery.query('viewport')[0];
        viewport.add({
            xtype: 'underconstruction',
            region: 'center'
        });
    }
});