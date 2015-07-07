::: page-description
Resources
=========
:::

Resources are the bread-and-butter of building out the server-side functionality. A resource is responsible for:
 * Receiving an HTTP request
 * Performing the processing by interacting with other subsystems
 * Returning an HTTP response

Functionality of resources which may be useful to other resources should be extracted into subsystems.

## Developing a Resource

Annotated example resources which complement this guide are provided in the rdk repository at  
`/product/production/rdk/resources/_example/`  
_(Note that this directory name only has a leading underscore because it is for examples. Real resource paths should not have leading underscores.)_

### Before you create a resource
 * Ensure that it does not already exist
 * Identify the already-existing utilities and subsystems that can help you create your resource instead of reinventing the wheel
 * Understand that proper [logging](logging.md) is very important to identifying problems with the resource server and other parts of the Vistacore stack, and understand how to use proper logging.

### Create the resource file
 * Identify the correct location to place the resource
    * All resources belong in /product/production/rdk/resources/
    * Closely-related resources which use the same subsystems and which have similar scaling profiles should be placed next to each other

The convention of creating a resource file is:  
`/resources/(functionality)/(functionality)Resource.js`  
where the functionality is a camelCase identifier.  
For example, given a resource to expose a list of allergens known to the VA, the following file would be created:  
`/resources/allergens/allergensResource.js`

