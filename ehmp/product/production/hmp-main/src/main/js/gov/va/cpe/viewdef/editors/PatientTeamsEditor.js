Ext.define('gov.va.cpe.viewdef.editors.PatientTeamsEditor', {
	requires: ['gov.va.hmp.team.StaffAssignmentContactInfo'],
	alias: 'widget.ptdisplay',
	extend: 'Ext.panel.Panel',
	minWidth: 300,
	height: 400,
	layout: {
		type: 'vbox',
		align: 'stretch'
	},
	items: [{
		xtype: 'panel',
		flex: 0,
		style: 'background-color: white;',
		layout: {
			type: 'hbox',
			align: 'stretch',
		},
		items: [{
			xtype: 'button',
			ui: 'link',
			text: '<- Prev',
			flex: 0,
			handler: function(bn) {
				var editor = bn.up('ptdisplay');
				editor.selDex = editor.selDex - 1;
				if(editor.selDex<0) {
					editor.selDex = editor.teams.length-1;
				}
				editor.refreshTeamDat();
			}
		},{
			xtype: 'displayfield',
			name: 'displayName',
            style:'text-align:center;',
			flex: 1
		},{
			xtype: 'button',
			ui: 'link',
			text: 'Next ->',
			flex: 0,
			handler: function(bn) {
				var editor = bn.up('ptdisplay');
				editor.selDex = editor.selDex + 1;
				if(editor.selDex>(editor.teams.length-1)) {
					editor.selDex = 0;
				}
				editor.refreshTeamDat();
			}
		}]
	},{
		xtype: 'grid',
		flex: 1,
        store:{
            model:'gov.va.hmp.team.StaffAssignmentContactInfo',
            proxy: {
                type: 'ajax',
                reader: {
                    type: 'json'
                },
                url: '/teamMgmt/v1/teamPersons',
                params: {
                	teamUid: ''
                }
            },
            autoLoad:false
        },

        hideHeaders:true,
        rowLines:true,
        disableSelection:true,
        viewConfig:{
            stripeRows:false
        },
        emptyText:'There are no staff members associated with or positions configured for this team.',
        columns:[
            {
                text:'Position',
                dataIndex:'positionName',
                flex:1,
                tdCls:'hmp-label'
            }
        ],
        features:[
            {
                ftype:'rowbody',
                setupRowData: function(record, rowIndex, rowValues) {
                    var headerCt = this.view.headerCt,
                        colspan = headerCt.getColumnCount(),
                        displayName = record.get('displayName'),
                        hasRow = (displayName && !displayName==''),
                        rowBodyHtml = '';
                    if(hasRow) {
                        // TODO: maybe use an XTemplate here?
                        rowBodyHtml = '<div><table class="hmp-labeled-values" width=100%><tr><td width="30%">';
                        var ci = [];

                        if(record.get('officePhone') && record.get('officePhone')!='') {ci.push({name:'Office',data:record.get('officePhone')});}
                        if(record.get('commercialPhone') && record.get('commercialPhone')!='') {ci.push({name:'Commercial',data:record.get('commercialPhone')});}
                        if(record.get('digitalPager') && record.get('digitalPager')!='') {ci.push({name:'Pager',data:record.get('digitalPager')});}
                        if(record.get('voicePager') && record.get('voicePager')!='') {ci.push({name:'Voice Pager',data:record.get('voicePager')});}
                        if(record.get('fax') && record.get('fax')!='') {ci.push({name:'Fax',data:record.get('fax')});}

                        rowBodyHtml = rowBodyHtml + '<span>' + displayName + '</span>';

                        rowBodyHtml = rowBodyHtml + '</td><td width="70%">';
                        if(ci.length>0) {
                            rowBodyHtml = rowBodyHtml + '<table class="hmp-labeled-values">';
                            for(key in ci) {
                                rowBodyHtml = rowBodyHtml + '<tr><td>' + ci[key].name + '</td><td>' + ci[key].data + '</td></tr>';
                            }
                            rowBodyHtml = rowBodyHtml + '</table>';
                        }
                        rowBodyHtml = rowBodyHtml + '</td></tr></table></div>';
                    } else {
                        rowBodyHtml = rowBodyHtml+ '<i>Position Not Filled</i>';
                    }

                    return {
                        rowBody:rowBodyHtml,
                        rowBodyColspan:colspan
                    };
                }
            }
        ]
	}],
	teams: null,
	selDex: null,
	setValue: function(val) {
		if(Ext.isString(val)) {
			this.teams = Ext.decode(val).results;
		} else {
			this.teams = val.results;
		}
		this.selDex = this.teams?this.teams.length>0?0:-1:-1;
		this.refreshTeamDat();
	},
	refreshTeamDat: function() {
		if(this.selDex>-1) {
			var team = this.teams[this.selDex];
			this.down('displayfield').setValue(team.displayName);
			var store = this.down('grid').getStore();
			if(team && team.uid && team.uid!='') {
				store.load({
                    params: {
                        teamUid: team.uid
                    }
                });
			}
//			this.down('grid').getStore().proxy.params
//			this.down('grid').getStore().loadRawData(team.staff);
		}
	},
	getValue: function() {},
	reset: function(a, b, c) {},
	/**
	 * This gets it cooperating with collapsing when it should (document events)
	 */
	initComponent: function() {
		var me = this;

        // monitor clicking and mousewheel
        me.mon(Ext.getDoc(), {
            mousewheel: me.collapseIf,
            mousedown: me.collapseIf,
            scope: me
        });
        
		this.callParent(arguments);
	},
	isValid: function() {
		return false;
	},
	collapseIf: function(event) {
        var me = this;
        
    	var boxen = Ext.ComponentQuery.query('pickerfield',this);
    	for(idx in boxen) {
    		var picker = boxen[idx].getPicker();
    		if(picker.rendered && event.within(picker.el)) {
    			return;
    		}
    	}
		if(me.externalWidget) {
			if(event.within(me.externalWidget.body)) {
				return;
			}
			if(Ext.isFunction(me.externalWidget.getHeader)) {
				if(event.within(me.externalWidget.getHeader().getEl())) {
					return;
				}
			}
		}
        if ((!me.isDestroyed) && (!event.within(me.el, false, true))) {
        	
            me.collapse();
        }
    },
    collapse: function() {
        this.isExpanded = false;
        this.ownerCt.cancelEdit(false);
    },
});