@ProblemList @single
Feature: F116 Return and display of problem list records with VA and DoD data

Background:
  Given a patient with pid "5000000217V519385" has been synced through Admin API

@problem
Scenario: Client can request problem list
  Given a patient with problem list in multiple VistAs and in DoD
  When the client requests problem lists for the patient "5000000217V519385" in VPR format
  Then the client receives 0 VPR VistA result(s)
  Then the client receives 15 VPR DoD result(s)
  And the VPR results contain "problem"
    | field            | value                                                   |
    | uid              | urn:va:problem:DOD:0000000001:1000000062                |
    | facilityName     | DOD                                                     |
    | facilityCode     | DOD                                                     |
    | locationName     | NH Great Lakes IL                                       |
    | pid              | CONTAINS ;100716                                        |
    | acuityName       | Chronic                                                 |
    | entered          | 20131206161548                                          |
    | problemText      | ASTHMA EXERCISE-INDUCED                                 |
    | comments.comment | Testing AHLTA problem comments                          |
    | kind             | Problem                                                 |
