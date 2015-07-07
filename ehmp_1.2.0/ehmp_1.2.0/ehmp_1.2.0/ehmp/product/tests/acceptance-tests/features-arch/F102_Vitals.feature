@Vitals @future
Feature: F102 Access and Verify the vitals in the hmp system
# This feature file has UI test and the background UI rest request.  Since we don't want either to run in the jenkins pipeline
# I have marked the Feature as @future so the background step will also not be run

Background:
    Given a patient with pid "10108" has been synced through FHIR
    Given a patient with pid "9E7A;100022" has been synced through FHIR

@vitals_rest
Scenario: Client can request vitals
	Given a patient with "vitals" in multiple VistAs
	When the client requests vitals for the patient "10108"
	Then eHMP returns "166" VistA result(s)
	And the results contain data group
	  | field    | value                     |
      | typeName | BLOOD PRESSURE            |
      | uid      | urn:va:vital:9E7A:3:24038 |
      | result   | 80/30                     |
      | observed | 20131015095502            |
      | units    | mm[Hg]                    |
	And the results contain data group
      | field    | value                     |
      | typeName | PULSE                     |
      | uid      | urn:va:vital:9E7A:3:24023 |
      | result   | Pass                      |
      | observed | 201310060900              |
      | units    | /min                      |
	And the results contain data group
      | field    | value                     |
      | typeName | RESPIRATION               |
      | uid      | urn:va:vital:9E7A:3:24024 |
      | result   | Pass                      |
      | observed | 201310060900              |
      | units    | /min                      |
	And the results contain data group
      | field    | value                     |
      | typeName | TEMPERATURE               |
      | uid      | urn:va:vital:9E7A:3:24025 |
      | units    | F                         |
	And the results contain data group
      | field    | value                     |
      | typeName | PULSE OXIMETRY            |
      | uid      | urn:va:vital:9E7A:3:24026 |
      | units    | %                         |
	And the results contain data group
      | field    | value                     |
      | typeName | HEIGHT                    |
      | uid      | urn:va:vital:9E7A:3:24027 |
      | units    | in                        |
	And the results contain data group
      | field    | value                     |
      | typeName | PAIN                      |
      | uid      | urn:va:vital:9E7A:3:24028 |
	And the results contain data group
      | field    | value                     |
      | typeName | WEIGHT                    |
      | uid      | urn:va:vital:9E7A:3:24029 |
      | units    | lb                        |

	
@vitals_search @UI
Scenario: User can search for vitals in the eHMP UI
	Given user has successfully logged into HMP
	And a patient with vitals in multiple VistAs
    When user searches for "vital sign" for that patient
	Then search results displays "1" titles
	When user opens title "Vital Sign"
	Then search results displays "8" summaries
      | summary_title               | summary_date      |
      | BLOOD PRESSURE 80/30 mm[Hg] | 25-Nov-2013 09:57 |
      | PULSE Pass /min             | 25-Nov-2013 09:49 |
      | RESPIRATION Pass /min       | 25-Nov-2013 09:49 |
      | TEMPERATURE Pass F          | 25-Nov-2013 09:49 |
      | PULSE OXIMETRY Pass %       | 25-Nov-2013 09:49 |
      | HEIGHT Pass in              | 25-Nov-2013 09:49 |
      | PAIN Pass                   | 25-Nov-2013 09:49 |
      | WEIGHT Pass lb              | 25-Nov-2013 09:49 |

