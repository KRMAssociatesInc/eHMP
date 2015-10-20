/**
 * Created by alexluong on 3/9/15.
 */

'use strict';

module.exports.swagger = require('swagger-node-express');

module.exports.commonParams = {
    pid: {
        paramType: 'query',
        name: 'pid',
        description: 'patient id',
        type: 'string',
        required: true,
        enum: undefined,
        defaultValue: undefined
    },
    uid: function(uidType, required) {
        return {
            paramType: 'query',
            name: 'uid',
            description: uidType + ' uid',
            type: 'string',
            required: required,
            enum: undefined,
            defaultValue: undefined
        };
    },
    id: function(paramType, idType, required) {
        return {
            paramType: paramType,
            name: 'id',
            description: idType + ' id',
            type: 'string',
            required: required,
            enum: undefined,
            defaultValue: undefined
        };
    },
    site: function(paramType, required) {
        return {
            paramType: paramType,
            name: 'site.code',
            description: 'site code',
            type: 'string',
            required: required,
            enum: undefined,
            defaultValue: undefined
        };
    },
    fhir: {
        pid: {
            paramType: 'path',
            name: 'id',
            description: 'Patient id',
            type: 'string',
            required: true,
            enum: undefined,
            defaultValue: undefined
        },
        _count: {
            paramType: 'query',
            name: 'limit',
            description: 'Number of results to show',
            type: 'integer',
            required: false,
            enum: undefined,
            defaultValue: undefined
        },
        // TODO: SI is deprecated. In DSTU2 the patient id is provided in the url path
        si: {
            paramType: 'query',
            name: 'subject.identifier',
            description: 'patient id',
            type: 'string',
            required: true,
            enum: undefined,
            defaultValue: undefined
        }
    },
    jds: {
        start: {
            paramType: 'query',
            name: 'start',
            description: 'start showing results from this 0-based index',
            type: 'integer',
            required: false,
            enum: undefined,
            defaultValue: undefined
        },
        limit: {
            paramType: 'query',
            name: 'limit',
            description: 'number of results to show',
            type: 'integer',
            required: false,
            enum: undefined,
            defaultValue: undefined
        },
        filter: {
            paramType: 'query',
            name: 'filter',
            description: 'a JDS filter',
            type: 'string',
            required: false,
            enum: undefined,
            defaultValue: undefined
                //pattern: 'eq("[^"]*","[^"]*")'  // todo: provide correct pattern
        },
        order: {
            paramType: 'query',
            name: 'order',
            description: 'field to sort by and order',
            type: 'string',
            required: false,
            enum: undefined,
            defaultValue: undefined,
            pattern: '[A-Za-z]+ (asc|desc)'
        }
    },
    fields: {
        paramType: 'query',
        name: 'fields',
        description: 'fields to return',
        type: 'string',
        required: false,
        enum: undefined,
        defaultValue: undefined
    }
};
