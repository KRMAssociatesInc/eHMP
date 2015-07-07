Ext.define('gov.va.hmp.ux.UnderConstruction', {
    extend: 'Ext.Container',
    alias: 'widget.underconstruction',
    layout: {
        type:'vbox',
        align:'center',
        defaultMargins: '20 0 0 0'
    },
    items: [
        {
            xtype: 'image',
            height: 128,
            width: 128,
            src: '/images/icons/under_construction_128.png'
        },
        {
            xtype: 'component',
            html: '<p>Under Construction</p>'
        }
    ]
});