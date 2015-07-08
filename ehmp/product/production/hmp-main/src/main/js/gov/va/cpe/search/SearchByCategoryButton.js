Ext.define('gov.va.cpe.search.SearchByCategoryButton', {
    extend: 'gov.va.hmp.ux.BoundMenuButton',
    ui: 'pill',
    text: '<div>Search</div><div class="small">by category</div>',
    emptyText: 'No Search Categories Registered',
    displayField: 'display',
    store: Ext.create('Ext.data.Store', {
        fields:['query','display','type','category','cls','typeFilter','browse','example'],
        proxy:{
            url: '/search/suggest',
            type:'ajax',
            extraParams: {
                query: 'gov.va.cpe.vpr.search.SuggestSearchFrame|help: syntax',
                pid: ''
            }, // updated by changepatient event
            reader: {
                type: 'json',
                root: 'data.items',
                totalProperty: 'totalItems'
            }
        }
    }),
    createMenuItemFn: function(text,  record) {
        var query = record.get('browse') + "|" + record.get('query');
        var menuitem = Ext.widget('menuitem', {
            text: text,
            iconCls: 'none',
            data: record,
            menu: {
                xtype: 'boundmenu',
                emptyText: 'None',
                displayField: 'display',
                store: Ext.create('Ext.data.Store', {
                    fields:['query','display','type','category','cls','typeFilter','browse','example'],
                    proxy:{
                        url: '/search/suggest',
                        type:'ajax',
                        extraParams: {
                            query: query,
                            pid: 0
                        },
                        reader: {
                            type: 'json',
                            root: 'data.items',
                            totalProperty: 'totalItems'
                        }
                    },
                    autoLoad: false
                })
            }
        });
        return menuitem;
    },
    initComponent:function() {
        this.callParent(arguments);

        this.storesLoaded = false;
    },
    // private
    onMenuShow:function() {
        var me = this;
        if (me.rendered && !me.storesLoaded) {
            for (var i = 0; i < me.menu.items.getCount(); i++) {
                var menuitem = me.menu.getComponent(i);
                me.relayEvents(menuitem.menu, ['select']);
                menuitem.menu.getStore().load();
            }

            me.storesLoaded = true;
        }

        me.callParent(arguments);
    }
});