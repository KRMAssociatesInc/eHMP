Ext.define('gov.va.hmp.team.TeamManagementPanel', {
    extend:'Ext.container.Container',
    requires:[
        'gov.va.hmp.team.StaffAssignmentPanel',
        'gov.va.hmp.team.TeamPositionField',
        'gov.va.hmp.ux.PopUpButton',
        'gov.va.hmp.team.TeamStore',
        'gov.va.hmp.team.TeamCategoryStore',
        'gov.va.cpe.roster.RosterStore',
        'gov.va.cpe.roster.RosterPicker',
        'gov.va.hmp.team.PersonField',
        'gov.va.hmp.team.PersonPicker',
        'gov.va.hmp.team.BoardPicker',
        'gov.va.hmp.ptselect.PatientPicker',
        'gov.va.hmp.team.PatientField',
        'gov.va.cpe.viewdef.ViewDefGridPanel',
        'gov.va.hmp.ux.SearchableList',
        'gov.va.hmp.team.TeamRosterEditor',
        'gov.va.hmp.ux.SegmentedButton',
        'gov.va.hmp.ux.TagField'
    ],
//    padding:10,
    layout:'border',
    items:[
        {
            xtype:'grid',
            ui: 'well',
            frame:true,
            itemId:'teamList',
            title:'Teams',
            region:'west',
            hideHeaders:true,
            minWidth:300,
            width:300,
            split: true,
            emptyText: 'No Teams Found',
            columns:[
                {
                    xtype: 'templatecolumn',
                    flex: 1,
                    tpl: '<div>' +
                            '<div><tpl if="draft"><span class="fa fa-pencil"></span>&nbsp;</tpl><strong>{displayName}</strong><span class="badge pull-right">{totalStaff}</span></div>' +
                            '<div class="text-muted">{ownerName}</div>' +
                        '</div>'
                },
                {
                    xtype:'actioncolumn',
                    width:20,
                    items:[
                        {
                            iconCls: 'fa-times-circle',
                            tooltip:'Remove Team'
                        }
                    ]
                }
            ],
            tools:[
                {
                    xtype: 'button',
                    ui: 'link',
                    itemId:'createTeamButton',
                    text: 'New Team'
                }
            ]
        },
        {
            xtype:'form',
            itemId:'teamEdit',
            region:'center',
//            width: '100%',
            title: '&nbsp;',
            hidden:true,
            autoScroll: false,
//            defaults:{
//                anchor:'100%'
//            },
            layout:{type: 'vbox', align: 'stretch'},
            items:[
                {
                    flex: 0,
                    xtype:'textfield',
                    itemId:'teamNameField',
                    fieldLabel:'Name',
                    emptyText: 'Team Name',
                    maxLength: 96,
                    enforceMaxLength: true
                },
                {
                    flex: 0,
                    xtype:'displayfield',
                    itemId:'ownerNameField',
                    fieldLabel:'Created By',
                    name:'ownerName'
                },
                {
                	flex: 0,
                    xtype:'textarea',
                    itemId:'teamDescriptionField',
                    fieldLabel:'Description',
                    name:'description',
                    emptyText: 'Description'
                },
                {
                	flex: 0,
                	xtype: 'tagfield',
                    itemId:'teamCategoriesField',
                    fieldLabel:'Categories',
                    name:'categories',
                    idField: 'uid',
                    store: {
		    			model:'gov.va.hmp.team.TeamCategory',
		    		    proxy: {
		    		        type: 'ajax',
		    		        url: '/category/list',
		    		        extraParams: {
		    		        	domain: 'team'
		    		        },
		    		        reader: {
		    		            type: 'json',
		    		            root: 'data.items',
		    		            totalProperty: 'data.totalItems'
		    		        }
		    		    }
		    		},
		            addPickerChoice: function(val, success, failure) {
		    			var me = this;
		    			var successFn = success;
		    			var failureFn = failure;
		    			var wnd = Ext.create('Ext.window.Window', {
		    				title: 'Add New Category',
		    				layout: 'fit',
		    				items: [{
		    					xtype: 'form',
		    					layout: {type: 'vbox', align: 'stretch'},
		    					items: [{
		    						xtype: 'textfield',
		    						name: 'name',
		    						fieldLabel: 'Name',
		    						value: val
		    					},{
		    						xtype: 'textfield',
		    						name: 'description',
		    						fieldLabel: 'Description'
		    					}]
		    				}], 
		    				bbar: {
		    					items: [{
		    						xtype: 'button',
		    						text: 'Submit',
		    						handler: function(bn) {
		    							bn.disable();
		    							var wnd = bn.up('window');
		    							var frm = wnd.down('form');
		    							var vals = frm.getForm().getValues();
		    							Ext.apply(vals, {domain: 'team'});
		    							Ext.Ajax.request({
		    								url: "/category/new",
		    					            method: 'POST',
		    					            jsonData: vals,
		    					            success: function(response) {
		    					            	successFn(response);
		    					            	wnd.close();
		    					            },
		    					            failure: function(response) {
		    					            	failureFn(response);
		    					            	wnd.close();
		    					            }
		    							});
		    						}
		    					}]
		    				}
		    			});
		    			wnd.setWidth(300);
		    			wnd.setHeight(180);
		    			wnd.show();
		    		}
                },
                {
                    xtype: 'panel',
                    title: 'Patient Lists',
                    bodyPadding: 10,
                    items: [
                        {
                            xtype: 'component',
                            cls: 'text-muted',
                            html: 'Coming Soon'
                        }
                    ]
                },
                {
                    xtype: 'panel',
                    title: 'Boards',
                    bodyPadding: 10,
                    items: [
                        {
                            xtype: 'component',
                            cls: 'text-muted',
                            html: 'Coming Soon'
                        }
                    ]
                },
                {
                    title: 'Staff',
                    flex: 1,
                    xtype: 'staffeditor',
                    itemId: 'staffList'
                }
            ],
            tools: [
                {
                    xtype: 'button',
                    text: 'Discard Changes',
                    ui: 'link',
                    disabled: true
                },
                {
                    xtype: 'button',
                    itemId: 'removeTeamButton',
                    text: 'Remove',
                    ui: 'link'
                },
                {
                    xtype: 'button',
                    text:'Save',
                    itemId:'saveTeamButton'
                }
            ]
        }
    ],
    initComponent:function () {
        this.items[0].store = Ext.data.StoreManager.containsKey('teamsdraft') ? Ext.getStore('teamsdraft') : Ext.create('gov.va.hmp.team.TeamStore',{
        	storeId: 'teamsdraft', 
        	proxy: {
                type: 'ajax',
                url: '/teamMgmt/v1/team/list',
                reader: {
                    type: 'json',
                    root: 'data.items',
                    totalProperty: 'data.totalItems'
                },
                extraParams: {
                	showDraft: true
                }
            }
        });
        this.items[1].items[3].store = Ext.data.StoreManager.containsKey('teamCategories') ? Ext.getStore('teamCategories') : Ext.create('gov.va.hmp.team.TeamCategoryStore');

        this.callParent(arguments);
    },
    onBoxReady:function () {
        this.callParent(arguments);
        this.down('#teamList').getStore().load();
    }
});
