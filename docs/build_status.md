Overview
========
This is where I will be documenting my progress and problems on EHMP.

MockServices
============
Current issues:

1) Build failure
When running 'Gradle Build' I receive the following error:

```
10 errors
:compileJava FAILED

FAILURE: Build failed with an exception.
```
This could be something I am doing wrong; however, I wanted to share regardless.

The error appears to originate around line 70 of MockCDSResource.java:
```
catch (IOException | IllegalArgumentException e) {
```
