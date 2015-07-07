@vitals_fhir @fhir

Feature: F93 - Return of Vitals in FHIR format


#This feature item returns Vitals in FHIR format. Also includes cases where no Vitals exist.


@f93_1_vitals_fhir @fhir
Scenario: Client can request vital results in FHIR format
	Given a patient with "vitals" in multiple VistAs
	Given a patient with pid "5000000341V359724" has been synced through Admin API
	When the client requests vitals for the patient "5000000341V359724" in FHIR format
	Then a successful response is returned
	Then the client receives 18 FHIR "VistA" result(s)
	And the client receives 9 FHIR "panorama" result(s)
	And the FHIR results contain "vital results"

	| field									| panorama_value						|
	| content.contained.identifier.label	| facility-code							|
#	| content.identifier.value				| urn:va:vital:9E7A:100022:24039		|
	| content.identifier.value				| CONTAINS urn:va:vital:9E7A:100022		|
	| content.contained.identifier.value	| 998									|
	| content.contained.name				| ABILENE (CAA)							|
# Not available for this patient.
	| content.extention.valueCoding.system	| IS_NOT_SET							|
	| content.extention.valueCoding.code	| IS_NOT_SET							|
	| content.extention.valueCoding.display	| IS_NOT_SET							|
	| content.text.status					| generated								|
	| content.text.div						| <div>10-Dec 2013 14:32 : Systolic blood pressure 120 mm[Hg]</div>	|
	| content.name.coding.system			| http://loinc.org						|
	| content.name.coding.code				| 8480-6								|
	| content.name.coding.display			| Systolic blood pressure				|
	| content.valueQuantity.value			| 120									|
    | content.valueQuantity.units           | mm[Hg]                               	|
	| content.appliesDateTime				| 2013-12-10T14:32:00					|	
#	| content.issued						| 20140519214212						|
	| content.status						| final         						|
	| content.reliability					| unknown								|
	| content.bodysite.coding.system		| IS_NOT_SET							|
	| content.bodysite.coding.code			| IS_NOT_SET							|
	| content.bodysite.coding.display		| IS_NOT_SET							|
	| content.method.coding.system			| IS_NOT_SET							|
	| content.method.coding.code			| IS_NOT_SET							|
	| content.method.coding.display			| IS_NOT_SET							|						
	| content.identifier.use				| official								|
	| content.identifier.label				| uid									|
	| content.identifier.system				| http://vistacore.us/fhir/id/uid		|
	| content.subject.reference				| Patient/100022						|
