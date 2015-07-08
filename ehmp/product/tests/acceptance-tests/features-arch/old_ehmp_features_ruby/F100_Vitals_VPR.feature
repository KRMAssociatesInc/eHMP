@Vitals @vpr
Feature: F100 Return of Vital Results in VPR format

    
#   This was the code from NEXT - but I believe we want this on... 

@f100_1_vitals_vpr
Scenario: client can request Vitals in VPR format
# End of PSI4
    Given a patient with "vitals" in multiple VistAs
    Given a patient with pid "5000000341V359724" has been synced through Admin API
    When the client requests vitals for the patient "5000000341V359724" in VPR format
	Then the client receives 16 VPR "VistA" result(s)
	Then the client receives 8 VPR "panorama" result(s)
    And the VPR results contain:
    
      | field						| value								|
      | uid							| CONTAINS urn:va:vital:9E7A:100022	|
      | summary						| BLOOD PRESSURE 120/75 mm[Hg]	|
      | pid							| 9E7A;100022					|
    #  | localId						| 24039							|
      | facilityCode				| 998							|
      | facilityName				| ABILENE (CAA)					|
      | observed					| 201312101432					|
      | resulted					| IS_SET        				|
      | locationName				| PRIMARY CARE					|
      | kind						| Vital Sign					|
      | typeCode					| urn:va:vuid:4500634			|
      | typeName					| BLOOD PRESSURE				|
      | displayName					| BP							|
      | result						| 120/75						|
      | units						| mm[Hg]						|
      | qualifiedName				| BLOOD PRESSURE				|
      | locationUid					| urn:va:location:9E7A:32		|
      | low							| 100/60						|
      | high						| 210/110						|
	And the VPR results contain:
	  | field						| value							|
	  | uid							| CONTAINS urn:va:vital:9E7A:100022|
      | summary						| TEMPERATURE 98.6 F			|
      | typeName					| TEMPERATURE					|
      | displayName					| T								|
      | result						| 98.6							|
      | units						| F								|
      | metricResult				| 37.0							|
      | metricUnits					| C								|
      | low							| 95							|
      | high						| 102							|
      | qualifiedName				| TEMPERATURE					|
    And the VPR results contain: 
      | field						| value							|
      | uid							| CONTAINS urn:va:vital:9E7A:100022|
      | summary						| RESPIRATION 22 /min			|
      | typeName					| RESPIRATION					|
      | displayName					| R								|
      | result						| 22							|
      | units						| /min							|
      | low							| 8								|
      | high						| 30							|
      | qualifiedName				| RESPIRATION					|
    And the VPR results contain: 
      | field						| value							|
      | uid							| CONTAINS urn:va:vital:9E7A:100022|
      | summary						| PULSE 70 /min					|
      | typeName					| PULSE							|
      | displayName					| P								|
      | result						| 70							|
      | units						| /min							|
      | low							| 60							|
      | high						| 120							|
      | qualifiedName				| PULSE							|
    And the VPR results contain: 
      | field						| value							|
      | uid							| CONTAINS urn:va:vital:9E7A:100022|
      | summary						| HEIGHT 60 in					|
      | typeName					| HEIGHT						|
      | displayName					| HT							|
      | result						| 60							|
      | units						| in							|
      | qualifiedName				| HEIGHT						|
    And the VPR results contain: 
      | field						| value							|
      | uid							| CONTAINS urn:va:vital:9E7A:100022|
      | summary						| WEIGHT 200 lb					|
      | typeName					| WEIGHT						|
      | displayName					| WT							|
      | result						| 200							|
      | units						| lb							|
      | metricResult				| 90.91							|
      | metricUnits					| kg							|
      | qualifiedName				| WEIGHT						|
    And the VPR results contain: 
      | field						| value							|
      | uid							| CONTAINS urn:va:vital:9E7A:100022|
      | summary						| PULSE OXIMETRY 98 %			|
      | typeName					| PULSE OXIMETRY				|
      | displayName					| PO2							|
      | result						| 98							|
      | units						| %								|
      | low							| 50							|
      | high						| 100							|
      | qualifiedName				| PULSE OXIMETRY				|
    And the VPR results contain: 
      | field						| value							|
      | uid							| CONTAINS urn:va:vital:9E7A:100022|
      | summary						| CONTAINS PAIN 3 				|
      | typeName					| PAIN							|
      | displayName					| PN							|
      | result						| 3								|
      | units						| EMPTY							|
      | low							| IS_NOT_SET					|
      | high						| IS_NOT_SET					|
      | qualifiedName				| PAIN							|            
      

