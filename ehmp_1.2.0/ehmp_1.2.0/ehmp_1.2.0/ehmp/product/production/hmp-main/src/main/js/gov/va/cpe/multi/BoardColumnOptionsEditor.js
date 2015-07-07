Ext.define('gov.va.cpe.multi.BoardColumnOptionsEditor', {
	alias: 'widget.boardcoloptions',
	extend: 'Ext.form.Panel',
	tbar: [{
		xtype: 'panel',
		id: 'boardcoloptions'
	}],
	bbar: [{
		xtype: 'button',
		text: 'Save as Template Configuration',
		handler: function(bn) {
			bn.up('boardcoloptions').saveTemplateOptions();
		}
	}],
	defaults: {
		width: 500,
		listeners: {
			blur: function(field, evt, eopts) {
				var form = field.up('form');
				form.saveColData();
			},
			change: function(field, evt, eopts) {
				if(!field.is('textfield')) {
					var form = field.up('form');
					form.saveColData();
				}
			}
		},
	},
	dereferenceDotNotation: function(data) {
		for(key in data) {
			var d = key.indexOf('.');
			if(d>0) {
				var firstPart = key.substring(0,d);
				var secondPart = key.substring(d+1);
				var sdat = data[firstPart] || {};
				sdat[secondPart] = data[key];
				if(!data[firstPart]) {data[firstPart] = sdat;}
			}
		}
		return data;
	},
	
	saveColData: function() {
		if(!this.progLoad) {
			var frm = this.getForm();
			
			var vals = this.dereferenceDotNotation(frm.getValues());
			if(this.colList && this.colList.getSelectionModel().getSelection().length>0) {
				var selcol = this.colList.getSelectionModel().getSelection()[0];
				if(selcol.get("sequence")!=frm.colId) {
					selcol = null;
					for(key in this.colList.getStore().data.items) {
						var rec = this.colList.getStore().data.items[key];
						if(rec.get("sequence")==frm.colId) {
							selcol = rec;
						}
					}
				} 
				if(selcol!=null) {
					for(key in vals) {
						selcol.data[key] = vals[key];
					}
					this.colList.fireEvent('colchange', this.colList, selcol);
				}
			}
		}
	},
	
	/**
	 * Set options for column-specific fields and also viewdef filters.
	 */
	setConfigOptions: function(configOptions) {
		this.removeAll();
		this.add(gov.va.cpe.multi.BoardColumnOptionsEditor.buildConfigOptions(configOptions));
		this.doLayout();
		this.loadTemplateButtons(configOptions);
	},
	
	loadTemplateButtons: function(configOptions) {
		this.clearTemplateButtons();
		if(configOptions['templateOptions'] && configOptions['templateOptions'].length>0) {
			for(key in configOptions['templateOptions']) {
				var tmpl = configOptions['templateOptions'][key];
				this.addTemplateButton(tmpl);
			}
		}
	},
	clearTemplateButtons: function() {
		var me = this;
		var tPnl = me.getDockedItems('toolbar[dock="top"]')[0].down('panel');
		tPnl.removeAll();
	},
	addTemplateButton: function(templateOption) {
		var me = this;
		var tPnl = me.getDockedItems('toolbar[dock="top"]')[0].down('panel');
		var bn = {
			xtype: 'button',
			text: templateOption.name,
			formData: templateOption.formVals,
			handler: function(bn) {
				me.setConfigData({data: bn.formData});
				me.saveColData();
			}
		};
		tPnl.add(bn);
	},
	
	saveTemplateOptions: function() {
		var me = this;
		var name = Ext.MessageBox.prompt('Save Template','Enter name for template',function(bnId, name, opt) {
			if((bnId!='cancel') && name && name != '') {
				var frm = me.getForm();
				var vals = Ext.encode(me.dereferenceDotNotation(frm.getValues()));
				var parms = {
						name: name,
						formData: vals,
						columnClass: me.columnClass
					};
				Ext.Ajax.request({
					url: '/config/setColTemplate',
					method: 'POST',
					params: parms,
					success: function(resp) {
						me.addTemplateButton(parms);
					},
					failure: function(resp) {
						console.log(resp);
					}
				})
			}
		});
	},
	
	/**
	 * Set the selected model record on this form to fill field values.
	 */
	setConfigData: function(configData) {
		// Temp hack.
		for(key in configData.data) {
			if(key=="configProperties" || key=="viewdefFilters") {
				for(k2 in configData.data[key]) {
					configData.data[key+"."+k2] = configData.data[key][k2];
				}
			}
		}
		this.progLoad = true;
		var frm = this.getForm();
		frm.loadRecord(configData);
		frm.colId = configData.get("sequence");
		var boxen = Ext.ComponentQuery.query('checkbox', this);
		for(key in boxen) {
			// <hack=to load checkboxen because checkbox groups do not load their data correctly on form.load() reliably>
			var box = boxen[key];
			var nm = box.name;
			if(configData.data[nm]!=null) {
				if(configData.data[nm]==box.inputValue || configData.data[nm].length>0 && configData.data[nm].indexOf(box.inputValue)>-1) {
					box.setValue(true);
				} 
			} else {
				box.setValue(false);
			}
			// </hack>
			boxen[key].on('check', function(field) {
				var form = field.up('form');
				form.saveColData();
			})
		}
		this.progLoad = false;
	},
	
	statics: {
		buildConfigOptions: function(configOptions) {
			
			var fitems = [];
			fitems.push({
				xtype: 'panel',
				margin: '10 10 10 0',
				border: 1,
				html: '<b>Description:</b><br>'+configOptions.description+"<br>"
			});
			var txtype = 'displayfield';
			if(configOptions['titleEditable']) {txtype = 'textfield';}
			fitems.push({
				xtype: txtype,
				name: 'fieldName',
				fieldLabel: 'Column Title'
			});
			if(configOptions.viewdefFilterOptions) {
//				var fitems = [];
				for(key in configOptions.viewdefFilterOptions) {
					var opt = configOptions.viewdefFilterOptions[key];
					// TODO: Switch based on data types / etc.
					var fld = {};
					var options = opt.choiceList;
					
					fld['fieldLabel'] = opt.label;
					
					if(options) {
						if(opt.dataType=='LIST') {
							var boxen = [];
							for(o in options) {
								var oval = options[o];
								var lbl = null;
								var inpt = null;
								if(Ext.isString(oval)) {
									lbl = oval;
									inpt = oval;
								} else {
									lbl = oval.displayName;
									inpt = oval.inputValue;
								}
								boxen.push({boxLabel: lbl, name: 'viewdefFilters.'+opt.name, inputValue: inpt});
							}
							fld['xtype'] = 'checkboxgroup';
							fld['columns'] = 2;
							fld['vertical'] = true;
							fld['items'] = boxen;
						}
						else {
							fld['name'] = 'viewdefFilters.'+opt.name;
							var strDat = [];
							for(o in options) {
								strDat.push({choice: options[o]});
							}
							fld['xtype'] = 'combobox';
						    fld['store'] = {
						    	fields: ['choice'],
						        data : strDat
						    };
						    fld['queryMode'] = 'local';
						    fld['displayField'] = 'choice';
						    fld['valueField'] = 'choice';
						    cls = 'Ext.form.ComboBox';
						}
					} else {
						fld['name'] = 'viewdefFilters.'+opt.name;
						fld['xtype'] = 'textfield';
					}
					
					if(opt.dataType=="BOOLEAN") {
						fld['xtype'] = 'checkbox';
						fld['boxLabel'] = fld['fieldLabel'];
						fld['fieldLabel'] = '';
						fld['inputValue'] = 'true';
						fld['submitValue'] = true;
						fld['uncheckedValue'] = false;
					} else if(opt.dataType=="MAP") {
						// TODO
					} else if(opt.dataType=="LIST") {
						// TODO
					} else if(opt.dataType=="RANGE") {
						// TODO
					} else {
						// TODO
					}
					fitems.push(fld);
				}
			}
			
			if(configOptions.configOptions) {
				for(key in configOptions.configOptions) {
					var opt = configOptions.configOptions[key];
					// TODO: Switch based on data types / etc.
					var fld = {};
					var options = opt.choiceList;
					if(options) {
						if(opt.dataType=='LIST') {
							var boxen = [];
							for(o in options) {
								var oval = options[o];
								var lbl = null;
								var inpt = null;
								if(Ext.isString(oval)) {
									lbl = oval;
									inpt = oval;
								} else {
									lbl = oval.displayName;
									inpt = oval.inputValue;
								}
								boxen.push({boxLabel: lbl, name: 'configProperties.'+opt.name, inputValue: inpt});
							}
							fld['xtype'] = 'checkboxgroup';
							fld['columns'] = 2;
							fld['vertical'] = true;
							fld['items'] = boxen;
						}
						else {
							fld['name'] = 'configProperties.'+opt.name;
							var strDat = [];
							for(o in options) {
								strDat.push({choice: options[o]});
							}
							fld['xtype'] = 'combobox';
						    fld['store'] = {
						    	fields: ['choice'],
						        data : strDat
						    };
						    fld['queryMode'] = 'local';
						    fld['displayField'] = 'choice';
						    fld['valueField'] = 'choice';
						    cls = 'Ext.form.ComboBox';
						}
					} else {
						fld['xtype'] = 'textfield';
					}
					fld['fieldLabel'] = opt.label;
					fld['name'] = 'configProperties.'+opt.name;
					
					if(opt.dataType=="BOOLEAN") {
						fld['xtype'] = 'checkbox';
						fld['boxLabel'] = fld['fieldLabel'];
						fld['fieldLabel'] = '';
						fld['inputValue'] = 'true';
						fld['submitValue'] = true;
						fld['uncheckedValue'] = false;
					} else if(opt.dataType=="MAP") {
						// TODO
					} else if(opt.dataType=="LIST") {
						// TODO
					} else if(opt.dataType=="RANGE") {
						// TODO
					} else if(opt.dataType=="TEAM CATEGORIES") {
						Ext.apply(fld, {
		                	xtype: 'tagfield',
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
				    		}
				    	});
						fld['getSubmitData'] = function() {
							var rslt = {};
							rslt[this.name] = this.value;
							return rslt;
						};
					} else {
						// TODO
					}
					fitems.push(fld);
				}
			}
			return fitems;
		}
	}
});