@Problems @future
Feature: F102 Access and Verify the patient problems in the hmp system
# This feature file has UI test and the background UI rest request.  Since we don't want either to run in the jenkins pipeline
# I have marked the Feature as @future so the background step will also not be run

Background:
	Given a patient with pid "10108" has been synced through FHIR
   
@problems_rest
Scenario: Client can request problems
	Given a patient with "problems" in multiple VistAs
	When the client requests problems for the patient "10108"
	Then eHMP returns "5" result(s)
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
		
		
		
@problems_search @UI
Scenario: User can search for problems in the eHMP UI
	Given user has successfully logged into HMP
	And a patient with problems in multiple VistAs
    When user searches for "problem" for that patient
	Then search results displays "1" titles
	When user opens title "Problem"
	Then search results displays "5" summaries
      | summary_title                                                                                        | summary_date |
      | Active (chronic): Hypertension (ICD-9-CM 401.9)                                                      | 10-Apr-2007  |
      | Active (chronic): Hyperlipidemia (ICD-9-CM 272.4)                                                    | 10-Apr-2007  |
      | Active: Acute myocardial infarction, unspecified site, episode of care unspecified (ICD-9-CM 410.90) | 17-Mar-2005  |
      | Active (chronic): Chronic Systolic Heart failure (ICD-9-CM 428.22)                                   | 09-Mar-2004  |
      | Active (chronic): Diabetes Mellitus Type II or unspecified (ICD-9-CM 250.00)                         | 08-May-2000  |