#	| content.referenceRange.meaning.coding.system	| "http://snomed.info/id"		|
	| content.referenceRange.low.value		| 100/60								|
	| content.referenceRange.low.units		| mm[Hg]								|
	| content.referenceRange.high.value		| 210/110								|
	| content.referenceRange.high.units		| mm[Hg]								|
	
	And the FHIR results contain "vital results"

	| field									| panorama_value						|
	| content.text.div						| <div>10-Dec 2013 14:32 : Diastolic blood pressure 75 mm[Hg]</div>	|
	| content.name.coding.code				| 8462-4								|
	| content.name.coding.display			| Diastolic blood pressure				|
	| content.valueQuantity.value			| 75									|
    | content.valueQuantity.units           | mm[Hg]                               	|
	
	And the FHIR results contain "vital results"
	| content.identifier.value				| CONTAINS urn:va:vital:9E7A:100022		|
	| content.text.div						| CONTAINS TEMPERATURE 98.6 F			|
	| content.name.coding.display			| TEMPERATURE							|
	| content.valueQuantity.value			| 98.6									|
    | content.valueQuantity.units           | F		                               	|
	| content.referenceRange.low.value		| 95									|
	| content.referenceRange.low.units		| F										|
	| content.referenceRange.high.value		| 102									|
	| content.referenceRange.high.units		| F										|
	
	And the FHIR results contain "vital results"
	
	| content.identifier.value				| CONTAINS urn:va:vital:9E7A:100022		|
	| content.text.div						| CONTAINS RESPIRATION 22 /min			|
	| content.name.coding.display			| RESPIRATION							|
	| content.valueQuantity.value			| 22									|
    | content.valueQuantity.units           | /min		                           	|
	| content.referenceRange.low.value		| 8										|
	| content.referenceRange.low.units		| /min									|
	| content.referenceRange.high.value		| 30									|
	| content.referenceRange.high.units		| /min									|
	
	And the FHIR results contain "vital results"
	
	| content.identifier.value				| CONTAINS urn:va:vital:9E7A:100022		|
	| content.text.div						| CONTAINS PULSE 70 /min				|
	| content.name.coding.display			| PULSE									|
	| content.valueQuantity.value			| 70									|
    | content.valueQuantity.units           | /min		                           	|
	| content.referenceRange.low.value		| 60									|
	| content.referenceRange.low.units		| /min									|
	| content.referenceRange.high.value		| 120									|
	| content.referenceRange.high.units		| /min									|
	
	And the FHIR results contain "vital results"
	
	| content.identifier.value				| CONTAINS urn:va:vital:9E7A:100022		|
	| content.text.div						| CONTAINS HEIGHT 60 in					|
	| content.name.coding.display			| HEIGHT								|
	| content.valueQuantity.value			| 60									|
    | content.valueQuantity.units           | in		                           	|
	| content.referenceRange.low.value		| IS_NOT_SET							|
	| content.referenceRange.low.units		| IS_NOT_SET							|
	| content.referenceRange.high.value		| IS_NOT_SET							|
	| content.referenceRange.high.units		| IS_NOT_SET							|
	
	And the FHIR results contain "vital results"
	
	| content.identifier.value				| CONTAINS urn:va:vital:9E7A:100022		|
	| content.text.div						| CONTAINS WEIGHT 200 lb				|
	| content.name.coding.display			| WEIGHT								|
	| content.valueQuantity.value			| 200									|
    | content.valueQuantity.units           | lb		                           	|
	| content.referenceRange.low.value		| IS_NOT_SET							|
	| content.referenceRange.low.units		| IS_NOT_SET							|
	| content.referenceRange.high.value		| IS_NOT_SET							|
	| content.referenceRange.high.units		| IS_NOT_SET							|
	
	And the FHIR results contain "vital results"
	
	| content.identifier.value				| CONTAINS urn:va:vital:9E7A:100022		|
	| content.text.div						| CONTAINS PULSE OXIMETRY 98 %			|
	| content.name.coding.display			| PULSE OXIMETRY						|
	| content.valueQuantity.value			| 98									|
    | content.valueQuantity.units           | %			                           	|
	| content.referenceRange.low.value		| 50									|
	| content.referenceRange.low.units		| %										|
	| content.referenceRange.high.value		| 100									|
	| content.referenceRange.high.units		| %										|
	
	And the FHIR results contain "vital results"
	
	| content.identifier.value				| CONTAINS urn:va:vital:9E7A:100022		|
	| content.text.div						| CONTAINS PAIN 3						|
	| content.name.coding.display			| PAIN									|
	| content.valueQuantity.value			| 3										|
    | content.valueQuantity.units           | EMPTY		                        	|
	| content.referenceRange.low.value		| IS_NOT_SET							|
	| content.referenceRange.high.value		| IS_NOT_SET							|
	
