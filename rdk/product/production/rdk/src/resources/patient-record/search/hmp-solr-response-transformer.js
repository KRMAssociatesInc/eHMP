'use strict';

var rdk = require('../../../core/rdk');
var nullchecker = rdk.utils.nullchecker;
var _ = require('underscore');
var _s = require('underscore.string');
module.exports.addSpecializedResultsToResponse = addSpecializedResultsToResponse;
module.exports._addDetailInfo = addDetailInfo;
module.exports._updateCumulativeResponseData = updateCumulativeResponseData;
module.exports._transformSolrHighlightingToHmpObject = transformSolrHighlightingToHmpObject;
module.exports._transformSolrItemsToHmpFormat = transformSolrItemsToHmpFormat;
module.exports._buildResponseObjectSkeleton = buildResponseObjectSkeleton;
module.exports._getSearchedDomainFromSolrResponse = getSearchedDomainFromSolrResponse;
module.exports._isGroupingEnabled = isGroupingEnabled;

function addSpecializedResultsToResponse(specializedSolrResults, reqQuery, facetMap) {
    var hmpEmulatedResponseObject = buildResponseObjectSkeleton(reqQuery);

    _.each(specializedSolrResults, function (specializedSolrResult) {
        // TODO check safety of deep document
//        transformSolrItemsToHmpFormat(specializedSolrResult, hmpEmulatedResponseObject);
        hmpEmulatedResponseObject = transformSolrItemsToHmpFormat(specializedSolrResult, hmpEmulatedResponseObject);
        hmpEmulatedResponseObject = updateCumulativeResponseData(specializedSolrResult, facetMap, hmpEmulatedResponseObject);
        hmpEmulatedResponseObject = addDetailInfo(specializedSolrResult, hmpEmulatedResponseObject);
    });
    return hmpEmulatedResponseObject;
}


/**
 * Add the information that the client uses to dig down into search results
 * @param specializedSolrResult
 * @param hmpEmulatedResponseObject
 * @returns {*}
 */
function addDetailInfo(specializedSolrResult, hmpEmulatedResponseObject) {
    // TODO: implement
    return hmpEmulatedResponseObject;
}


function updateCumulativeResponseData(specializedSolrResult, facetMap, hmpEmulatedResponseObject) {
    var facetQueries = ((specializedSolrResult || {}).facet_counts || {}).facet_queries || {};
    var facetFields = ((specializedSolrResult || {}).facet_counts || {}).facet_fields || {};

    var humanizedFacetResults = hmpEmulatedResponseObject.data.facets;
    _.each(facetMap, function (humanizedFacetKey, solrFacetKey) {
        var facetValue = facetQueries[solrFacetKey];
        if (!humanizedFacetResults.hasOwnProperty(humanizedFacetKey)) {
            humanizedFacetResults[humanizedFacetKey] = 0;
        }
        if (humanizedFacetKey === 'all' && facetFields.domain && facetFields.domain.length > 0) {
            var domainSpecificKey = 'domain:' + facetFields.domain[0];
            humanizedFacetResults[domainSpecificKey] = facetValue;
            // do not accumulate foundItemsTotal and unfilteredtotal here because the 'all' facet is not guaranteed to be accurate
        }
        humanizedFacetResults[humanizedFacetKey] += facetValue;
    });
    if (isGroupingEnabled(specializedSolrResult)) {
        _.each(specializedSolrResult.grouped, function (group_field) {
            var itemsFound = group_field.matches || 0;
            hmpEmulatedResponseObject.data.foundItemsTotal += itemsFound;
            hmpEmulatedResponseObject.data.unfilteredTotal += itemsFound;  // these are the same in HMP
        });
    } else {
        var itemsFound = specializedSolrResult.response.numFound;
        hmpEmulatedResponseObject.data.foundItemsTotal += itemsFound;
        hmpEmulatedResponseObject.data.unfilteredTotal += itemsFound;
    }

    hmpEmulatedResponseObject.data.facets = humanizedFacetResults;
    hmpEmulatedResponseObject.data.elapsed += specializedSolrResult.responseHeader.QTime;

    return hmpEmulatedResponseObject;
}

