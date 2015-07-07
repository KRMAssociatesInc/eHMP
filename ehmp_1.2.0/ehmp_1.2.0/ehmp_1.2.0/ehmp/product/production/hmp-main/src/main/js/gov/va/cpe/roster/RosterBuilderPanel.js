Ext.define('gov.va.cpe.roster.RosterBuilderPanel', {
    extend: 'Ext.container.Container',
    requires: [
        'gov.va.cpe.roster.RosterStore',
        'gov.va.cpe.roster.RosterSourceSelector',
        'gov.va.cpe.roster.RosterPatientList',
        'gov.va.hmp.team.TeamRosterEditor',
        'gov.va.hmp.ptselect.PatientSelector'
    ],
    layout: 'border',
    items: [
        {
            xtype: 'grid',
            ui: 'well',
            frame: true,
            itemId: 'rosterList',
            title: 'Patient Lists',
            region: 'west',
            minWidth: 300,
            width: 300,
            split: true,
            columns: [
                { text: 'Name', flex: 1,  dataIndex: 'name' },
                {
                    xtype: 'actioncolumn',
                    width: 20,
                    items: [
                        {
                            iconCls: 'fa-remove-sign',
                            tooltip: 'Remove Patient List',
                            handler: function (grid, rowIndex, colIndex) {
                                var srcgrid = grid.up('#rosterList');
                                var rec = grid.getStore().getAt(rowIndex);
                                grid.getStore().removeAt(rowIndex);
                                srcgrid.fireEvent('rosterremove', this, rec);
                            }
                        }
                    ]
                }
            ],
            tools: [
                {
                    xtype: 'button',
                    ui: 'link',
                    itemId: 'createRosterButton',
                    text: 'New Patient List'
                }
            ]
        },
        {
            xtype: 'form',
            itemId: 'rosterEditor',
            region: 'center',
            title: '',
            disabled: true,
            width: 500,
            layout: {type: 'vbox', align: 'stretch'},
            items: [
                {
                    xtype: 'textfield',
                    itemId: 'rosterNameEdit',
                    fieldLabel: 'Name',
                    name: 'name',
                    flex: 0
                },
                {
                	xtype: 'rosterpatientlist',
//                	xtype: 'teamrostereditor',
                	itemId: 'rosterWindowSrcGrid',
                	hidden: true,
                	flex: 1,
                    tools: [//,'OE/RR','VPR Roster'
                        {
                            xtype: 'rostersourceselector',
                            disabled: true,
	                        ui: 'link',
	                        itemId: 'addSpecialtyToRosterButton',
	                        text: 'Add Specialty',
	                        sourceType: 'Specialty',
                            listeners: {
                            	select: function(cmp, rec) {
                            		if(rec===this.lastRec) {return;}
                					this.lastRec = rec;
                            		var grid = cmp.up('rosterpatientlist');
                            		grid.fireEvent("addSource",rec);
                					cmp.hideMenu();
                            	}
                            }
                        },{
                            xtype: 'rostersourceselector',
                            disabled: true,
	                        ui: 'link',
	                        itemId: 'addPXRMToRosterButton',
	                        text: 'Add Reminder',
	                        sourceType: 'PXRM',
                            listeners: {
                            	select: function(cmp, rec) {
                            		if(rec===this.lastRec) {return;}
                					this.lastRec = rec;
                            		var grid = cmp.up('rosterpatientlist');
                            		grid.fireEvent("addSource",rec);
                					cmp.hideMenu();
                            	}
                            }
                        },{
                            xtype: 'rostersourceselector',
                            disabled: true,
	                        ui: 'link',
	                        itemId: 'addProviderToRosterButton',
	                        text: 'Add Provider',
	                        sourceType: 'Provider',
                            listeners: {
                            	select: function(cmp, rec) {
                            		if(rec===this.lastRec) {return;}
                					this.lastRec = rec;
                            		var grid = cmp.up('rosterpatientlist');
                            		grid.fireEvent("addSource",rec);
                					cmp.hideMenu();
                            	}
                            }
                        },{
                            xtype: 'rostersourceselector',
                            disabled: true,
	                        ui: 'link',
	                        itemId: 'addPCMMToRosterButton',
	                        text: 'Add PCMM Team',
	                        sourceType: 'PCMM Team',
                            listeners: {
                            	select: function(cmp, rec) {
                            		if(rec===this.lastRec) {return;}
                					this.lastRec = rec;
                            		var grid = cmp.up('rosterpatientlist');
                            		grid.fireEvent("addSource",rec);
                					cmp.hideMenu();
                            	}
                            }
                        },{
                            xtype: 'rostersourceselector',
                            disabled: true,
	                        ui: 'link',
	                        itemId: 'addWardToRosterButton',
	                        text: 'Add Ward',
	                        sourceType: 'Ward',
                            listeners: {
                            	select: function(cmp, rec) {
                            		if(rec===this.lastRec) {return;}
                					this.lastRec = rec;
                            		var grid = cmp.up('rosterpatientlist');
                            		grid.fireEvent("addSource",rec);
                					cmp.hideMenu();
                            	}
                            }
                        },{
                            xtype: 'rostersourceselector',
                            disabled: true,
	                        ui: 'link',
	                        itemId: 'addClinicToRosterButton',
	                        text: 'Add Clinic',
	                        sourceType: 'Clinic',
                            listeners: {
                            	select: function(cmp, rec) {
                            		if(rec===this.lastRec) {return;}
                					this.lastRec = rec;
                            		var grid = cmp.up('rosterpatientlist');
                            		grid.fireEvent("addSource",rec);
                					cmp.hideMenu();
                            	}
                            }
                        },{
                            xtype: 'patientselector',
                            disabled: true,
	                        ui: 'link',
	                        itemId: 'addPatientToRosterButton',
	                        text: 'Add Patient',
                            listeners: {
                            	select: function(cmp, rec) {
                            		if(rec===this.lastRec) {return;}
                					this.lastRec = rec;
                            		var grid = cmp.up('rosterpatientlist');
                            		grid.fireEvent("addPatient",rec);
                					cmp.hideMenu();
                            	}
                            }
                        }
                    ]
                }
            ]
        }
    ],
    initComponent: function () {
        var rosterStore = Ext.data.StoreManager.containsKey('rosterbuilder') ? Ext.getStore('rosterbuilder') : Ext.create('gov.va.cpe.roster.RosterStore', {
        	storeId: 'rosterbuilder', 
        	model: 'gov.va.cpe.roster.RosterModel',
            pageSize: 250,
            sortOnLoad: true,
            sorters: {property: 'name', direction: 'ASC'},
            proxy: {
                type: 'ajax',
                url: '/roster/list',
                extraParams: {
                    id:'all'
                },
                reader: {
                    root: 'data.items',
                    totalProperty: 'data.totalItems',
                    type: 'json'
                }
            }
        });
        this.items[0].store = rosterStore;
        var me = this;
        rosterStore.on("beforeload", function(store) {
            var grid = me.down('grid');
            if(grid.getSelectionModel().getSelection().length) {
                me.selRec = store.data.indexOf(grid.getSelectionModel().getSelection()[0]);
            }
            else {
                me.selRec=null;
            }
        });
        rosterStore.on("load", function(store){
            if(me.selRec!=null) {
                me.down('grid').getSelectionModel().select(me.selRec);
            }
        });
        this.callParent(arguments);
    },
    onBoxReady: function () {
        this.callParent(arguments);
        this.down('grid').getStore().load();
    }
});