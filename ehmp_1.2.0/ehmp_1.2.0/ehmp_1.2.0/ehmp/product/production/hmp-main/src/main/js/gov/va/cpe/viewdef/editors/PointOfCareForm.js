Ext.define('gov.va.cpe.viewdef.editors.PointOfCareForm', {
	extend: 'Ext.form.Panel',
	alias: 'widget.pocform',
	layout: 'vbox',
	/*
	 * String displayName;
	String displayWhen;
	String defaultStatus;
	Boolean inactive;
	String category;
	String sharedName;
	String useBoard;
	Boolean isPrimary;
	Boolean useColor;
	String foregroundColor;
	String backgroundColor;
	 */
	items: [{
		xtype: 'textfield',
		fieldLabel: 'Name',
		name: 'displayName'
	},{
		xtype: 'button',
		text: 'Submit',
		handler: function(bn) {
			var frm = bn.up('form').getForm();
			var vals = frm.getValues();
			frm.submit({
				url: '/nonPatientDomain/set?domain=pointOfCare',
				params: {
					value: Ext.encode(frm.getValues())
				},
				success: function(form, action) {
					form.fireEvent('actioncomplete', null);
				},
				failure: function(form, action) {
					form.fireEvent('actioncomplete',null);
				}
			});
		}
	}]
});