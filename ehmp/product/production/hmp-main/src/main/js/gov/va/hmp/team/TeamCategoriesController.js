/**
 * Controls TeamCategoriesPanel.
 */
Ext.define('gov.va.hmp.team.TeamCategoriesController', {
    extend:'gov.va.hmp.Controller',
    requires:[
        'gov.va.hmp.team.TeamCategoriesPanel'
    ],
    refs:[
        {
            ref:'nameField',
            selector:'#categoryNameField'
        },
        {
            ref:'categoryList',
            selector:'#categoryList'
        },
        {
            ref:'categoryForm',
            selector:'#categoryEdit'
        }
    ],
    init:function () {
//        console.log(Ext.getClassName(this) + ".init()");
        var me = this;
        me.control({
            '#categoryList':{
                select:me.onSelect
            },
            '#categoryList actioncolumn':{
                click:me.onAction
            },
            '#createCategoryButton':{
                click:me.onNew
            },
            '#deleteCategoryButton':{
                click:me.onClickDelete
            },
            '#saveCategoryButton':{
                click:me.onSave
            },
            '#categoryNameField':{
                blur:me.onNameBlur
            }
        });
    },
    onSelect:function (grid, record, index) {
//        console.log("select()");
        var formpanel = this.getCategoryForm();
        formpanel.setTitle(record.get('name'));
        var form = formpanel.getForm();
        form.loadRecord(record);
    },
    onNameBlur:function (field) {
        var form = this.getCategoryForm().getForm();
        if (!form.isDirty()) return;
        form.updateRecord();
        this.getCategoryForm().setTitle(form.getRecord().get('name'));
    },
    onNew:function () {
//        console.log("new category please!");
        var newPosition = Ext.create('gov.va.hmp.team.TeamCategory', {
            name:"New Category"
        });
        var categoryStore = Ext.getStore('teamCategories');
        categoryStore.add(newPosition);
        this.getCategoryList().getSelectionModel().select(newPosition);
        this.getNameField().focus(true, 40);
    },
    onClickDelete:function() {
        this.removeCategory(this.getCategoryForm().getForm().getRecord());
    },
    onAction: function(view,cell,row,col,e){
        var category = this.getCategoryList().getStore().getAt(row);
        this.removeCategory(category);
    },
    removeCategory:function(category) {
        var me = this;
        var categoryName = category.get('name');
        Ext.Msg.show({
            title: "Remove '" + categoryName + "'",
            icon: Ext.Msg.QUESTION,
            msg: "Are you sure you want to remove category '" + categoryName + "'?",
            buttons: Ext.Msg.YESNO,
            callback: me.onConfirmRemove,
            scope: me,
            category: category
        });
    },
    onConfirmRemove:function(btn, value, opts) {
        if (btn != "yes") return;

        this.doRemoveCategory(opts.category);
    },
    doRemoveCategory:function (category) {
        var me = this;
        var remcat = category;
        var categoryStore = Ext.getStore('teamCategories');
        var uid = category.getId();
        if (!uid) return; // no need to delete - it hasn't been saved yet.
        Ext.Ajax.request({
            url: '/category/' + uid,
            method: 'DELETE',
            jsonData: category.getData(),
            success: function(response, opts) {
                var json = Ext.decode(response.responseText);
            	if(json.error && json.error.message) {
            		Ext.MessageBox.alert("Unable to remove Category",json.error.message);
            		return;
            	}
                categoryStore.remove(remcat);
                me.getCategoryForm().getForm().reset(true);
                me.getCategoryForm().setTitle('&nbsp;');
            },
            failure: function(response, opts) {
            	var json = Ext.decode(response.responseText);
            	if(json.error && json.error.message) {
            		Ext.MessageBox.alert("Unable to delete",json.error.message);
            	}
            }
        });
//        this.down('grid').getSelectionModel()
    },
    onSave:function () {
        var me = this;
        var form = me.getCategoryForm().getForm();
        var categoryStore = Ext.getStore('teamCategories');
        form.updateRecord();
        var category = form.getRecord();
        if (!category) return;
        category.set('domain', 'team');
        var uid = category.getId();
        Ext.Ajax.request({
            url: uid ? '/category/' + uid : '/category/new',
            method: 'POST',
            jsonData: category.getData(),
            success: function(response, opts) {
                var json = Ext.decode(response.responseText);
            	if(json.error && json.error.message) {
            		Ext.MessageBox.alert("Unable to save",json.error.message);
            		return;
            	}
                if (!uid) category.set('uid', json.data.uid);
                category.commit();
                categoryStore.sort();
                me.getCategoryList().getView().focusRow(category);
            },
            failure: function(response, opts) {
            	var json = Ext.decode(response.responseText);
            	if(json.error && json.error.message) {
            		Ext.MessageBox.alert("Unable to save",json.error.message);
            	}
            }
        });
    }
});