@vitals_fhir_girth 
Scenario: Client can request vitals in FHIR format
	Given a patient with "vitals" in multiple VistAs
	When the client requests vitals for the patient "10117V810068" in FHIR format
	Then a successful response is returned
	And the FHIR results contain "vital results"
      | name                                          | value                                |
      | content.text.div                              | <div>CIRCUMFERENCE/GIRTH 42 in</div> |
      | id											                      | CONTAINS urn:va:vital:9E7A           |
      | content.text.status                           | generated                            |
      | content.name.coding.system                    | urn:oid:2.16.840.1.113883.6.233      |
      | content.name.coding.code                      | urn:va:vuid:4688720                  |
      | content.name.coding.display                   | CIRCUMFERENCE/GIRTH                  |
      | content.appliesDateTime                       | 1999-09-24T13:00:00                  |
      | content.status                                | final                                |
      | content.reliability                           | unknown                              |
      | content.referenceRange.low.value              | IS_NOT_SET                           |
      | content.referenceRange.low.units              | IS_NOT_SET                           |
      | content.referenceRange.high.value             | IS_NOT_SET                           |
      | content.referenceRange.high.units             | IS_NOT_SET                           |
      | content.identifier.use                        | official                             |
      | content.identifier.value                      | IS_SET                               |
      | content.identifier.label                      | uid                                  |
      | content.identifier.system                     | http://vistacore.us/fhir/id/uid      |
      | content.subject.reference                     | Patient/428                          |
      | content.referenceRange.meaning.coding.system  | IS_NOT_SET                           |
      | content.referenceRange.meaning.coding.code    | IS_NOT_SET                           |
      | content.referenceRange.meaning.coding.display | IS_NOT_SET                           |
      | content.subject.reference                     | Patient/428                          |
      | content.valueQuantity.value                   | 42                                   |
      | content.valueQuantity.units                   | in                                   |
   #   | content.issued                                | IS_FORMATTED_DATE                    |

@f93_2_vitals_fhir @fhir
Scenario: Client can request vital results in FHIR format
	Given a patient with "vitals" in multiple VistAs
	Given a patient with pid "5000000341V359724" has been synced through Admin API
	When the client requests vitals for the patient "5000000341V359724" in FHIR format
	Then a successful response is returned
	#Then the client receives 9 FHIR "VistA" result(s)
	#And the client receives 9 FHIR "kodak" result(s)
	And the FHIR results contain "vital results"

	| field									| panorama_value						|
	| content.contained.identifier.label	| facility-code							|
#	| content.identifier.value				| urn:va:vital:C877:100022:24039		|
	| content.identifier.value				| CONTAINS urn:va:vital:C877:100022		|
	| content.contained.identifier.value	| 500									|
	| content.contained.name				| CAMP BEE								|
# Not available for this patient.
	| content.extention.valueCoding.system	| IS_NOT_SET							|
	| content.extention.valueCoding.code	| IS_NOT_SET							|
	| content.extention.valueCoding.display	| IS_NOT_SET							|
	| content.text.status					| generated								|
	| content.text.div						| <div>5-Nov 2013 8:1 : Systolic blood pressure 120 mm[Hg]</div>	|
	| content.name.coding.system			| http://loinc.org						|
	| content.name.coding.code				| 8480-6								|
	| content.name.coding.display			| Systolic blood pressure				|
	| content.valueQuantity.value			| 120									|
    | content.valueQuantity.units           | mm[Hg]                               	|
	| content.appliesDateTime				| 2013-11-05T08:01:00					|	
#	| content.issued						| 20140519214212						|
	| content.status						| final         						|
	| content.reliability					| unknown								|
	| content.bodysite.coding.system		| IS_NOT_SET							|
	| content.bodysite.coding.code			| IS_NOT_SET							|
	| content.bodysite.coding.display		| IS_NOT_SET							|
	| content.method.coding.system			| IS_NOT_SET							|
	| content.method.coding.code			| IS_NOT_SET							|
	| content.method.coding.display			| IS_NOT_SET							|						
	| content.identifier.use				| official								|
	| content.identifier.label				| uid									|
	| content.identifier.system				| http://vistacore.us/fhir/id/uid		|
	| content.subject.reference				| Patient/100022						|
