@vlervitals @fhir

Feature: F96 - Return of patient generated Vitals domain data from the VLER DAS in FHIR format

#This feature item returns patient generated Vitals domain data from the mock VLER DAS in FHIR format.

Background:
	Given a patient with pid "11016V630869" has been synced through Admin API

@f96_1_vitals_vler_fhir @fhir
Scenario: Client can request vitals in VPR format for a patient with data in VLER DAS
	Given a patient with "vitals" in multiple VistAs
	When the client requests vitals for the patient "11016V630869" in FHIR format
	Then a successful response is returned
	#Then the client receives 2 FHIR "VistA" result(s)
	#And the client receives 2 FHIR "panorama" result(s)
	And the FHIR results contain "vler das vital results"

	| field									| panorama_value						|
	| content.identifier.value				| urn:va:vital:DAS:11016V630869:11016-1  		|
	| content.contained.identifier.value	| PGD									|
	| content.contained.name				| Patient Generated Data				|
# Not available for this patient.
#	| content.extention.valueCoding.system	| urn:oid:2.16.840.1.113883.6.233		|
#	| content.extention.valueCoding.code	|										|
#	| content.extention.valueCoding.display	|										|
	| content.text.status					| generated								|
	| content.text.div						| <div>Height 183 cm</div>				|
	| content.name.coding.system			| urn:oid:2.16.840.1.113883.6.233		|
#	| content.name.coding.code				| 										|
	| content.name.coding.display			| Height								|
	| content.name.coding.system			| LOINC									|	
	| content.name.coding.code				| 8302-2								|
	| content.name.coding.display			| Height								|
	| content.valueQuantity.value			| 183									|
    | content.valueQuantity.units           | cm                                   	|
	| content.appliesDateTime				| 2012-08-14T12:00:00					|	
	| content.issued						| CONTAINS 2012-08-14T12:00:00			|		
	| content.identifier.use				| official								|
	| content.subject.reference				| Patient/11016V630869				    		|
	And the FHIR results contain "vler das vital results"
	| content.identifier.value				| urn:va:vital:9E7A:11016V630869:11016-3	        |
	| content.referenceRange.low.units		| mm[Hg]								|
	| content.referenceRange.high.units		| mm[Hg]								|
	And the FHIR results contain "vler das vital results"
	| content.identifier.value				| urn:va:vital:DAS:11016:11016-2		|
	| content.text.div						| <div>Patient Body Weight - Measured 93 kg</div>|
	| content.valueQuantity.value			| 93									|
    | content.valueQuantity.units           | kg                                   	|
	And the FHIR results contain "vler das vital results"
	| content.identifier.value				| urn:va:vital:DAS:11016:11016-3		|
	| content.text.div						| <div>Intravascular Systolic 113 mm[Hg]</div>|
	| content.valueQuantity.value			| 113									|
    | content.valueQuantity.units           | mm[Hg]                               	|

		
