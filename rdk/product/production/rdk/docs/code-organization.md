::: page-description
Code Organization
=================
:::

::: callout
This document shows planned changes and does not reflect the current state of the code organization
:::

 * All file names and directory names must be spelled-out, lowercase words, separated by dashes
 * Having a flat file is preferable to having a directory with one file
    * A file and its name should be describable as one concept. Once a file performs multiple concepts, break it to multiple files inside a new directory.
 * Before writing any new code, check to see if what you want already exists.
 * Do not end filenames with '-util.js'
    * It's obvious that a file is a utility file
    * Generic utility files are subject to scope creep
 * Files which contain the getResourceConfig function should end in `-resource.js`
 * All unit test files and integration test files should be placed directly next to the file they test.
 * Unit test filenames should be the same as the file they test, with `-spec` appended before `.js`.
    * For example, the file which unit tests `notes-validator.js` should be named `notes-validator-spec.js`.
 * Integration test filenames should have `-itest-spec.js` appended before `.js`.


## Directory overview
```
/product/production/rdk/                environment configuration ONLY
/product/production/rdk/bin/            server executables ONLY
/product/production/rdk/node_modules/   external dependencies ONLY
/product/production/rdk/docs/           general documentation ONLY
/product/production/rdk/config/         application-wide configuration ONLY
/product/production/rdk/test-helpers/   global test helpers ONLY
/product/production/rdk/src/            fetch source code ONLY
/product/production/rdk/src/write/      writeback source code ONLY
```


## File and directory detail
```
/product/production/rdk/
  .jshintrc                 code style check configuration
  package.json              dependency declaration and meta info
  README.md                 quick intro
  gulpfile.js               task configuration


/product/production/rdk/bin/
  rdk-fetch-server.js       the main vx-api fetch server
  rdk-pick-list-server.js   the main vx-api pick-list server
  rdk-write-server.js       the main vx-api writeback server


/product/production/rdk/node_modules/
Do not add files to this directory manually
This directory is created by running `npm install`


/product/production/rdk/docs/
  index.md                  the entry point for general documentation
  code-organization.md      this file


/product/production/rdk/config/
Everything here is automatically generated and overwritten upon deployment
  rdk-fetch-server-config.json      fetch server configuration
  rdk-pick-list-server-config.json  pick-list server configuration
  rdk-write-server-config.json      writeback server configuration


/product/production/rdk/test-helpers/
  mocha-helper.js           provides sinon and must globals to test files
  sinon-helper.js           creates a sinon sandbox for each test
  environment-helper.js     sets environment variables for integration tests


/product/production/rdk/src/
  core/                     framework code
  utils/                    generally useful functions
  subsystems/               provide interfaces to external systems
  interceptors/             incoming middleware
  outerceptors/             outgoing middleware
  resources/                resource code
  fhir/                     fhir resources


/product/production/rdk/src/write/
See the writeback documentation for more detail
  core/                     writeback framework code
  pick-list/                pick-list code
  (domain)/                 writeback code for that domain
```

<br />
---
Next: [Resources](resources.md)
