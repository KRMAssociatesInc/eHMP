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
Use one of these commands:
 * `./run.sh --config ./config/config.js`  
 * `node resource-server.js --config ./config/config.js`

## Development and Implementation details
 * [Development Environment](development.md)
 * [Style Guide](style-guide.md)
 * [Resources](resources.md)
 * [Subsystems](subsystems.md)
 * [Middleware (Interceptors and Outerceptors)](middleware.md)
 * [Logging](logging.md)
 * [Testing](testing.md)

