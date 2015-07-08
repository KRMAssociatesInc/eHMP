/*jslint node: true */
'use strict';

var express = require('express');
var app = express();
var java = require('java');
var bodyParser = require('body-parser');
var bunyan = require('bunyan');
app.config = require('./config.js');
var contextProcess = require('./contextProcess.js');

java.classpath.push('./jars/WebJContextor.jar');
java.classpath.push('./jars/CCOWContextWrapper.jar');
java.classpath.push('./jars/commons-lang3-3.3.2.jar');
java.classpath.push('./jars/RPCWrapper.jar');

var logger = bunyan.createLogger(app.config.logger);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

app.post('/ccow/ssoprocess', function(req, res){
    var jsonData = contextProcess.setContext(req.param('blob'), req.param('mContextManagerUrl'),  req.param('participantUrl'));
    var token = '';

    for (var i = 0; i < jsonData.contextItems.length; i++) {
        if (jsonData.contextItems[i].name.indexOf('vistatoken') > -1) {
             token = '~~TOK~~' + jsonData.contextItems[i].value;
             break;
         }
    }

    logger.debug('TOKEN', token);
    res.json({token:token, ccowObject: jsonData});

});

app.post('/ccow/stopContext', function(req, res) {
    try {
        var initializeContext = java.newInstanceSync('com.sentillion.sdkweb.webcontextor.WebContextor');
        var blob = java.newArray('java.lang.String', [req.body.blob]);
        java.callMethodSync(initializeContext, 'stop', blob);
        res.status(200).json({'message': 'success'});
    } catch (e) {
        logger.debug(e);
        res.status(500).send(e.message);
    }
});

app.post('/ccow/setContext', function(req, res) {
    var jsonData = contextProcess.setContext(req.param('blob'), req.param('mContextManagerUrl'), req.param('participantUrl'));
    res.status(200).json(jsonData);
});

app.post('/ccow/getNewContext', function(req, res) {
    var initializeContext = java.newInstanceSync('com.sentillion.sdkweb.webcontextor.WebContextor');
    var blob = java.newArray('java.lang.String', [req.body.blob]);
    var lastBlob = blob;
    var contextItems = [];
    var dfn = '', icn = '';

    try {
        var contextItemCollection = java.callMethodSync(initializeContext, 'getCurrentContext', blob);
        lastBlob = java.callMethodSync(initializeContext, 'getLastContextBlob');
        var counter = contextItemCollection.countSync();
        var contextItemName, contextItemValue;

        for (var i = 1; i <= counter; i++) {
            contextItemName = contextItemCollection.itemSync(i).getNameSync();
            contextItemValue = contextItemCollection.itemSync(i).getValueSync();
            contextItems.push({ name: contextItemName, value: contextItemValue });
            icn = contextItemName.indexOf('nationalidnumber') > -1 ?  contextItemValue : icn;
            dfn = contextItemName.indexOf('dfn') > -1 ?  contextItemValue : dfn;
        }
    } catch(e) {
        console.log(e);
        contextItems.push({
            name: 'Currently, Application is not part of the Vault.',
            value: ''
        });
    }

    var jsonData = {
        pid: dfn,
        blob: lastBlob,
        contextItems: contextItems
    };

    console.log(jsonData);
    res.status(200).json(jsonData);
});

