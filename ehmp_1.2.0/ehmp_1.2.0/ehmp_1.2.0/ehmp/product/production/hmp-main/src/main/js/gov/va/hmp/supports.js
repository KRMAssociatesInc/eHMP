/**
 * @class gov.va.hmp.supports
 *
 * Determines information about features supported in the current environment that aren't handled by {@link Ext.supports}
 *
 * @singleton
 */
(function () {
    Ext.namespace('gov.va.hmp');
    gov.va.hmp.supports = {
        /**
         * @property GetUserMedia True if document environment supports the <a href="http://dev.w3.org/2011/webrtc/editor/getusermedia.html">Media Capture and Streams API</a>.
         * @type {Boolean}
         */
        GetUserMedia: !!(navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia)
//        DragAndDrop: false
    }
}());
