::: page-description
RDK Introduction
================
:::

## Overview
### eHMP Overview
 * The eHMP UI is composed of applets which show pieces of information.
 * The applets are written with the client-side Application Development Kit (ADK) framework.
 * The applets retrieve information from the resource server through ADK.
 * The resource server is written with the server-side Resource Development Kit (RDK) framework.
 * ADK and RDK constitute the Software Development Kit (SDK).

### RDK Overview
The RDK is an opinionated, server-side JavaScript framework for developing a resource server.
The RDK assists common cross-cutting concerns like authentication, authorization, logging, etc.

RDK core concepts:
 * **resource**: a single web service.
 * **resource server**: a deployable set of resources with a specific configuration.
 * **subsystem**: a set of functionality used by the RDK framework itself or usable by multiple resources.
 * **interceptor**: middleware which runs as a resource receives a request.
 * **outerceptor**: middleware which runs as a resource sends a response.


Currently there is one main resource server, the *VistA Exchange API Resource Server*.

## Running the Resource Server
Proper deployment of RDK will generate a JSON configuration file at `config/rdk-fetch-server-config.json`.  
Once a configuration file has been generated, one of these commands may be used to start the resource server:
 * `./run.sh`  
 * `./resource-server.js`

The resource server process accepts a --config command-line argument to specify a path to a JSON configuration file.

## Development and Implementation details
 * [Contributing](contributing.md)
 * [Style Guide](style-guide.md)
 * [Code Organization](code-organization.md)
 * [Contributing](contributing.md)
 * [Resources](resources.md)
 * [Subsystems](subsystems.md)
 * [Middleware (Interceptors and Outerceptors)](middleware.md)
 * [Logging](logging.md)
 * [Testing](testing.md)