app.post('/ccow/addNewPatient', function(req, res) {
    var initializeContext = java.newInstanceSync('com.sentillion.sdkweb.webcontextor.WebContextor');
    var blob = java.newArray('java.lang.String', [req.body.blob]);
    var newBlob = blob;
    var dfn = req.param('dfn', '');
    var name = req.param('name', '');
    var appUrls = null;
    var vistaSite = req.param('vistaSite');
    var testTag =  vistaSite.production ? '' : '_TEST';
    var contextItemCollection = java.newInstanceSync('com.sentillion.sdkweb.webcontextor.ContextItemCollection');
    var contextItem1 = java.newInstanceSync('com.sentillion.sdkweb.webcontextor.ContextItem');
    var contextItem2 = java.newInstanceSync('com.sentillion.sdkweb.webcontextor.ContextItem');
    contextItem1.setNameSync('patient.id.mrn.dfn_' + vistaSite.division + testTag);
    contextItem1.setValueSync(dfn);
    contextItemCollection.addSync(contextItem1);
    contextItem2.setNameSync('Patient.co.PatientName');
    contextItem2.setValueSync(name);
    contextItemCollection.addSync(contextItem2);
    var contextCoupon2 = java.callMethodSync(initializeContext, 'getContextCoupon', blob);

    try {
        java.callMethodSync(initializeContext, 'startContextChange', blob);
        var lastBlob = java.callMethodSync(initializeContext, 'getLastContextBlob');
        newBlob = java.newArray('java.lang.String', [lastBlob]);
        var contextHandler = java.newInstanceSync('ContextHandler');
        var resp = java.callMethodSync(contextHandler, 'endContextChange', newBlob, contextItemCollection);
        lastBlob = java.callMethodSync(initializeContext, 'getLastContextBlob');
        newBlob = java.newArray('java.lang.String', [lastBlob]);

        if (resp.length === 0) {
            var contextCoupon = java.newArray('java.lang.String', [null]);
            appUrls = java.callMethodSync(initializeContext, 'commitContextChange', newBlob, contextCoupon);
            lastBlob = java.callMethodSync(initializeContext, 'getLastContextBlob');
            newBlob = java.newArray('java.lang.String', [lastBlob]);
            contextCoupon2 = java.callMethodSync(initializeContext, 'getContextCoupon', newBlob);
            res.status(200).json({msg: 'Context Changed', blob: lastBlob });
        } else {
            res.status(200).json({msg: resp, contextCoupon: contextCoupon2, blob: lastBlob});
        }
    } catch(e) {
    }
});

app.post('/ccow/commitContextChange', function(req, res) {
    try {
        var initializeContext = java.newInstanceSync('com.sentillion.sdkweb.webcontextor.WebContextor');
        var blob = java.newArray('java.lang.String', [req.body.blob]);
        var contextCouponArray = java.newArray('java.lang.String', [null]);
        java.callMethodSync(initializeContext, 'commitContextChange', blob, contextCouponArray);
        var lastBlob = java.callMethodSync(initializeContext, 'getLastContextBlob');
        res.status(200).json({msg: 'accepted', blob: lastBlob});
    } catch (e) {
        logger.debug(e);
        res.status(500).send(e.message);
    }
});

app.post('/ccow/cancelContextChange', function(req, res) {
    try {
        var initializeContext = java.newInstanceSync('com.sentillion.sdkweb.webcontextor.WebContextor');
        var blob = java.newArray('java.lang.String', [req.body.blob]);
        java.callMethodSync(initializeContext, 'cancelContextChange', blob);
        var lastBlob = java.callMethodSync(initializeContext, 'getLastContextBlob');
        res.status(200).json({ msg: 'Context Change has been cancelled!!', blob: lastBlob} );
    } catch (e) {
        logger.debug(e);
        res.status(500).send(e.message);
    }
});

app.post('/ccow/breakContext', function(req, res) {
    try {
        var initializeContext = java.newInstanceSync('com.sentillion.sdkweb.webcontextor.WebContextor');
        var blob = java.newArray('java.lang.String', [req.body.blob]);
        java.callMethodSync(initializeContext, 'cancelContextChange', blob);
        java.callMethodSync(initializeContext, 'suspend', blob);
        var lastBlob = java.callMethodSync(initializeContext, 'getLastContextBlob');
        res.status(200).json({message: 'Suspended', blob: lastBlob});
    } catch (e) {
        logger.debug(e);
        res.status(500).send(e.message);
    }
});

app.post('/ccow/suspend', function(req, res) {
    try {
        var initializeContext = java.newInstanceSync('com.sentillion.sdkweb.webcontextor.WebContextor');
        var blob = java.newArray('java.lang.String', [req.body.blob]);
        java.callMethodSync(initializeContext, 'suspend', blob);
        var lastBlob = java.callMethodSync(initializeContext, 'getLastContextBlob');
        res.status(200).json({message: 'Suspended', blob: lastBlob});
    } catch (e) {
        logger.debug(e);
        res.status(500).send(e.message);
    }
});

app.post('/ccow/resume', function(req, res) {
    try {
        var initializeContext = java.newInstanceSync('com.sentillion.sdkweb.webcontextor.WebContextor');
        var blob = java.newArray('java.lang.String', [req.body.blob]);
        java.callMethodSync(initializeContext, 'resume', blob);
        var lastBlob = java.callMethodSync(initializeContext, 'getLastContextBlob');
        res.status(200).json({message: 'Resume', blob: lastBlob});
    } catch (e) {
        logger.debug(e);
        res.status(500).send(e.message);
    }
});



var server = app.listen(app.config.port, function() {
    logger.info('Listening on port %d', server.address().port);
});
