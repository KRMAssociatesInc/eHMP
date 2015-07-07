@vlervitals @vpr

Feature: F96 - Return of patient generated Vitals domain data from the VLER DAS in VPR format

#This feature item returns patient generated Vitals domain data from the mock VLER DAS in VPR format.

Background:
	Given a patient with pid "11016V630869" has been synced through Admin API

@f96_1_vlerdas_vitals_vpr 
 
Scenario: Client can request vitals in VPR format for a patient with data in VLER DAS

	Given a patient with "Vitals" in multiple VistAs
	When the client requests vitals for the patient "11016V630869" in VPR format
	Then a successful response is returned
	Then the client receives 102 VPR "VistA" result(s)
#	Then the client receives 1 VPR "DAS" result(s)
	Then the VPR results contain:

		| field							| value								|	
		| uid							| urn:va:vital:DAS:11016V630869:11016-1  	|
		| summary						| Height 183 cm						|
		| facilityCode					| PGD								|
		| facilityName					| Patient Generated Data			|
		| observed						| 20120814120000					|
		| resulted						| 20120814120000					|
		| kind							| Vital Sign						|
		| typeName						| Height							|
		| result						| 183								|
		| units							| cm								|
		| codes.code					| 8302-2							|
		| codes.system					| LOINC								|
		| codes.display					| Height							|
		| qualifiedName					| Height							|
		
	And the VPR results contain "vler das vitals results" 
		| uid							| urn:va:vital:DAS:11016:11016-2	|
		| summary						| Patient Body Weight - Measured 93 kg|
		| result						| 93								|
		| units							| kg								|
		| qualifiedName					| Patient Body Weight - Measured	|
		
	And the VPR results contain "vler das vitals results" 
		| uid							| urn:va:vital:DAS:11016:11016-3	|
		| summary						| Intravascular Systolic 113 mm[Hg]	|
		| result						| 113								|
		| units							| mm[Hg]							|
		| qualifiedName					| Intravascular Systolic			|
