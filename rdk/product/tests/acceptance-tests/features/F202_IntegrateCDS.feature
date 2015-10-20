# Team Europa

Feature: F202 - Integrate Clinical Decision Support 

@F202-9_immunization @US8575 @F202-16
 Scenario: Client can request immunization in FHIR format
     Given a patient with "immunization" in multiple VistAs
     #And a patient with pid "10110V004877" has been synced through the RDK API
       When the client requests "immunization" for the patient "10110V004877"
     Then a successful response is returned
       And the results contain
       | name         | value     |
       | total        | 43        |
     And the results contain
        | field                                             | value                                 |
        | entry.resource.resourceType                       | Immunization                          |
        | entry.resource.text.status                        | generated                             |
        | entry.resource.text.div                           | <div>DT (PEDIATRIC)</div>             |
        | entry.resource.identifier.system                  | urn:oid:2.16.840.1.113883.6.233       |
        | entry.resource.identifier.value                   | urn:va:immunization:C877:8:966        |
        | entry.resource.date                               | 2014-05-16T09:47:57                   |
        | entry.resource.vaccineType.coding.code            | 28                                    |
        | entry.resource.vaccineType.coding.display         | diphtheria and tetanus toxoids, adsorbed for pediatric use |
        | entry.resource.vaccineType.coding.system          | urn:oid:2.16.840.1.113883.12.292      |
        | entry.resource.vaccineType.coding.code            | urn:cpt:90702                         |
        | entry.resource.vaccineType.coding.display         | DT VACCINE < 7 IM                     |
        | entry.resource.patient.reference                  | Patient/C877;8                        |
        | entry.resource.wasNotGiven                        | false                                 |
        | entry.resource.reported                           | false                                 |
        # ------------ CHECKING ORGANIZATION CONTAINED RESOURCE ----------------------
        | entry.resource.contained.resourceType             | Organization                          |
        | entry.resource.contained.identifier.system        | urn:oid:2.16.840.1.113883.6.233       |
        | entry.resource.contained.identifier.value         | 500                                   |
        | entry.resource.contained.name                     | CAMP BEE                              |
        | entry.resource.contained.text.status              | generated                             |
        | entry.resource.contained.text.div                 | <div>CAMP BEE</div>                   |
        # ------------ CHECKING PRACTIONTIONER CONTAINED RESOURCE ----------------------
        | entry.resource.contained.resourceType             | Practitioner                          |
        | entry.resource.contained.identifier.system        | http://vistacore.us/fhir/id/uid       |
        | entry.resource.contained.identifier.value         | urn:va:user:C877:1                    |
        | entry.resource.contained.name                     | PROGRAMMER,ONE                        |
        # ------------ CHECKING LOCATION CONTAINED RESOURCE ----------------------
        | entry.resource.contained.resourceType             | Location                              |
        | entry.resource.contained.identifier.system        | http://vistacore.us/fhir/id/uid       |
        | entry.resource.contained.identifier.value         | urn:va:location:C877:32               |
        | entry.resource.contained.name                     | PRIMARY CARE                          |
        | entry.resource.contained.text.status              | generated                             |
        | entry.resource.contained.text.div                 | <div>PRIMARY CARE</div>               |
        # ------------ CHECKING REACTION (as Observation) CONTAINED RESOURCE ----------------------
        | entry.resource.contained.resourceType             | Observation                           |
        | entry.resource.contained.code.coding.code         | urn:va:reaction:C877:8:2              |
        | entry.resource.contained.code.coding.display      | IRRITABILITY                          |
        | entry.resource.contained.status                   | final                                 |
        | entry.resource.contained.reliability              | unknown                               |
        | entry.resource.contained.valueString              | IRRITABILITY                          |
        | entry.resource.contained.text.status              | generated                             |
        | entry.resource.contained.text.div                 | <div>IRRITABILITY</div>               |
        # ------------ CHECKING ENCOUNTER CONTAINED RESOURCE ----------------------
        | entry.resource.contained.resourceType             | Encounter                             |
        | entry.resource.contained.text.div                 | <div>PRIMARY CARE May 16, 2014</div>  |
        | entry.resource.contained.text.status              | generated                             |
        | entry.resource.contained.status                   | finished                              |
        | entry.resource.contained.identifier.system        | http://vistacore.us/fhir/id/uid       |
        | entry.resource.contained.identifier.value         | urn:va:visit:C877:8:10577             | 
        # ------------ CHECKING ENCOUNTER CONTAINED RESOURCE ----------------------
        | entry.resource.extension.url                      | http://vistacore.us/fhir/extensions/immunization#contraindicated   |
        | entry.resource.extension.valueBoolean             | false                                 |
        | entry.resource.extension.url                      | http://vistacore.us/fhir/extensions/immunization#seriesCode        |
        | entry.resource.extension.valueString              | urn:va:series:C877:8:SERIES 1         |
        | entry.resource.extension.url                      | http://vistacore.us/fhir/extensions/immunization#seriesName        |
        | entry.resource.extension.valueString              | SERIES 1                              |
        | entry.resource.extension.url                      | http://vistacore.us/fhir/extensions/immunization#stampTime         |
        | entry.resource.extension.valueString              | 20140516094757                        |


