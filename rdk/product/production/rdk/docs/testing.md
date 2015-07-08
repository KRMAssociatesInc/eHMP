::: page-description
Testing
=======
:::

## Unit Tests
[Jasmine](http://jasmine.github.io/) version 1.3.1 is the current unit testing framework. Unit tests are placed in the `/rdk/product/production/rdk/jasmine-tests` directory.

All unit test filenames must end with `-spec.js`.

As unit tests are not necessarily tied to individual resources, unit tests should be named by the most general thing they test.

The [Jasmine documentation](http://jasmine.github.io/1.3/introduction.html) describes well how to write Jasmine tests.

## Acceptance Tests

[Cucumber](https://cukes.info/) is the current acceptance testing framework.

Acceptance tests are found in the `/rdk/product/production/tests/acceptance-tests` directory.
