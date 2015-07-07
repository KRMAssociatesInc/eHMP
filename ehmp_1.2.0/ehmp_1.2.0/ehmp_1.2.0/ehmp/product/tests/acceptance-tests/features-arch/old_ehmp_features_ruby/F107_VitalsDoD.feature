@VitalsDoD @single
Feature: F107 Return and Display of Vitals with DoD data

    
@VitalsDoD_FHIR
Scenario: Client can request DoD vitals in FHIR format
	Given a patient with "vitals" in multiple VistAs and in DoD
  Given a patient with pid "5000000116V912836" has been synced through Admin API
	When the client requests vitals for the patient "5000000116V912836" in FHIR format
	Then a successful response is returned
	And the client receives 18 FHIR DoD result(s)
	And the client receives 9 FHIR VistA result(s)
	And the FHIR results contain vitals
      | vitals_field_list           | dod_vitals_values               |
      | content.text.div            | <div>TEMPERATURE 100 F</div>    |
      | content.text.status         | generated                       |
      | content.name.coding.system  | DOD_NCID                        |
      | content.name.coding.code    | 2154                            |
      | content.appliesDateTime     | 2013-12-12T21:07:43             |
      | content.status              | final                           |
      | content.reliability         | unknown                         |
      | content.identifier.use      | official                        |
      | content.identifier.value    | IS_SET                          |
      | content.identifier.label    | uid                             |
      | content.identifier.system   | http://vistacore.us/fhir/id/uid |
      | content.subject.reference   | Patient/0000000002              |
      | content.valueQuantity.value | 100                             |
      | content.valueQuantity.units | F                               |
  #| content.referenceRange.low.value              | 95                              |
  #| content.referenceRange.low.units              | F                               |
  #| content.referenceRange.high.value             | 102                             |
  #| content.referenceRange.high.units             | F                               |
  #| content.name.coding.display                   |                      |
  #| content.issued                                | IS_FORMATTED_DATE               |
  #| content.referenceRange.meaning.coding.system  | http://snomed.info/id           |
  #| content.referenceRange.meaning.coding.code    | 87273009                        |
  #| content.referenceRange.meaning.coding.display | Normal Temperature              |
      

  @VitalsDoD_jds @US977
Scenario: Client can request DoD vitals in VPR format
    Given a patient with "vitals" in multiple VistAs and in DoD
    Given a patient with pid "5000000116V912836" has been synced through Admin API
    When the client requests vitals for the patient "5000000116V912836" in VPR format
    Then the VPR results contain
    #And the jds results contain results
      | field             | panorama_value                 |
      | summary           | BLOOD PRESSURE 110/71 mm[Hg]   |
      # | uid               | urn:va:vital:9E7A:100615:24047 |
      | pid               | CONTAINS ;100615               |
      | facilityCode      | 500                            |
      | facilityName      | CAMP MASTER                    |
      | observed          | 201312081101                   |
      | typeName          | BLOOD PRESSURE                 |
      | result            | 110/71                         |
      | units             | mm[Hg]                         |
   And the VPR results contain
      | field             | panorama_value                 |
      | summary           | TEMPERATURE 100.1 F            |
      # | uid               | urn:va:vital:9E7A:100615:24048 |
      | pid               | CONTAINS ;100615               |
      | facilityCode      | 500                            |
      | facilityName      | CAMP MASTER                    |
      | observed          | 201312081101                   |
      | typeName          | TEMPERATURE                    |
      | result            | 100.1                          |
      | units             | F                              |
   And the VPR results contain
      | field             | panorama_value                 |
      | summary           | TEMPERATURE 100 F              |
      | uid               | urn:va:vital:DOD:0000000002:1000000298 |
      | pid               | CONTAINS ;100615               |
      | facilityCode      | DOD                            |
      | facilityName      | DOD                            |
      | observed          | 20131212210743                 |
      | typeName          | TEMPERATURE                    |
      | result            | 100                            |
      | units             | F                              |
    And the VPR results contain
      | field             | panorama_value                 |
      | summary           | BLOOD PRESSURE 110/40 mmHg     |
      | uid               | urn:va:vital:DOD:0000000002:1000000315 |
      | pid               | CONTAINS ;100615               |
      | facilityCode      | DOD                            |
      | facilityName      | DOD                            |
      | observed          | 20131118150416                 |
      | typeName          | BLOOD PRESSURE                 |
      | result            | 110/40                         |
      | units             | mmHg                           |

