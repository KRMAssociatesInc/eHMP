Ext.define('gov.va.cpe.patient.ChartTabs', {
    extend: 'Ext.panel.Panel',
    requires: [
        'gov.va.cpe.patient.ChartTabBar',
        'gov.va.hmp.ux.TabReorderer',
        'gov.va.hmp.ux.PopUpButton',
        'gov.va.cpe.CoverSheet',
        'gov.va.cpe.NewsFeedCoverSheet',
        'gov.va.hmp.tabs.MedsPanel',
        'gov.va.hmp.tabs.ProblemsPanel',
        'gov.va.hmp.tabs.TasksPanel',
        'gov.va.hmp.tabs.DocumentsPanel',
        'gov.va.hmp.tabs.WorksheetPanel',
        'gov.va.hmp.PatientContext'
    ],
    alias: 'widget.charttabs',
    deferredRender: true,
    /**
     * @cfg {Boolean} removePanelHeader
     * True to instruct each Panel added to the TabContainer to not render its header element.
     * This is to ensure that the title of the panel does not appear twice.
     */
    removePanelHeader: true,
    activeTab: 0,
    layout: 'card',
    dockedItems: [
        {
            xtype: 'container',
            dock: 'top',
            style: {
                background: 'white'
            },
            layout: {
                type: 'hbox',
                align: 'middle'
            },
            items: [
                {
                    xtype: 'popupbutton',
                    text: 'More',
                    disabled: true,
                    margin: '0 4'
                }
            ]
        }
    ],
    items: [
        // FIXME: hardcoding these for now until menu builder complete
        {
            xtype: 'coversheet',
            title: 'Cover&nbsp;Sheet'
        },
        {
            xtype: 'newsfeedcoversheet'
        },
        {
            xtype: 'searchpanel',
            title: 'Search'
        },
        {
            xtype: 'medspanel',
            title: 'Meds Review'
        },
        {
            xtype: 'documentspanel',
            title: 'Documents'
        },
        {
            xtype: 'taskspanel',
            title: 'Tasks'
        }
    ],
    initComponent: function () {
        var me = this,
            activeTab = me.activeTab || (me.activeTab = 0);

        // Configure the layout with our deferredRender, and with our activeTeb
        me.layout = new Ext.layout.container.Card(Ext.apply({
            owner: me,
            deferredRender: me.deferredRender,
            itemCls: me.itemCls,
            activeItem: me.activeTab
        }, me.layout));

        me.tabBar = Ext.widget('charttabbar', {
            itemId: 'tabBar',
            flex: 1
        });
        me.dockedItems[0].items.push(me.tabBar);

        me.callParent(arguments);
        me.addEvents(
            /**
             * @event
             * Fires before a tab change (activated by {@link #setActiveTab}). Return false in any listener to cancel
             * the tabchange
             * @param {Ext.tab.Panel} tabPanel The TabPanel
             * @param {Ext.Component} newCard The card that is about to be activated
             * @param {Ext.Component} oldCard The card that is currently active
             */
            'beforetabchange',

            /**
             * @event
             * Fires when a new tab has been activated (activated by {@link #setActiveTab}).
             * @param {Ext.tab.Panel} tabPanel The TabPanel
             * @param {Ext.Component} newCard The newly activated item
             * @param {Ext.Component} oldCard The previously active item
             */
            'tabchange'
        );

        // We have to convert the numeric index/string ID config into its component reference
        me.activeTab = me.getComponent(activeTab);

        // Ensure that the active child's tab is rendered in the active UI state
        if (me.activeTab) {
            me.activeTab.tab.activate(true);

            // So that it knows what to deactivate in subsequent tab changes
            me.tabBar.activeTab = me.activeTab.tab;
        }
    },
    // private
    onBoxReady: function() {
       this.callParent(arguments);
//        this.initMegaMan();
    },
    initMegaMan: function () {
        var me = this;
        Ext.Ajax.request({
            url: '/page/list',
            method: 'GET',
            success: function (resp) {
                var itms = Ext.decode(resp.responseText);
                var ai = [];
                var rslt = []; // top-level items array
                for (key in itms) {
                    var itm = itms[key];
                    var cat = itm.category;
                    if (ai[cat] == null) {
                        ai[cat] = [];
                    }
                    ai[cat].push(itm);
                }
                for (k2 in ai) {
                    var sub = {
                        items: [
                            {
                                category: k2,
                                xtype: 'component',
                                cls: 'dropdown-header',
                                html: k2
                            },
                            {
                                xtype: 'menu',
                                floating: false,
                                defaultType: 'menucheckitem',
                                defaults: {
                                    checkedCls: 'hmp-favorite-checked',
                                    uncheckedCls: 'hmp-favorite-unchecked',
                                    checked: false,
                                    listeners: {
                                        click: me.onMegaClick
                                    }
                                },
                                items: [
                                ]
                            }
                        ]
                    };
                    for (k3 in ai[k2]) {
                        sub.items[1].items.push({
                            text: ai[k2][k3].name,
                            checked: false,
                            pagedef: ai[k2][k3]
                        });
                    }
                    rslt.push(sub);
                }
                var dockedPanel = me.getDockedItems()[0];
                var buuhn = Ext.create('Ext.button.Button', {
                    text: 'More',
                    disabled:true,
                    margin: '0 4',
                    menu: {
                        plain: true,
                        bodyPadding: 4,
                        layout: 'hbox',
                        defaults: {
                            xtype: 'container',
                            padding: 0,
                            flex: 1,
                            layout: {
                                type: 'vbox',
                                align: 'stretch'
                            }
                        },
                        items: rslt,
                        fbar: [
                            {
                                xtype: 'button',
                                text: 'New Custom View',
                                handler: me.createNewTab
                            },
                            {
                                xtype: 'button',
                                text: 'Close',
                                handler: function (btn) {
                                    btn.up('menu').hide();
                                }
                            }
                        ]
                    }
                });
                dockedPanel.insert(0, buuhn);
                me.refreshTabs();
            },
            failure: function (resp) {

            }
        })
    },
    createNewTab: function () {
        var me = this.up('charttabs');
        var wnd = Ext.create('gov.va.cpe.patient.ChartTabEditor', {
            target: me
        });
        wnd.show();
    },
    addTabOption: function (tabJson, select) {
        var me = this;
        var cat = tabJson.category;
        var dockedPanel = this.getDockedItems()[0];
        var catcomps = Ext.ComponentQuery.query('component[category="' + cat + '"]');
        var cmp = null;
        if (catcomps && catcomps.length > 0) {
            var catcomp = catcomps[0].up('container').down('panel');
            cmp = catcomp.add({
                text: tabJson.name,
                checked: select,
                pagedef: tabJson
            });
        } else {
            var bn = dockedPanel.down('button');
            bn.menu.add({
                items: [
                    {
                        category: tabJson.category,
                        xtype: 'component',
                        cls: 'dropdown-header',
                        html: tabJson.category
                    },
                    {
                        xtype: 'menu',
                        floating: false,
                        defaultType: 'menucheckitem',
                        defaults: {
                            checkedCls: 'hmp-favorite-checked',
                            uncheckedCls: 'hmp-favorite-unchecked',
                            checked: false,
                            listeners: {
                                click: me.onMegaClick
                            }
                        },
                        items: [
                            {
                                text: tabJson.name,
                                checked: select,
                                pagedef: tabJson
                            }
                        ]
                    }
                ]
            });
            cmp = bn.down('menu').down('component');
        }
        if (select) {
            this.onMegaClick(cmp);
        }

    },
    listsAreEqual: function (set1, set2) {
        if (set1 == null || set2 == null) {
            return set1 == set2;
        }
        if (set1.length != set2.length) {
            return false;
        }
        for (i = 0; i < set1.length; i++) {
            if (set1[i].uid != set2[i].uid) {
                return false;
            }
        }
        return true;
    },
    getMegaComps: function () {
        var dockedPanel = this.getDockedItems()[0];
        var leaves = Ext.ComponentQuery.query('component', dockedPanel); // Couldn't get 'component[uid!=null]' to work for the selector so screw it. Brute force time.
        var rslt = [];
        for (key in leaves) {
            if (leaves[key].pagedef) {
                rslt.push(leaves[key]);
            }
        }
        return rslt;
    },
    getCategoryNames: function () {
        var cats = [];
        var rslt = [];
        var comps = this.getMegaComps();
        for (key in comps) {
            var comp = comps[key];
            if (($.inArray(comp.pagedef.category, cats) > -1) == false) {
                cats.push(comp.pagedef.category);
                rslt.push({'category': comp.pagedef.category});
            }
        }
        return rslt;
    },
    onMegaClick: function (cmp) {
        // Collect all checked items and submit to the back-end.
        var me = cmp.up('charttabs');
        var dockedPanel = me.getDockedItems()[0];
        var leaves = me.getMegaComps();//Ext.ComponentQuery.query('component',dockedPanel); // Couldn't get 'component[uid!=null]' to work for the selector so screw it. Brute force time.

        var submitData = [];
        for (key in leaves) {
            var leaf = leaves[key];
            if (leaf.checked) {
                submitData.push(leaf.pagedef);
            }
        }

        var rslt = me.listsAreEqual(submitData, me.prefs);

        if (rslt) {
            return;
        }

        Ext.Ajax.request({
            url: '/page/set',
            method: 'POST',
            tabsJson: submitData,
            params: function () {
                return {'tabsJson': Ext.encode({'data': submitData})};
            },
            success: function (response) {
                me.refreshTabs();
            }
        })
    },
    refreshTabs: function () {
        var me = this;
        if (!me.refreshing) {
            me.refreshing = true;
            me.queueRefresh = false;
            Ext.Ajax.request({
                url: '/page/userPref',
                methood: 'GET',
                success: function (resp) {
                    var prefs = Ext.decode(resp.responseText);
                    if (prefs) {
                        me.prefs = prefs.tabs;
                        Ext.suspendLayouts();
                        me.removeAll();
                        for (key in me.prefs) {
                            // Add an item for each one!
                            me.add(me.prefs[key].widget);
                        }
                        Ext.resumeLayouts();
                    }
                    me.refreshing = false;
                    if (me.queueRefresh) {
                        me.refreshTabs();
                    } else {
                        me.synchPrefsSelectStatus();
                    }

                    // set the first tab as active for now
                    me.setActiveTab(0);
                },
                failure: function (resp) {
                    me.refreshing = false;
                    me.queueRefresh = false;
                    console.log('Error getting user tab prefs: ' + resp.responseText);
                }
            })
        }
    },
    synchPrefsSelectStatus: function () {
        var me = this;
        var optids = [];
        for (key in me.prefs) {
            optids.push(me.prefs[key].uid);
        }
        var leaves = me.getMegaComps();
        var changed = false;
        for (key2 in leaves) {
            var leaf = leaves[key2];
            var chk = ($.inArray(leaf.pagedef.uid, optids) > -1);//(optids.indexOf(leaf.pagedef.uid)>0);
            if (chk != leaf.checked) {
                leaf.setChecked(chk);
            }
        }
    },
    /**
     * Makes the given card active. Makes it the visible card in the TabPanel's CardLayout and highlights the Tab.
     * @param {String/Number/Ext.Component} card The card to make active. Either an ID, index or the component itself.
     * @return {Ext.Component} The resulting active child Component. The call may have been vetoed, or otherwise
     * modified by an event listener.
     */
    setActiveTab: function (card) {
        var me = this,
            previous;

        card = me.getComponent(card);
        if (card) {
            previous = me.getActiveTab();

            if (previous !== card && me.fireEvent('beforetabchange', me, card, previous) === false) {
                return false;
            }

            me.setPatientAwareForTab(previous, false);
            me.setPatientAwareForTab(card, true);

            // We may be passed a config object, so add it.
            // Without doing a layout!
            if (!card.isComponent) {
                Ext.suspendLayouts();
                card = me.add(card);
                Ext.resumeLayouts();
            }

            // MUST set the activeTab first so that the machinery which listens for show doesn't
            // think that the show is "driving" the activation and attempt to recurse into here.
            me.activeTab = card;

            // Attempt to switch to the requested card. Suspend layouts because if that was successful
            // we have to also update the active tab in the tab bar which is another layout operation
            // and we must coalesce them.
            Ext.suspendLayouts();
            me.layout.setActiveItem(card);

            // Read the result of the card layout. Events dear boy, events!
            card = me.activeTab = me.layout.getActiveItem();

            // Card switch was not vetoed by an event listener
            if (card && card !== previous) {
                // Update the active tab in the tab bar and resume layouts.
                var tab = null;
                me.tabBar.items.each(function (i) {
                    if (card == i.card) tab = i;
                });
                if (!tab.disabled && tab !== me.tabBar.activeTab) {
                    if (me.tabBar.activeTab) {
                        if (me.tabBar.activeTab.isDestroyed) {
                            me.tabBar.previousTab = null;
                        } else {
                            me.tabBar.previousTab = me.activeTab;
                            me.tabBar.activeTab.deactivate();
                        }
                    }
                    tab.activate();

                    me.tabBar.activeTab = tab;

                    // Ensure that after the currently in progress layout, the active tab is scrolled into view
                    me.tabBar.needsScroll = true;
                    me.tabBar.updateLayout();
                }

                Ext.resumeLayouts(true);

                // previous will be undefined or this.activeTab at instantiation
                if (previous !== card) {
                    me.fireEvent('tabchange', me, card, previous);
                }
            }
            // Card switch was vetoed by an event listener. Resume layouts (Nothing should have changed on a veto).
            else {
                Ext.resumeLayouts(true);
            }
            return card;
        }
    },

    setPatientAwareForTab: function(tab, flag) {
        if (tab != null) {
            if ( typeof(tab.patientAware) !== 'undefined' )   {
                tab.patientAware = flag;
                if ( flag && tab.pid != 0 && tab.pid != gov.va.hmp.PatientContext.pid ) {
                    tab.pid =  gov.va.hmp.PatientContext.pid;
                    if(Ext.isFunction(tab.reload)) {
                        tab.reload();
                    }
                }
            }
            else {
                if ( typeof(tab.patientAwareTab) !== 'undefined' ) {
                    if ( flag ) {
                        tab.enablePatientAware();
                    } else {
                        tab.disablePatientAware();
                    }
                }
            }
        }
    },

    /**
     * Returns the item that is currently active inside this TabPanel.
     * @return {Ext.Component} The currently active item.
     */
    getActiveTab: function () {
        var me = this,
        // Ensure the calculated result references a Component
            result = me.getComponent(me.activeTab);

        // Sanitize the result in case the active tab is no longer there.
        if (result && me.items.indexOf(result) != -1) {
            me.activeTab = result;
        } else {
            me.activeTab = null;
        }

        return me.activeTab;
    },
    /**
     * @protected
     * Makes sure we have a Tab for each item added to the TabPanel
     */
    onAdd: function (item, index) {
        var me = this,
            cfg = item.tabConfig || {},
            defaultConfig = {
                xtype: 'tab',
                card: item,
                disabled: item.disabled,
                closable: item.closable,
                hidden: item.hidden && !item.hiddenByLayout, // only hide if it wasn't hidden by the layout itself
                tooltip: item.tooltip,
                tabBar: me.tabBar,
                closeText: item.closeText
            };

        cfg = Ext.applyIf(cfg, defaultConfig);

        // Create the correspondiong tab in the tab bar
        item.tab = me.tabBar.insert(index, cfg);
        me.mon(item.tab, 'click', me.onTabClick, me);

        item.on({
            scope: me,
            enable: me.onItemEnable,
            disable: me.onItemDisable,
            beforeshow: me.onItemBeforeShow,
//            iconchange: me.onItemIconChange,
//            iconclschange: me.onItemIconClsChange,
            titlechange: me.onItemTitleChange
        });

        if (item.isPanel) {
            if (me.removePanelHeader) {
                if (item.rendered) {
                    if (item.header) {
                        item.header.hide();
                    }
                } else {
                    item.header = false;
                }
            }
            if (item.isPanel && me.border) {
                item.setBorder(false);
            }
        }
    },

    onRemove: function (item, bool) {
        var titem = null;
        for (key in this.tabBar.items.items) {
            if (this.tabBar.items.items[key].card == item) {
                titem = this.tabBar.items.items[key];
            }
        }
        if (titem) {
            this.tabBar.remove(titem);
        }
    },

    // @private
    onTabClick: function (tab, e) {
        // The target might not be a valid tab el.
        var me = this,
            tabEl = tab.getEl(),
//            tabEl = e.getTarget('.' + Ext.tab.Tab.prototype.baseCls),
//            tab = tabEl && Ext.getCmp(tabEl.id),
            isCloseClick = tab && tab.closeEl && (e.getTarget() === tab.closeEl.dom);
        if (isCloseClick) {
            e.preventDefault();
        }
        if (tab && tab.isDisabled && !tab.isDisabled()) {
            if (tab.closable && isCloseClick) {
                tab.onCloseClick();
            } else {
                me.setActiveTab(tab.card);
                tab.focus();
            }
        }
    },

    /**
     * @private
     * Enable corresponding tab when item is enabled.
     */
    onItemEnable: function (item) {
        item.tab.enable();
    },

    /**
     * @private
     * Disable corresponding tab when item is enabled.
     */
    onItemDisable: function (item) {
        item.tab.disable();
    },

    /**
     * @private
     * Sets activeTab before item is shown.
     */
    onItemBeforeShow: function (item) {
        if (item !== this.activeTab) {
            this.setActiveTab(item);
            return false;
        }
    },

    /**
     * @private
     * Update the tab title when panel title has been set or changed.
     */
    onItemTitleChange: function (item, newTitle) {
        item.tab.setText(newTitle);
    }
});