@f100_2_vitals_vpr
Scenario: client can request Vitals in VPR format
    Given a patient with "vitals" in multiple VistAs
    Given a patient with pid "5000000341V359724" has been synced through Admin API
    When the client requests vitals for the patient "5000000341V359724" in VPR format
	Then the client receives 16 VPR "VistA" result(s)
	Then the client receives 8 VPR "kodak" result(s)
    And the VPR results contain:
      | field						| value								|
      | uid							| CONTAINS urn:va:vital:C877:100022	|
      | summary						| BLOOD PRESSURE 120/70 mm[Hg]	|
      | pid							| C877;100022					|
   #   | localId						| 24039							|
      | facilityCode				| 500							|
      | facilityName				| CAMP BEE						|
      | observed					| 201311050801					|
      | resulted					| IS_SET        				|
      | locationName				| GENERAL MEDICINE				|
      | kind						| Vital Sign					|
      | typeCode					| urn:va:vuid:4500634			|
      | typeName					| BLOOD PRESSURE				|
      | displayName					| BP							|
      | result						| 120/70						|
      | units						| mm[Hg]						|
      | qualifiedName				| BLOOD PRESSURE				|
      | locationUid					| urn:va:location:C877:23		|
      | low							| 100/60						|
      | high						| 210/110						|
      | codes.code					| 55284-4						|
      | codes.system				| http://loinc.org				|
      | codes.display				| Blood pressure systolic and diastolic|      
      
	And the VPR results contain:
	  | field						| value							|
	  | uid							| CONTAINS urn:va:vital:C877:100022|
      | summary						| TEMPERATURE 98.7 F			|
      | typeName					| TEMPERATURE					|
      | displayName					| T								|
      | result						| 98.7							|
      | units						| F								|
      | metricResult				| 37.1							|
      | metricUnits					| C								|
      | low							| 95							|
      | high						| 102							|
      | qualifiedName				| TEMPERATURE					|
    And the VPR results contain: 
      | field						| value							|
      | uid							| CONTAINS urn:va:vital:C877:100022|
      | summary						| RESPIRATION 20 /min			|
      | typeName					| RESPIRATION					|
      | displayName					| R								|
      | result						| 20							|
      | units						| /min							|
      | low							| 8								|
      | high						| 30							|
      | qualifiedName				| RESPIRATION					|
    And the VPR results contain: 
      | field						| value							|
      | uid							| CONTAINS urn:va:vital:C877:100022|
      | summary						| PULSE 65 /min					|
      | typeName					| PULSE							|
      | displayName					| P								|
      | result						| 65							|
      | units						| /min							|
      | low							| 60							|
      | high						| 120							|
      | qualifiedName				| PULSE							|
    And the VPR results contain: 
      | field						| value							|
      | uid							| CONTAINS urn:va:vital:C877:100022|
      | summary						| HEIGHT 60 in					|
      | typeName					| HEIGHT						|
      | displayName					| HT							|
      | result						| 60							|
      | units						| in							|
      | qualifiedName				| HEIGHT						|
    And the VPR results contain: 
      | field						| value							|
      | uid							| CONTAINS urn:va:vital:C877:100022|
      | summary						| WEIGHT 200 lb					|
      | typeName					| WEIGHT						|
      | displayName					| WT							|
      | result						| 200							|
      | units						| lb							|
      | metricResult				| 90.91							|
      | metricUnits					| kg							|
      | qualifiedName				| WEIGHT						|
    And the VPR results contain: 
      | field						| value							|
      | uid							| CONTAINS urn:va:vital:C877:100022|
      | summary						| PULSE OXIMETRY 99 %			|
      | typeName					| PULSE OXIMETRY				|
      | displayName					| PO2							|
      | result						| 99							|
      | units						| %								|
      | low							| 50							|
      | high						| 100							|
      | qualifiedName				| PULSE OXIMETRY				|
    And the VPR results contain: 
      | field						| value							|
      | uid							| CONTAINS urn:va:vital:C877:100022|
      | summary						| CONTAINS PAIN 1 				|
      | typeName					| PAIN							|
      | displayName					| PN							|
      | result						| 1								|
      | units						| EMPTY							|
      | low							| IS_NOT_SET					|
      | high						| IS_NOT_SET					|
      | qualifiedName				| PAIN							|

