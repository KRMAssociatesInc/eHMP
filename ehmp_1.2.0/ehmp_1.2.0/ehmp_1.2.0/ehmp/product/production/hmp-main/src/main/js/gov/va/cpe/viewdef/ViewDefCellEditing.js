Ext.define('gov.va.cpe.viewdef.ViewDefCellEditing', {
    extend: 'Ext.grid.plugin.CellEditing',
    alias: 'plugin.viewdefcellediting',
    clicksToEdit: 1,
    pluginId: "CellEditor",
    listeners: {
        beforeedit: function(editor, e, eOpts) {
            var grid = e.grid;
            if(grid.selectedByClick) {
                return false;
            }
            if(e.record && e.record.srcJson && e.record.srcJson[e.field]) {
                editor.record = e.record;
                if(e.record.srcJson[e.field].editable==false) {
                    return false;
                }
            }
        },
        edit: function(editor, e, eOpts) {
            if(!e.column.initialConfig.editor.readOnly) {
                var rec = e.record;
                var fld = e.field;
                var uid = rec.get('uid');
                var pid = rec.get('pid');
                if(!pid && e.grid != null) {
                    pid = e.grid.pid;
                }
                var editOpt = e.column.editOpt;
                var fieldName = editOpt.fieldName; // Very well may not be the same as the fieldName in the store.
                var value = e.value;
                var origVal = e.originalValue;
                if(value!=origVal) {

                    // If this is a complex object, we better JSON-encode it.
                    if(Ext.isArray(value) || Ext.isObject(value)) {
                        value = Ext.encode(value);
                    }

                    // TODO: Refactor for cleanliness; At least merge cases 1 and 2 into something more streamlined.
                    if(editOpt.submitOpts) {
                        // Case 1: This is a single cell editor that will submit for one and only one UID. A singleton instance of a domain that is tied to this view cell.
                        // It expects a URL has been supplied.
                        if(editOpt.submitOpts.type=='singleCellOrganism') {
                            uid = '';
                            if(rec.srcJson && rec.srcJson[fld] && rec.srcJson[fld].data && rec.srcJson[fld].data.length>1) {
                                uid = rec.srcJson[fld].data[0].uid;
                            }
                            parms = {
                                uid: uid,
                                pid: pid,
                                fieldName: fieldName,
                                value: value
                            };
                            Ext.apply(parms, editOpt.extraParams);
                            Ext.Ajax.request({
                                url: editOpt.submitOpts.url,
                                method: 'POST',
                                params: parms,
                                success: function(a, b, c) {
                                    rec.srcJson[fld].data[0][fieldName] = value;
                                    rec.set(fieldName, value);
                                },
                                failure: function(a, b, c) {
                                    Ext.MessageBox.alert('Save failed','See error log for details: '+a);
                                }
                            })
                        }
                    } else if (e.column.deferred && e.column.deferred.restEndpoint) {
                        // Case 2: This is a specific REST endpoint; Submit the value to this URL.
                        // This still only works with one UID. Maybe this and the item above should be combined somehow.
                        uid = '';
                        if(rec.srcJson && rec.srcJson[fld]) {
                            if(rec.srcJson[fld].uid) {
                                uid = rec.srcJson[fld].uid;
                            } else if(rec.srcJson[fld].data && rec.srcJson[fld].data[0] && rec.srcJson[fld].data[0].uid) {
                                uid = rec.srcJson[fld].data[0].uid;
                            }
                        }
                        var req = {
                            url: e.column.deferred.restEndpoint,
                            method: 'POST',
                            params: {
                                pid: pid,
                                uid: uid,
                                value: value
                            },
                            success: function(a, b, c) {
//								Ext.log("YAY!: "+a);
                            },
                            failure: function(a, b, c) {
                                Ext.log("FAIL: "+a);
                            }
                        };
                        req.params[fieldName] = value;
                        Ext.Ajax.request(req);
                    } else {
                        // Case 3: Generic field editor. This is a direct viewdef field setter for the viewdef's given domain element.
                        Ext.Ajax.request({
                            url: '/editor/submitFieldValue',
                            method: 'POST',
                            params: {
                                uid: uid,
                                pid: pid,
                                fieldName: fieldName,
                                value: value
                            },
                            success: function(a, b, c) {
//							Ext.log("YAY!: "+a);
                            },
                            failure: function(a, b, c) {
                                Ext.log("FAIL: "+a);
                            }
                        });
                    }
                }
            }

            if(Ext.isFunction(editor.close)) {
                editor.close();
            }
            if(Ext.isFunction(editor.dispose)) {
                editor.dispose();
            }
        }
    }
});