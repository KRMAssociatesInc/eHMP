Ext.define('gov.va.hmp.config.PagePanel', {
    extend: 'Ext.form.Panel',
    requires: [
        'gov.va.hmp.config.PageColumn',
        'gov.va.hmp.config.PageDropZone',
        'gov.va.hmp.config.HmpComponentPicker',
        'gov.va.hmp.config.LayoutPicker',
        'gov.va.hmp.ux.PopUpButton'
    ],
    alias: 'widget.pagepanel',
    title: 'New Page',
    frane: true,
    tools: [
        {
            xtype: 'button',
            ui: 'pill',
            text: 'Single Patient',
            pressed: true,
            enableToggle: true,
            toggleGroup: 'patientDataDisplayType'
        },
        {
            xtype: 'button',
            ui: 'pill',
            text: 'Multi-Patient',
            enableToggle: true,
            toggleGroup: 'patientDataDisplayType'
        },
        {
            xtype: 'button',
            ui: 'pill',
            text: 'No Patient Data',
            enableToggle: true,
            toggleGroup: 'patientDataDisplayType'
        },
        {
            xtype: 'tbspacer',
            width: 22
        },
        {
            xtype: 'popupbutton',
            ui: 'pill',
            text: 'Add Content',
            popUp: {
                xtype: 'hmpcomponentpicker',
                width: 500,
                height: 480
            }
        },
        {
            xtype: 'popupbutton',
            ui: 'pill',
            text: 'Edit Layout',
            popUp: {
                xtype: 'layoutpicker',
                margin: '0 0 10 0'
            }
        }
    ],
    manageHeight: false,
    defaultType: 'pagecolumn',
    defaults: {
        margin: '3 3',
        columnWidth: 0.33
    },
    layout: {
        type: 'column',
        reserveScrollbar: true
    },
    items: [
        {
            xtype: 'pagecolumn',
            items: [
                {
                    xtype: 'panel',
                    frame: true,
                    title: 'One',
                    draggable: {
                        moveOnDrag: false
                    },
                    bodyPadding: 6,
                    layout: 'fit',
                    items: [
                        {
                            xtype: 'component',
                            html: '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam tortor nibh, aliquam ac arcu ut, viverra scelerisque nunc. Phasellus ut faucibus nunc, et ullamcorper eros. Vivamus sagittis, tortor semper viverra fermentum, eros dui porttitor metus, nec facilisis justo tellus vel sem. Aenean posuere euismod odio, vel consectetur libero luctus a. Mauris tincidunt mauris vel lacus adipiscing, sit amet scelerisque arcu venenatis. Vestibulum fringilla pellentesque libero, sit amet eleifend ligula luctus a. Aliquam tortor urna, dignissim iaculis elit eu, semper consequat metus. Fusce lacinia vulputate viverra.</p>' +
                                '<p>Nam vitae lacus orci. Nam ut erat sodales, tincidunt ipsum a, hendrerit orci. Donec vel faucibus diam. Phasellus tortor augue, tincidunt ac nulla a, consectetur vulputate dui. In ac tortor quis velit volutpat congue. In rutrum rhoncus neque, in semper urna venenatis sed. Morbi ac neque ullamcorper, mollis risus in, condimentum nibh. Morbi eget condimentum mi. Suspendisse iaculis, lacus et congue mollis, lectus quam consectetur nisl, quis ultrices nunc mauris et velit.</p>'
                        }
                    ]
                }
            ]
        },
        {
            xtype: 'pagecolumn',
            items: [
                {
                    xtype: 'panel',
                    frame: true,
                    title: 'Two',
                    draggable: {
                        moveOnDrag: false
                    },
                    bodyPadding: 6,
                    layout: 'fit',
                    items: [
                        {
                            xtype: 'component',
                            html: '<div>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</div>'
                        }
                    ]
                }
            ]
        },
        {
            xtype: 'pagecolumn',
            items: [
                {
                    xtype: 'panel',
                    frame: true,
                    title: 'Three',
                    draggable: {
                        moveOnDrag: false
                    },
                    bodyPadding: 6,
                    layout: 'fit',
                    items: [
                        {
                            xtype: 'component',
                            html: '<ul class="hmp-richtext"><li>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</li>' +
                                '<li>Nullam condimentum ligula sit amet tellus ullamcorper fringilla.</li>' +
                                '<li>Curabitur auctor eros nec odio ornare, sit amet tincidunt nunc placerat.</li>' +
                                '<li>Quisque malesuada felis a bibendum sagittis.</li>' +
                                '<li>Cras placerat magna a nunc bibendum, vitae feugiat nulla facilisis.</li></ul>'
                        }
                    ]
                }
            ]
        }
    ],
    initComponent: function () {
        this.callParent(arguments);

        this.addEvents({
            validatedrop: true,
            beforedragover: true,
            dragover: true,
            beforedrop: true,
            drop: true
        });
    },
    afterRender: function () {
        this.callParent(arguments);
        this.dd = Ext.create('gov.va.hmp.config.PageDropZone', this, this.dropConfig);
    },
    // private
    beforeDestroy: function () {
        if (this.dd) {
            this.dd.unreg();
        }
        this.callParent();
    }
});