function transformSolrItemsToHmpFormat (specializedSolrResult, hmpEmulatedResponseObject) {
    var transformSolrItemsToHmpFormatDispatch = {
        accession: transformDefaultSolrItemsToHmp,
        allergy: transformDefaultSolrItemsToHmp,
        treatment: transformDefaultSolrItemsToHmp,
        consult: transformDefaultSolrItemsToHmp,
        procedure: transformDefaultSolrItemsToHmp,
        obs: transformDefaultSolrItemsToHmp,
        image: transformDefaultSolrItemsToHmp,
        surgery: transformDefaultSolrItemsToHmp,
        mh: transformDefaultSolrItemsToHmp,
        immunization: transformDefaultSolrItemsToHmp,
        pov: transformDefaultSolrItemsToHmp,
        skin: transformDefaultSolrItemsToHmp,
        exam: transformDefaultSolrItemsToHmp,
        cpt: transformDefaultSolrItemsToHmp,
        education: transformDefaultSolrItemsToHmp,
        factor: transformDefaultSolrItemsToHmp,
        appointment: transformDefaultSolrItemsToHmp,
        visit: transformDefaultSolrItemsToHmp,
        rad: transformDefaultSolrItemsToHmp,
        ptf: transformDefaultSolrItemsToHmp,

        med: transformMedSolrItemsToHmp,
        order: transformOrderSolrItemsToHmp,
        document: transformDocumentSolrItemsToHmp,
        vital: transformVitalSolrItemsToHmp,
        result: transformLabSolrItemsToHmp,
        lab: transformLabSolrItemsToHmp,  // should not be needed, but left in for safety
        problem: transformProblemSolrItemsToHmp,

//        suggest: buildSuggestQuery,
//        tasks: buildTasksQuery,
//        generic: buildGenericQuery,
//        wholeDomain: buildWholeDomainQuery,
//        labPanel: buildLabPanelQuery,
//        labGroup: buildLabGroupQuery,
//        infobuttonSearch: buildInfobuttonQuery  // HMP uses Infobutton as one word
        default: transformDefaultSolrItemsToHmp,
        'null': transformDefaultSolrItemsToHmp
    };

    var searchedDomain = getSearchedDomainFromSolrResponse(specializedSolrResult);
    if (isGroupingEnabled(specializedSolrResult)) {
        _.each(specializedSolrResult.grouped, function (group_type) {
            _.each(group_type.groups, function (group) {
                _.each(group.doclist.docs, function (doc) {
                    var transformedItem = transformSolrItemsToHmpFormatDispatch[searchedDomain](doc, searchedDomain);
                    transformedItem.count = group.doclist.numFound;
                    // avoid push mutation by using concat
                    hmpEmulatedResponseObject.data.items = hmpEmulatedResponseObject.data.items.concat(transformedItem);
                });
            });
        });
    } else {
        _.each(specializedSolrResult.response.docs, function (doc) {
            var transformedItem = transformSolrItemsToHmpFormatDispatch[searchedDomain](doc, searchedDomain);
            hmpEmulatedResponseObject.data.items = hmpEmulatedResponseObject.data.items.concat(transformedItem);
        });
    }

    hmpEmulatedResponseObject = transformSolrHighlightingToHmpObject(specializedSolrResult, hmpEmulatedResponseObject);
    return hmpEmulatedResponseObject;
}

function transformSolrHighlightingToHmpObject(specializedSolrResult, hmpEmulatedResponseObject) {
    var highlighting = specializedSolrResult.highlighting || {};

    // use _.each() instead of for..in to allow function scope and more concise syntax
    _.each(highlighting, function (highlightedFields, highlightedUid) {
        _.each(highlightedFields, function (highlights) {
            _.each(hmpEmulatedResponseObject.data.items, function (item) {
                if (item.uid === highlightedUid) {
                    item.highlights = (item.highlights || []).concat(highlights);
                }
            });
        });
    });

    return hmpEmulatedResponseObject;
}