@F202-9 @US7176_vitals @DE1444
Scenario: Observation can be requested in Fhir format
    Given a patient with "observation" in multiple VistAs
    #And a patient with pid "5000000217V519385" has been synced through the RDK API
    When the "observation" is requested for patient "5000000217V519385"
    Then a successful response is returned
    And the results contain
       | name         | value     |
       | total        | 1122      |
    And the FHIR results contain "vital results"
      | field 											| value 								|
     	| resource.resourceType 						| Observation 							|
     	| resource.text.status 						| generated 							|
     	| resource.text.div 							| <div>TEMPERATURE 92 F</div> 			|
     	| resource.contained.resourceType 			| Organization 							|
     	| resource.contained.identifier.system 		| urn:oid:2.16.840.1.113883.6.233 		|
     	| resource.contained.identifier.value 		| 500 									|
     	| resource.contained.name 					| CAMP BEE 								|
     	| resource.code.coding.system 				| urn:oid:2.16.840.1.113883.6.233 		|
     	| resource.code.coding.code 					| urn:va:vuid:4500638 					|
     	| resource.code.coding.display 				| TEMPERATURE 							|
     	| resource.code.coding.system 				| http://loinc.org 						|
     	| resource.code.coding.code 					| 8310-5 								|
     	| resource.code.coding.display 				| BODY TEMPERATURE 						|
     	| resource.valueQuantity.value				| 92 									|
     	| resource.valueQuantity.units 				| F 									|
     	| resource.appliesDateTime 					| 2013-12-15T13:01:00 					|
     	| resource.status 							| final 								|
     	| resource.reliability 						| unknown 								|
     	| resource.identifier.use 					| official 								|
     	| resource.identifier.system 					| http://vistacore.us/fhir/id/uid 		|
     	| resource.subject.reference 					| Patient/100716 						|
     	| resource.performer.display 					| CAMP BEE 								|
     	| resource.referenceRange.low.value 			| 95 									|
     	| resource.referenceRange.low.units 			| F 									|
     	| resource.referenceRange.high.value 			| 102 									|
     	| resource.referenceRange.high.units 			| F 									|
     	| resource.referenceRange.meaning.coding.system | http://snomed.info/id 				|
     	| resource.referenceRange.meaning.coding.code | 87273009 								|
     	| resource.referenceRange.meaning.coding.display | Normal Temperature 				|
    
@F202-9 @US7176_code
Scenario: Observation can be requested and filtered by vital code in Fhir format
    Given a patient with "observation" in multiple VistAs
    #And a patient with pid "9E7A;253" has been synced through the RDK API
    When the "observation" is requested with parameter "code" value "9279-1" for patient "9E7A;253" 
    Then a successful response is returned
    And the results contain
       | name         | value     |
       | total        | 26      |
    And the FHIR results contain "vital results"
       | resource.code.coding.system 				| http://loinc.org 						|
     	 | resource.code.coding.code 					| 9279-1 								|

