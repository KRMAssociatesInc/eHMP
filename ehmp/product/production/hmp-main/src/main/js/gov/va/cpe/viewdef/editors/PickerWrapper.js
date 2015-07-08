Ext.define('gov.va.cpe.viewdef.editors.PickerWrapper', {
	extend: 'Ext.form.field.Picker', 
	alias: 'widget.pickerwrapper',
    editable: false,
    hideTrigger: true,
    pickerOffset: [ 0, -20 ],
    listeners: {
        focus: function( fld, e, opts ) {
            fld.expand();
        }
    },
    
    /*
     * These funky routines have to exist because of this issue: http://www.sencha.com/forum/showthread.php?243946-Pickerfield-s-picker-ignores-collapseIf-when-used-in-grid-editor
     */ 
    collapseIf: function(e) {
        var me = this;
        
    	var boxen = Ext.ComponentQuery.query('pickerfield',this.myPicker);
    	for(idx in boxen) {
    		var picker = boxen[idx].getPicker();
    		if(picker.rendered && e.within(picker.el)) {
    			return;
    		}
    	}
    	if(me.myPicker) {
    		if(me.myPicker.externalWidget) {
    			if(e.within(me.myPicker.externalWidget.body)) {
    				return;
    			}
    			if(Ext.isFunction(me.myPicker.externalWidget.getHeader)) {
    				if(e.within(me.myPicker.externalWidget.getHeader().getEl())) {
    					return;
    				}
    			}
    		}
    	}
    	// Original code pasted from Ext.form.field.Picker:
        if (!me.isDestroyed && !e.within(me.bodyEl, false, true) && !e.within(me.picker.el, false, true) && !me.isEventWithinPickerLoadMask(e)) {
            me.collapse();
        }
    },
    mimicBlur: function(e) {
        var me = this,
        	picker = me.picker;
    	var boxen = Ext.ComponentQuery.query('pickerfield',this.myPicker);
    	for(idx in boxen) {
    		var picker = boxen[idx].getPicker();
    		if(picker.rendered && e.within(picker.el)) {
    			return;
    		}
    	}
    	if(me.myPicker) {
    		if(me.myPicker.externalWidget) {
    			if(e.within(me.myPicker.externalWidget.body)) {
    				return;
    			}
    			if(Ext.isFunction(me.myPicker.externalWidget.getHeader)) {
    				if(e.within(me.myPicker.externalWidget.getHeader().getEl())) {
    					return;
    				}
    			}
    		}
    	}
    	// Original code pasted from Ext.form.field.Picker:
        // ignore mousedown events within the picker element
        if (!picker || !e.within(picker.el, false, true) && !me.isEventWithinPickerLoadMask(e)) {
            me.callParent(arguments);
        }
    },
    
    /**
     * Override this to use focusLost functionality for submitting changes instead of a bu'uhn.
     */
    useSubmitButton: true,
    
    /**
     * Branch on whether or not we want to do "submit" buttons or "focusLost" functionality?
     */
	createPicker: function() {
		var me = this;
		var def = {
	            bodypadding:5,
	            pickerField: me,
	            ownerCt: me.ownerCt,
	            renderTo: document.body,
	            floating: true,
	            bodyPadding:8,
	            listeners: {
	                scope: me,
	                select: me.onSelect
	            },
			};
		if(this.useSubmitButton) {
			Ext.apply(def, {
				bbar: {
					items: [{
						xtype: 'button',
						text: 'Submit',
						handler: function(bn) {
							me.applyValues();
						}
					},{
						xtype: 'button',
						text: 'Cancel',
						handler: function(bn) {
							me.cancelEdit();
						}
					}]
				}
			});
		}
		this.myPicker = Ext.create(this.editorAlias, def);
		this.myPicker.setValue(this.value);
		return this.myPicker;
	},
	cancelEdit: function() {
        this.fireEvent( 'blur' );
	    this.collapse();       
	},
	applyValues: function() {
		this.setValue(Ext.encode(this.myPicker.getValue()));
		this.fireEvent( 'blur' );
	    this.collapse();        
	},
    onExpand: function() {
        this.myPicker.setValue(this.value);
    },
	onSelect: function() {
		this.myPicker.setValue(this.value);
	},
	getSubmitValue: function() {
		return this.myPicker.getValue();
	}
});