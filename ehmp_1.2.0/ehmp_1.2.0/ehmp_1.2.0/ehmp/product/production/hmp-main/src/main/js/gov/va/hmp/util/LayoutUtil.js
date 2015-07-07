Ext.define('gov.va.hmp.util.LayoutUtil', {
    statics: {
        gotoAndResize: function(addendumid) {
            var domel = document.getElementById(addendumid);
            var excmp = Ext.getCmp(domel.id);
            while(!excmp) {
                domel = domel.parentNode;
                excmp = Ext.getCmp(domel.id);
            }
            if(!excmp.scrollFlags.y) {
                excmp = excmp.up('component[scrollFlags!=null]');
            }
            domel = document.getElementById(addendumid);
            if(excmp && domel) {
                excmp.body.dom.scrollTop=domel.offsetTop;
            }
            return false; // Necessary so that IE doesn't think we are changing the page, when we use this from an <a href="javascript:void(0);">
        }
    }
})