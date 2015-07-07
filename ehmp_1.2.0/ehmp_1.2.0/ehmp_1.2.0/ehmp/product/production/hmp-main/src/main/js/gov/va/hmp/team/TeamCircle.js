Ext.define('gov.va.hmp.team.TeamCircle', {
    extend:'Ext.container.Container',
    requires:[
        'gov.va.hmp.ux.Circle'
    ],
    alias:'widget.teamcircle',
//    config: {
        title:'New Team',
//        subtitle:'New Owner',
//    },
    height:260,
    width:200,
    layout:'fit',
    items:[
        {
            xtype:'circle'
        }
    ],
    initComponent:function () {
        var me = this;

        Ext.apply(me.items[0], {
            title:me.title,
            subtitle:me.subtitle
        });

        me.callParent(arguments);
    },
//    beforeRender: function () {
//        var me = this;
//
//        me.callParent();
//
//        // Apply the renderData to the template args
//        Ext.applyIf(me.renderData, me.getTemplateArgs());
//    },
    setTitle:function(title) {
        this.callParent();
        this.down('circle').setTitle(title);

    },
    setSubtitle:function(subtitle){
        this.down('circle').setSubtitle(subtitle);
    }
});