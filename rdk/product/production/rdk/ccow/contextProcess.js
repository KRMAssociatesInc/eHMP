'use strict';

var java = require('java');
var bunyan = require('bunyan');

java.classpath.push('./jars/WebJContextor.jar');
java.classpath.push('./jars/CCOWContextWrapper.jar');
java.classpath.push('./jars/commons-lang3-3.3.2.jar');

var config = require('./config.js');
var logger = bunyan.createLogger(config.logger);

function setContext(paramBlob, mContextManagerUrl, participantUrl) {
    var initializeContext = java.newInstanceSync('com.sentillion.sdkweb.webcontextor.WebContextor');
    var blob = java.newArray('java.lang.String', [null]);
    blob[0] = java.callMethodSync(initializeContext, 'getLastContextBlob');
    var contextItems = [];
    var _state = 0,
        dfn = '',
        icn = '',
        participantCoupon = '',
        contextCoupon = '',
        jsonData = {};

    if (blob[0] === '' && paramBlob !== '') {
        blob[0] = paramBlob;
    }

    if (mContextManagerUrl === undefined) {
        jsonData.statusCode = 500;
        jsonData.message = 'Cannot retrieve context manager url.';
    } else {
        var paramContextManagerUrl = java.newInstanceSync('java.lang.String', mContextManagerUrl);
        var paramParticipantUrl = java.newInstanceSync('java.lang.String', participantUrl);

        if (blob[0] !== null) {
            //check state
            try {
                _state = java.callMethodSync(initializeContext, 'getState', blob);
                logger.info('State', _state, typeof _state);
            } catch (e) {
                //Nothing to do
            }
        }

        if (_state < 2) {
            try {
                java.callMethodSync(initializeContext, 'run', blob, paramContextManagerUrl, paramParticipantUrl, config.appName, config.appPasscode, true);
            } catch (e) {
                //There seems to be orphan context which cannot be killed.
                // So better start new one by appending '#' in app name
                java.callMethodSync(initializeContext, 'run', blob, paramContextManagerUrl, paramParticipantUrl, config.appName + '#', config.appPasscode, true);
            }

            blob[0] = java.callMethodSync(initializeContext, 'getLastContextBlob');
        }

        participantCoupon = java.callMethodSync(initializeContext, 'getParticipantCoupon', blob);
        contextCoupon = java.callMethodSync(initializeContext, 'getContextCoupon', blob);
        var contextItemCollection = java.callMethodSync(initializeContext, 'getCurrentContext', blob);
        var counter = contextItemCollection.countSync();
        var contextItemName, contextItemValue;

        for (var i = 1; i <= counter; i++) {
            contextItemName = contextItemCollection.itemSync(i).getNameSync();
            contextItemValue = contextItemCollection.itemSync(i).getValueSync();
            contextItems.push({
                name: contextItemName,
                value: contextItemValue
            });
            icn = contextItemName.indexOf('nationalidnumber') > -1 ? contextItemValue : icn;
            dfn = contextItemName.indexOf('dfn') > -1 ? contextItemValue : dfn;
            logger.debug(contextItemName + ':' + contextItemValue);
        }

        logger.debug('icn:' + icn);
        logger.debug('dfn:' + dfn);

        jsonData = {
            pid: dfn,
            participantCoupon: participantCoupon,
            contextCoupon: contextCoupon,
            blob: blob[0],
            contextItems: contextItems,
            contextManagerUrl: mContextManagerUrl
        };

    }


    return jsonData;
}

module.exports.setContext = setContext;
