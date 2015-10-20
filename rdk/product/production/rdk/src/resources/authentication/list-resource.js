'use strict';

var _ = require('lodash');

var apiDocs = {
    spec: {
        summary: 'Return the list of vistas available',
        notes: 'Is a readonly resource that returns an array.',
        parameters: [],
        responseMessages: []
    }
};

function listResource(req, res) {
    var vistaSites = _.clone(req.app.config.vistaSites || {});
    var result = {};
    result.data = {};
    result.data.items = [];
    _.each(vistaSites, function(vistaSiteInfo, vistaSite) {
        result.data.items.push(_.extend(
            _.pick(vistaSiteInfo, ['name', 'division']),
            {siteCode: vistaSite}
        ));
    });
    return res.status(200).rdkSend(result);
}

module.exports.get = listResource;
module.exports.apiDocs = apiDocs;
