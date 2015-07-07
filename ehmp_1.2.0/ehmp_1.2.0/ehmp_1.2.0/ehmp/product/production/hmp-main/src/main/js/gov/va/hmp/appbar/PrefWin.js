Ext.define('gov.va.hmp.appbar.PrefWin',{
	extend: 'Ext.window.Window',
	requires: ['gov.va.cpe.roster.FavoriteRosterPicker'],
    alias: 'widget.prefwin',
	id: 'PrefWinID',
 	height: 450,
 	width: 650,
 	stateful: false,
 	stateId: 'PrefWinID',
 	title: 'User Preferences',
 	layout: 'fit',
 	closeAction: 'hide',
 	modal: true,
 	listeners: {
 		show: function() {
 			this.disable();
            this.load();
 		}
 	},
 	initComponent: function() {
 		this.callParent(arguments);
 		this.form = Ext.create('Ext.form.Basic', this);
 	},
 	load: function() {
 		var me = this;
 		Ext.Ajax.request({
 			url: '/param/get/VPR USER PREF?default={}',
 			success: function(resp) {
				var txt = Ext.String.htmlDecode(resp.responseText);
 				var prefs = Ext.JSON.decode(txt);
 				me.form.setValues(prefs);
 				me.enable();
 			}
 		});
 	},
 	save: function() {
 		var vals = this.form.getValues();
 		Ext.Ajax.request({
 			url: '/param/set/VPR USER PREF',
 			params: vals,
 			success: function() {
 				window.location.reload();
 			}
 		});
 		this.close();
 	},
 	fbar: [
         {
             text: 'Cancel',
             handler: function() {
                 this.up('window').close();
             }
         },
         {
             text: 'Save and Reload',
             ui: 'primary',
             handler: function() { this.up('window').save();}
         }
     ],
 	items: {
 		xtype: 'tabpanel',
 		activeTab: 0,
        bodyPadding: '5 0 0 0',
 		defaults: {
 			padding: 5,
            defaults: {
//                 anchor: '100%',
                 labelSeparator: '',
                labelAlign: 'right'
            }
 		},
 		items: [
            {
                xtype: 'fieldcontainer',
                title: 'HMP',
                layout: 'anchor',
                defaults: {
                    anchor: '100%'
                },
                items: [
                    {
                        xtype: 'combobox',
                        fieldLabel: 'Theme',
                        name: 'ext.theme',
                        value: '/css/hmp-blue-dk.css',
                        emptyText: 'Theme',
                        displayField: 'text',
                        valueField: 'path',
                        store: Ext.create('Ext.data.Store', {
                            fields: ['path', 'text', 'color1', 'color2'],
                            data: [
                                { path: '/css/hmp-blue-ltr.css', text: 'Blues Lighter', color1: '#BDD7E7', color2: '#EFF3FF'},
                                { path: '/css/hmp-blue-lt.css', text: 'Blues Light', color1: '#6BAED6', color2: '#BDD7E7'},
                                { path: '/css/hmp-blue.css', text: 'Blues', color1: '#3182BD', color2: '#6BAED6'},
                                { path: '/css/hmp-blue-dk.css', text: 'Blues Dark', color1: '#08519C', color2: '#3182BD'},

                                { path: '/css/hmp-green-ltr.css', text: 'Greens Lighter', color1: '#BAE4B3', color2: '#EDF8E9'},
                                { path: '/css/hmp-green-lt.css', text: 'Greens Light', color1: '#74C476', color2: '#BAE4B3'},
                                { path: '/css/hmp-green.css', text: 'Greens', color1: '#31A354', color2: '#74C476'},
                                { path: '/css/hmp-green-dk.css', text: 'Greens Dark', color1: '#006D2C', color2: '#31A354'},

                                { path: '/css/hmp-grey-ltr.css', text: 'Greys Lighter', color1: '#CCCCCC', color2: '#F7F7F7'},
                                { path: '/css/hmp-grey-lt.css', text: 'Greys Light', color1: '#969696', color2: '#CCCCCC'},
                                { path: '/css/hmp-grey.css', text: 'Greys', color1: '#636363', color2: '#969696'},
                                { path: '/css/hmp-grey-dk.css', text: 'Greys Dark', color1: '#252525', color2: '#636363'},

                                { path: '/css/hmp-orange-ltr.css', text: 'Oranges Lighter', color1: '#FDBE85', color2: '#FEEDDE'},
                                { path: '/css/hmp-orange-lt.css', text: 'Oranges Light', color1: '#FD8D3C', color2: '#FDBE85'},
                                { path: '/css/hmp-orange.css', text: 'Oranges', color1: '#E6550D', color2: '#FD8D3C'},
                                { path: '/css/hmp-orange-dk.css', text: 'Oranges Dark', color1: '#A63603', color2: '#E6550D'},

                                { path: '/css/hmp-purple-ltr.css', text: 'Purples Lighter', color1: '#CBC9E2', color2: '#F2F0F7'},
                                { path: '/css/hmp-purple-lt.css', text: 'Purples Light', color1: '#9E9AC8', color2: '#CBC9E2'},
                                { path: '/css/hmp-purple.css', text: 'Purples', color1: '#756BB1', color2: '#9E9AC8'},
                                { path: '/css/hmp-purple-dk.css', text: 'Purples Dark', color1: '#54278F', color2: '#756BB1'},

                                { path: '/css/hmp-red-ltr.css', text: 'Reds Lighter', color1: '#FCAE91', color2: '#FEE5D9'},
                                { path: '/css/hmp-red-lt.css', text: 'Reds Light', color1: '#FB6A4A', color2: '#FCAE91'},
                                { path: '/css/hmp-red.css', text: 'Reds', color1: '#DE2D26', color2: '#FB6A4A'},
                                { path: '/css/hmp-red-dk.css', text: 'Reds Dark', color1: '#A50F15', color2: '#DE2D26'},

                                { path: '/css/hmp-bugn-ltr.css', text: 'BuGn Lighter', color1: '#B2E2E2', color2: '#EDF8FB'},
                                { path: '/css/hmp-bugn-lt.css', text: 'BuGn Light', color1: '#66C2A4', color2: '#B2E2E2'},
                                { path: '/css/hmp-bugn.css', text: 'BuGn', color1: '#2CA25F', color2: '#66C2A4'},
                                { path: '/css/hmp-bugn-dk.css', text: 'BuGn Dark', color1: '#006D2C', color2: '#2CA25F'},

                                { path: '/css/hmp-bupu-ltr.css', text: 'BuPu Lighter', color1: '#B3CDE3', color2: '#EDF8FB'},
                                { path: '/css/hmp-bupu-lt.css', text: 'BuPu Light', color1: '#8C96C6', color2: '#B3CDE3'},
                                { path: '/css/hmp-bupu.css', text: 'BuPu', color1: '#8856A7', color2: '#8C96C6'},
                                { path: '/css/hmp-bupu-dk.css', text: 'BuPu Dark', color1: '#810F7C', color2: '#8856A7'},

                                { path: '/css/hmp-pubugn-ltr.css', text: 'PuBuGn Lighter', color1: '#BDC9E1', color2: '#F6EFF7'},
                                { path: '/css/hmp-pubugn-lt.css', text: 'PuBuGn Light', color1: '#67A9CF', color2: '#BDC9E1'},
                                { path: '/css/hmp-pubugn.css', text: 'PuBuGn', color1: '#1C9099', color2: '#67A9CF'},
                                { path: '/css/hmp-pubugn-dk.css', text: 'PuBuGn Dark', color1: '#016C59', color2: '#1C9099'},

                                { path: '/css/hmp-rdpu-ltr.css', text: 'RdPu Lighter', color1: '#FBB4B9', color2: '#FEEBE2'},
                                { path: '/css/hmp-rdpu-lt.css', text: 'RdPu Light', color1: '#F768A1', color2: '#FBB4B9'},
                                { path: '/css/hmp-rdpu.css', text: 'RdPu', color1: '#C51B8A', color2: '#F768A1'},
                                { path: '/css/hmp-rdpu-dk.css', text: 'RdPu Dark', color1: '#7A0177', color2: '#C51B8A'},

                                { path: '/css/hmp-ylgnbu-ltr.css', text: 'YlGnBu Lighter', color1: '#A1DAB4', color2: '#FFFFCC'},
                                { path: '/css/hmp-ylgnbu-lt.css', text: 'YlGnBu Light', color1: '#41B6C4', color2: '#A1DAB4'},
                                { path: '/css/hmp-ylgnbu.css', text: 'YlGnBu', color1: '#2C7FB8', color2: '#41B6C4'},
                                { path: '/css/hmp-ylgnbu-dk.css', text: 'YlGnBu Dark', color1: '#253494', color2: '#2C7FB8'},

                                { path: '/lib/ext-4.2.2.1144/resources/css/ext-all.css', text: 'Default ExtJS 4.2'},
                                { path: '/lib/ext-4.2.2.1144/resources/css/ext-all-gray.css', text: 'Gray ExtJS 4.2'}
                            ]
                        }),
                        listConfig: {
                            getInnerTpl: function () {
                                return '<div class="x-combo-list-item"><div style="float:left;width:16px;height:16px;background-color:{color1}"></div><div style="float:left;width:16px;height:16px;background-color:{color2};margin:right:2px"></div><span>{text}</span></div>';
                            }
                        }
                    },
                    {
                        fieldLabel: 'Default Workspace',
                        xtype: 'combobox',
                        name: 'aviva.default.app',
                        emptyText: 'Default Workspace...',
                        store: ['cpe', 'admin']
                    }
                ]
            },
            {
                xtype: 'radiogroup',
                title: 'Date/Time Format',
                columns: 3,
                items: [
                    {
                        boxLabel: 'HMP Default',
                        name: 'cpe.datetime.format',
                        inputValue: 'mscui',
                        checked: true
                    },
                    {
                        boxLabel: 'CPRS Style',
                        name: 'cpe.datetime.format',
                        inputValue: 'cprs'
                    },
                    {
                        boxLabel: '"Sortable"',
                        name: 'cpe.datetime.format',
                        inputValue: 'sortable'
                    },
                    {
                        xtype: 'component',
                        itemId: 'mscui-format-examples',
                        html:'<table class="hmp-labeled-values">' +
                            '<tr><td>Date/Time</td><td>08-Aug-2008 15:11</td></tr>' +
                            '<tr><td>Date</td><td>08-Aug-2008</td></tr>' +
                            '<tr><td>Month/Year</td><td>Aug-2008</td></tr>' +
                            '<tr><td>Year</td><td>2008</td></tr>' +
                            '</table>'
                    },
                    {
                        xtype: 'component',
                        itemId: 'cprs-format-examples',
                        html:'<table class="hmp-labeled-values">' +
                            '<tr><td>Date/Time</td><td>Aug 08,08 15:11</td></tr>' +
                            '<tr><td>Date</td><td>Aug 08,08</td></tr>' +
                            '<tr><td>Month/Year</td><td>Aug 2008</td></tr>' +
                            '<tr><td>Year</td><td>2008</td></tr>' +
                            '</table>'
                    },
                    {
                        xtype: 'component',
                        itemId: 'sortable-format-examples',
                        html:'<table class="hmp-labeled-values">' +
                            '<tr><td>Date/Time</td><td>2008-08-08 15:11</td></tr>' +
                            '<tr><td>Date</td><td>2008-08-08</td></tr>' +
                            '<tr><td>Month/Year</td><td>2008-08</td></tr>' +
                            '<tr><td>Year</td><td>2008</td></tr>' +
                            '</table>'
                    }
                ]
            }
        ]
 	}
});

