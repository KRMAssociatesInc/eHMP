::: page-description
# ADK Overview #
High level explanation of ADK, what it provides, and its scope
:::
> The Application Development Kit (ADK) was developed with the following requirements:
- A mechanism to create autonomous, functional components called applets
- A mechanism to arrange these applets through app configuration into layouts called screens
- Provide holistic application utilities and functions
- Include common cross cutting concerns (authentication, authorization, etc)
- Provide consistent visual themes
- To be published as an artifact for consumption by an application

## ADK Features ##
### Anatomy ###
ADK terminology for parts of an application:
- An **applet** is a single unit of visual functionality.  Examples of applets include a list of allergies, an ability to enter a new allergy, ability to place a new order.
- A **layout** is an abstract arrangement of applets.  A screen typically chooses from a set of ADK predefined layout.
- A **screen** is a defined collection of applets.
- An **application** is a collection of screens.

### Roles ###
Applets are created by applet developers.  Applet developers can often develop applets without consideration to the screens in which the applet will run.  Applet developers utilize JavaScript and Marionette to develop applets.

Screen designers choose how to arrange a set of applets.  Screen designers use configuration files.

### Technical Information ###
ADK is built using JavaScript, backbone.js, marionette, bootstrap (a full list of libraries being used can be accessed on our **Libraries** tab)

Resulting application is a SPA (see description [below](adk/index.md#Single-Page-Application)), static HTML served from web server (not dynamic web pages such as JSP, PHP, etc. No J2EE web server)

### ADK responsibilities for applet developers ###
- provide mechanism to discover the current patient
- provide mechanism to fetch patient data from vista exchange, can use canonical model (based on VPR) or provide custom "view" model
- provide mechanism to bind data to backbone views, provide templating
- provide mechanism to choose for preselected display paradigms (tableview, etc) and UI controls.  UI style set by application
- support multiple view types (ie. gist and summary) while providing common functionality (text filtering, data refresh, etc.)

> Applet Developers are responsible for producing a marionette "view".  This often will fall into patterns as below:
- HTML template for a row using handlebars
- Creation of backbone view-model
- Registering these with ADK
- Show example for allergy template, both short and complex version

### ADK responsibilities for screen designers ###
- provide mechanism for screen designers to create a screen, choose from predefined layouts and assigning applets to regions

### ADK responsibilities for application designer ###
- SDK provides the runtime UI shell for the application.  Displays current patient, current user, provides navigation
- provide mechanism for application designer to choose the screens that are part of the application

## ADK Details ##
### Single Page Application ###
The implementation of the web application created through the SDK is SPA ("single-page application") utilizing a set of server side resources (RESTful web services).

The HTML/JavaScript/CSS for the application is returned as "static HTML" from a web server (specifically Apache httpd). The client side application utilizes the resource server (web services) to execute various data-driven activities, such as reading the patient record, updating the patient record, documenting a patient encounter, ordering medications, etc.

Note that this pattern is similar to a traditional client-server or native mobile application: the user downloads the application on first use, the application itself contains behavior but not the data, the application reaches back out to a server for read/write activities.

The term "single-page application" can be misleading in that it may suggest that there is a single "view" for the entire application. Rather, the term "page" refers to the handling of the lifecycle of the page within the browser. Rather than recycling the entire page, elements on the DOM are modified as needed.

Although there are differing approaches for implementation of a SPA, ours will be to have the static assets (HTML/JavaScript/CSS) decoupled from the data-centric resource services from which the rely. The static assets will be available from a web server (like Apache) independent from the resource server (running within JVM and/or node.js).

