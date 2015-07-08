Ext.define('gov.va.cpe.designer.PatientAwarePanelEditor', {
	extend: 'gov.va.cpe.designer.PanelEditor',
	title: 'Web/App Editor',
	layout: {type: 'vbox', align: 'stretch'},
	items: [
	    {xtype: 'textfield', name: 'title', fieldLabel: 'Name/Title'},
	    {
			xtype: 'fieldset',
			title: 'Detail URL',
			layout: {type: 'vbox', align: 'stretch'},
			height: 300,
			items: [
		        {
		        	xtype: 'combobox', 
		        	fieldLabel: 'Examples', 
		        	store: [
		        	    ['/vpr/view/gov.va.cpe.vpr.queryeng.LabViewDef?mode=/lab/lab&patient.id={pid}', 'Lab Panel'],
		        	    ['/vpr/view/gov.va.cpe.vpr.queryeng.MedsViewDef?mode=/patientDomain/medicationtimeline&patient_id={pid}', 'Timeline']
		        	],
		        	listeners: {
		        		select: function(box, recs) {
		        			var url = recs[0].get('field1');
		        			this.next('textfield').setValue(url);
		        		}
		        	}
		        },
		        {xtype: 'checkbox', name: 'iframe', inputValue: true, fieldLabel: 'Use IFRAME'},
		        {xtype: 'textfield', name: 'detailURL', fieldLabel: 'Detail URL', allowBlank: false}
			]
	    }
    ],
    initComponent: function() {
        this.callParent();
        this.form = Ext.create('Ext.form.Basic', this);
    },
    onBoxReady:function() {
        this.initPatientContext();
        this.callParent(arguments);
    },
    setEditorValues: function(vals) {
        this.form.setValues(gov.va.cpe.designer.PanelEditor.parseObjToDot(vals));
    },
    getEditorValues: function() {
        return this.form.getFieldValues();
    }
});

