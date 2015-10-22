::: page-description
Writeback Resources
===================
This document is a work in progress and details will be added as the writeback framework is negotiated.
:::

Writeback resources are resources which save new or changed patient data.

## Writeback Code Organization

```
/product/production/rdk/write/   - all writeback code belongs here
    write-health-data-service.js - the main writeback service
    write-pick-list-service.js   - the pick list service
    core/  - utilities for creating the writeback framework
    (domain)/
        (domain)-resources.js    - plumbing for creating the REST endpoint
        (domain)-validator.js    - validate the model here
        (domain)-vista-writer.js - perform the write here
    pick-list/
        pick-list-resources.js   - plumbing for the pick list
```

Teams implementing writeback should not modify the `-resources.js` files or any other plumbing without collaborating with the owners of the plumbing.

All new files created for writeback should be lowercase words separated by dashes. Consult the framework owner if you have a file which you think should not follow this standard.


## Developing a Writeback Resource

An annotated example writeback resource which complements this guide is in the rdk repository at `/product/production/rdk/write/_example/` _(Note that this directory name only has a leading underscore because it is for examples. Real resource paths should not have leading underscores.)_


### Before you create a resource

 * Ensure that it does not already exist
 * Identify the already-existing utilities and subsystems that can help you create your resource instead of reinventing the wheel
 * Understand that proper [logging](logging.md) is very important to identifying problems with the resource server and other parts of the Vistacore stack, and understand how to use proper logging.


### Create the resource plumbing

**For project members, creation of the plumbing should be handled by the plumbing owners.**

A directory should be created for the domain of the writeback resource with a file that exports a resource configuration, as described above in [Writeback Code Organization](#Writeback-Code-Organization). A template `-resources.js` file is in the `_example` folder.
The `-resources.js` file should reference external files which export asynchronous handler functions for each distinct task.
See the `_example` folder for detail of how task files are used by the resources file.

### Implement the handlers

The plumbing will reference files to be created with task handlers. The handlers should all have the following function signature: `function(writebackContext, callback)`

The plumbing provides a context object which is shared across handlers and which can accumulate useful data for later handlers to use. The context object and its properties are described below:
```JavaScript
var writebackContext = {
    logger: req.logger,
    vistaConfig: // The VistA config used by VistaJS with the credentials of the user making the request
    model: req.body,
    interceptorResults: req.interceptorResults,
    siteHash: req.session.user.site,
    duz: req.session.user.duz,
    pid: req.param('pid'),
    resourceId: req.param('resourceId'),  // The item to update or delete
    vprModel: null,  // this is sent to the vx-sync writeback endpoint
    vprResponse: null,  // becomes the value of the response data object
    vprResponseStatus: 200  // becomes the response HTTP status code
};
```

Set the `writebackContext.vprModel` variable to be the VPR model which is required by the VX-Sync wrapper, which should be the response value of the writeback VistA RPC wrappers.

Once the final handler has called the callback, the plumbing will respond with the standard RDK response object format, which gets serialized as JSON: 
```JavaScript
{
    status: // the http status code
    message: // the response message, if any
    data: writebackContext.vprResponse
}
```

`writebackContext.vprResponse` should contain an object or an array of objects with information about the written data.

### Document the resource
 * Ensure that [JSDoc](style-guide.md#JSDoc-Guidelines) is written where applicable
 * Write Swagger documentation for your resource. (TODO: example)

### Test the handlers
 * Write [unit tests and integration tests](testing.md) where applicable.
 * Write acceptance test steps from the Cucumber feature file provided by a feature owner.

## Adding Writeback-Specific Dependencies
 * From the main rdk/write/ directory with package.json, run `npm install --save <package>`.
 * **Please follow the process to request libraries to be added (POC: Team Mercury) before pushing code with new dependencies.**

<br />
---
Next: [Resources](resources.md)
