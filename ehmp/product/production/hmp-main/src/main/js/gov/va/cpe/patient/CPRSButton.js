Ext.define('gov.va.cpe.patient.CPRSButton', {
    extend: 'Ext.button.Button',
    requires: [
        'gov.va.hmp.UserContext'
    ],
    alias: 'widget.cprsbutton',
    ui: 'link',
    text: 'Launch CPRS',
    hidden: true,
    disabled: true,
//            href: 'cprs:\\',
//            hrefTarget: '_self',
    listeners: {
        beforerender: function () {
            var user = gov.va.hmp.UserContext;
            var cprsPath = user.getUserInfo().attributes.cprsPath;

            if (Ext.isIE && cprsPath && cprsPath.length >= 3) {
                this.show();
                this.setDisabled(false);
            } else {
                this.setDisabled(true);
                this.hide();
            }
        },
        click: function (btn) {
            var user = gov.va.hmp.UserContext;
            var cprsPath = user.getUserInfo().attributes.cprsPath;
            if (!cprsPath) return;

            var host = user.getUserInfo().host.hostname;
            var port = user.getUserInfo().host.port;
            var pathSplit = cprsPath.split("\\");
            var path;
            if (cprsPath.indexOf("\\\\") == 0) {
                path = cprsPath;
            } else {
                for (var i=0;i<pathSplit.length;i++) {
//                            if (i == 0) path="\\"+ pathSplit[i]
                    if (i == 0) path = pathSplit[i];
                    else path = path +"\\\\"+ pathSplit[i];
                }
            }
            try {
                WSH = new ActiveXObject("WScript.Shell");
                var cprsPath = String.fromCharCode(34) + path + String.fromCharCode(34)+" S="+host+" P="+port;
                WSH.run(cprsPath.toString());
            } catch (e) {

            }
        }
    }
});