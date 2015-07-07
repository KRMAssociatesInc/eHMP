Ext.define('gov.va.hmp.admin.ManagePluginsPanel', {
    extend: 'Ext.grid.Panel',
    requires: [
        'gov.va.hmp.EventBus',
        'gov.va.hmp.admin.Bundle',
        'gov.va.hmp.ux.Alert'
    ],
    title: 'Manage Plugins',
    emptyText: 'No plugins in this category match your filter.',
    store: {
        model: 'gov.va.hmp.admin.Bundle',
        proxy: {
            type: 'ajax',
            url: '/plugins/v1/list',
            reader: {
                type: 'json',
                root: 'data.items'
            }
        },
        autoLoad: false,
        filterOnLoad: true,
        filters: [
            { property: "category", value: 'user'}
        ]
    },
    columns: [
        {text: 'Name', xtype: 'templatecolumn', flex: 1, tpl: '<strong>{name}</strong>'},
        {text: 'Status', dataIndex: 'state'}
    ],
    plugins: [
        {
            ptype: 'rowexpander',
            rowBodyTpl:
                '<div style="padding-right: 16px; margin-bottom: 6px">' +
                    '<span>{description}</span>' +
                    '<tpl if="category == \'user\'">' +
                        '<span class="pull-right">' +
                            '<button class="btn btn-small" data-id="{bundleId}" data-action="uninstall">Uninstall</button>' +
                            '<tpl if="stateRaw == 32"><button class="btn btn-small" data-id="{bundleId}" data-action="disable">Disable</button></tpl>' +
                            '<tpl if="stateRaw == 4"><button class="btn btn-small" data-id="{bundleId}" data-action="enable">Enable</button></tpl>' +
                        '</span>' +
                    '</tpl>' +
                '</div>' +
                '<table class="hmp-labeled-values" style="width: 100%">' +
                '<tpl if="docUrl"><tr><td></td><td><a href="{docUrl}" target="_blank">Documentation</a></td></tr></tpl>' +
                '<tr><td>Version</td><td>{version}</td></tr>' +
                '<tr><td>Plugin key</td><td>{symbolicName}</td></tr>' +
                '<tr><td>Developer</td><td>{vendor}</td></tr>' +
                '<tr><td>Category</td><td>{category}</td></tr>' +
                '<tpl if="services.length &gt; 0"><tr>' +
                    '<td>Modules</td>' +
                    '<td>' +
                    '<table class="table table-bordered" style="width: 100%">' +
                    '<tpl for="services">' +
                        '<tr>' +
                            '<td style="padding: 2px 4px">' +
                                '<div><strong>{[ values["hmp.module.name"] ? values["hmp.module.name"] : values["objectClass"] ]}</strong><tpl if="\"hmp.module.name\""><span class="text-muted pull-right">{[ values["objectClass"] ]}</span></tpl></div>' +
                                '<div>{[values["service.description"]]}</div>' +
                            '</td>' +
                        '</tr>' +
                    '</tpl>' +
                    '</table>' +
                    '</td>' +
                    '</tr>' +
                    '</tpl>' +
                '</table>'

        }
    ],
    dockedItems: [
        {
            xtype: 'component',
            padding: '4 5',
            html: 'You can install, update, enable, and disable plugins here.'
        },
        {
            xtype: 'container',
            itemId: 'messages',
            padding: '4 5'
        },
        {
            xtype: 'toolbar',
            dock: 'top',
            items: [
                {
                    xtype: 'textfield',
                    itemId: 'nameFilter',
                    emptyText: 'Filter visible plugins',
                    flex: 1
                },
                {
                    xtype: 'combobox',
                    itemId: 'categorySelector',
                    editable: false,
                    forceSelection: true,
                    displayField: 'name',
                    valueField: 'category',
                    value: 'user',
                    store: Ext.create('Ext.data.Store', {
                        fields: ['category', 'name'],
                        data: [
                            {"name": "User-installed", category: 'user'},
                            {"name": "System", category: 'system'},
                            {"name": "All Plugins", category: 'all'}
                        ]
                    })
                },
                '->',
//                { xtype: 'button', ui: 'link', text: 'Find new plugins', disabled: true },
                { xtype: 'button', ui: 'link', itemId: 'uploadPlugin', text: 'Upload Plugin' }
            ]
        }
    ],
    // @private
    initEvents: function () {
        var me = this;
        me.callParent(arguments);
        me.mon(me.down('#categorySelector'), 'select', me.onCategorySelect, me);
        me.mon(me.down('#nameFilter'), 'change', me.onNamePatternChange, me);
        me.mon(me.down('#uploadPlugin'), 'click', me.onUploadPlugin, me);
        me.mon(me.getView().getEl(), 'click', me.onClickInTable, me);

        gov.va.hmp.EventBus.on('bundleresolved', me.onBundleUpdated, me);
        gov.va.hmp.EventBus.on('bundleunresolved', me.onBundleUnresolved, me);
        gov.va.hmp.EventBus.on('bundlestarted', me.onBundleUpdated, me);
        gov.va.hmp.EventBus.on('bundlestopped', me.onBundleUpdated, me);
    },
    // @private
    onBoxReady: function () {
        this.callParent(arguments);
        this.getStore().load();
    },
    // @private
    onCategorySelect: function (combo, records) {
        if (!this.rendered) return;
        this.resetToCategoryFilter(records[0].get('category'));
        var pattern = this.down('#nameFilter').getValue().trim();
        if (pattern.length > 0) {
            this.getStore().filter('name', new RegExp(".*" + pattern + ".*", "i"));
        }
    },
    // @private
    onNamePatternChange: function (field, newvalue, oldvalue) {
        if (!this.rendered) return;
        var pattern = newvalue.trim();
        if (pattern.length > 0) {
            this.getStore().filter('name', new RegExp(".*" + pattern + ".*", "i"));
        } else {
            this.resetToCategoryFilter(this.down('#categorySelector').getValue());
        }
    },
    // @private
    resetToCategoryFilter: function (category) {
        this.getStore().clearFilter();
        if (category !== 'all') {
            this.getStore().filter('category', category);
        }
    },
    // @private
    onUploadPlugin: function () {
        var me = this;
        var messages = me.down('#messages');
        Ext.create('Ext.window.Window', {
            title: 'Upload Plugin',
            closable: false,
            modal: true,
            bodyPadding: 10,
            height: 200,
            width: 400,
            layout: 'fit',
            items: {  // Let's put an empty grid in just to illustrate fit layout
                xtype: 'form',
                border: false,
                layout: 'anchor',
                fieldDefaults: {
                    anchor: '100%'
                },
                items: [
                    {
                        xtype: 'component',
                        html: 'Upload the .jar file for a custom or third-party plugin here.'
                    },
                    {
                        xtype: 'filefield',
                        name: 'file',
                        flex: 1,
                        allowBlank: false,
                        buttonOnly: true,
                        emptyText: 'No file selected',
                        buttonText: 'Select a file from your computer',
                        buttonConfig: {
                            ui: 'link',
                            height: 22
                        },
                        listeners: {
                            'change': function (filefield, value) {
                                filefield.nextSibling().setValue(value.replace('C:\\fakepath\\', ''));
                            }
                        }
                    },
                    {
                        xtype: 'displayfield',
                        value: 'No file selected'
                    }
                ]
            },
            fbar: [
                {
                    text: 'Cancel',
                    handler: function (btn, event) {
                        btn.up('window').close();
                    }
                },
                {
                    ui: 'primary',
                    text: 'Upload',
                    handler: function () {
                        var win = this.up('window');
                        var form = win.down('form').getForm();
                        if (form.isValid()) {
                            form.submit({
                                url: '/plugins/v1/upload',
                                waitMsg: 'Uploading your plugin...',
                                success: function (form, action) {
                                    var json = action.result;
                                    var alert = gov.va.hmp.ux.Alert.success(json.data.message, 'Success');
                                    messages.add(alert);
                                    me.getStore().reload();
                                    win.close();
                                },
                                failure: function (form, action) {
                                    var json = action.result;
                                    var alert = gov.va.hmp.ux.Alert.error(json.data.message, 'Error');
                                    messages.add(alert);
                                    win.close();
                                }
                            });
                        }
                    }
                }
            ]
        }).show();
    },
    // @private
    onClickInTable: function (event, target) {
        var dataset = target.dataset,
            action = dataset.action;
        if (action === 'uninstall') {
            var bundleId = dataset.id;
            if (bundleId) {
               Ext.Ajax.request({
                   url: '/plugins/v1/' + bundleId,
                   method: 'DELETE',
                   success: function(response, opts) {
                       var json = Ext.decode(response.responseText);
                   },
                   failure: function(response, opts) {
                       console.log('server-side failure with status code ' + response.status);
                   }
               });
            }
        }
        if (action === 'disable') {
            var bundleId = dataset.id;
            if (bundleId) {
                Ext.Ajax.request({
                    url: '/plugins/v1/' + bundleId,
                    method: 'POST',
                    params: {
                        action: 'stop'
                    },
                    success: function(response, opts) {
                        var json = Ext.decode(response.responseText);
                    },
                    failure: function(response, opts) {
                        console.log('server-side failure with status code ' + response.status);
                    }
                });
            }
        }
        if (action === 'enable') {
            var bundleId = dataset.id;
            if (bundleId) {
                Ext.Ajax.request({
                    url: '/plugins/v1/' + bundleId,
                    method: 'POST',
                    params: {
                        action: 'start'
                    },
                    success: function(response, opts) {
                        var json = Ext.decode(response.responseText);
                    },
                    failure: function(response, opts) {
                        console.log('server-side failure with status code ' + response.status);
                    }
                });
            }
        }
    },
    // @private
    onBundleUnresolved: function (event) {
        var me = this;
        var bundle = me.getStore().getById(event.bundleId);
        if (bundle) {
            me.getStore().remove(bundle);
        }
    },
    // @private
    onBundleUpdated: function (event) {
        var me = this,
            bundle = event.bundle;
        if (bundle) {
            me.getStore().loadRawData([bundle], true);
        }
    }
});