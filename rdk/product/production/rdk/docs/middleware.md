::: page-description
Middleware
==========
:::

## Overview
The RDK provides middleware mechanisms for resources in 2 forms:
 1. **Interceptors**: middleware which runs before a request request handler
 2. **Outerceptors**: middleware which runs after a request handler and before sending the response

There can be multiple interceptors and outerceptors for a resource. Middleware is processed in the order that it is added to the resource.

Middleware is added to a resource by inserting its name (a string) into the resource configuration's `interceptors` or `outerceptors` arrays.

## Interceptors
Interceptors are basic express.js middleware:
```JavaScript
function myInterceptor(req, res, next) {
    /* handle req */
    /* return res.send() if there is an error */
    /* return next() on success */
}
```
An interceptor may:
 * Perform tasks related to the request, like pre-processing data on the req object
 * Short-circuit the request handling by calling `res.send()`. You may want to do this if there is an irrecoverable error while processing the request, for example.
 * Call the `next()` callback upon completion of processing, which runs the next handler in line for the request.

The standard place for an interceptor to store information for the request handler to use is on `req.interceptorResults.(name)`.

### Available Interceptors
 * **audit** interceptor
    * Provides the `req.audit` object onto which resource handlers should place information useful for auditing resource calls. The following audit fields are standard, and you should include them in your resources if applicable:
        * `req.audit.patientId`: store the identifier of a patient whose records are being accessed
        * `req.audit.dataDomain`: store the domain of the data being accessed for a patient
        * `req.audit.logCategory`: The category of action being performed. Common values:
           * 'RETRIEVE' - for when fetching primary data
           * 'SUPPORT' - for when fetching data indirectly
           * 'SEARCH' - for when searching (for patients or within a patient record)
           * 'SYNC' - for when syncing patient data
           * 'AUTH' - for when authenticating to a service
        * `req.audit.sensitive`: for when accessing a sensitive patient
 * **metrics** interceptor
    * Automatically logs information about request metrics
 * **authentication** interceptor
    * Requires that a user must be logged in before accessing a resource
 * **pep** interceptor (Policy Enforcement Point interceptor)
    * Checks for the Policy Decision Point (PDP) for authorization to use a resource
 * **operationalDataCheck** interceptor
    * Verifies that the operational data (the minimum amount of data required for JDS to operate as expected) has been loaded into JDS
 * **synchronize** interceptor
    * On requests with a `pid` query parameter, synchronizes that patient
        * `pid` can be an [ICN] identifier or a [site hash;dfn] identifier.
 * **jdsFilter** interceptor
    * Applies business logic to JDS filters on the filter query parameter.
    * Adds the `req.interceptorResults.jdsFilter` object:
        * `req.interceptorResults.jdsFilter.error` exists with an error if there was an error parsing
        * `req.interceptorResults.jdsFilter.filter` exists with the parsed filter parameters (parsed by `jdsFilter.parse()`) which can be used by `jdsFilter.build()` to construct a JDS filter query string
 * **validateAgainstApiDocs** interceptor
     * Validates requests against their swagger apiDocs
     * Invalid requests return status 400 Bad Request with details specifying the invalid input
 * **convertPid** interceptor
     * Requires 'pid' parameter as icn | dfn | siteDfn
     * Must place after 'synchronize' interceptor
     * Adds the `req.interceptorResults.patientIdentifiers` object with corresponding patient identifiers:
        * `req.interceptorResults.patientIdentifiers.icn`
        * If primary site:
            * `req.interceptorResults.patientIdentifiers.siteDfn`
            * `req.interceptorResults.patientIdentifiers.dfn`
        * If secondary site:
            * `req.interceptorResults.patientIdentifiers.siteEdipi`
            * `req.interceptorResults.patientIdentifiers.edipi`

### Default Interceptors
The following interceptors are enabled for each resource by default:
 * audit
 * metrics
 * authentication
 * pep
 * operationalDataCheck

### Creating an Interceptor
 * Ensure that what you want does not already exist
 * Create a file `/product/production/rdk/interceptors/(name).js`
 * Implement the interceptor behavior
 * Export the middleware function with the signature described above
 * Write unit tests for the interceptor
 * Edit the `registerInterceptors` function in `app-factory.js` to include your interceptor in the `interceptors` object:
    * `(name): require('../interceptors/(name)'),`

There is currently not a way to add default interceptors. Contact Team Mercury if you think an interceptor should be run on every request.

## Outerceptors
Outerceptors are run once a resource calls `res.send()` or an equivalent.

An outerceptor may transform the body of the response sent to the client or send an error response.


The current default outerceptors which run on every request are:
 * **linkifyUids**: looks through the response for uids which can be directly accessed through the uid resource and adds sibling `uidHref` fields to the response JSON.
 * **transformJdsApiVersion**: changes the "apiVersion" field of JDS responses to be "jdsApiVersion", to avoid confusion of RDK consumers about what version the RDK is.
 * **facilityDisplay**: adds the facilityDisplay and facilityMoniker fields as siblings of `facilityCode` fields

The **emulateJdsResponse** outerceptor can be used to add JDS-style pagination information to a response

### Creating an Outerceptor
 * Ensure that what you want does not already exist
 * Ensure that what you want should be an outerceptor instead of a transform on a subsystem
 * Create a file `/product/production/rdk/outerceptors/(name).js`
 * Export the middleware function with the signature described below
 * Write unit tests for the outerceptor
 * Edit the `registerOuterceptors` function in `app-factory.js` to include your outerceptor in the `outerceptors` object:
    * `(name): require('../outerceptors/(name)'),`

A basic outerceptor which adds an "intercepted" field to the response body JSON:
```JavaScript
function example(req, res, body, callback) {
    body = JSON.parse(body);
    body.intercepted = true;
    body = JSON.stringify(body);
    var error = null;
    callback(error, req, res, body);
}
```

The `callback` function must be given 4 arguments:
 * **error**: an error if there was an error, or null
 * **req**: the req object which was given to the outerceptor
 * **res**: the res object which was given to the outerceptor
 * **body**: the response body as a string which may have been modified by the outerceptor

Please note that `body` should always be a string, but write safe code which can handle `body` as an Object.

Don't call `res.send()` or a similar method in an outerceptor. Instead rely on the `callback` function.

To make your outerceptor a default outerceptor, add your outerceptor name to the `defaultOuterceptors` array in the `registerDefaultOuterceptors` function in `app-factory.js` and contact Team Mercury about the change.

<br />
---
Next: [Logging](logging.md)
