
This document is being rewritten in parts in the markdown files found under the docs directory. Get started at docs/index.md

Resource Development Kit (RDK)
==============================
The Resource Development Kit (RDK) is created to support the development of the eHMP UI as part of VistA Core / VistA Evolution effort.  Specifically, the RDK provides a mechanism to create resources / web services.

The RDK, along with the Application Development Kit (ADK), make of the eHMP Software Development Kit.  An explanation of the overall intention of the SDK can be found as part of the [eHMP SDK Overview](https://wiki.vistacore.us/x/aJgZ).

This document
=============
This document is intended as a developer's guide, both in utilizing the RDK and in extending the RDK.  This document contains:


- *RDK Overview*: an overview of the concept of the RDK
- *VistA Core Resource Server Pattern*: explanation of the existing VistA Core resource server(s) that utilize the RDK
- *How to develop a resource*: explains how to create a new resource (web service) that can be hosted within a resource server
- *How to develop a subsystem*: explains how to integrate a subsystem, such as JDS or VistA, with the resource server, to make available to a resource
- *How to develop a healthcheck*: explains how to create a healthcheck to help determine if a part of the system is up and running
- *How to developer a resource server*: explains how to bundle resources, subsystems, healthchecks, and configuration to create an instance of a resource server
- *How to develop against the RDK*: explains how an RDK developer can extend the existing RDK

This repository
===============
This git repository contains several items:
- RDK
- VistA Exchange Virtual Patient Record Resource Server
- Resources
- tests

Perhaps these should be split into separate repositories.  For now and the foreseeable future, they are all in this one repo.

The git repository is hosted at: https://git.vistacore.us/git/rdk.git

*TODO* link to support for SDK

RDK Overview
============

Anatomy
-------
A *resource* is a single web service (allergies, or "save allergies").  (In JAX-RS, a single method that gets the @GET annotation)

A *resource server* is a deployable unit, including a set of resource and specific configuration.  (In JAX-RS, a war file).

The *RDK* an opinionated framework for initiating an resource server, including common cross cutting concerns (authentication, authorization, logging, etc)

Roles
-----
A *resource developer* develops the resources.  The resource developer develops in JavaScript, utilizing node, express.js, the RDK, and other npm modules.

A *deployment engineer* chooses how to deploy a set of resources as a resource server.  The deployment engineer develops in JavaScript, utilizing the RDK's app builder routines to register a set of resources.  Further, the configuration is specified using configuration files.

Technical Specification
-----------------------
The RDK is developed using *JavaScript* and *express.js*.

The resulting resource servers are deployed using *node.js*.

The ecosystem relies on *npm* for package management.

RDK Responsibilities for resource developer
-------------------------------------------
- Provide configuration of the resource family
- For each resource, specify relative mount path and method using standard express signature function(request, response, next)
- Specify resource characteristics (sensitive, audit information)
- request provides resource information about the request: url, path parameters, query parameters, header, current user, access to RDK utility methods, access to current resource server, configuration information, logger
- response provides resource ability to send response: status code, json or text body, media information
- RDK provides resources with handles to common external systems, including JDS, VistA(s), solr
- CI pipeline / devops of resource including compiling, packing, testing, and publishing to artifact repository.  This produces a CM-ed version of the resource

RDK responsibilities for deployment engineer when creating a resource server
----------------------------------------------------------------------------
- Group resources into a logical deployment unit called a resource server.
- Specify how many processes using cluster/fork
- Deployment engineer chooses which resource family should be registered using: (show code)
- Resource Server deployed behind a reverse proxy (apache httpd) for load balancing
- Ability to enable: authentication, authorization/PEP, audit
- Specify logging rules
- Specify configuration
- Specify resource caching rules
- RDK routes calls to resources based upon URL and media type (content-negotation)
- Provides health check (both binary and discrete information) based upon each resource registered.  Deployment engineer can specify additional health check rules.
- CI pipeline / devops to pulling resources from artifact repository, compiling, packing, testing, and publishing to artifact repository.  This produces a CM-ed version of the resource server (which includes specific version of resources)

Other responsibilities
----------------------
RDK also provides:
- RDK centralizes dependency management
- Automatic creation of resource directory

VistA Core Resource Server Pattern
==================================
Although it is expected to support multiple resource servers optimized for various scaling needs, thus far the VistA Core ecosystem has one single resource server, *VistA Exchange API Resource Server*.

Run It!
-------
To run the standard *VistA Exchange API Resource Server*, first deploy the eHMP ecosystem (outside scope of this document), then run: `./run.sh --config config/config.js`.

The set of command line parameters:
`--config <configfile>` or `-c <configfile>`: specify configuration file.  Use relative path from app.js.  Example: `./run.sh --config config/customConfig.js`.  Defaults to `config/config.js`

Note: run `run.sh` from `/product/production/rdk`.
Note: you may have to alter permissions to execute the script (`chmod a+x run.sh`)

Resource Directory
------------------

Patient Search
--------------

Patient Record API
------------------

Text search API
---------------

Developer Concerns
==================
Regardless of the type of development that you will do (using the RDK to develop resources, subsytems, or resource servers or if you are developing the RDK), you will need to follow these directions to get started.

IDE
---
We have standardized on [Sublime Text 3](http://www.sublimetext.com/3), along with a standard set of plug-in's, as our team IDE.  Why did we standardize?  To encourage common cosmetic items (tabs vs spaces, for example), ensure that everyone is performing common jslint/jshint checks prior to check-in's, and to make it easier as developers pair.  Sure, some of those items can be / should be moved to build time checks.

If you are developing the ADK, it super highly recommended to use this standard IDE.
If you are developing your own resources, it is only a standard recommendation.

The instructions for setting up Sublime with its plug-in's can be found here: [https://wiki.vistacore.us/x/RZsZ].

Source Code
-----------
You will need source code, located at [https://git.vistacore.us/git/rdk.git].  Currently, just clone this directory.  Likely in the future you will need to run a devops provided script to initialize your development environment.  *make sure that you modify the next branch, not master*

Setup Node / NPM
----------------
If you installed via devops setup scripts, node and npm are already installed.

Otherwise, you will need to ensure dependencies are in place:

install node:
`brew install node`

Install dependencies
--------------------
Install node dependencies:
`gradle build`

Run tests
---------
Run unit tests using `gradle rdkTests`.
Run *VistA Exchange API Resource Server* integration tests using `gradle rdkIntTests` (*VistA Exchange API Resource Server* must be running)

Commit
------
Use git to commit changes and push to central repo.  *make sure that you modify the next branch, not master*

Track the build process
-----------------------
The RDK build process is located here: [https://build.vistacore.us/view/rdk/view/Next%20Branch/]

Coding Conventions
------------------
* On adding references from resourcs to other modules:
- if it is a custom module provided as part of the RDK, reference indirectly via RDK (`req.rdk.utils` or `req.app`)
- if it is a very stable NPM module, reference directly or through RDK, resource developers choice
- if is a unstable NPM module, will decide on case-by-case basis

* References to the RDK should be "stateless" (utility functions) whereas references to the app should be "stateful" (things that represent configuration, the running instances)
* `req` contains references to both `rdk` and `app`

Documentation
-------------
The RDK uses JSDoc as the documentation standard for scaleable and mantainable code. Each module and it's related method should have a related jsdoc comment. If you are familiar with Java or C#, JSDocs work much the same and should be familar.


How to develop a resource
=========================
The development of resources is the bread-and-butter of building out the server side functionality.  A resource is responsible for receiving an HTTP request, performing the processing by interacting with other subsystems, and then returning an HTTP response.

This section will describe the standard process and convention in developing a resource.

Create resource file
--------------------
Create a new file to encapsulate the resource.  Generally, a group of resources can be packages within a single file to increase readability.  For a set of resources to be grouped within the same file, the resources should be very closely related, use the same subsystems, and have similiar scaling profiles.  Not adhering to this reduces flexibility in deployment / scalability.

The convention of the naming of this file is (functionality) + resource.js.  For example, given a resource to expose a list of allergens known to the VA, this could be within a file name `allergenResource.js`.  This file is to be created in a directory as follows: `/resources/(functionality)/(functionality)Resource.js`

Create resource configuration
-----------------------------
The resource server will register the configuration of the supported resources with the system.  This will specify things like which URL's to which to listen, how to respond when these URL's are invoked, and cross-cutting concerns.

Create an exported method to return the configuration.  By convention, this method is called `getResourceConfig` and accept a `server` instance.

This method returns either a single configuration object, or an array of configuration objects.

The configuration object may contain the following:
**name**: a name of the resource.  No spaces please.  This will be used in logs, healthchecks, and directory resource.  This will often either be overridden by the resource server or prepended with a parent name.
**mountpoint**: an absolute directory onto which to mount this handler.  This will often be overridden by the resource server
**path**: local path to append to mountpoint onto which to mount this handler.  This is supplied so that even if the resource(s) are mounted to a resource server defined location, you still have control to differentiate handlers.
**interceptors**: list of cross cutting *middleware* methods to run prior to running these handlers.  Note that this will likely be modified to be less explicit, and instead to define the characteristics of the resource (for example: does it expose patient record?)
**get, put, post, delete**: for each of these, specify the method to handle the request.  See `create request handler` below.  You can include a method for each of the http methods.
**healthcheck**: One or multiple healthchecks or subsystem *healthchecks* to run when the system needs to determine if the resource is *healthy*

Below is a simple hello world of a resource:

```
var getResourceConfig = function(app) {

    return [{
        name: 'hello-world',
        get: handle,
    }];
};

function handle(req, res) {
    res.send('hello-world');
}

exports.getResourceConfig = getResourceConfig;
```

Create request handler
----------------------
The request handler follows the pattern established by the [node.js http module](http://nodejs.org/api/http.html#http_event_request) and further used by express.js handlers:
```
function(req, res)
```

**req**: the request object.  The base object is [node http incoming message](http://nodejs.org/api/http.html#http_http_incomingmessage), enhanced by express.js and the RDK.

The request offers access to the request URL, path params, query params, http headers, the resource server instance, and RDK utility methods.  [Express.js request documentation](http://expressjs.com/4x/api.html#req.params) provides an overview of the standard ability to access the request.  In addition to those methods provides by express, you can access the resource server (`req.app`) and the RDK (`req.rdk`).

**res**: the response object.  The base object is [node http server response](http://nodejs.org/api/http.html#http_class_http_serverresponse), enhanced by express.js.

The response offers abilty to send a response back to the client.  The most often used method is `res.send()` [doc](http://expressjs.com/4x/api.html#res.send).  [Express.js response documentation](http://expressjs.com/4x/api.html#res.status) provides an overview of the standard ability to work with the response.

Conventions/Guidelines
----------------------
**DO NOT** before blocking IO.  Never.
**DO** return a status code [`200`/OK](http://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html#sec10.2.1) to indicate that the request was successfully processed.
**DO** return a status code [`202`/ACCEPTED](http://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html#sec10.2.3) to indicate that the request was received but not yet processed.
**DO** return a status code [`404`/NOT FOUND](http://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html#sec10.4.5) when there is a request for a specific set of data (such as fetching by id) when there is no data for that id.  For example, given a resource to fetch lab results by id for a url `http://server/patient/123/labs/ordernumber/XYZ-123` and there is no lab with order number `XYZ-123`, return a `404`.  However..
**DO NOT** return a `404/NOT FOUND` when requesting a collection of data that happens to have 0 results.  For example, given a resource to fetch lab results by patient for a url `http://server/patient/123/labs`, where patient 123 is valid (or unknown to be valid), and there are no labs for this patient, do not return a `404`.  Instead **DO** return an empty array (or other empty convention) with a `200/OK`.

How to develop a subsystem
==========================
explains how to integrate a subsystem, such as JDS or VistA, with the resource server, to make available to a resource

How to develop a healthcheck
============================
explains how to create a healthcheck to help determine if a part of the system is up and running

How to developer a resource server
==================================
explains how to bundle resources, subsystems, healthchecks, and configuration to create an instance of a resource server

To create a resource server instance, initialize a `resourceServerBuilder`.  The most basic would look like:
```
var builder = rdk.resourceServerBuilder();
var app = builder.build();
```

The `resourceServerBuilder` provides several methods to specify the resource server behavior:

`argv`: pass the raw arguments from the running process.  These are parsed and made availabe to the application.
`config`: specify an instance of a config file
`configFilename`: specify the path to a config file
`defaultConfigFilename`: specify the path to a config file to be used if none are otherwise provided, such as if no command line switch is present
`registerResource`: register a resource (web service).  This method can either accept a `resourceConfiguration` or `name`,`mountpoint`,`resourceConfiguration`.  If name and mountpoint are provided they will override what is provided in the resourceConfiguration.  This allows for a resource to provide default name and mountpoint, but for the resource server to override this (such as mounting the same resource in different places).

When registering a resource the provided object is a configuration object containing:
	`name`: name of the resource
	`mountpoint`: the path onto which to mount the resource
	`inteceptors`: optional array of middleware functions that should be run prior to executing resource
	`get`, `put`, `post`, `delete`: optional function to run when a the http method is executed at the mountpoint.
	`healthcheck`: one or array of healthcheck instances to run to determine if this particular resource is healthy


How to develop against the RDK
==============================
explains how an RDK developer can extend the existing RDK



Other things that probably belong in a section above, somewhere
===============================================================

Accessing the commandline parameters
------------------------------------
`app.argv`, todo: describe how to access switches, etc




Add dependencies
----------------
To add an additional run-time dependency, use npm:
`npm install <packagename> --save`

To add an additional development-time dependency, use npm:
`npm install <packagename> --save-dev`


VistA Exchange Resource Server
==============================










RDK Model
=========
## RDK.utils.commandlineparser
The RDK command line parse utilizes [yargs](https://www.npmjs.org/package/yargs).  It is expected that only an resource directory server (app) will utilize the commandline parser.


Subsystem
=========
Create subsystem
----------------
To create a subsystem, create a factory method which returns an object that is an instance of the subsystem.  By convention, the constructor method has the style `getInstance(app, sectionConfiguration)`.  The subsystem object contains the following fields:
`start()`: optional function invoked during application startup. Add if the subsystem required a startup process, such as connecting to a database.
`stop()`: optional function invoked during application shutdown. Add if the subsystem required a startup process, such as disconnecting from a database.
`healthcheck`: optional function to provide the application with a `healthcheck` instance to represent if the subsystem is healthy.
The subsystem provides other custom methods to be used by the application, resources, or other subsystems.

Register the subsystem
----------------------
To register a subsystem, in the application, invoke the subsystem factory method and register the instance with the application.
```
var mySubsystem = require('MySubsystem').getInstance(app, app.config.mysubsystem);
app.subsystem.register('mysubsystem',mySubsystem);
```

Use the subsystem
-----------------
To utilize the subsystem from the resource, access from the `req.app.subsystem` object.  For example:

```
function(req,res) {
	mySubsystem = req.app.subsystems.mysubsystem;
	// do something interesting with subsystem
}
```

References
==========
SDK Overview: [https://wiki.vistacore.us/x/aJgZ]
Markdown Syntax: [https://daringfireball.net/projects/markdown/]
JavaScript resources: [https://wiki.vistacore.us/x/6QQm]
JSDocs: [http://usejsdoc.org/]