### Create the resource configuration
The resource server will register the configuration of the resource with the system. The resource configuration will specify information about the resource:
 * What path to mount the resource on
 * What name to identify the resource by
 * [Middleware](middleware.md) the resource needs
 * [Documentation](#Document-the-resource) of how the resource should be used
 * [Subsystems](subsystems.md) the resource depends on
 * Restrictions on permissions for accessing the resource

Resources provide configuration through an exported function called `getResourceConfig`, which may be passed in a server instance argument.
`getResourceConfig` returns an array of resource configuration objects.

A configuration object may contain the following fields:
 * `name`: the name used to identify a resource, which must be only lowercase letters and spaces. The name may be modified by the resource server, for example, to prepend a parent name.
 * `mountpoint`: an absolute path the handler may be mounted at. This is often overridden by the resource server.
 * `path`: a mountpoint relative to the parent of the resource.
 * `interceptors`: an object which enables or disables cross-cutting middleware methods to be run prior to the resource handler.
 * `outerceptors`: an array of response transformers. Not commonly included in resource configurations.
 * `get`, `put`, `post`, `delete`: for any of these (lowercase) HTTP verbs, specify the function to handle the request
 * `healthcheck`: one or multiple healthchecks or subsystem healthchecks to run when the system needs to determine if the resource is healthy.
 * `permissions`: an array of permission levels that a user must have to access the resource
    * **required**, and may be empty if all authenticated users are allowed to access a resource

::: definition
#### Resource Name and Path Criteria
Name criteria:
 * Names must contain letters and dashes only
 * Words must be fully spelled out unless an acronym or shorthand is very common
 * Words must be separated by dashes
 * Words should be ordered from most to least significant
    * This groups resources which share the most similarity together when sorting
 * Must not include the word "resource" as this is implied and obvious
 * Should avoid verbs if possible

Paths follow the same criteria as names, except:
 * Significant words or groups of words should be separated by a slash

Examples:
 * **BAD**: `POST /writeback/allergy/save`  
   **OK**: `POST /patient/record/allergies`  
   **Comment**: The HTTP verb already implies writeback and save. You are saving allergies of a patient record, so the resource should be mounted in the corresponding, already-existing directory (/patient/record/)
 * **BAD**: `POST /search/globalSearch`  
   **OK**: `POST /patient-search/global`  
   **Comment**: "search" is redundant there. You are searching for patients, so mount the resource in the /patient-search/ directory, which contains other ways to search for patients (last5, full-name, ssn, pid). You are not searching within one patient's records, so do not use the /patient/ root path.
 * **BAD**: `GET /vler/toc`  
   **OK**: `GET /vler/table-of-contents`  
   **Comment**: "toc" is not a specially designated acronym of the Vistacore project so it should be spelled out fully.
 * **OK**: `GET /patient/record/labs/by-type`
 * **OK**: `GET /patient/record/search/text`
 * **OK**: `GET /patient/record/search/summary`
 * **OK**: `GET /patient/photo`

:::

#### Interceptors
::: side-note
Most resources should have the following interceptors enabled, in order:
 * audit (enabled by default)
 * metrics (enabled by default)
 * authentication (enabled by default)
 * pep (enabled by default)
 * operationalDataCheck
 * synchronize

Some of these interceptors are vital to security. See descriptions of these interceptors in the [middleware](middleware.md#Available-interceptors) document.
:::

### Create the request handler
The request handler follows the pattern established by the [node.js http module](http://nodejs.org/api/http.html#http_event_request) and further used by express.js handlers:
```JavaScript
function(req, res)
```

**req**: the request object. The base object is [node http incoming message](http://nodejs.org/api/http.html#http_http_incomingmessage), enhanced by express.js and the RDK.

The request offers access to the request URL, path params, query params, http headers, the resource server instance, and RDK utility methods.  [Express.js request documentation](http://expressjs.com/4x/api.html#req.params) provides an overview of the standard ability to access the request. In addition to those methods provides by express, you can access the resource server (`req.app`) and the RDK (`req.rdk`).

**res**: the response object. The base object is [node http server response](http://nodejs.org/api/http.html#http_class_http_serverresponse), enhanced by express.js.

The response object provides the ability to send a response back to the client. The most often used method is `res.send()` [doc](http://expressjs.com/4x/api.html#res.send). [Express.js response documentation](http://expressjs.com/4x/api.html#res.status) provides an overview of the standard ability to work with the response.

`res.send()` will trigger the RDK to run [outerceptors](middleware.md#Outerceptors) and finally send a response.

### Handle the request
 * **Do not block IO**; always use asynchronous functions instead.
 * [Log](logging.md) each business decision made (significant `if` branches, etc.), each unexpected state, and each error.
 * Use subsystems, if available, to fetch any data required to form the response.
    * Most patient data you will need from JDS is accessible through the JDS subsystem's `getPatientDomainData` function. See its JSDoc for more details and see `patientrecordResource.js` for example usage.
 * Use the VistaJS library at `/product/production/rdk/VistaJS/VistaJS.js` to perform VistA RPCs. See `examples.js` in the same folder for some example usage of the library, and see `rdk/resources/_example/exampleVistaResource.js` for a complete resource example.
    * A nice list of available [VistA RPCs](http://code.osehra.org/vivian/files/Order%20Entry%20Results%20Reporting-RPC.html) is available from OSEHRA

::: callout
While developing the resource, watch for errors and warnings in the log caused by improper usage of libraries in your resource.
:::

### Send the response
 * Use `res.send()` to send the response payload.
    * This can be chained with `res.status()` to customize the status code. For example:  
    `res.status(403).send({error: 'Forbidden'});`.
 * Use `res.json()` to send a response with the correct Content-Type header easily.
 * Be familiar with the [W3C http status codes](http://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html) and choose the appropriate status code for your responses.
    * [`200`/OK](http://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html#sec10.2.1) indicates that the request was successfully processed
    * [`202`/ACCEPTED](http://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html#sec10.2.3) indicates that the request was received but not yet processed
    * [`404`/NOT FOUND](http://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html#sec10.4.5) indicates that the id of a request by a specific id is not found or invalid
       * **Do not** return a `404` when requesting a collection that exists and that happens to have 0 results. Instead, return an empty array (or other empty convention)

Creation of a method of providing uniform response formats from the RDK is planned.

### Document the resource
 * Ensure that [JSDoc](style-guide.md#JSDoc-Guidelines) is written where applicable
 * Write Swagger documentation for your resource. See `rdk/resources/_example/exampleBasicResource.js` for detail.

### Test the resource
 * Write [unit tests and integration tests](testing.md) where applicable.
 * Write acceptance test steps from the Cucumber feature file provided by a feature owner.

### Mount the resource
 * If you are authorized to add resources to the main resource server, you may make your resource accessible by adding it to the resource directory, with a new line as demonstrated below in `resource-server.js`.
    * If you are unsure of whether you are authorized to add a resource to the main resource server, contact Team Mercury.
```JavaScript
app.register('family-name', '/family-path', require('./resources/(functionality)/(functionality)Resource').getResourceConfig(app));
```


## Adding Dependencies to the RDK
 * From the main rdk directory with package.json, run `npm install --save <package>`.
 * Please follow the process to request libraries to be added (POC: Team Mercury) before pushing code with new dependencies.

<br />
---
Next: [Subsystems](subsystems.md)
