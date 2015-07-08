Ext.define('gov.va.hmp.ux.PhotoSnapshot', {
    extend:'Ext.panel.Panel',
    alias:'widget.photosnapshot',
//    layout:
    items:[
        {
            xtype:'component',
            itemId:'videoStream',
            autoEl:{
                tag:'video'
            }
        },
        {
            xtype:'component',
            itemId:'canvasCmp',
            style:'display:none',
            autoEl:'canvas'
        }
    ],
    bbar:[
        '->',
        {
            xtype:'button',
            itemId:'snapshotButton',
            ui:'primary',
            text:'Take Snapshot'
        },
        '->'
    ],
    initComponent:function () {
        var me = this;

        if (!gov.va.hmp.supports.GetUserMedia) {
            me.items = [
                {
                    xtype:'component',
                    html:'HTML5 Media Capture and Streams API Not Supported'
                }
            ];
        }

        me.callParent(arguments);

        me.addEvents(
            /**
             * @event snapshot
             * Fires when this component has taken a snapshot.
             * @param {gov.va.hmp.ux.PhotoSnapshot} this
             * @param {Event} dataUrl The data URL of the image
             */
            'snapshot'
        );

        me.down('#snapshotButton').on('click', me.onSnapshotClick, me);
    },
    startCamera:function () {
        if (!gov.va.hmp.supports.GetUserMedia) return;
//        console.log("startCamera()");
        var videoEl = this.getVideoEl();
        videoEl.play();
        this.getUserMedia({video:true}, this.onObtainVideoStream, this.onUnableToObtainVideoStream);
    },
    stopCamera:function () {
        if (!gov.va.hmp.supports.GetUserMedia) return;
//        console.log("stopCamera()");
        var videoEl = this.getVideoEl();
        videoEl.pause();
        if (this.localMediaStream) {
            this.localMediaStream.stop();
        }
    },
    getVideoEl:function () {
        return this.down('#videoStream').getEl().dom;
    },
    getCanvasEl:function() {
        return this.down('#canvasCmp').getEl().dom;
    },
    getUserMedia:function(opts, success, failure) {
        var me = this;
        var userMediaFunc = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
        userMediaFunc.call(navigator, opts, function(stream){
            success.call(me, stream);
        }, function() {
            failure.call(me);
        });
    },
//    getUserMedia:,
    onObtainVideoStream:function (stream) {
        var urlFactory = window.URL || window.webkitURL;
        var videoStream = this.getVideoEl();
        videoStream.src = urlFactory.createObjectURL(stream);
        this.localMediaStream = stream;
    },
    onUnableToObtainVideoStream:function (stream) {
        console.log("ACK!!!");
    },
    onBoxReady:function () {
        this.callParent(arguments);
        this.startCamera();
    },
    onSnapshotClick:function () {
//        console.log("snapshot()");

        var video = this.getVideoEl();
        var canvas = this.getCanvasEl();
        var ctx = canvas.getContext('2d');

        if (this.localMediaStream) {
            ctx.drawImage(video, 0, 0);
            // "image/webp" works in Chrome 18. In other browsers, this will fall back to image/png.
            var dataUrl = canvas.toDataURL('image/webp');
            this.fireEvent('snapshot', this, dataUrl);
        }
    }
});