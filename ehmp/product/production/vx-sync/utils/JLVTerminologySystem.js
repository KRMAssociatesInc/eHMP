'use strict';
var _ = require('underscore');

var termSystems = {
        UMLS: {oid : '2.16.840.1.113883.6.86'},
        CVX : {oid : '2.16.840.1.113883.12.292'},
        LOINC :{oid : '2.16.840.1.113883.6.1', uri: 'http://loinc.org'},
        //LABS code value is of type LOINC
        LABS : {oid : '2.16.840.1.113883.6.1'},
        //VITALS code value is of type LOINC
        VITALS : {oid : '2.16.840.1.113883.6.1'},
        RXNORM : {oid : '2.16.840.1.113883.6.88'},
        //SNOMED or SNOMEDCT?
        SNOMED : {oid : '2.16.840.1.113883.6.96', uri: 'http://snomed.info/sct'},
    };

function getTermSystemOidOrUrn(systemName)
{
    if(!systemName || !_.isString(systemName)) {return null;}

    var system = termSystems[systemName.toUpperCase()];

    if(_.isUndefined(system)) {return null;}

    if (system.uri) {
        return system.uri;
    }

    if (system.oid) {
        return ('urn:oid:' + system.oid);
    }

    return null;
}

module.exports.getTermSystemOidOrUrn = getTermSystemOidOrUrn;