@F202-9 @US7176_link
Scenario: Observation can be requested and filtered by system link in Fhir format
    Given a patient with "observation" in multiple VistAs
    #And a patient with pid "9E7A;253" has been synced through the RDK API
    When the "observation" is requested with parameter "code" value "http://loinc.org|9279-1" for patient "9E7A;253" 
    Then a successful response is returned
    And the results contain
       | name         | value     |
       | total        | 26      |
   And the FHIR results contain "vital results"
       | resource.code.coding.system 				| http://loinc.org 						|
     	 | resource.code.coding.code 					| 9279-1 								|
    
@F202-9 @US7176_count
Scenario: Observation can be requested and limited by count in Fhir format
    Given a patient with "observation" in multiple VistAs
    #And a patient with pid "9E7A;253" has been synced through the RDK API
    When the "observation" is requested with parameter "_count" value "5" for patient "9E7A;253" 
    Then a successful response is returned
    And total returned resources are "5"
    And the results contain
       | name         | value     |
       | total        | 289      |
    
@F202-9 @US7176_date @DE1459
Scenario: Observation can be requested and filtered by date in Fhir format
    Given a patient with "observation" in multiple VistAs
    #And a patient with pid "9E7A;253" has been synced through the RDK API
    When the "observation" is requested with parameter "date" value "2004-03-30" for patient "9E7A;253" 
    Then a successful response is returned
    And the results contain
       | name         | value     |
       | total        | 14      |
   And the FHIR results contain "vital results"
       | resource.appliesDateTime 				| 2004-03-30T21:31:00	|
       
@F202-9 @US7176_datetime @DE1459
Scenario: Observation can be requested and filtered by full datetime in Fhir format
    Given a patient with "observation" in multiple VistAs
    #And a patient with pid "9E7A;253" has been synced through the RDK API
    When the "observation" is requested with parameter "date" value "2004-03-30T21:31:00" for patient "9E7A;253" 
    Then a successful response is returned
    And the results contain
       | name         | value     |
       | total        | 14      |
   And the FHIR results contain "vital results"
       | resource.appliesDateTime 				| 2004-03-30T21:31:00	|
       
@F202-9 @US7176_date_yyyymm @DE1459
Scenario: Observation can be requested and filtered by partial date (yyyy-mm) in Fhir format
    Given a patient with "observation" in multiple VistAs
    #And a patient with pid "9E7A;253" has been synced through the RDK API
    When the "observation" is requested with parameter "date" value "2004-03" for patient "9E7A;253" 
    Then a successful response is returned
    And the results contain
       | name         | value     |
       | total        | 14      |
   And the FHIR results contain "vital results"
       | resource.appliesDateTime 				| 2004-03-30T21:31:00	|
       
@F202-9 @US7176_date_yyyy @DE1459
Scenario: Observation can be requested and filtered by partial date (yyyy)in Fhir format
    Given a patient with "observation" in multiple VistAs
    #And a patient with pid "9E7A;253" has been synced through the RDK API
    When the "observation" is requested with parameter "date" value "2005" for patient "9E7A;253" 
    Then a successful response is returned
    And the results contain
       | name         | value     |
       | total        | 34      |
   And the FHIR results contain "vital results"
       | resource.appliesDateTime 				| 2005-03-15T11:30:00	|
       | resource.appliesDateTime 				| 2005-03-16T06:00:00	|

@F202-9 @US7176_datewithcode
Scenario: Observation can be requested and filtered by date and code in Fhir format
    Given a patient with "observation" in multiple VistAs
    #And a patient with pid "9E7A;253" has been synced through the RDK API
    When the "observation" is requested with parameter "date" value ">2004-03-30&code=8310-5" for patient "9E7A;253" 
    Then a successful response is returned
    And the results contain
       | name         | value     |
       | total        | 30     |

