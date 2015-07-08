/**
 * Known outstanding issues:
 * TODO: The header rows are selectable, how can we make them unselectable like group header row?
 *
 */
Ext.define('gov.va.hmp.containers.MedsReviewTab', {
            extend: 'gov.va.hmp.containers.OnePanelToRuleThemAll',
            alias: 'widget.medsreviewtab',
            title: 'Meds Review',
            detail: 'none',
            items: [
                {
                    xtype: 'viewdefgridpanel',
                    gridX: 0,
                    gridY: 0,
                    widthX: 1,
                    widthY: 1,
                    weightX: 2,
                    weightY: 1,
                    title: 'Outpatient Meds',
                    itemId: 'medsoutgrid',
                    viewID: 'gov.va.cpe.vpr.queryeng.MedsTabViewDef',
                    viewParams: {
                                filter_kind: 'O,N',
                                group: 'kind',
                                'col.display': 'infobtnurl, vaStatus, overallStart, overallStop'
                            },

                            addFilterTool: true,
//                    detailType: '#medsgriddetailpanel',
                    listeners : {
                        select: function(dv, rec, item, index, e) {
                            var medGrid = Ext.ComponentQuery.query('#medsgriddetailpanel')[0];
                            this.up('wunderpanel').down('#medsingrid').getSelectionModel().deselectAll();
                            var history = rec.data.history;
                            var historyJson = Ext.encode(history);
                            Ext.Ajax.request({
                                        url: "/vpr/detail/medtabdetail?history=" + historyJson,
                                        success: function(response) {
                                            medGrid.update(response.responseText)
                                        }
                                    })
                        }
                    }
                },
                {
                    xtype: 'viewdefgridpanel',
                    gridX: 0,
                    gridY: 1,
                    widthX: 1,
                    widthY: 1,
                    weightX: 2,
                    weightY: 1,
                    itemId: 'medsingrid',
                    title: 'Inpatient Meds',
                    viewParams: {
                                filter_kind: 'I',
//                                group: 'kind',
                                'col.display': 'infobtnurl,summary, vaStatus, overallStart, overallStop'
                            },

                            addFilterTool: true,
                            viewID: 'gov.va.cpe.vpr.queryeng.MedsTabViewDef',
                            listeners : {
                            select: function(dv, rec, item, index, e) {
                                var medGrid = Ext.ComponentQuery.query('#medsgriddetailpanel')[0];
                                this.up('wunderpanel').down('#medsoutgrid').getSelectionModel().deselectAll();
                                var history = rec.data.history;
                                var historyJson = Ext.encode(history);
                                Ext.Ajax.request({
                                        url: "/vpr/detail/medtabdetail?history=" + historyJson,
                                        success: function(response) {
                                            medGrid.update(response.responseText)
                                        }
                                    })
                        }
                    }
                },
                                {
                    xtype: 'viewdefgridpanel',
                    gridX: 0,
                    gridY: 2,
                    widthX: 1,
                    widthY: 1,
                    weightX: 2,
                    weightY: 1,
                    title: 'Infusion',
                    itemId: 'medsivgrid',
                    viewID: 'gov.va.cpe.vpr.queryeng.MedsIVViewDef',
                    viewParams: {
                                filter_kind: 'V',
                                group: 'kind',
                                'col.display': 'infobtnurl, vaStatus, overallStart, overallStop'
                            },

                            addFilterTool: true,
                    detailType: '#medsgriddetailpanel'
//                    listeners : {
//                        select: function(dv, record, item, index, e) {
//                            var medGrid = Ext.ComponentQuery.query('#medsgriddetailpanel')[0];
//                            var tempGrid = Ext.ComponentQuery.query('#medsingrid')[0];
//                            var outGrid = Ext.ComponentQuery.query('#medsoutgrid')[0];
//                            var allItems = [];
//				            var groupedItems = outGrid.getStore().getGroups();
//				            for (var i=0; i<groupedItems.length; i++) {
//					            allItems = allItems.concat(groupedItems[i].children);
//				            }
//				            var data = allItems[item];
//                            tempGrid.getSelectionModel().deselectAll();
//                            var history = data.data.history;
//                            var historyJson = Ext.encode(history);
//                            Ext.Ajax.request({
//                                        url: "/vpr/detail/medtabdetail?history=" + historyJson,
//                                        success: function(response) {
//
//                                            medGrid.update(response.responseText)
//                                        }
//                                    })
//
//                        }
//                    }
                },
                {
                    xtype: 'griddetailpanel',
                    itemId: 'medsgriddetailpanel',
//			enableTrendChart: true,
                    gridX: 1,
                    gridY: 0,
                    widthX: 1,
                    widthY: 3,
                    weightX: 1,
                    weightY: 1,
//                    tbar: {
//                        items: [
//                            {
//                                xtype: 'button', itemId: "dcBtn", text: 'Discontinue',
//                                listeners: {
//                                    click: function() {
////                                        console.log("in Click");
//                                        var medOutGrid = Ext.ComponentQuery.query('#medsoutgrid')[0];
//                                        var medInGrid = Ext.ComponentQuery.query('#medsingrid')[0];
//                                        var uid = '';
//                                        var outSelected = medOutGrid.getSelectionModel().getSelection();
//                                        var inSelected = medInGrid.getSelectionModel().getSelection();
//                                        var dcWindow = Ext.getCmp('dcReasonsListWindow');
//                                        if (!dcWindow) dcWindow = Ext.create('gov.va.cpe.order.DcReasonsListWindow', {
//                                        });
//                                        if (outSelected) {
//                                            uid = outSelected[0].data.uid;
//                                            dcWindow.targetName = outSelected[0].data.name;
//                                            dcWindow.uid = uid;
//                                            dcWindow.show();
//                                        } else {
////                                            var selected = medInGrid.getSelectionModel().getSelection();
//                                            if (inSelected) {
//                                                uid = selected[0].data.uid;
//                                            }
//                                        }
//                                    }
//                                }
//                            },
//                            { xtype: 'button', itemId: "qolBtn", text: 'Quick Order',
//                                listeners: {
//                                    click: function() {
//                                        var qoWindow = Ext.getCmp('qoItemListWindow');
//                                        if (!qoWindow) qoWindow = Ext.create('gov.va.cpe.order.QoItemListWindow', {});
//                                        qoWindow.show()
//                                    }
//                                }
//                            },
//                            { xtype: 'button', itemId: "renewBtn",  text: 'Renew',
//                                listeners: {
//                                    click: function() {
////                                        console.log("in Click");
//                                        var medOutGrid = Ext.ComponentQuery.query('#medsoutgrid')[0];
//                                        var medInGrid = Ext.ComponentQuery.query('#medsingrid')[0];
//                                        var uid = '';
//                                        var outSelected = medOutGrid.getSelectionModel().getSelection();
//                                        var inSelected = medInGrid.getSelectionModel().getSelection();
//                                        var snippet = Ext.getCmp('snippetWindow');
//                                        if (!snippet) snippet = Ext.create('gov.va.cpe.SnippetWindow', {
//                                        });
//                                        if (outSelected) {
//                                            uid = outSelected[0].data.uid;
//                                            snippet.targetName = outSelected[0].data.name;
//                                            snippet.uid = uid;
//                                            snippet.command = "renewOrder",
//                                            snippet.action = "R",
//                                            snippet.title = 'Renew ' + outSelected[0].data.name;
//                                            snippet.show();
//                                        } else {
////                                            var selected = medInGrid.getSelectionModel().getSelection();
//                                            if (inSelected) {
//                                                uid = selected[0].data.uid;
//                                            }
//                                        }
//                                    }
//                                }
//                            },
//                            { xtype: 'button', itemId: "copyBtn",  text: 'Copy',
//                                listeners: {
//                                    click: function() {
////                                        console.log("in Click");
//                                        var medOutGrid = Ext.ComponentQuery.query('#medsoutgrid')[0];
//                                        var medInGrid = Ext.ComponentQuery.query('#medsingrid')[0];
//                                        var uid = '';
//                                        var outSelected = medOutGrid.getSelectionModel().getSelection();
//                                        var inSelected = medInGrid.getSelectionModel().getSelection();
//                                        var snippet = Ext.getCmp('snippetWindow');
//                                        if (!snippet) snippet = Ext.create('gov.va.cpe.SnippetWindow', {
//                                        });
//                                        if (outSelected) {
//                                            uid = outSelected[0].data.uid;
//                                            console.log(outSelected[0].data);
//                                            snippet.targetName = outSelected[0].data.name;
//                                            snippet.uid = uid;
//                                            snippet.command = "ordering",
//                                            snippet.action = "C",
//                                            snippet.title = 'Copy ' + outSelected[0].data.name;
//                                            console.log(snippet);
//                                            snippet.show();
//                                        } else {
////                                            var selected = medInGrid.getSelectionModel().getSelection();
//                                            if (inSelected) {
//                                                uid = selected[0].data.uid;
//                                            }
//                                        }
//                                    }
//                                }
//                            }
//                        ]
//                    }
                }
            ]
        });

