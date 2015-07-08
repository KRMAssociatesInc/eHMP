Ext.define('gov.va.cpe.roster.RosterPanel', {
	extend: 'Ext.panel.Panel',
    requires: [
        'gov.va.cpe.roster.FavoriteRosterPicker'
    ],
	alias: 'widget.rosterpanel',
	layout: 'hbox',
	height: 30,
	initComponent: function() {
		var search = {
				flex: 5,
				xtype: 'textfield',
				itemId: 'patientsearchfield',
				minWidth: 300,
				emptyText: 'Patient Search....',
				margins: '5 50 5 50'
			};
//		var edit = {
//				xtype: 'button',
//				ui: 'link',
//				itemId: 'patientlisteditbutton',
//				region: 'east',
//				margins: '5 0 5 0',
//				minWidth: 200,
//				text: 'Edit Patient List(s)',
//				flex: 2,
//				handler: function() {
//					var cpe = Ext.ComponentQuery.query('cpepanel');
//					if(cpe && cpe.length>0)
//					{
//						cpe[0].showRosterEditor();
//					}	
//				}
//			};
		var picker = {
				xtype: 'favrosterpicker',
				flex: 3,
				minWidth: 200,
				margins: '5 0 5 0',
				listeners: {
		            select: function(combo, records){
						if(records && records.length>0)
						{
							combo.doRosterSelection(combo, records[0]);
						}
					}
				}
			};
		var label = {
				xtype: 'label',
				flex: 0,
				margins: '8 5 5 20',
				text: 'Patient List:',
				minWidth: 100
			};
		if(this.shortOrientation) {
//			Ext.apply(edit, {text: 'Edit', flex: 55, margins: '0 0 0 0', minWidth: null});
			Ext.apply(picker, {flex: 100, margins: '0 0 0 0'});
			Ext.apply(search, {flex: 1, margins: '0 10 0 0'});
			this.height = 60;

			var subpnl = {
				xtype: 'panel',
				layout: 'hbox',
				flex: 1,
				height: 30,
				width: '100%',
				items: [picker]
			};
			this.layout = {type: 'vbox', align: 'stretch'};
			this.items = [subpnl, search];
		}
		else {
			this.items = [label, picker, search];
		}
		this.callParent();
	}
});