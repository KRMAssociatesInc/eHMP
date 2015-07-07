// hook up global error handlers
Ext.onReady(function () {
    // global exception handler: translates into a visual error
    Ext.Error.handle = function (err) {
        //Ext.util.Cookies.set('SUPPRESS_ERRORS', '1', new Date(2020,1,1));
        var SUPPRESS_ERRORS = Ext.util.Cookies.get('SUPPRESS_ERRORS');
        if (SUPPRESS_ERRORS && false) return;
        gov.va.hmp.ErrorHandler.error('<strong>Oops!</strong> The system has encountered a problem. <a href="">Please Reload</a>', 0, err);

        // register the error in the appbar (so the diagnostic window can find it)
        console.log('ext error', err);
        gov.va.hmp.ErrorHandler.errors.push({type: 'EXT', msg: err.msg, loc: err.sourceClass + "." + err.sourceMethod});
        //return true;
    }

    // global AJAX request error handler: translates into visual error
    Ext.Ajax.on('requestexception', function (conn, response, opts) {
        var msg, method = response.request.options.method, url = response.request.options.url;
        var errorHandledByView = opts.skipErrors || ( opts.operation && opts.operation.skipErrors) || (opts.scope && opts.scope.skipErrors);
        var summary = gov.va.hmp.ErrorHandler.handle(response);
        if (summary.type !== 'none') {
            if (!errorHandledByView) {
                var alertDetail = {
                	"Request ID": summary.id,
                	"User ID": summary.user,
                	"PID": summary.pid,
                    status: summary.statusLine,
                    url: summary.url
                };
                if (summary.detail.error) {
                    alertDetail.error = summary.detail.error;
                }
                if (summary.detail.className) {
                    alertDetail.method = summary.detail.className + (summary.detail.methodName ? '.' + summary.detail.methodName + '&#40;&#41;' : '');
                }
                if (summary.detail.file) {
                    alertDetail.file = summary.detail.file + (summary.detail.line ? ':' + summary.detail.line : '');
                }
                if (summary.detail.stackTrace) {
                    alertDetail.stackTrace = summary.detail.stackTrace;
                }
//                if (summary.detail.rawStackTrace) {
//                    alertDetail.rawStackTrace = summary.detail.rawStackTrace;
//                }

                gov.va.hmp.ErrorHandler.alert({
                    type: summary.type,
                    msg: '<p>' + summary.msg + '</p><p>' + summary.description + '</p>',
                    detail: alertDetail
                });
            }

            // register the error in the appbar (so the diagnostic window can find it)
            gov.va.hmp.ErrorHandler.errors.push({type: 'XHR', msg: summary.statusLine, loc: summary.url, details: summary.detail});
        }
    });

    // Low level javascript error: attempt to translate into visual error
    window.onerror = function (msg, url, line) {
        // register the error in the appbar (so the diagnostic window can find it)
        gov.va.hmp.ErrorHandler.errors.push({type: 'JS', msg: msg, loc: url + ' (line: ' + line + ')'});
    }
});

/**
 * TODO: The warning/error window should have a stack of messages/timeouts.  So that one message/error does not clobber others.
 */
