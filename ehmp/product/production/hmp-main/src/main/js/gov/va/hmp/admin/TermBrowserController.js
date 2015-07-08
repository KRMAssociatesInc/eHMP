/**
 * Controls behavior of {@link gov.va.hmp.admin.TermBrowserPanel}
 */
Ext.define('gov.va.hmp.admin.TermBrowserController', {
    extend:'gov.va.hmp.Controller',
    requires:[
        'gov.va.hmp.admin.TermBrowserTree',
        'gov.va.hmp.admin.TermBrowserPanel'
    ],
    refs: [
        {
            ref: 'termSearchField',
            selector: '#termSearchField'
        },
        {
            ref: 'termSearchTabs',
            selector: '#termSearchTabs'
        }
    ],
    init:function () {
//        console.log(Ext.getClassName(this) + ".init()");
        var me = this;

        me.control({
            '#termSearchField': {
                'select': me.executeTermSearch,
                'specialkey': function(field, e) {
            		if (e.getKey() == e.ENTER) {
            			me.executeTermSearch();
            		}
                },
                'focus': function(field) {
                	field.selectText(); // select all of the text results
                } 
            }
        });
    },
//    onLaunch:function() {
//        this.getTermSearchField().getStore().load();
//    },
    executeTermSearch: function() {
        var me = this;

        var target = me.getTermSearchTabs();
        var searchText = me.getTermSearchField().getValue();
        var tab = target.add({xtype: 'component', title: 'Search: ' + searchText, closable: true, loader: {url: '/term/display?urn='+searchText, renderer: 'html', autoLoad: true}});
//    	tab = target.add({xtype: 'termbrowsertree', title: 'Search: ' + searchText, searchText: searchText, closable: true});
        target.setActiveTab(tab);
    }
});