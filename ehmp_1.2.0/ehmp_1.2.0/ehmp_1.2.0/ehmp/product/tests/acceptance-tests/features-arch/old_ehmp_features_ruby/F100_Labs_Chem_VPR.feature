@labs_vpr 
Feature: F100 Return of Lab (Chem/Hem) Results in VPR format 


#This feature item covers the return of Chemistry and Hematology Lab results in VPR format. Also includes cases when no results exist. 

	
@f100_1_labs_ch_vpr @vpr
Scenario: Client can request Lab (Chem/Hem) results in VPR format
	Given a patient with "lab  results" in multiple VistAs
      Given a patient with pid "11016V630869" has been synced through Admin API
	When the client requests labs for the patient "11016V630869" in VPR format
	Then the client receives 92 VPR "VistA" result(s)
	Then the client receives 46 VPR "panorama" result(s)
	Then the VPR results contain:
                                                      
      | field              | value			       								  |
      | uid                      | urn:va:lab:9E7A:227:CH;6949681.966383;2                  |
      | typeName           | GLUCOSE          									  |
      | typeName           | GLUCOSE          									  |
      # The following fields are commented out because S65 removed the VUID which broke LOINC codes
      #| typeCode           | urn:lnc:2344-0          							  |
      | typeCode           | urn:va:ien:60:175:72                                                 |
      | typeName           | GLUCOSE          									  |
      | result 			   | 310             									  |
      | units              | mg/dL   											  |
      | interpretationCode | urn:hl7:observation-interpretation:HH 				  |
      | high			   | 110 												  |
      | units              | mg/dL   											  |
      | low    			   | 60  												  |
      | units              | mg/dL   											  |
      | statusName         | completed 											  |
      | specimen		   | SERUM  											  |
      | groupName     	   | CH 0317 234 										  |
      | groupUid           | urn:va:accession:9E7A:227:CH;6949681.966383 		  |	
      |labOrderId          | 2790  												  |
      | localId			   | CH;6949681.966383;2 								  |
      | summary			   | GLUCOSE (SERUM) 310<em>H*</em> mg/dL 				  |
      | facilityCode       | 500												  |
      | comment			   |  CONTAINS Ordering Provider: Onehundredsixteen Vehu  |
      | facilityName       | CAMP MASTER 										  |
      | comment 		   | CONTAINS Performing Lab: ALBANY VA MEDICAL CENTER    |
      | comment 		   | CONTAINS VA MEDICAL CENTER 1 3RD sT. 				  |
      | comment 		   | CONTAINS ALBANY           					   	      |
      | comment            | CONTAINS NY 										  |
      | comment            | CONTAINS 12180-0097                                  |
      | specimen		   | SERUM  											  |
      | observed		   | 200503170336 										  |
      | resulted		   | 200503170336										  |
      | categoryCode       | urn:va:lab-category:CH 							  |
      # The following fields are commented out because S65 removed the VUID which broke LOINC codes
      #| codes.code     	   | 2344-0  										      |
      #| codes.system       | http://loinc.org              						  |
      #| codes.display	   | Glucose [Mass/volume] in Body fluid      			  |
      
 	And the VPR results contain:
	  | field                | values               							  |
      | typeName             | PROTIME   			 				  			  |      
      | typeCode             | urn:va:ien:60:467:73   							  |
      | orderUid             | urn:va:order:9E7A:227:16688        				  |
		   