Ext.define('gov.va.hmp.ErrorHandler', {
    singleton: true,
    requires: [
        'gov.va.hmp.appbar.ErrorWindow',
        'gov.va.hmp.ux.Alert',
        'gov.va.hmp.jira.TroubleTicket'
    ],
    /**
     * The list of errors
     * @private
     */
    errors: [],
    constructor: function (cfg) {
        var me = this;

        me.initConfig(cfg);

        // task for hiding warning window if needed
        this.hideAlertTask = new Ext.util.DelayedTask(function () {
            if (Ext.isDefined(me.msgwin)) {
                me.msgwin.hide();
            }
        });
    },

    /**
     * Common place to interpret/handle all HTTP errors and returns the correct msg, details, url, etc.
     */
    handle: function (response) {
        var request = response.request,
            url = request.options.url,
            summary = {
                type: 'none',
                msg: null,
                description: null,
                url: request.options.method + '&nbsp;' + url,
                statusLine: response.status + '&nbsp;(' + response.statusText + ')',
                detail: {}
            };

        if (response.status === 0 && url === '/broadcast/listen') {
            // broadcast listen request error triggers 'disconnected mode' - see BroadcastEventListener
        } else if (response.status === 401) {
            // attempting a login or change verify code, not an error
            if (url && (url.indexOf('j_spring_security_check') != -1 || url.indexOf('login') != -1
                || url.indexOf('/auth/update/verifycode') != -1)) {
                return summary;
            }

            // unauthenticated.  Usually means the session timed out (redirect to login)
            summary.msg = 'Your session has expired! Please sign in again.';
            gov.va.hmp.ErrorHandler.alert({
                type: 'info',
                title: 'Your session has expired!', // not really an Oops
                msg: 'Please sign in again.'
            });
            window.location.href = '/auth/login?msg=TIMEOUT';
        } else if (response.status === 430) {
            // SSO timeout
            summary.msg = 'Single sign-on time limit expired. Please log in.';
            gov.va.hmp.ErrorHandler.alert({
                type: 'info',
                title: 'Single sign-on expired!', // not really an Oops
                msg: 'Please log in.'
            });
            window.location.href = '/auth/login?msg=SSO_TIMEOUT';
        } else if (response.status === -1 || response.aborted === true) {
            // request aborted (usually means EXT canceled the request)
            // often caused by user clicking fast on different rows
            // so its not really an exception, so log it, but don't raise any error messages
            summary.msg = 'Server/HTTP Request Aborted.'
        } else if (response.status === 0 && response.timedout === true) {
            // connection timeout
            summary.type = 'warning';
            summary.msg = 'It is taking longer than expected to load a resource from the HMP server.';
            summary.description = 'Usually, a flaky or unstable network connection may be temporarily preventing all of HMP\'s features from loading completely. Please check that your network connection is otherwise behaving normally and try again. If this problem persists, please report it.';
        } else if (response.status === 500 || response.status === 404 || response.status === 400) {
            // server error
            summary.type = 'error';
            summary.msg = 'The system has encountered a problem loading a resource from the HMP server.';
            summary.description = 'This is an unexpected error and reflects a bug in the system. Please report it including the details below.';

            // if it was a JSON error response, try to parse it
            var errorMsg = Ext.JSON.decode(response.responseText, true);
            if (errorMsg !== null && errorMsg.success === false && errorMsg.error) {
            	summary.id = errorMsg.id;
            	summary.user = errorMsg.error.user;
            	summary.pid = errorMsg.error.pid;
                summary.detail.error = errorMsg.error.message;

                var firstError = errorMsg.error.errors[0];
                var stackTrace = firstError.stackTrace;
//                summary.detail.rawStackTrace = firstError.stackTrace;
                if (Ext.isString(stackTrace)) {
                    stackTrace = stackTrace.replace(/ /g, '&nbsp;');
                    stackTrace = stackTrace.replace(/\t/g, '&nbsp;&nbsp;');
                    stackTrace = stackTrace.replace(/\n/g, '<br/>');
                }
                summary.detail.stackTrace = stackTrace;
                if (Ext.isDefined(firstError.causedByFileName)) {
                    summary.detail.file = firstError.causedByFileName;
                }
                if (Ext.isDefined(firstError.causedByLineNumber)) {
                    summary.detail.line = firstError.causedByLineNumber;
                }
                if (Ext.isDefined(firstError.causedByClassName)) {
                    summary.detail.className = firstError.causedByClassName;
                }
                if (Ext.isDefined(firstError.causedByMethodName)) {
                    summary.detail.methodName = firstError.causedByMethodName;
                }
            }
        } else {
            // TODO:What else needs trapping?
            console.log('UNHANDLED HTTP STATUS: ', response.status, response);
        }

        return summary;
    },
    warn: function (str, delay, details) {
        this.alert({
            msg: str,
            delay: delay,
            detail: details
        });
    },
    error: function (str, delay, details) {
        this.alert({
            type: 'error',
            msg: str,
            delay: delay,
            detail: details
        });
    },
    /**
     *
     * @param {Object} config The following config options are supported:
     * @param {String} config.type
     * @param {String} config.title
     * @param {String} config.msg
     * @param {Object} config.detail
     * @param {Boolean} config.closable
     * @param {Boolean} config.block
     * True to display a block alert for longer messages (defaults to false)
     *
     * @param config.hideAfterDelay
     */
    alert: function (cfg) {
        var me = this;
        if (me.msgwin && me.msgwin.rendered) return;

        cfg = Ext.applyIf(cfg, {
            type: 'warning',
            title: 'Oops!',
            msg: 'The system has encountered a problem.',
            detail: null,
            closable: true,
            block: true,
            hideAfterDelay: 0
        });

        me.msgwin = gov.va.hmp.ux.Alert.show({
            ui: cfg.type,
            title: cfg.title,
            msg: cfg.msg,
            detail: cfg.detail,
            detailTpl: new Ext.XTemplate(
                    '<dl id="{id}-detailEl" class="dl-horizontal" style="display: none" contenteditable="true">' +
                        '<tpl if="Ext.isString(detail)">' +
                            '<dt></dt><dd>{detail}</dd>' +
                        '<tpl else>' +
                            '<tpl foreach="detail">' +
                                '<dt>{$}</dt>' +
                                '<dd style="overflow:auto; max-height: 300px">{.}</dd>' +
                            '</tpl>' +
                        '</tpl>' +
                        '<dt></dt>' +
                        '<dd><button id="{id}-diagnosticsEl" class="btn btn-link btn-small" style="padding: 0;margin: 0">Diagnostics</button></dd>' +
                        //'<dd><button id="{id}-submitJiraEl" class="btn btn-link btn-small" style="padding: 0;margin: 0">Submit Jira Ticket</button></dd>' +
                    '</dl>'
            ),
            block: cfg.block,
            closable: cfg.closable,
            floating: true,
            maxWidth: 616,
            maxHeight: 800,
            listeners: {
                afterrender:function(cmp) {
                    var diagnosticsBtnEl = Ext.get(cmp.getId() + "-diagnosticsEl");
                    cmp.mon(diagnosticsBtnEl, 'click', function() {
                        gov.va.hmp.appbar.ErrorWindow.show();
                    });
//                    var jiraBtnEl = Ext.get(cmp.getId() + "-submitJiraEl");
//                    cmp.mon(jiraBtnEl, 'click', function() {
//                        gov.va.hmp.jira.TroubleTicket.showTicket(me.msgwin.detail.rawStackTrace);
//                    });
                },
                close: function () {
                    me.msgwin = null;
                }
            }
        });

        var appbar = Ext.getCmp('AppBar');
        if (Ext.isDefined(appbar)) {
            me.msgwin.show(appbar.getEl());
            me.msgwin.alignTo(appbar, 't-b', [0, -5]);
        } else {
            me.msgwin.show();
        }

        if (cfg.hideAfterDelay == 0) {
            me.hideAlertTask.cancel();
        } else {
            me.hideAlertTask.delay(cfg.hideAfterDelay);
        }
    }
});