#	| content.referenceRange.meaning.coding.system	| "http://snomed.info/id"		|
	| content.referenceRange.low.value		| 100/60								|
	| content.referenceRange.low.units		| mm[Hg]								|
	| content.referenceRange.high.value		| 210/110								|
	| content.referenceRange.high.units		| mm[Hg]								|
	
	And the FHIR results contain "vital results"

	| field									| panorama_value						|
	| content.text.div						| <div>5-Nov 2013 8:1 : Diastolic blood pressure 70 mm[Hg]</div>	|
	| content.name.coding.code				| 8462-4								|
	| content.name.coding.display			| Diastolic blood pressure				|
	| content.valueQuantity.value			| 70									|
    | content.valueQuantity.units           | mm[Hg]                               	|
	
	And the FHIR results contain "vital results"
	| content.identifier.value				| CONTAINS urn:va:vital:9E7A:100022		|
	| content.text.div						| CONTAINS TEMPERATURE 98.7 F			|
	| content.name.coding.display			| TEMPERATURE							|
	| content.valueQuantity.value			| 98.7									|
    | content.valueQuantity.units           | F		                               	|
	| content.referenceRange.low.value		| 95									|
	| content.referenceRange.low.units		| F										|
	| content.referenceRange.high.value		| 102									|
	| content.referenceRange.high.units		| F										|
	
	And the FHIR results contain "vital results"
	
	| content.identifier.value				| CONTAINS urn:va:vital:9E7A:100022		|
	| content.text.div						| CONTAINS RESPIRATION 20 /min			|
	| content.name.coding.display			| RESPIRATION							|
	| content.valueQuantity.value			| 20									|
    | content.valueQuantity.units           | /min		                           	|
	| content.referenceRange.low.value		| 8										|
	| content.referenceRange.low.units		| /min									|
	| content.referenceRange.high.value		| 30									|
	| content.referenceRange.high.units		| /min									|
	
	And the FHIR results contain "vital results"
	
	| content.identifier.value				| CONTAINS urn:va:vital:9E7A:100022		|
	| content.text.div						| CONTAINS PULSE 65 /min				|
	| content.name.coding.display			| PULSE									|
	| content.valueQuantity.value			| 65									|
    | content.valueQuantity.units           | /min		                           	|
	| content.referenceRange.low.value		| 60									|
	| content.referenceRange.low.units		| /min									|
	| content.referenceRange.high.value		| 120									|
	| content.referenceRange.high.units		| /min									|
	
	And the FHIR results contain "vital results"
	
	| content.identifier.value				| CONTAINS urn:va:vital:9E7A:100022		|
	| content.text.div						| CONTAINS HEIGHT 60 in					|
	| content.name.coding.display			| HEIGHT								|
	| content.valueQuantity.value			| 60									|
    | content.valueQuantity.units           | in		                           	|
	| content.referenceRange.low.value		| IS_NOT_SET							|
	| content.referenceRange.low.units		| IS_NOT_SET							|
	| content.referenceRange.high.value		| IS_NOT_SET							|
	| content.referenceRange.high.units		| IS_NOT_SET							|
	
	And the FHIR results contain "vital results"
	
	| content.identifier.value				| CONTAINS urn:va:vital:9E7A:100022		|
	| content.text.div						| CONTAINS WEIGHT 200 lb				|
	| content.name.coding.display			| WEIGHT								|
	| content.valueQuantity.value			| 200									|
    | content.valueQuantity.units           | lb		                           	|
	| content.referenceRange.low.value		| IS_NOT_SET							|
	| content.referenceRange.low.units		| IS_NOT_SET							|
	| content.referenceRange.high.value		| IS_NOT_SET							|
	| content.referenceRange.high.units		| IS_NOT_SET							|
	
	And the FHIR results contain "vital results"
	
	| content.identifier.value				| CONTAINS urn:va:vital:9E7A:100022		|
	| content.text.div						| CONTAINS PULSE OXIMETRY 99 %			|
	| content.name.coding.display			| PULSE OXIMETRY						|
	| content.valueQuantity.value			| 99									|
    | content.valueQuantity.units           | %			                           	|
	| content.referenceRange.low.value		| 50									|
	| content.referenceRange.low.units		| %										|
	| content.referenceRange.high.value		| 100									|
	| content.referenceRange.high.units		| %										|
	
	And the FHIR results contain "vital results"
	
	| content.identifier.value				| CONTAINS urn:va:vital:9E7A:100022		|
	| content.text.div						| CONTAINS PAIN 1						|
	| content.name.coding.display			| PAIN									|
	| content.valueQuantity.value			| 1										|
    | content.valueQuantity.units           | EMPTY		                        	|
	| content.referenceRange.low.value		| IS_NOT_SET							|
	| content.referenceRange.high.value		| IS_NOT_SET							|


