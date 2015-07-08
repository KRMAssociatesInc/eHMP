Background
==========
This document is a developer's guide to developing `vx-sync`. `vx-sync` is the implementation to synchronize the VistA Exchange (VX) cache, expanding on the existing HMP Sychronization process. `vx-sync` is to support multiple sources of data, be able to scale to enterprise demands by supporting processing data massively in parallel and in order independent manner, and be able to reliable reflect how up-to-date the data in the cache is.

The overall design for `vx-sync` may be found on the wiki [https://wiki.vistacore.us/pages/viewpage.action?pageId=4720941].

This document
=============
This document is written using markdown [http://daringfireball.net/projects/markdown/syntax]. This ideal is that, by following markdown syntax, this is maintainable and readable as a plaintext document but can also be "compiled" to a PDF or HTML document for distrubution or pretty formatting.

This document is maintained in the vx-sync git repository as `product/production/vx-sync/README.md`.

Installation
============

Node
----
`node.js` [http://nodejs.org] is the container under which the vx-sync job processors run. It is _comparable_ in purpose to the `JVM` for the Java ecosystem.

`npm` is the package management service for node.js. It is _comparable_ in purpose to Maven repositories for the Java ecosystem.

`vx-sync` must have `node.js` and `npm` installed.

We try to stay reasonably current with the latest stable version of node. At the time this document was written, the latest version of node was 0.10.33.

```
jayray> node --version
v0.10.33
jayray> npm --version
1.3.11
```

Beanstalkd
----------
Must have `beanstalkd` installed. Check to see if installed.

```
jayray> beanstalkd -v
beanstalkd 1.9
```

Until we have the infrastructure scripts to manage installing `node.js`, `npm`, and `beanstalkd`, use brew [http://brew.sh].

Using `brew install node` (this will install both node and npm), `brew install beanstalkd`.

Run `npm install` to ensure all required npm modules are installed

IDE and environment
-------------------
TODO: provide link to IDE setup. Ensure that everyone is using same plug-in's


Get the code
------------
Perform `git clone https://git.vistacore.us/git/VX-Sync.git`.

This needs to change to get source code from an infrastructure boostrap script.

Install npm defined dependencies
--------------------------------
Once you have the source code and npm, use npm to pull down any dependencies by running:

```
npm install
```

Running the Application
=======================
Note: much of this is placeholder until we get legit infrastructure scripts. This is intended to be used for a short period of time.

To start the entire framework, there are 10 processes that must be run. Start them in the order listed from within `~/Projects/vistacore/VX-Sync/product/production/vx-sync`:

* `beanstalkd -p 5000 -V`
* `node mocks/vista/vista-mock.js --vistaId 9E7A --port 10001 | node_modules/.bin/bunyan -o short`
* `node mocks/vista/vista-mock.js --vistaId C877 --port 10002 | node_modules/.bin/bunyan -o short`
* `node endpoints/mvi/mvi-endpoint.js --connector ../../mocks/mvi/mvi-mock.js --port 3000 | node_modules/.bin/bunyan -o short`
* `node mocks/jds/jds-mock.js --port 9080 | node_modules/.bin/bunyan -o short`
* `node pollerHost.js --site 9E7A --site C877 | node_modules/.bin/bunyan -o short`
* `node subscriberHost.js | node_modules/.bin/bunyan -o short`
* `node endpoints/writeback/writeback-endpoint.js --port 9090 | node_modules/.bin/bunyan -o short`

This is optional. It will add a __lot__ of traffic
* `node triggerPollerHost.js --site 9E7A --site C877 | node_modules/.bin/bunyan -o short`

This is not really used at the moment, it just stubs out the writeback endpoint
* `node endpoints/sync-request/sync-request-endpoint.js --port 8080 | node_modules/.bin/bunyan -o short`

There are several shell scripts that will start (and stop) these processes, which you can use if you find them more convenient. If you run the triggerPollerHost.js, messages will begin moving through the system, as the vista-mock.js will generate simulated appointment patients.

Start a Patient Sync
--------------------
Once everything is started, you can start a simulated synchronization by doing a `GET` to the following url [http://localhost:8080/sync/doLoad?pid=9E7A;3](http://localhost:8080/sync/doLoad?pid=9E7A;3). Note that you can pass a `pid` or an `icn` as the query parameter. Alternately, you can do a `POST` to the following url [http://localhost:8080/sync/load?pid=9E7A;3](http://localhost:8080/sync/load?pid=9E7A;3).

Run tests
=========

You can run the unit tests using `npm test`.


Development
===========
The rest of this document is to explain how to develop.

There are several concepts to ensure that you understand in order to execute development. Please ensure that you have working knowledge of the [design](http://bit.ly/vx-sync) prior to proceeding - the details are less important than the concept and the terms.

*Editorial comment*: it is possible for this document and the wiki based design to drift. My recommendation is to use the wiki based document for high level design and use this document for code level design of *how* to build handlers, write tests, and code level design goals.

* job: represents one unit of work. This is requested and scheduled by publishing a job request into a job repository and then executed by a job handler. An example of a job is "transform JMeadow to VPR".
* job handler: a job handler is the implementation that fulfills a job. An example is the "transform JMeadow to VPR handler" (which is responsible for taking a payload in JMeadows format and transforming to VPR format). A job handler implements a logic contract for accepting the job payload and returning, via callback, the result

The development of `vx-sync` consists of building cross-cutting concerns (maintaining infrastructure code, sync status, ability to reserve jobs, etc) and development of handlers. The development of handlers is expected to involve many developers, and thus this document will focus setting a process for how to develop a handler.

How to develop a handler
========================

General Guidelines
------------------
* Don't block. Make sure that the handler utilizes non-blocking I/O. Consider the use of `sync` [http://bit.ly/1st6NxU] to help manage serial / parallel asynchronous processing.

* Only one instance of a given handler is created. Thus, handlers shall have no "threading" concerns. The only state that should be stored in a handler are references to other stateless module

Anti-pattern:
```
self.currentPatient = job.payload.patient;
```

Acceptable pattern:
```
self.log = Logger.get('enterprise-sync-request-handler');
```

* All functions shall exist as part of the handler instance, not just in module space

* Be very careful with the use of `this`. It is recommended to set reference to `self` to avoid unexpected issues

Acceptable pattern:
```
var self = this;
self.log.info('sample handler received job request [%s]', JSON.stringify(payload));
```

Create module
-------------
Currently, all modules are created in the same git repository. Perhaps over time that we will change this to allow for handlers to exist in their own git repository, have their own build pipelines, publish to a npm repository, and be pulled in together at compilation time. But no yet..

Start by creating a module by creating a new directory `/product/production/vx-sync/handlers/<jobname>/`

Create a new file file in that directory `<jobname>-handler.js`.

For example, the handler for job `enterprise-sync-request` exists as: `/product/production/vx-sync/handlers/enterprise-sync-request/enterprise-sync-request-handler.js`.

Factory method
--------------
By contract the handler must implement a factory method as the exported module fucntion.

Within the handler, export a function that will return an instance of the handler. This function accepts two parameters.
`environment`: this contains reference to any subsystems needed by the handler as well as configuration
`publisherRouter`: this is an instance of a router that can be used to publish new jobs to other job repositories

A standard example is:
```
module.exports = function(environment, publisherRouter) {
    function SampleHandler(environment, publisherRouter) {
        var self = this;
        self.environment = environment;
        self.publisherRouter = publisherRouter;
    }

...

    return new SampleHandler(environment, publisherRouter);
};
```

Create a handler method
-----------------------
By contract, the handler object must implement a function that will be used to process job request. This function accepts two parameters:
`payload`: this is the payload portion of the job that was created by the producer. The format of this payload is specific to this job
`handlerCallback`: this is a callback method in the format of `f(err, result)`. `err` is any exception that occurred during the processing of this job. `result` specifies is this was successfully processed or not. See the response section of this document for more information. For convenience, if there is no error, the handler may invoke as `f(result)` - this is handled by the underlying job framework.

It is recommended to create the handler function as a prototype of the based object definition (although I suppose that it does not matter, since it is expected that only one instance of the object will be created).

Example:
```
    SampleHandler.prototype.handle = function(payload, handlerCallback) {
        var self = this;
        self.log.info('sample handler received job request [%s]', JSON.stringify(payload));
        handlerCallback('success');
    }
```

This handler method is the core entry point into processing. Have at it!

Logger
------
Every handler is likely to need to perform logging.

In the header part of the module, utilize the Logger to get an instance of a log, utilizing `handler` as the prototype.

Example (replace `sample-handler` with your handler name)
```
var log = require('../../jobframework/loggingFactory').get('sample-handler', 'handler');
```

*Jason's note*: I am split between two perspectives of logging. In general, there is no doubt that we need to achieve the following:
- while in development mode and possibly early day's of deployment, we need to have verbose logging to help troubleshoot
- while in mature deployment, to maximize runtime efficiency and size of logs, we need to favor logging that only reports issues that need to be addressed
- it is easy to fall into a mindset while you are developing a set of code (like a handler) that for that period of time the stuff is significant to you, and thus the shift the logging to a high level than it should be. That is, something that is actually debug/trace quickly becomes info. Warns become error. Error becomes fatal. Need to provide guidelines to prevent this.

Two choices:
1) cap all handler logging to `debug`/`trace`. Because all exceptions (both through callback or uncaught exceptions) are raised to the vx-framework, these significant messages are logged by the framework. This gives us ability to leave `debug` (or even `trace`) output on while we are in dev / early deployment. When we are running at a stable mode, we would switch the logging configuration to only output at `info` and above.
2) Allow handlers to log at their own defined levels. Adjust the handler logging configuration indepedently of the standard logging configuration.

After typing this out, I am convinced that option #1 is the correct path.

Guidelines on logging levels for a handler:

`fatal`: should only be used to represent events that effect many jobs. This should not be used by a handler. This generally would be used by the framework if a situation occurs that results in the process shutting down (such as required external systems are not available)

`error`: should be used to represent that a job has a non-transient exception (such as malformed format). This should not be used by a handler. This should be used a maximum of ONCE from the framework during the processing of a job.

`warn`: should be used to represent that a job has a transient exception (such as a timeout while waiting for a response from MVI). This should be used a maximum of ONCE from the framework during the processing of a job.

`info`: use ONCE per message from job framework; information during startup. Not used from handlers.

`debug`, `trace`: any log messages that need to be used to troubleshoot a handler should be at debug and trace level. Consider debug should be enough for casual understanding, while trace is likely extermely verbose. Expect that during development it is acceptable for `trace` to be turned on, and that early deployment can be at `debug`.


Logging is through a component call `bunyan`. One of the interesting things with bunyan is that it actually logs as a json stream to file or stdout. This is great for later parsing the log file. This is hard from a human readable perspective. Luckily there is a utility (`node_modules/.bin/bunyan`) that can put into an easy to read format.

To use this, generally when running a process, pipe the output to this utility. The startup scripts do this as shown in the run-worker.sh script:
```
node host.js "$@" | node_modules/.bin/bunyan
```

Response
--------
During the course of processing a job, the job handler will yield one of the following logical conclusions:
* the job was successfully processed (lets label this as success)
* the job was not able to be completely processed because of a potentially temporary situation with the expectation that a retry at some future point in time may result in success. This could be a result as of an external system not available (lets label this as transient exception)
* the job was not able to be completely processed, and it is not expected that retrying later will yield a different (lets label this as fatal exception)

In the case of success, perform the following at the conclusion of processing:
```
handlerCallback('success');
```

In the case of transient exception, perform the following at the conclusion of processing (where `err` is either the actual exception that was caught that represents the issue OR *preferably* a string/object to represent the situation):
```
handlerCallback(err, 'transient-exception');
```

In the case of fatal exception, perform the following at the conclusion of processing (where `err` is either the actual exception that was caught that represents the issue OR *preferably* a string/object to represent the situation):
```
handlerCallback(err, 'fatal-exception');
```

The framework will catch an uncaught exception and treat as fatal-exception. Do not rely upon this.

The framework also understands other status (`exception`, `release`, `bury`), do not use these. Likely will be dropped.


Running Tests
=============
For the development of `vx-sync`, we will rely upon different levels of testing to achieve different balances of timeliness (how quick can the developer get feedback), fidelity (how much is this test reflective of the way that it will actually be used in production / how much can you trust the test), and permanency (tests that assert the requirements at a stable API contract have high permanency compared with tests that represent developer intent at low level class level and are obsoleted by refactoring the implementation).

To this, I expect the following type of tests:
- *VX acceptance tests*: this asserts that the overal behavior of the system while utilizing the integration of the application, resource server, and `vx-sync` subsystem. It is expect that there are only a minimal number of tests at this level as they have a high expense (high timeliness). These are defined in gherkin and implement in cucumber with ruby.
- *`vx-sync` accceptance tests*: this assert that synchronization behavior executes as intended, exercising the sync API and asserting state in `VX-Cache` with test instances of VistA and mocked instances of systems like MVI (these should be actual running instances that use the same technology / interfaces). It is expected that there many of these to cover top level concerns of `vx-sync`. It is not expected that these *must* be run by a handler developer prior to check-in. (Subject to change if handler development is routinely breaking the acceptance builds). These are defined in gherkin and implement in cucumber with ruby.
- *handler integration tests*: this asserts that a handler, when executed in the context of running through the vx framework worker host and connecting to job repository (beanstalkd) runs as expected (including properly creating other jobs and making network calls to mock instances of external systems). It is expected that each handler has a few integration tests. These need to be executed locally during pre-commit activities. It is expected that these are defined in gherkin and implement in cucumber with ruby (but could be through Jasmine, but probably not a good idea). Unless contract for a handler change (such as different format for the input or aggregation/decomposition of handlers in the design), this should be very stable definition of the tests themselves (high permancy).
- *handler unit test tests*: this asserts developer intent for a handler. These need to be FAST. The full suite of all unit tests should run in the matter of a few seconds. These utilize fake job framework, and thus do not require network calls, no interaction with beanstalkd, etc. It is expected that each handler have many unit tests to cover different scenarios. These tests should be run not only during pre-commit, but constantly throughout the development of the handler. It is expected that these test are written in `jasmine-node`.

To run all unit test
--------------------
You can run this using `node_modules/jasmine-node/bin/jasmine-node tests/unittests/ --matchall --color --verbose`. For short, I added an npm shortcut which you can run as: `npm test`
TODO: This should be wrapped with a gradle command.

To write handler unit tests
---------------------------
For an intro into jasmine, see here: http://jasmine.github.io/2.0/introduction.html
TODO: explain how to use HandlerTestRunner
TODO: explain how we need to expand the expection checker for HandlerTestRunner

Other testing concerns
----------------------
TODO: setup common code and patterns for handler acceptance tests (in gherkin and ruby), including spinning up beanstalk, starting specific worker, how to publish test messsage, wait for worker to run, then check downstream effects such as JDS or other job repositories.

TOOD: allow developer to run acceptance / unit tests for their handler rather than all tests

TODO: setup common code and patterns for `vx-sync` acceptance tests

TODO: consider the impact that `vx-sync` will have on system wide acceptance tests - not all data is immediately available. This is by its very nature not deterministic. How should this evolve?


Beanstalkd Protocol
===================
It is helpful to understand the beanstalkd protocol:
[https://wiki.vistacore.us/download/attachments/4720934/BeanStalk-protocol-abridged.pdf?api=v2]. As it relates to the workflow of the handlers.

* Through the use of the publisher, either from the web service API or through other handlers, performs a `put`
* The worker (part of the vx job framework) performs a `reserve` and then delegates the job to the correct handler instance
* The handler response with `success`, `transient-exception`, or `fatal-exception`.
* On `success`, the worker performs a `delete` to remove the job from the job repository
* On `transient-exception`, the worker performs a `release with delay` to schedule the job to be worked on in the future
* On `fatal-exception`, the worker performs a `bury`

Note: it is expected to utilize TTR to ensure that jobs to not get assigned to a handler, the handler crashes, and that the job never is released. So far this seems to be handled without using TTR, but we will implement TTR for safety.


