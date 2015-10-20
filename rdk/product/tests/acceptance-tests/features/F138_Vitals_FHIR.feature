 @debug @vitals_fhir @fhir @vxsync @patient

 Feature: F138 - Return of Vitals in FHIR format


 #This feature item returns Vitals in FHIR format. Also includes cases where no Vitals exist.


 @F138_1_vitals_fhir @fhir @5000000341V359724
 Scenario: Client can request vital results in FHIR format
 	Given a patient with "vitals" in multiple VistAs
   #  And a patient with pid "5000000341V359724" has been synced through the RDK API
 	When the client requests vitals for the patient "5000000341V359724" in FHIR format
 	Then a successful response is returned
 	And the FHIR results contain "vital results"
 	| field									| panorama_value						|
 	| resource.contained.resourceType	| Organization							|
 #	| resource.identifier.value				| urn:va:vital:9E7A:100022:24039		|
 	| resource.identifier.value				| CONTAINS urn:va:vital:9E7A:100022		|
 	| resource.contained.identifier.value	| 998									|
 	| resource.contained.name				| ABILENE (CAA)							|
 # Not available for this patient.
 	| resource.extention.valueCoding.system	| IS_NOT_SET							|
 	| resource.extention.valueCoding.code	| IS_NOT_SET							|
 	| resource.extention.valueCoding.display	| IS_NOT_SET							|
 	| resource.text.status					| generated								|
 	| resource.text.div						| <div>10-Dec 2013 14:32 : Systolic blood pressure 120 mm[Hg]</div>	|
 	| resource.code.coding.system			| http://loinc.org						|
 	| resource.code.coding.code				| 8480-6								|
 	| resource.code.coding.display			| Systolic blood pressure				|
 	| resource.valueQuantity.value			| 120									|
     | resource.valueQuantity.units           | mm[Hg]                               	|
 	| resource.appliesDateTime				| 2013-12-10T14:32:00					|
 #	| resource.issued						| 20140519214212						|
 	| resource.status						| final         						|
 	| resource.reliability					| unknown								|
 	| resource.bodysite.coding.system		| IS_NOT_SET							|
 	| resource.bodysite.coding.code			| IS_NOT_SET							|
 	| resource.bodysite.coding.display		| IS_NOT_SET							|
 	| resource.method.coding.system			| IS_NOT_SET							|
 	| resource.method.coding.code			| IS_NOT_SET							|
 	| resource.method.coding.display			| IS_NOT_SET							|
 	| resource.identifier.use				| official								|
 	| resource.identifier.system				| http://vistacore.us/fhir/id/uid		|
 	| resource.subject.reference				| Patient/100022						|
 #	| resource.referenceRange.meaning.coding.system	| "http://snomed.info/id"		|
 	| resource.referenceRange.low.value		| 100/60								|
 	| resource.referenceRange.low.units		| mm[Hg]								|
 	| resource.referenceRange.high.value		| 210/110								|
 	| resource.referenceRange.high.units		| mm[Hg]								|

 	And the FHIR results contain "vital results"

 	| field									| panorama_value						|
 	| resource.text.div						| <div>10-Dec 2013 14:32 : Diastolic blood pressure 75 mm[Hg]</div>	|
 	| resource.code.coding.code				| 8462-4								|
 	| resource.code.coding.display			| Diastolic blood pressure				|
 	| resource.valueQuantity.value			| 75									|
     | resource.valueQuantity.units           | mm[Hg]                               	|

 	And the FHIR results contain "vital results"
 	| field									| panorama_value						|
 	| resource.identifier.value				| CONTAINS urn:va:vital:9E7A:100022		|
 	| resource.text.div						| CONTAINS TEMPERATURE 98.6 F			|
 	| resource.code.coding.display			| TEMPERATURE							|
 	| resource.valueQuantity.value			| 98.6									|
     | resource.valueQuantity.units           | F		                               	|
 	| resource.referenceRange.low.value		| 95									|
 	| resource.referenceRange.low.units		| F										|
 	| resource.referenceRange.high.value		| 102									|
 	| resource.referenceRange.high.units		| F										|

 	And the FHIR results contain "vital results"
 	| field									| panorama_value						|
 	| resource.identifier.value				| CONTAINS urn:va:vital:9E7A:100022		|
 	| resource.text.div						| CONTAINS RESPIRATION 22 /min			|
 	| resource.code.coding.display			| RESPIRATION							|
 	| resource.valueQuantity.value			| 22									|
     | resource.valueQuantity.units           | /min		                           	|
 	| resource.referenceRange.low.value		| 8										|
 	| resource.referenceRange.low.units		| /min									|
 	| resource.referenceRange.high.value		| 30									|
 	| resource.referenceRange.high.units		| /min									|

 	And the FHIR results contain "vital results"
 	| field									| panorama_value						|
 	| resource.identifier.value				| CONTAINS urn:va:vital:9E7A:100022		|
 	| resource.text.div						| CONTAINS PULSE 70 /min				|
 	| resource.code.coding.display			| PULSE									|
 	| resource.valueQuantity.value			| 70									|
     | resource.valueQuantity.units           | /min		                           	|
 	| resource.referenceRange.low.value		| 60									|
 	| resource.referenceRange.low.units		| /min									|
 	| resource.referenceRange.high.value		| 120									|
 	| resource.referenceRange.high.units		| /min									|

 	And the FHIR results contain "vital results"
 	| field									| panorama_value						|
 	| resource.identifier.value				| CONTAINS urn:va:vital:9E7A:100022		|
 	| resource.text.div						| CONTAINS HEIGHT 60 in					|
 	| resource.code.coding.display			| HEIGHT								|
 	| resource.valueQuantity.value			| 60									|
     | resource.valueQuantity.units           | in		                           	|
 	| resource.referenceRange.low.value		| IS_NOT_SET							|
 	| resource.referenceRange.low.units		| IS_NOT_SET							|
 	| resource.referenceRange.high.value		| IS_NOT_SET							|
 	| resource.referenceRange.high.units		| IS_NOT_SET							|

 	And the FHIR results contain "vital results"
 	| field									| panorama_value						|
 	| resource.identifier.value				| CONTAINS urn:va:vital:9E7A:100022		|
 	| resource.text.div						| CONTAINS WEIGHT 200 lb				|
 	| resource.code.coding.display			| WEIGHT								|
 	| resource.valueQuantity.value			| 200									|
     | resource.valueQuantity.units           | lb		                           	|
 	| resource.referenceRange.low.value		| IS_NOT_SET							|
 	| resource.referenceRange.low.units		| IS_NOT_SET							|
 	| resource.referenceRange.high.value		| IS_NOT_SET							|
 	| resource.referenceRange.high.units		| IS_NOT_SET							|

 	And the FHIR results contain "vital results"
 	| field									| panorama_value						|
 	| resource.identifier.value				| CONTAINS urn:va:vital:9E7A:100022		|
 	| resource.text.div						| CONTAINS PULSE OXIMETRY 98 %			|
 	| resource.code.coding.display			| PULSE OXIMETRY						|
 	| resource.valueQuantity.value			| 98									|
     | resource.valueQuantity.units           | %			                           	|
 	| resource.referenceRange.low.value		| 50									|
 	| resource.referenceRange.low.units		| %										|
 	| resource.referenceRange.high.value		| 100									|
 	| resource.referenceRange.high.units		| %										|

 	And the FHIR results contain "vital results"
 	| field									| panorama_value						|
 	| resource.identifier.value				| CONTAINS urn:va:vital:9E7A:100022		|
 	| resource.text.div						| CONTAINS PAIN 3						|
 	| resource.code.coding.display			| PAIN									|
 	| resource.valueQuantity.value			| 3										|
     | resource.valueQuantity.units           | EMPTY		                        	|
 	| resource.referenceRange.low.value		| IS_NOT_SET							|
 	| resource.referenceRange.high.value		| IS_NOT_SET							|

 @F138_vitals_fhir_girth @fhir @10117V810068
 Scenario: Client can request vitals in FHIR format
 	Given a patient with "vitals" in multiple VistAs
  #   And a patient with pid "10117V810068" has been synced through the RDK API
 	When the client requests vitals for the patient "10117V810068" in FHIR format
 	Then a successful response is returned
 	And the FHIR results contain vitals
       | name                                          | value                                |
       | resource.text.div                              | <div>CIRCUMFERENCE/GIRTH 42 in</div> |
       | resource.text.status                           | generated                            |
       | resource.code.coding.system                    | urn:oid:2.16.840.1.113883.6.233      |
       | resource.code.coding.code                      | urn:va:vuid:4688720                  |
       | resource.code.coding.display                   | CIRCUMFERENCE/GIRTH                  |
       | resource.appliesDateTime                       | 1999-09-24T13:00:00                  |
       | resource.status                                | final                                |
       | resource.reliability                           | unknown                              |
       | resource.referenceRange.low.value              | IS_NOT_SET                           |
       | resource.referenceRange.low.units              | IS_NOT_SET                           |
       | resource.referenceRange.high.value             | IS_NOT_SET                           |
       | resource.referenceRange.high.units             | IS_NOT_SET                           |
       | resource.identifier.use                        | official                             |
       | resource.identifier.value                      | IS_SET                               |
       | resource.identifier.system                     | http://vistacore.us/fhir/id/uid      |
       | resource.subject.reference                     | Patient/428                          |
       | resource.referenceRange.meaning.coding.system  | IS_NOT_SET                           |
       | resource.referenceRange.meaning.coding.code    | IS_NOT_SET                           |
       | resource.referenceRange.meaning.coding.display | IS_NOT_SET                           |
       | resource.subject.reference                     | Patient/428                          |
       | resource.valueQuantity.value                   | 42                                   |
       | resource.valueQuantity.units                   | in                                   |
       | resource.issued                                | IS_FORMATTED_DATE                    |

 @F138_2_vitals_fhir @fhir @5000000341V359724
 Scenario: Client can request vital results in FHIR format
 	Given a patient with "vitals" in multiple VistAs
   #  And a patient with pid "5000000341V359724" has been synced through the RDK API
 	When the client requests vitals for the patient "5000000341V359724" in FHIR format
 	Then a successful response is returned
 	#Then the client receives 9 FHIR "VistA" result(s)
 	#And the client receives 9 FHIR "kodak" result(s)
 	And the FHIR results contain "vital results"

 	| field									| panorama_value						|
  | resource.contained.resourceType	| Organization							|
 #	| resource.identifier.value				| urn:va:vital:C877:100022:24039		|
 	| resource.identifier.value				| CONTAINS urn:va:vital:C877:100022		|
 	| resource.contained.identifier.value	| 500									|
 	| resource.contained.name				| CAMP BEE								|
 # Not available for this patient.
 	| resource.extention.valueCoding.system	| IS_NOT_SET							|
 	| resource.extention.valueCoding.code	| IS_NOT_SET							|
 	| resource.extention.valueCoding.display	| IS_NOT_SET							|
 	| resource.text.status					| generated								|
 	| resource.text.div						| <div>5-Nov 2013 8:1 : Systolic blood pressure 120 mm[Hg]</div>	|
 	| resource.code.coding.system			| http://loinc.org						|
 	| resource.code.coding.code				| 8480-6								|
 	| resource.code.coding.display			| Systolic blood pressure				|
 	| resource.valueQuantity.value			| 120									|
     | resource.valueQuantity.units           | mm[Hg]                               	|
 	| resource.appliesDateTime				| 2013-11-05T08:01:00					|
 #	| resource.issued						| 20140519214212						|
 	| resource.status						| final         						|
 	| resource.reliability					| unknown								|
 	| resource.bodysite.coding.system		| IS_NOT_SET							|
 	| resource.bodysite.coding.code			| IS_NOT_SET							|
 	| resource.bodysite.coding.display		| IS_NOT_SET							|
 	| resource.method.coding.system			| IS_NOT_SET							|
 	| resource.method.coding.code			| IS_NOT_SET							|
 	| resource.method.coding.display			| IS_NOT_SET							|
 	| resource.identifier.use				| official								|
 	| resource.identifier.system				| http://vistacore.us/fhir/id/uid		|
 	| resource.subject.reference				| Patient/100022						|
 #	| resource.referenceRange.meaning.coding.system	| "http://snomed.info/id"		|
 	| resource.referenceRange.low.value		| 100/60								|
 	| resource.referenceRange.low.units		| mm[Hg]								|
 	| resource.referenceRange.high.value		| 210/110								|
 	| resource.referenceRange.high.units		| mm[Hg]								|

 	And the FHIR results contain "vital results"

 	| field									| panorama_value						|
 	| resource.text.div						| <div>5-Nov 2013 8:1 : Diastolic blood pressure 70 mm[Hg]</div>	|
 	| resource.code.coding.code				| 8462-4								|
 	| resource.code.coding.display			| Diastolic blood pressure				|
 	| resource.valueQuantity.value			| 70									|
     | resource.valueQuantity.units           | mm[Hg]                               	|

 	And the FHIR results contain "vital results"
 	| field									| panorama_value						|
 	| resource.identifier.value				| CONTAINS urn:va:vital:C877:100022		|
 	| resource.text.div						| CONTAINS TEMPERATURE 98.7 F			|
 	| resource.code.coding.display			| TEMPERATURE							|
 	| resource.valueQuantity.value			| 98.7									|
     | resource.valueQuantity.units           | F		                               	|
 	| resource.referenceRange.low.value		| 95									|
 	| resource.referenceRange.low.units		| F										|
 	| resource.referenceRange.high.value		| 102									|
 	| resource.referenceRange.high.units		| F										|

 	And the FHIR results contain "vital results"
 	| field									| panorama_value						|
 	| resource.identifier.value				| CONTAINS urn:va:vital:C877:100022		|
 	| resource.text.div						| CONTAINS RESPIRATION 20 /min			|
 	| resource.code.coding.display			| RESPIRATION							|
 	| resource.valueQuantity.value			| 20									|
     | resource.valueQuantity.units           | /min		                           	|
 	| resource.referenceRange.low.value		| 8										|
 	| resource.referenceRange.low.units		| /min									|
 	| resource.referenceRange.high.value		| 30									|
 	| resource.referenceRange.high.units		| /min									|

 	And the FHIR results contain "vital results"
 	| field									| panorama_value						|
 	| resource.identifier.value				| CONTAINS urn:va:vital:C877:100022		|
 	| resource.text.div						| CONTAINS PULSE 65 /min				|
 	| resource.code.coding.display			| PULSE									|
 	| resource.valueQuantity.value			| 65									|
     | resource.valueQuantity.units           | /min		                           	|
 	| resource.referenceRange.low.value		| 60									|
 	| resource.referenceRange.low.units		| /min									|
 	| resource.referenceRange.high.value		| 120									|
 	| resource.referenceRange.high.units		| /min									|

 	And the FHIR results contain "vital results"
 	| field									| panorama_value						|
 	| resource.identifier.value				| CONTAINS urn:va:vital:C877:100022		|
 	| resource.text.div						| CONTAINS HEIGHT 60 in					|
 	| resource.code.coding.display			| HEIGHT								|
 	| resource.valueQuantity.value			| 60									|
     | resource.valueQuantity.units           | in		                           	|
 	| resource.referenceRange.low.value		| IS_NOT_SET							|
 	| resource.referenceRange.low.units		| IS_NOT_SET							|
 	| resource.referenceRange.high.value		| IS_NOT_SET							|
 	| resource.referenceRange.high.units		| IS_NOT_SET							|

 	And the FHIR results contain "vital results"
 	| field									| panorama_value						|
 	| resource.identifier.value				| CONTAINS urn:va:vital:C877:100022		|
 	| resource.text.div						| CONTAINS WEIGHT 200 lb				|
 	| resource.code.coding.display			| WEIGHT								|
 	| resource.valueQuantity.value			| 200									|
     | resource.valueQuantity.units           | lb		                           	|
 	| resource.referenceRange.low.value		| IS_NOT_SET							|
 	| resource.referenceRange.low.units		| IS_NOT_SET							|
 	| resource.referenceRange.high.value		| IS_NOT_SET							|
 	| resource.referenceRange.high.units		| IS_NOT_SET							|

 	And the FHIR results contain "vital results"
 	| field									| panorama_value						|
 	| resource.identifier.value				| CONTAINS urn:va:vital:C877:100022		|
 	| resource.text.div						| CONTAINS PULSE OXIMETRY 99 %			|
 	| resource.code.coding.display			| PULSE OXIMETRY						|
 	| resource.valueQuantity.value			| 99									|
     | resource.valueQuantity.units           | %			                           	|
 	| resource.referenceRange.low.value		| 50									|
 	| resource.referenceRange.low.units		| %										|
 	| resource.referenceRange.high.value		| 100									|
 	| resource.referenceRange.high.units		| %										|

 	And the FHIR results contain "vital results"
 	| field									| panorama_value						|
 	| resource.identifier.value				| CONTAINS urn:va:vital:C877:100022		|
 	| resource.text.div						| CONTAINS PAIN 1						|
 	| resource.code.coding.display			| PAIN									|
 	| resource.valueQuantity.value			| 1										|
     | resource.valueQuantity.units           | EMPTY		                        	|
 	| resource.referenceRange.low.value		| IS_NOT_SET							|
 	| resource.referenceRange.high.value		| IS_NOT_SET							|


 # following 2 scenarios are checking for another patient for return of vital results.
 # only few fields are checked to validate data integrity.
 # qualifiers field mapping is checked here which was not available for the above patient

 @F138_3_vitals_fhir @fhir @9E7A100184
 Scenario: Client can request vital results in FHIR format
 	Given a patient with "vitals" in multiple VistAs
   #  And a patient with pid "9E7A;100184" has been synced through the RDK API
 	When the client requests vitals for the patient "9E7A;100184" in FHIR format
 	Then a successful response is returned
 	Then the client receives 15 FHIR "VistA" result(s)
 	And the client receives 15 FHIR "panorama" result(s)
 	And the FHIR results contain "vital results"
 	| field									| panorama_value						|
 	| resource.identifier.value				| CONTAINS urn:va:vital:9E7A:100184					|
 	| resource.code.coding.system			| http://loinc.org									|
 	| resource.code.coding.code				| 8310-5											|
 	| resource.code.coding.display			| BODY TEMPERATURE									|
 	| resource.text.div						| CONTAINS TEMPERATURE 98.7 F						|
 	| resource.valueQuantity.value			| 98.7												|
     | resource.valueQuantity.units           | F			    			                    	|
 	| resource.referenceRange.low.value		| 95												|
 	| resource.referenceRange.high.value		| 102												|

 	And the FHIR results contain "vital results"
 	| field									| panorama_value						|
 	| resource.identifier.value				| CONTAINS urn:va:vital:9E7A:100184					|
 	| resource.code.coding.system			| http://loinc.org									|
 	| resource.code.coding.code				| 8867-4											|
 	| resource.code.coding.display			| HEART BEAT										|
 	| resource.text.div						| CONTAINS PULSE 72 /min							|
 	| resource.valueQuantity.value			| 72												|
     | resource.valueQuantity.units           | /min			    			                    |
 	| resource.referenceRange.low.value		| 60												|
 	| resource.referenceRange.high.value		| 120												|

 @F138_4_vitals_fhir @fhir @C877100184
 Scenario: Client can request vital results in FHIR format
 	Given a patient with "vitals" in multiple VistAs
   #  And a patient with pid "C877;100184" has been synced through the RDK API
 	When the client requests vitals for the patient "C877;100184" in FHIR format
 	Then a successful response is returned
 	Then the client receives 15 FHIR "VistA" result(s)
 	And the client receives 15 FHIR "kodak" result(s)
 	And the FHIR results contain "vital results"
 	| field									| panorama_value						|
 	| resource.identifier.value				| CONTAINS urn:va:vital:C877:100184					|
 	| resource.code.coding.system			| http://loinc.org									|
 	| resource.code.coding.code				| 8310-5											|
 	| resource.code.coding.display			| BODY TEMPERATURE									|
 	| resource.text.div						| CONTAINS TEMPERATURE 98.7 F						|
 	| resource.valueQuantity.value			| 98.7												|
     | resource.valueQuantity.units           | F			    			                    	|
 	| resource.referenceRange.low.value		| 95												|
 	| resource.referenceRange.high.value		| 102												|

 	And the FHIR results contain "vital results"
 	| field									| panorama_value						|
 	| resource.identifier.value				| CONTAINS urn:va:vital:C877:100184					|
 	| resource.code.coding.system			| http://loinc.org									|
 	| resource.code.coding.code				| 8867-4											|
 	| resource.code.coding.display			| HEART BEAT										|
 	| resource.text.div						| CONTAINS PULSE 72 /min							|
 	| resource.valueQuantity.value			| 72												|
     | resource.valueQuantity.units           | /min			    			                    |
 	| resource.referenceRange.low.value		| 60												|
 	| resource.referenceRange.high.value		| 120												|

 @F138_5_vitals_neg_fhir @fhir @5123456789V027402
 Scenario: Negative scenario.  Client can request vital results in FHIR format
 	Given a patient with "vitals" in multiple VistAs
    #   And a patient with pid "5123456789V027402" has been synced through the RDK API
 	When the client requests vitals for the patient "9E7A;100184" in FHIR format
 	Then a successful response is returned
 	Then corresponding matching FHIR records totaling "15" are displayed

 @F138_6_vitals_fhir @fhir @5000000341V359724 @DE974
 Scenario: Client can request vital results in FHIR format
 	Given a patient with "vitals" in multiple VistAs
   #  And a patient with pid "5000000341V359724" has been synced through the RDK API
 	When the client requests vitals for the patient "5000000341V359724" in FHIR format
 	Then a successful response is returned
 	And the results contain
       | name         | value     |
       | total        | 103        |