@DE1457_multiplecodes
Scenario: Observation can be requested and filtered by code in Fhir format
    Given a patient with "observation" in multiple VistAs
    #And a patient with pid "9E7A;253" has been synced through the RDK API
    When the "observation" is requested with parameter "code" value "29463-7,9279-1,8310-5" for patient "9E7A;253" 
    Then a successful response is returned
    And the results contain
       | name         | value     |
       | total        | 104     |
    And the FHIR results contain "vital results"
      | resource.code.coding.system 				| http://loinc.org 				|
      | resource.code.coding.code 					| 29463-7 								|
    And the FHIR results contain "vital results"  
      | resource.code.coding.system 				| http://loinc.org 				|
     	| resource.code.coding.code 					| 9279-1 								  |
    And the FHIR results contain "vital results"  
      | resource.code.coding.system 				| http://loinc.org 				|
     	| resource.code.coding.code 					| 8310-5 								  |

@DE1457_multiplecodeslinks
Scenario: Observation can be requested and filtered by multiple codes and systems in Fhir format
    Given a patient with "observation" in multiple VistAs
    #And a patient with pid "9E7A;253" has been synced through the RDK API
    When the "observation" is requested with parameter "code" value "http://loinc.org|9279-1,http://loinc.org|8310-5" for patient "9E7A;253" 
    Then a successful response is returned
    And the results contain
       | name         | value     |
       | total        | 68     |
    And the FHIR results contain "vital results"
      | resource.code.coding.system 				| http://loinc.org 			|
     	| resource.code.coding.code 					| 9279-1 								|
    And the FHIR results contain "vital results"
      | resource.code.coding.system 				| http://loinc.org 			|
     	| resource.code.coding.code 					| 8310-5 								|

@F202-9 @US7176_all
Scenario: Observation can be requested and filtered by date,code and count in Fhir format
    Given a patient with "observation" in multiple VistAs
    #And a patient with pid "9E7A;253" has been synced through the RDK API
    When the "observation" is requested with all parameters for patient "9E7A;253"
    Then a successful response is returned
    And the results contain
       | name         | value     |
       | total        | 2     |
       
@DE1458_notdatetime
Scenario: Observation can be requested and filtered by date in Fhir format (!datetime)
    Given a patient with "observation" in multiple VistAs
    #And a patient with pid "9E7A;253" has been synced through the RDK API
    When the "observation" is requested with parameter "date" value "!=2004-03-30T21:31:00" for patient "9E7A;253" 
    Then a successful response is returned
    And the results contain
       | name         | value     |
       | total        | 275      |
   And the FHIR results contain "vital results"
       | resource.appliesDateTime 	| 2005-03-15T11:30:00	|
   And the FHIR results contain "vital results"
       | resource.appliesDateTime 	| 2005-03-16T06:00:00	|
   And the FHIR results contain "vital results"
       | resource.appliesDateTime   | 2005-03-16T10:00:00 |
   And the FHIR results contain "vital results"
       | resource.appliesDateTime   | 2007-03-15T08:00:00 |
   And the FHIR results contain "vital results"
       | resource.appliesDateTime   | 2007-04-11T07:45:00 |
   And the FHIR results contain "vital results"
       | resource.appliesDateTime   | 2007-04-24T08:00:00 | 
   And the FHIR results contain "vital results"     
       | resource.appliesDateTime   | 2007-11-28T08:00:00 |

@DE1458_notdate
Scenario: Observation can be requested and filtered by date in Fhir format (!date)
    Given a patient with "observation" in multiple VistAs
    #And a patient with pid "9E7A;253" has been synced through the RDK API
    When the "observation" is requested with parameter "date" value "!=2004-03-30" for patient "9E7A;253" 
    Then a successful response is returned
    And the results contain
       | name         | value     |
       | total        | 275     |
   And the FHIR results contain "vital results"
       | resource.appliesDateTime 				| 2005-03-15T11:30:00	|
   And the FHIR results contain "vital results"     
       | resource.appliesDateTime 				| 2005-03-16T06:00:00	|

@DE1458_notdateyyyymm
Scenario: Observation can be requested and filtered by date in Fhir format (!dateyyyymm)
    Given a patient with "observation" in multiple VistAs
    #And a patient with pid "9E7A;253" has been synced through the RDK API
    When the "observation" is requested with parameter "date" value "!=2004-03" for patient "9E7A;253" 
    Then a successful response is returned
    And the results contain
       | name         | value   |
       | total        | 275     |
   And the FHIR results contain "vital results"
       | resource.appliesDateTime 				| 2005-03-15T11:30:00	|
   And the FHIR results contain "vital results"     
       | resource.appliesDateTime 				| 2005-03-16T06:00:00	|

