::: page-description
Subsystems
==========

Subsystems are services provided by the RDK to resources.  
Subsystems may be used within the RDK framework itself as well.
:::

Use subsystems to enable writing [DRY](http://en.wikipedia.org/wiki/Don%27t_repeat_yourself) code. In other words, use subsystems to provide functionality to resources or other parts of the RDK which may be useful in multiple places.

## Developing a Subsystem
Subsystems are developed similarly to resources.

The JDS subsystem located at `/product/production/rdk/subsystems/jds/jdsSubsystem.js` is a good example subsystem. Use this to complement the reading below.
A simpler example subsystem can be found at `_example/exampleSubsystem.js` in the subsystems folder.

### Before you create a subsystem
 * Ensure that it does not already exist
 * Identify the already-existing utilities that can help you create your subsystem instead of reinventing the wheel

### Create the subsystem file
 * Identify the correct location to place the subsystem
    * All subsystems belong in /product/production/rdk/subsystems/
    * Each subsystem should have its own subdirectory. Consider extending the functionality of or adding another function to an existing subsystem if what you want to create is similar.

 * The convention of creating a subsystem file is:
    * `/subsystems/(functionality)/(functionality)Subsystem.js`
    * where the functionality is a camelCase identifier.  
 * For example, the JDS subsystem file is:
    * `/subsystems/jds/jdsSubsystem.js`

### Create the subsystem configuration
 * The resource server will register the configuration of the subsystem with the system.
 * The subsystem configuration can currently specify [Healthcheck](#Healthchecks) information about the subsystem.
 * Other subsystem functions are simply exported through `module.exports`.

The subsystem configuration object is obtained by the resource server through an exported function called `getSubsystemConfig`, which is passed an instance of the server object. `getSubsystemConfig` returns an object which may contain healthcheck information.

### Create the subsystem functions
**Do not block IO**; always use asynchronous functions instead.

### Register the subsystem
Edit the `registerAppSubsystems` function in `app-factory.js`, following this example:
```JavaScript
var fooSubsystem = require('../subsystems/foo/fooSubsystem.js');
app.subsystems.register('foo', fooSubsystem);
```
Where `foo` names the item of functionality that the subsystem exposes, like jds or solr.

### Document the subsystem
 * Ensure that [JSDoc](style-guide.md#JSDoc-Guidelines) is written where applicable

### Test the subsystem
 * Write [unit tests and integration tests](testing.md) where applicable.

## Healthchecks
Healthchecks (health checks) allow monitoring of subsystem statuses, which is useful for subsystems that connect to outside network resources.

Healthcheck objects must contain the following items:
 * `name`: The name of the healthcheck, following the same naming conventions as resource names
 * `interval`: The interval in milliseconds of how frequently to run the health check. The currently recommended value is 5000 (5 seconds).
 * `check`: A function which performs an asynchronous healthcheck and calls the callback upon completion. The callback currently takes either a `true` or a `false` to indicate whether the check was healthy.

See the JDS subsystem healthcheck as an example.

<br />
---
Next: [Middleware](middleware.md)