# following 2 scenarios are checking for another patient for return of vital results.
# only few fields are checked to validate data integrity.
# qualifiers field mapping is checked here which was not available for the above patient

@f100_3_vitals_vpr
Scenario: client can request vitals in VPR format. 
    Given a patient with "vitals" in multiple VistAs
    Given a patient with pid "9E7A;100184" has been synced through Admin API
    When the client requests vitals for the patient "9E7A;100184" in VPR format
	Then the client receives 13 VPR "VistA" result(s)
	Then the client receives 13 VPR "panorama" result(s)
    And the VPR results contain:
      | field						| value								|
      | uid							| CONTAINS urn:va:vital:9E7A:100184	|
      | qualifiers.name				| ORAL								|
      | qualifiers.vuid				| 4500642							|
      | summary						| TEMPERATURE 98.7 F				|
      | typeName					| TEMPERATURE						|
      | displayName					| T									|
      | result						| 98.7								|
      | units						| F									|
      | low							| 95								|
      | high						| 102								| 
	And the VPR results contain:
	  | field						| value								|
	  | uid							| CONTAINS urn:va:vital:9E7A:100184	|
      | summary						| BLOOD PRESSURE 146/92 mm[Hg]		|
      | typeName					| BLOOD PRESSURE					|
      | displayName					| BP								|
      | result						| 146/92							|
	  | units						| mm[Hg]							|
      | low							| 100/60							|
      | high						| 210/110							|
        
        
@f100_4_vitals_vpr
Scenario: client can request vitals in VPR format.  
    Given a patient with "vitals" in multiple VistAs
    Given a patient with pid "C877;737" has been synced through Admin API
    When the client requests vitals for the patient "C877;737" in VPR format
	Then the client receives 4 VPR "VistA" result(s)
	Then the client receives 4 VPR "kodak" result(s)
    And the VPR results contain:
      | field						| value								|
      | uid							| CONTAINS urn:va:vital:C877:737	|
      | qualifiers.name				| ORAL								|
      | qualifiers.vuid				| 4500642							|
      | summary						| TEMPERATURE 99 F					|
      | typeName					| TEMPERATURE						|
      | displayName					| T									|
      | result						| 99								|
      | units						| F									|
      | low							| 95								|
      | high						| 102								| 
	And the VPR results contain:
	  | field						| value								|
	  | uid							| CONTAINS urn:va:vital:C877:737	|
      | summary						| RESPIRATION 40 /min				|
      | typeName					| RESPIRATION						|
      | displayName					| R									|
      | result						| 40								|
      | units						| /min								|
      | low							| 8									|
      | high						| 30							|

# negative test case
      
@f100_5_vitals_neg_vpr	
Scenario: Negative scenario.  Client can request vital results in VPR format
Given a patient with "No vital results" in multiple VistAs
Given a patient with pid "1006184063V088473" has been synced through Admin API
When the client requests vitals for the patient "1006184063V088473" in VPR format
Then a successful response is returned
Then corresponding matching records totaling "0" are displayed
           