# following 2 scenarios are checking for another patient for return of vital results.
# only few fields are checked to validate data integrity.
# qualifiers field mapping is checked here which was not available for the above patient

@f93_3_vitals_fhir	
Scenario: Client can request vital results in FHIR format
	Given a patient with "vitals" in multiple VistAs
	Given a patient with pid "9E7A;100184" has been synced through Admin API
	When the client requests vitals for the patient "9E7A;100184" in FHIR format
	Then a successful response is returned
	Then the client receives 15 FHIR "VistA" result(s)
	And the client receives 15 FHIR "panorama" result(s)
	And the FHIR results contain "vital results"
	
	| content.identifier.value				| CONTAINS urn:va:vital:9E7A:100184					|
	| content.name.coding.system			| http://loinc.org									|
	| content.name.coding.code				| 8310-5											|
	| content.name.coding.display			| Body temperature									|
	| content.text.div						| CONTAINS TEMPERATURE 98.7 F						|
	| content.valueQuantity.value			| 98.7												|
    | content.valueQuantity.units           | F			    			                    	|
	| content.referenceRange.low.value		| 95												|
	| content.referenceRange.high.value		| 102												|
	
	And the FHIR results contain "vital results"
	
	| content.identifier.value				| CONTAINS urn:va:vital:9E7A:100184					|
	| content.name.coding.system			| http://loinc.org									|
	| content.name.coding.code				| 8867-4											|
	| content.name.coding.display			| Heart rate										|
	| content.text.div						| CONTAINS PULSE 72 /min							|
	| content.valueQuantity.value			| 72												|
    | content.valueQuantity.units           | /min			    			                    |
	| content.referenceRange.low.value		| 60												|
	| content.referenceRange.high.value		| 120												|
	
@f93_4_vitals_fhir	
Scenario: Client can request vital results in FHIR format
	Given a patient with "vitals" in multiple VistAs
	Given a patient with pid "C877;21" has been synced through Admin API
	When the client requests vitals for the patient "C877;21" in FHIR format
	Then a successful response is returned
	Then the client receives 18 FHIR "VistA" result(s)
	And the client receives 18 FHIR "kodak" result(s)
	And the FHIR results contain "vital results"
	
	| content.identifier.value				| CONTAINS urn:va:vital:C877:21					|
	| content.name.coding.system			| http://loinc.org								|
	| content.name.coding.code				| 8480-6										|
	| content.name.coding.display			| Systolic blood pressure						|
	| content.text.div						| CONTAINS Systolic blood pressure				|
	| content.valueQuantity.value			| 156											|
    | content.valueQuantity.units           | mm[Hg] 		    		                 	|
	| content.referenceRange.low.value		| 100											|
	| content.referenceRange.high.value		| 210											|
	
	And the FHIR results contain "vital results"
	
	| content.identifier.value				| CONTAINS urn:va:vital:C877:21					|
	| content.name.coding.system			| http://loinc.org								|
	| content.name.coding.code				| 8462-4										|
	| content.name.coding.display			| Diastolic blood pressure						|
	| content.text.div						| CONTAINS Diastolic blood pres					|
	| content.valueQuantity.value			| 60											|
    | content.valueQuantity.units           | mm[Hg]		   			                    |
	| content.referenceRange.low.value		| 60											|
	| content.referenceRange.high.value		| 110											|

@f93_5_vitals_neg_fhir	
Scenario: Negative scenario.  Client can request vital results in VPR format
Given a patient with "No vital results" in multiple VistAs
Given a patient with pid "1006184063V088473" has been synced through Admin API
When the client requests vitals for the patient "1006184063V088473" in FHIR format
Then a successful response is returned
Then corresponding matching FHIR records totaling "0" are displayed