@f100_2_labs_ch_vpr @vpr
Scenario: Client can request Lab (Chem/Hem) results in VPR format
	Given a patient with "lab  results" in multiple VistAs
      Given a patient with pid "11016V630869" has been synced through Admin API
	When the client requests labs for the patient "11016V630869" in VPR format
	Then the client receives 92 VPR "VistA" result(s)
	Then the client receives 46 VPR "kodak" result(s)
	Then the VPR results contain:
                                                      
      | field              | value			       								  |
      | uid                      | urn:va:lab:C877:227:CH;6949681.966383;2                  |
      | typeName           | GLUCOSE          									  |
      | typeName           | GLUCOSE          									  |
      # The following fields are commented out because S65 removed the VUID which broke LOINC codes
      #| typeCode           | urn:lnc:2344-0          							  |
      | typeCode           | urn:va:ien:60:175:72                                                 |
      | typeName           | GLUCOSE          									  |
      | result 			   | 310             									  |
      | units              | mg/dL   											  |
      | interpretationCode | urn:hl7:observation-interpretation:HH 				  |
      | high			   | 110 												  |
      | units              | mg/dL   											  |
      | low    			   | 60  												  |
      | units              | mg/dL   											  |
      | statusName         | completed 											  |
      | specimen		   | SERUM  											  |
      | groupName     	   | CH 0317 234 										  |
      | groupUid           | urn:va:accession:C877:227:CH;6949681.966383 		  |	
      |labOrderId          | 2790  												  |
      | localId			   | CH;6949681.966383;2 								  |
      | summary			   | GLUCOSE (SERUM) 310<em>H*</em> mg/dL 				  |
      | facilityCode       | 500												  |
      | comment			   | CONTAINS Ordering Provider: Onehundredsixteen Vehu   |
      | facilityName       | CAMP BEE	 										  |
      | comment 		   | CONTAINS Performing Lab: ALBANY VA MEDICAL CENTER    |
      | comment 		   | CONTAINS VA MEDICAL CENTER 1 3RD sT. 				  |
      | comment 		   | CONTAINS ALBANY           					   	      |
      | comment            | CONTAINS NY 										  |
      | comment            | CONTAINS 12180-0097                                  |
      | specimen		   | SERUM  											  |
      | observed		   | 200503170336 										  |
      | resulted		   | 200503170336										  |
      | categoryCode       | urn:va:lab-category:CH 							  |
      # The following fields are commented out because S65 removed the VUID which broke LOINC codes
      #| codes.code     	   | 2344-0  										      |
      #| codes.system       | http://loinc.org              						  |
      #| codes.display	   | Glucose [Mass/volume] in Body fluid      			  |

 	And the VPR results contain:
	  | field                | values               							  |
      | typeName             | PROTIME   			 				  			  |
      | typeCode             | urn:va:ien:60:467:73   							  |
      | orderUid             | urn:va:order:C877:227:16688        				  |

# following 2 scenarios are checking for another patient for return of labs results.
# only few fields are checked to validate data integrity.
      
@f100_3_labs_ch_vpr @vpr
Scenario: Client can request lab (Chem/Hem) results in VPR format
	Given a patient with "lab  results" in multiple VistAs
      Given a patient with pid "9E7A;100184" has been synced through Admin API
	When the client requests labs for the patient "9E7A;100184" in VPR format
	Then the client receives 7 VPR "VistA" result(s)
	Then the client receives 7 VPR "panorama" result(s)
	Then the VPR results contain:
	
		| field					| value						|
		| pid					| 9E7A;100184				|
		| groupName				| CH 0429 152				|
		| facilityCode			| 500						|
		| facilityName			| CAMP MASTER				|
		| categoryName			| Laboratory				|
		| observed				| 200304291615				|
		| typeName				| GLUCOSE					|
		| result				| 321						|
		| interpretationName	| High alert				|
		| labOrderId			| 2328						|
		| kind					| Laboratory				|
		| specimen				| SERUM						|
		| units					| mg/dL						|
		| low					| 60						|
		| high					| 123						|
		| summary				| GLUCOSE (SERUM) 321<em>H*</em> mg/dL|


@f100_4_labs_ch_vpr @vpr
Scenario: Client can request lab (Chem/Hem) results in VPR format
	Given a patient with "lab  results" in multiple VistAs
      Given a patient with pid "C877;21" has been synced through Admin API
	When the client requests labs for the patient "C877;21" in VPR format
	Then the client receives 23 VPR "VistA" result(s)
	Then the client receives 23 VPR "kodak" result(s)
	Then the VPR results contain:
	
		| field					| value						|
		| pid					| C877;21					|
		| labOrderId			| 2013						|
		| groupName				| CH 0917 1					|
		| facilityCode			| 500						|
		| facilityName			| CAMP BEE					|
		| categoryName			| Laboratory				|
		| observed				| 200209172032				|
		| typeName				| GLUCOSE					|
		| result				| 200						|
		| interpretationName	| High 						|
		| kind					| Laboratory				|
		| specimen				| SERUM						|
		| units					| mg/dL						|
		| low					| 60						|
		| high					| 123						|
		| summary				| GLUCOSE (SERUM) 200<em>H</em> mg/dL|

	
# negative test case for labs.

@f100_5_labs_ch_neg_vpr
Scenario: Negative scenario.  Client can request lab results in VPR format
Given a patient with "No lab results" in multiple VistAs
Given a patient with pid "1006184063V088473" has been synced through Admin API
When the client requests labs for the patient "1006184063V088473" in VPR format
Then a successful response is returned
Then corresponding matching records totaling "0" are displayed

	