@DE1458_notdateyyyy
Scenario: Observation can be requested and filtered by date in Fhir format (!dateyyyy)
    Given a patient with "observation" in multiple VistAs
    #And a patient with pid "9E7A;253" has been synced through the RDK API
    When the "observation" is requested with parameter "date" value "!=2004" for patient "9E7A;253" 
    Then a successful response is returned
    And the results contain
       | name         | value     |
       | total        | 275      |
   And the FHIR results contain "vital results"
       | resource.appliesDateTime 				| 2005-03-15T11:30:00	|
   And the FHIR results contain "vital results"     
       | resource.appliesDateTime 				| 2005-03-16T06:00:00	|
  
@DE1458_greaterdatetime
Scenario: Observation can be requested and filtered by date in Fhir format (>datetime)
    Given a patient with "observation" in multiple VistAs
    #And a patient with pid "9E7A;253" has been synced through the RDK API
    When the "observation" is requested with parameter "date" value ">2004-03-30T21:31:00" for patient "9E7A;253" 
    Then a successful response is returned
    And the results contain
       | name         | value     |
       | total        | 214      |
   And the FHIR results contain "vital results"
       | resource.appliesDateTime 	| 2005-03-15T11:30:00	|
   And the FHIR results contain "vital results"
       | resource.appliesDateTime 	| 2005-03-16T06:00:00	|
   And the FHIR results contain "vital results"     
       | resource.appliesDateTime   | 2005-03-16T10:00:00 |
   And the FHIR results contain "vital results"     
       | resource.appliesDateTime   | 2007-03-15T08:00:00 |
   And the FHIR results contain "vital results"     
       | resource.appliesDateTime   | 2007-04-11T07:45:00 |
   And the FHIR results contain "vital results"     
       | resource.appliesDateTime   | 2007-04-24T08:00:00 | 
   And the FHIR results contain "vital results"
       | resource.appliesDateTime   | 2007-11-28T08:00:00 |
       
@DE1458_greaterdate
Scenario: Observation can be requested and filtered by date in Fhir format (>date)
    Given a patient with "observation" in multiple VistAs
    #And a patient with pid "9E7A;253" has been synced through the RDK API
    When the "observation" is requested with parameter "date" value ">2005-03-30" for patient "9E7A;253" 
    Then a successful response is returned
    And the results contain
       | name         | value     |
       | total        | 180       |
   And the FHIR results contain "vital results"
       | resource.appliesDateTime   | 2007-03-15T08:00:00 |
   And the FHIR results contain "vital results"     
       | resource.appliesDateTime   | 2007-04-11T07:45:00 |
   And the FHIR results contain "vital results"     
       | resource.appliesDateTime   | 2007-04-24T08:00:00 | 
   And the FHIR results contain "vital results"     
       | resource.appliesDateTime   | 2007-11-28T08:00:00 |

@DE1458_greaterdateyyyymm
Scenario: Observation can be requested and filtered by date in Fhir format (>dateyyyymm)
    Given a patient with "observation" in multiple VistAs
    #And a patient with pid "9E7A;253" has been synced through the RDK API
    When the "observation" is requested with parameter "date" value ">2000-03" for patient "9E7A;253" 
    Then a successful response is returned
    And the results contain
       | name         | value     |
       | total        | 288      |
   
@DE1458_greaterdateyyyy
Scenario: Observation can be requested and filtered by date in Fhir format (>dateyyyy)
    Given a patient with "observation" in multiple VistAs
    #And a patient with pid "9E7A;253" has been synced through the RDK API
    When the "observation" is requested with parameter "date" value ">2007" for patient "9E7A;253" 
    Then a successful response is returned
    And the results contain
       | name         | value     |
       | total        | 134      |
     
