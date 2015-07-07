Ext.define('gov.va.hmp.util.JSTimer', {
    statics: {
        getTimeStamp: function () {
            if (window.performance.now) {
//                console.log("Using high performance timer");
                return window.performance.now();
            } else {
                if (window.performance.webkitNow) {
//                    console.log("Using webkit high performance timer");
                    return window.performance.webkitNow();
                } else {
//                    console.log("Using low performance timer");
                    return new Date().getTime();
                }
            }
        }
    }
});