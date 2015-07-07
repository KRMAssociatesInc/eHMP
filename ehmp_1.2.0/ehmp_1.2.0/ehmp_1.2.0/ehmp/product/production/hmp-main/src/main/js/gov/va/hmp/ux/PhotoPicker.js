/**
 *
 */
Ext.define('gov.va.hmp.ux.PhotoPicker', {
    extend:'Ext.panel.Panel',
    requires:[
        'gov.va.hmp.ux.PhotoSnapshot'
    ],
    alias:'widget.photopicker',
    bodyPadding:6,
    width:400,
    height:300,
    /**
     * @cfg previewSize
     */
    previewSize: 96,
    layout:{
        type:'card'
//        align: 'center'
    },
    items:[
        {
            xtype:'panel',
            itemId:'previewPanel',
            width:'100%',
            height:'100%',
            layout:{
                type:'vbox',
                align:'center'
            },
            cls:'hmp-photo-drop-area',
            items:[
                {
                    xtype:'component',
                    itemId:'message',
                    flex:3,
                    margin:'130 0 0 0',
                    autoEl:{
                        tag:'p',
                        style:'font-weight:bold;font-size:14;color:#3F4751',
                        html:'Drop a photo here (TBD)'
                    }
                },
                {
                    xtype:'button',
                    itemId:'cameraButton',
                    flex:1,
                    ui:'link',
                    text:'Take a photo with web camera'
                },
                {
                    xtype:'filefield',
                    name:'file',
                    flex:1,
                    allowBlank:false,
                    buttonOnly:true,
                    buttonText:'Select a photo from your computer',
                    buttonConfig:{
                        ui:'link',
                        height:22
                    }
                }
            ]
        },
        {
            xtype:'photosnapshot',
            width:'100%',
            height:'100%'
        },
        {
            xtype:'container',
            ui: 'plain',
            width:'100%',
            height:'100%',
            layout:'border',
            items:[
                {
                    xtype:'image',
                    region: 'center',
                    itemId:'preview'
                },
                {
                    xtype: 'container',
                    region: 'east',
                    margin: '0 0 0 6',
                    layout: {
                        type: 'hbox',
                        align: 'middle'
                    },
                    items: [
                        {
                            xtype:'component',
                            itemId:'previewCanvas',
                            autoEl:{
                                tag:'canvas',
                                style:'overflow:hidden'
                            }
                        }
                    ]
                }
            ]
        }
    ],
    initComponent:function () {
        var canvasCfg = this.items[2].items[1].items[0].autoEl;
        canvasCfg.width = canvasCfg.height = this.previewSize;

        this.callParent(arguments);

        this.addEvents([
//            /**
//             * @event select
//             * Fires when a photo is selected
//             * @param {Ext.picker.Color} this
//             * @param {String} color The 6-digit color hex code (without the # symbol)
//             */
//            'select',
        /**
         * Fires after a successful upload.
         */
            'load',
        /**
         * Fires after an unsuccessful upload.
         */
            'exception'
        ]);

        var cameraButton = this.down('#cameraButton');
        if (!gov.va.hmp.supports.GetUserMedia) {
            cameraButton.hide();
        }
        cameraButton.on('click', this.onCameraSelect, this);
        this.getFileField().on('change', this.onFileSelect, this);
        this.down('photosnapshot').on('snapshot', this.onSnapshot, this);
    },
    reset:function () {
        this.getMessage().update(this.getMessage().initialConfig.autoEl.html);
        this.getLayout().setActiveItem(0);
        // destroy Jcrop if it is existed
        if (Ext.isDefined(this.jcrop_api))
            this.jcrop_api.destroy();
    },
    uploadTo:function (url) {
        var me = this;
        if (!me.down("#preview").src) return;

        var imageData = me.toDataURL();
        imageData = imageData.replace('data:image/png;base64,', '');
        Ext.Ajax.request({
            url:url,
            method:'POST',
            jsonData:Ext.JSON.encode({
                "content-type":"image/png;base64",
                "data":imageData
            }),
            success:function (response) {
                me.fireEvent('load', me, imageData, response);
            },
            failure:function (response) {
                e.fireEvent('exception', me, imageData, response);
            }
        });
    },
    toDataURL:function () {
        return this.previewCanvasDomEl.toDataURL("image/png");
    },
    /**
     * @private
     */
    getFileField:function () {
        return this.down('filefield');
    },
    /**
     * @private
     */
    getMessage:function () {
        return this.down('#message');
    },
    /**
     * @private
     */
    onCameraSelect:function () {
        this.getLayout().setActiveItem(1);
    },
    /**
     * @private
     */
    onFileSelect:function (field, newValue, oldValue) {
        var me = this;

        var file = me.getFileField().fileInputEl.dom.files[0];

        var rFilter = /^(image\/jpeg|image\/png)$/i;
        if (!rFilter.test(file.type)) {
            me.getMessage().update('Please select a valid image file (jpg and png are allowed).');
            return;
        }

        // check for file size
        if (file.size > 250 * 1024) {
            me.getMessage().update('You have selected too big a file, please select a smaller image file.');
            return;
        }

        // switch to preview card
        me.getLayout().setActiveItem(2);

        // prepare HTML5 FileReader
        var fileReader = new FileReader();
        fileReader.onload = function (fileLoadEvent) {
            // loadEvent.target.result contains the DataURL which we can use as a source of the image
            me.setPhoto.call(me, fileLoadEvent.target.result);
        };

        // read selected file as DataURL
        fileReader.readAsDataURL(file);

        return newValue;
    },
    /**
     * @private
     */
    setPhoto:function (url) {
        this.down('#preview').setSrc(url);
    },
    /**
     * @private
     */
    onPhotoLoad:function () {
        var me = this;
        var imageWidth, imageHeight;

        // destroy Jcrop if it is existed
        if (Ext.isDefined(me.jcrop_api)) {
            me.jcrop_api.destroy();
            imageWidth = imageHeight = null;
        }

        // initialize Jcrop
        $(me.previewImgDomEl).Jcrop({
            minSize:[32, 32], // min crop size
            aspectRatio:1, // keep aspect ratio 1:1
            bgFade:true, // use fade effect
            bgOpacity:.3, // fade opacity
            onChange: function(c) {me.updatePreviewCanvas.call(me, c)},
            onSelect:function(c) {me.updatePreviewCanvas.call(me, c)},
            onRelease:function(c) {me.updatePreviewCanvas.call(me, c)}
        }, function () {
            // Store the Jcrop API in the jcrop_api variable
            me.jcrop_api = this;

            var bounds = me.jcrop_api.getBounds();
            imageWidth = bounds[0];
            imageHeight = bounds[1];
//            console.log("1{" + imageWidth + "," + imageHeight + "} (" + me.previewSize + ")");
        });

        // stop camera if this was a snapshot
        me.down('photosnapshot').stopCamera();

        // update the canvas
//        console.log("2{" + imageWidth + "," + imageHeight + "} (" + me.previewSize + ")");
        var imageSize = imageWidth > imageHeight ? imageHeight : imageWidth;
        var canvasCtx = me.previewCanvasDomEl.getContext('2d');
        canvasCtx.drawImage(me.previewImgDomEl, 0, 0, me.previewSize, me.previewSize);
    },
    /**
     * Updates the preview canvas with the cropped photo.
     * @param c JCrop callback coordinates;  c.x, c.y, c.x2, c.y2, c.w, c.h are available
     * @private
     */
    updatePreviewCanvas:function (c) {
        if (!c) return;
        if (c.w <= 0) return;

        var me = this;
        var canvasCtx = me.previewCanvasDomEl.getContext('2d');
//        console.log(c);
        canvasCtx.drawImage(me.previewImgDomEl, c.x, c.y, c.w, c.h, 0, 0, me.previewSize, me.previewSize);
    },
    /**
     * @private
     */
    onSnapshot:function (cmp, dataUrl) {
        var me = this;

        // switch to preview card
        me.getLayout().setActiveItem(2);

        // preview image component
        me.setPhoto(dataUrl);
    },
    afterRender:function () {
        var me = this;

        me.callParent(arguments);

        // set some references for convenience
        me.previewImgDomEl = this.down("#preview").getEl().dom;
        me.previewCanvasDomEl = this.down('#previewCanvas').getEl().dom;

        // hook up img onload event
        me.previewImgDomEl.onload = function () {
            me.onPhotoLoad.call(me);
        };
    },
    onDestroy:function () {
        if (Ext.isDefined(this.jcrop_api))
            this.jcrop_api.destroy();

        this.callParent(arguments);
    }
});