@DE1458_greaterequaldatetime
Scenario: Observation can be requested and filtered by date in Fhir format (>=datetime)
    Given a patient with "observation" in multiple VistAs
    #And a patient with pid "9E7A;253" has been synced through the RDK API
    When the "observation" is requested with parameter "date" value ">=2004-03-30T21:31:00" for patient "9E7A;253" 
    Then a successful response is returned
    And the results contain
       | name         | value     |
       | total        | 228       | 

@DE1458_greaterequaldate
Scenario: Observation can be requested and filtered by date in Fhir format (>=date)
    Given a patient with "observation" in multiple VistAs
    #And a patient with pid "9E7A;253" has been synced through the RDK API
    When the "observation" is requested with parameter "date" value ">=2007-04-11" for patient "9E7A;253" 
    Then a successful response is returned
    And the results contain
       | name         | value     |
       | total        | 174       | 

@DE1458_greaterequaldateyyyymm
Scenario: Observation can be requested and filtered by date in Fhir format (>=dateyyyymm)
    Given a patient with "observation" in multiple VistAs
    #And a patient with pid "9E7A;253" has been synced through the RDK API
    When the "observation" is requested with parameter "date" value ">=2008-04" for patient "9E7A;253" 
    Then a successful response is returned
    And the results contain
       | name         | value     |
       | total        | 124      |
   
@DE1458_greaterequaldateyyyy
Scenario: Observation can be requested and filtered by date in Fhir format (>=dateyyyy)
    Given a patient with "observation" in multiple VistAs
    #And a patient with pid "9E7A;253" has been synced through the RDK API
    When the "observation" is requested with parameter "date" value ">=2004" for patient "9E7A;253" 
    Then a successful response is returned
    And the results contain
       | name         | value     |
       | total        | 228      |
   
@DE1458_lessdatetime
Scenario: Observation can be requested and filtered by date in Fhir format (<datetime)
    Given a patient with "observation" in multiple VistAs
    #And a patient with pid "9E7A;253" has been synced through the RDK API
    When the "observation" is requested with parameter "date" value "<2004-03-30T01:26:59" for patient "9E7A;253" 
    Then a successful response is returned
    And the results contain
       | name         | value     |
       | total        | 61      | 

@DE1458_lessdate
Scenario: Observation can be requested and filtered by date in Fhir format (<date)
    Given a patient with "observation" in multiple VistAs
    #And a patient with pid "9E7A;253" has been synced through the RDK API
    When the "observation" is requested with parameter "date" value "<2005-03-30" for patient "9E7A;253" 
    Then a successful response is returned
    And the results contain
       | name         | value     |
       | total        | 109      |
  
@DE1458_lessdateyyyymm
Scenario: Observation can be requested and filtered by date in Fhir format (<dateyyyymm)
    Given a patient with "observation" in multiple VistAs
    #And a patient with pid "9E7A;253" has been synced through the RDK API
    When the "observation" is requested with parameter "date" value "<2005-03" for patient "9E7A;253" 
    Then a successful response is returned
    And the results contain
       | name         | value     |
       | total        | 75      |

@DE1458_lessdateyyyy
Scenario: Observation can be requested and filtered by date in Fhir format (<dateyyyy)
    Given a patient with "observation" in multiple VistAs
    #And a patient with pid "9E7A;253" has been synced through the RDK API
    When the "observation" is requested with parameter "date" value "<2006" for patient "9E7A;253" 
    Then a successful response is returned
    And the results contain
       | name         | value     |
       | total        | 109      |
          
@DE1458_lessequaldatetime
Scenario: Observation can be requested and filtered by date in Fhir format (<=datetime)
    Given a patient with "observation" in multiple VistAs
    #And a patient with pid "9E7A;253" has been synced through the RDK API
    When the "observation" is requested with parameter "date" value "<=2003-04-05T15:15:00" for patient "9E7A;253" 
    Then a successful response is returned
    And the results contain
       | name         | value     |
       | total        | 49      |
   
