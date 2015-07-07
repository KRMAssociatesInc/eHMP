@ProblemsDoD @debug 
Feature: F116 Access and Verify the patient problems in the hmp system with DoD data
#A feature file called ProblemListDoD.feature has been created for this feature

  Background:
    Given a patient with pid "10108" has been synced through FHIR

  @problems_rest
  Scenario: Client can request problems
    Given a patient with "problems" in multiple VistAs and in DoD
    When the client requests problems for the patient "10108"
    Then eHMP returns "22" result(s)
    And the results contain data group
      | field               | value                                                      |
      | statusDisplayName   | Active                                                     |
      | summary             | Diabetes Mellitus Type II or unspecified (ICD-9-CM 250.00) |
      | uid                 | urn:va:problem:9E7A:3:183                                  |
      | providerUid         | urn:va:user:9E7A:20010                                     |
      | unverified          | false                                                      |
      | statusName          | ACTIVE                                                     |
      | onset               | 19980502                                                   |
      | entered             | 20000508                                                   |
      | problemText         | Diabetes Mellitus Type II or unspecified (ICD-9-CM 250.00) |
      | localId             | 183                                                        |
      | locationDisplayName | Primary Care                                               |
      | locationName        | PRIMARY CARE                                               |
      | icdName             | DIABETES MELLI W/O COMP TYP II                             |
      | kind                | Problem                                                    |
      | statusCode          | urn:sct:55561003                                           |
      | locationUid         | urn:va:location:9E7A:32                                    |
      | acuityCode          | urn:va:prob-acuity:c                                       |
      | facility            | CAMP MASTER                                                |
      | updated             | 20040330                                                   |
      | icdCode             | urn:icd:250.00                                             |
      | facilityCode        | 500                                                        |
      | serviceConnected    | false                                                      |
      | acuityName          | chronic                                                    |
      | pid                 | 10108                                                      |
      | icdGroup            | 250                                                        |
      | providerName        | VEHU,EIGHT                                                 |
      | removed             | false                                                      |
      | providerDisplayName | Vehu,Eight                                                 |
    And the results contain data group
      | field               | value                                                      |
      | statusDisplayName   | Active                                                     |
      | summary             | NULL                                                       |
      | uid                 | urn:va:problem:DOD:0000000003:1000000526                   |
      | statusName          | Active                                                     |
      | onset               | 18991230                                                   |
      | entered             | 20131119                                                   |
      | problemText         | NULL                                                       |
      | locationDisplayName | Nh Great Lakes Il                                          |
      | locationName        | NH Great Lakes IL                                          |
      | kind                | Problem                                                    |
      | updated             | 20131119                                                   |
      | facilityCode        | DOD                                                        |
      | facility            | NH Great Lakes IL                                          |
      | serviceConnected    | false                                                      |
      | acuityName          | Chronic                                                    |
      | pid                 | 10108                                                      |