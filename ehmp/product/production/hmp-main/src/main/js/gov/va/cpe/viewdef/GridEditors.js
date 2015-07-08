Ext.define('gov.va.cpe.viewdef.GridEditors',{
	requires: [
               'gov.va.cpe.viewdef.editors.PatientCommentEditor',
	           'gov.va.cpe.viewdef.editors.AcuityEditor',
	           'gov.va.cpe.viewdef.editors.PointOfCareEditor2',
	           'gov.va.cpe.viewdef.editors.PatientLocationEditor',
	           'gov.va.cpe.viewdef.editors.PickerWrapper',
	           'gov.va.cpe.viewdef.editors.PatientTeamsEditor',
	           'gov.va.cpe.viewdef.editors.ResultedOrdersEditor',
	           'gov.va.cpe.viewdef.editors.PanelColumnEditWrapper',
	           'gov.va.cpe.viewdef.editors.CWADGridDisplay',
	           'gov.va.cpe.viewdef.editors.ClaimedBy',
	           'gov.va.cpe.viewdef.editors.MentalHealth'
	           ],
	statics: {
		applyEditOpt: function(grd, coldef, editOpt) {
			var grid = grd;
			switch(editOpt.dataType) {
			case 'text':
			case 'string':
				Ext.apply(coldef, {editor: {xtype: 'textfield'}});
				break;
			case 'boolean':
				Ext.apply(coldef, {editor: {xtype: 'checkbox'},
	                cls: 'x-grid-checkheader-editor'});
				Ext.apply(coldef, {xtype: 'checkcolumn', listeners: {checkchange: function(column, recordIndex, checked){
                    grid.getSelectionModel().select(recordIndex);
                    e = {
                         grid : grid,
                         record : grid.getSelectionModel().getSelection()[0],
                         field : 'visible',
                         value : checked,
                         rowIdx: recordIndex,
                         colIdx : column.getIndex(),
                         column: column
                        };
                    var debug = grid;
                    grid.editingPlugin.fireEvent('edit', this, e)  ;
				}}});
				break;
			case 'claimedBy':
				Ext.apply(coldef, {editor: {xtype: 'pceditwrapper', constrainTo: grd, editorXtype: 'claimedby', minWidth: 50, minHeight: 20}});
				break;
			case 'location':
				Ext.apply(coldef, {editor: {xtype: 'pocedit2'}});
				break;
			case 'acuity':
				Ext.apply(coldef, {editor: {xtype: 'pceditwrapper', constrainTo: grd, editorXtype: 'acuity'}});
				break;
			case 'patientTeams':
//				Ext.apply(coldef, {editor: {xtype: 'pickerwrapper', editable: false, hidden: true, pickerAlign: 'tl', pickerOffset: [0,0], readOnly: true, editorAlias: 'widget.ptdisplay'}});
				Ext.apply(coldef, {editor: {xtype: 'ptdisplay', readOnly: true}});
				break;
			case 'resultedOrders':
				Ext.apply(coldef, {editor: {xtype: 'pceditwrapper', constrainTo: grd, editorXtype: 'resultedordersdisplay', readOnly: true, minWidth: 600, minHeight: 200}});
				break;
			case 'notices':
				Ext.apply(coldef, {editor: {xtype: 'pceditwrapper', constrainTo: grd, editorXtype: 'cwadgrid', readOnly: true, minWidth: 600, minHeight: 200}});
				break;
			case 'mentalHealth':
				Ext.apply(coldef, {editor: {xtype: 'pceditwrapper', constrainTo: grd, minWidth: 180, editorXtype: 'mentalhealth', readOnly: true}});
				break;
			}
		}
	}
});