/**
 * Coordinates selection on AdminScreenSelector and active card on AdminCardPanel along with history so state is preserved across browser refresh
 */
Ext.define('gov.va.hmp.admin.AdminScreenController', {
    extend:'gov.va.hmp.Controller',
    requires:[
        'gov.va.hmp.admin.AdminCardPanel',
        'gov.va.hmp.admin.SyncErrorStore'
    ],
    refs:[
        {
            ref:'screenSelector',
            selector:'#adminScreenSelector'
        },
        {
            ref:'adminCardPanel',
            selector:'#adminCardPanel'
        }
    ],
    init:function () {
//        console.log(Ext.getClassName(this) + ".init()");
        var me = this;

        me.control({
            '#adminScreenSelector':{
                select:function (tree, record, item, index, e) {
//                    Ext.log("select()");
                    if (!record.isLeaf()) {
                        me.setActiveScreen("");
                        return;
                    }

                    var view = record.get('view');
                    me.setActiveScreen(view);
                },
                boxready:function () {
//                    Ext.log("boxready()");
                    Ext.util.History.on('change', function (token) {
//                        Ext.log("history change()");
                        if (token.length == 0) return;
                        // restore selection on tree
//                        Ext.log("history.change(" + token + ")");
                        var store = Ext.getStore('adminScreens');
                        var record = store.getRootNode().findChild('view', token, true);
                        if (record) {
                            me.getScreenSelector().getSelectionModel().suspendEvents();
                            me.getScreenSelector().getSelectionModel().select(record);
                            me.getScreenSelector().getSelectionModel().resumeEvents();
                        }
                    });
                    var token = Ext.util.History.getToken();
                    if (token && token.length > 0) {
                        var store = Ext.getStore('adminScreens');
                        var record = store.getRootNode().findChild('view', token, true);
                        if (record) {
                            me.getScreenSelector().getSelectionModel().select(record);
                        }
                    }
                }
            }
        });

        Ext.TaskManager.start({
            run: me.autorefresh,
            scope: me,
            interval: 10000
        });
    },
    setActiveScreen:function (view) {
//        Ext.log("setActiveScreen(" + view + ")");

        var admin = this.getAdminCardPanel();

        if (view.length > 0) {
            var child = Ext.ComponentQuery.query('#'+view)[0];
            if (child) {
                var oldcard = admin.getLayout().getActiveItem();
                admin.setVisible(true);
                admin.getLayout().setActiveItem(child);
                this.autorefresh();
            } else {
                admin.setVisible(false);
            }
        } else {
            admin.setVisible(false);
        }
//        Ext.log("history add(" + view + ")");
        Ext.util.History.add(view);
    },
    autorefresh:function () {
        var admin = this.getAdminCardPanel();
        if (!admin || admin.isHidden()) return;

        var activeView = admin.getLayout().getActiveItem();
        if (activeView && activeView.autorefresh && Ext.isFunction(activeView.autorefresh)) {
            activeView.autorefresh.call(activeView);
        }
    }
});