function isGroupingEnabled(specializedSolrResult) {
    return specializedSolrResult.hasOwnProperty('grouped');
}

/**
 * Only gets domains from solr queries that filter on one domain
 */
function getSearchedDomainFromSolrResponse(solrResult) {
    var searchedDomain = null;
    solrResult.responseHeader.params.fq.forEach(function (filterQuery) {
        var domainFq = filterQuery.match(/domain:(\w+)/);
        if (!nullchecker.isNullish(domainFq)) {
            searchedDomain = domainFq[1];
        }
    });
    return searchedDomain;
    //var error = new Error('something broke');
    //console.error( error.stack );
    //return error;
}
function transformDefaultSolrItemsToHmp(item, domain) {
    var transformedItem = item;
    transformedItem.where = transformedItem.facility_name;
    transformedItem.type = domain;
    delete transformedItem.facility_name;

    return transformedItem;
}

function transformMedSolrItemsToHmp(item, domain) {

    var transformedItem = item;
    transformedItem.where = transformedItem.facility_name;
    transformedItem.type = domain;
    delete transformedItem.facility_name;

    return transformedItem;
}


function transformOrderSolrItemsToHmp(item, domain) {

    var transformedItem = item;
    transformedItem.where = transformedItem.facility_name;
    transformedItem.type = domain;
    if (transformedItem.service === 'LR') {
        transformedItem.kind = 'Laboratory';
    } else if (transformedItem.service === 'GMRC') {
        transformedItem.kind = 'Consult Report';
    } else if (transformedItem.service === 'RA') {
        transformedItem.kind = 'Radiology Report';
    }

    transformedItem.summary += ' (' + transformedItem.status + ' Order)';

    return transformedItem;
}
function transformDocumentSolrItemsToHmp(item, domain) {
    var transformedItem = item;
    transformedItem.where = transformedItem.facility_name;
    transformedItem.type = domain;
    delete transformedItem.facility_name;

    return transformedItem;
}

function transformVitalSolrItemsToHmp(item, domain) {
    var transformedItem = item;
    transformedItem.where = transformedItem.facility_name;
    transformedItem.type = domain;
    delete transformedItem.facility_name;

    return transformedItem;
}
function transformLabSolrItemsToHmp(item, domain) {

    var transformedItem = item;
    transformedItem.where = transformedItem.facility_name;
    transformedItem.type = domain;
    delete transformedItem.facility_name;

    return transformedItem;
}
function transformProblemSolrItemsToHmp(item, domain) {

    var transformedItem = item;
    transformedItem.where = transformedItem.facility_name;
    transformedItem.type = domain;
    delete transformedItem.facility_name;

    return transformedItem;

}

function buildResponseObjectSkeleton(reqQuery) {
    var responseObject = {};

    var data = {};
    data.query = reqQuery.query;     // query and original appear to be always the same
    data.original = reqQuery.query;  // "original search", PatientSearch.java:80
    data.altQuery = '';     // never used in HMP
    data.elapsed = 0;  // QTime header from solr response
    data.foundItemsTotal = 0;  // data points; not the number of returned result summaries
    data.unfilteredTotal = 0;  // see PatientSearch.java:200, probably equal to facets.all
    data.facets = {};  // tee-minus stuff, see emulatedHmpGetRelativeDate()
    data.corrections = [];  // never used in HMP
    data.mode = 'SEARCH';  // see NOTES for more modes
    data.items = [];
    data.filters = {};

    responseObject.id = _s.lpad(Math.floor(Math.random() * 10000000000), 9, '0');  // TODO: verify that this is what HMP actually does
    responseObject.data = data;
    responseObject.params = {};
    responseObject.success = true;

    return responseObject;
}