@DE1458_lessequaldate
Scenario: Observation can be requested and filtered by date in Fhir format (<=date)
    Given a patient with "observation" in multiple VistAs
    #And a patient with pid "9E7A;253" has been synced through the RDK API
    When the "observation" is requested with parameter "date" value "<=2003-04-05" for patient "9E7A;253" 
    Then a successful response is returned
    And the results contain
       | name         | value     |
       | total        | 49      |
         
@DE1458_lessequaldateyyyymm
Scenario: Observation can be requested and filtered by date in Fhir format (<=dateyyyymm)
    Given a patient with "observation" in multiple VistAs
    #And a patient with pid "9E7A;253" has been synced through the RDK API
    When the "observation" is requested with parameter "date" value "<=2003-04" for patient "9E7A;253" 
    Then a successful response is returned
    And the results contain
       | name         | value     |
       | total        | 61      |
   
@DE1458_lessequaldateyyyy
Scenario: Observation can be requested and filtered by date in Fhir format (<=dateyyyy)
    Given a patient with "observation" in multiple VistAs
    #And a patient with pid "9E7A;253" has been synced through the RDK API
    When the "observation" is requested with parameter "date" value "<=2004" for patient "9E7A;253" 
    Then a successful response is returned
    And the results contain
       | name         | value     |
       | total        | 75      |
   
@DE1458_daterange1
Scenario: Observation can be requested and filtered by date range in Fhir format - 1
    Given a patient with "observation" in multiple VistAs
    #And a patient with pid "9E7A;253" has been synced through the RDK API
    When the "observation" is requested with parameter "date" value ">2004-03-30T12:30:00&date=<2004-03-30T22:50:00" for patient "9E7A;253" 
    Then a successful response is returned
    And the results contain
       | name         | value     |
       | total        | 14      |

@DE1458_daterange2
Scenario: Observation can be requested and filtered by date range in Fhir format - 2
    Given a patient with "observation" in multiple VistAs
    #And a patient with pid "9E7A;253" has been synced through the RDK API
    When the "observation" is requested with parameter "date" value ">2004-03-29&date=<2004-03-30T22:50:00" for patient "9E7A;253" 
    Then a successful response is returned
    And the results contain
       | name         | value     |
       | total        | 14      |
   
@DE1458_daterange3
Scenario: Observation can be requested and filtered by date range in Fhir format - 3
    Given a patient with "observation" in multiple VistAs
    #And a patient with pid "9E7A;253" has been synced through the RDK API
    When the "observation" is requested with parameter "date" value ">2004-03-29&date=<2004-03-31" for patient "9E7A;253" 
    Then a successful response is returned
    And the results contain
       | name         | value     |
       | total        | 14      |
   
@DE1458_daterange4
Scenario: Observation can be requested and filtered by date range in Fhir format - 4
    Given a patient with "observation" in multiple VistAs
    #And a patient with pid "9E7A;253" has been synced through the RDK API
    When the "observation" is requested with parameter "date" value ">=2004-03-30&date=<2004-03-31" for patient "9E7A;253" 
    Then a successful response is returned
    And the results contain
       | name         | value     |
       | total        | 14      |
          
@DE1458_daterange5
Scenario: Observation can be requested and filtered by date range in Fhir format - 5
    Given a patient with "observation" in multiple VistAs
    #And a patient with pid "9E7A;253" has been synced through the RDK API
    When the "observation" is requested with parameter "date" value ">=2004-03-30&date=<=2004-03-30" for patient "9E7A;253" 
    Then a successful response is returned
    And the results contain
       | name         | value     |
       | total        | 14      |
         
@DE1458_date_invalid1
Scenario: Client receives 400 code for an invalid request - 1
    Given a patient with "observation" in multiple VistAs
    #And a patient with pid "9E7A;253" has been synced through the RDK API
    When the "observation" is requested with parameter "date" value ">!=2004-03-30" for patient "9E7A;253" 
    Then a bad request response is returned

@DE1458_date_invalid2
Scenario: Client receives 400 code for an invalid request - 2
    Given a patient with "observation" in multiple VistAs
    #And a patient with pid "9E7A;253" has been synced through the RDK API
    When the "observation" is requested with parameter "date" value ">2005=-03-30" for patient "9E7A;253" 
    Then a bad request response is returned
    