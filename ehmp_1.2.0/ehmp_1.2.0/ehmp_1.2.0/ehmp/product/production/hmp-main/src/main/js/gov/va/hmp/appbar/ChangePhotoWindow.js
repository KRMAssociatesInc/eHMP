Ext.define('gov.va.hmp.appbar.ChangePhotoWindow', {
    extend:'Ext.window.Window',
    requires:[
        'gov.va.hmp.UserContext',
        'gov.va.hmp.ux.PhotoPicker'
    ],
    title:'Edit Photo',
    items:[
        {
            xtype:'photopicker'
        }
    ],
    buttons:[
        {
            itemId:'cancelButton',
            text:'Cancel'
        },
        {
            itemId:'setPhotoButton',
            ui:'primary',
            text:'Set User Photo'
        }
    ],
    initComponent:function () {
        var me = this;
        me.callParent(arguments);

        me.addEvents([
            'load'
        ]);

        var photopicker = me.down('photopicker')
        photopicker.on('load', me.onUpload, me);
        me.down('#cancelButton').on('click', me.onCancel, me);
        me.down('#setPhotoButton').on('click', me.onSetPhoto, me);

        var nav = new Ext.util.KeyNav({
            target:me,
            enter:me.onSetPhoto,
            // Binding may be a function specifiying fn, scope and defaultAction
            esc:{
                fn:me.onCancel,
                defaultEventAction:false
            },
            scope:me
        });
    },
    onCancel:function () {
        this.close();
    },
    onSetPhoto:function () {
        var photopicker = this.down('photopicker');
        photopicker.uploadTo('/person/v1/' + gov.va.hmp.UserContext.getUserInfo().uid + '/photo');
    },
    onUpload:function () {
        this.fireEvent('load', this);
        this.close();
    }
});