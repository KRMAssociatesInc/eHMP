@F137 @f137_pagination @US1805 @patient
Feature: F137 - SDK Expansion and Enhancement - Pagination

@US1805 @f137_pagination_1 @vxsync @enrich
Scenario: Client can request a resource with a start and a limit query parameter
	Given a patient with pid "10108V420871" has been synced through the RDK API
	When the client requests "order" resource for the patient "10108V420871" in RDK format 
	Then the client receives 447 pagination results
	When the client requests "order" resource for the patient "10108V420871" starting with 0 and limited to 2 
	Then the client receives 2 pagination results
	And the VPR results contain
      | field               | panorama_valu							|
      | uid                 | urn:va:order:9E7A:3:38316				|
    And the VPR results contain
      | field               | panorama_valu							|
      | uid                 | urn:va:order:C877:3:38316 			|

@US1805 @f137_pagination_3  @vxsync @enrich
Scenario: Client can request a resource with a start and a limit query parameter, starting with a record offset given by the start parameter
	Given a patient with pid "10108V420871" has been synced through the RDK API
	When the client requests "order" resource for the patient "10108V420871" in RDK format 
	Then the client receives 447 pagination results
	When the client requests "order" resource for the patient "10108V420871" starting with 2 and limited to 2 
	Then the client receives 2 pagination results
	And the VPR results contain
      | field               | panorama_valu							|
      | uid                 | urn:va:order:9E7A:3:38312				|
    And the VPR results contain
      | field               | panorama_valu							|
      | uid                 | urn:va:order:C877:3:38312				|

@US1805 @f137_pagination_2 @vxsync @enrich
Scenario: Client can request a resource with only a limit query parameter and the result will start at the 1st record
	Given a patient with pid "10108V420871" has been synced through the RDK API
	When the client requests "order" resource for the patient "10108V420871" in RDK format 
	Then the client receives 447 pagination results
	When the client requests "order" resource for the patient "10108V420871" limited to 2 
	Then the client receives 2 pagination results
	And the VPR results contain
      | field               | panorama_valu							|
      | uid                 | urn:va:order:9E7A:3:38316				|
    And the VPR results contain
      | field               | panorama_valu							|
      | uid                 | urn:va:order:C877:3:38316				|


@US1805 @f137_pagination_4 @vxsync @enrich
Scenario: Client can request a resource with only a start query parameter
	Given a patient with pid "10108V420871" has been synced through the RDK API
	When the client requests "order" resource for the patient "10108V420871" in RDK format 
	Then the client receives 447 pagination results
	When the client requests "order" resource for the patient "10108V420871" starting with 427 
	Then the client receives 20 pagination results
	And the VPR results contain
      | field               | panorama_valu							|
      | uid                 | urn:va:order:C877:3:12540				|

@US1805 @f137_pagination_5 @vxsync @enrich
Scenario: When a client requests a resource with a start query parameter greater then the client will receive 0 results
	Given a patient with pid "10108V420871" has been synced through the RDK API
	When the client requests "order" resource for the patient "10108V420871" in RDK format 
	Then the client receives 447 pagination results
	When the client requests "order" resource for the patient "10108V420871" starting with 447 
	Then the client receives 0 pagination results

@US1805 @f137_pagination_6 @vxsync @enrich
Scenario: When a client requests a resource with a limited query parameter greater then expected results then the client will receive the expected results
	Given a patient with pid "10108V420871" has been synced through the RDK API
	When the client requests "order" resource for the patient "10108V420871" in RDK format 
	Then the client receives 447 pagination results
	When the client requests "order" resource for the patient "10108V420871" starting with 445 and limited to 5 
	Then the client receives 2 pagination results
	And the VPR results contain
      | field               | panorama_valu							|
      | uid                 | urn:va:order:C877:3:12540 			|
    And the VPR results contain
      | field               | panorama_valu							|
      | uid                 | urn:va:order:ABCD:92:7141.1			|

@US1805 @f137_pagination_7 
Scenario: When a client requests patient-search-full-name with a start and a limit query parameter
	When the client requests full name patient search with name "Eight"
	Then the client receives 38 pagination results
	When the client requests full name patient search with name "Eight" starting with 0 and limited to 2
	Then the client receives 2 pagination results

@US1805 @f137_pagination_8 @vxsync @enrich
Scenario: When a client requests patient-search-last5 with a start and a limit query parameter
	When the client requests last5 patient search with "E0008"
	Then the client receives 1 pagination results
	When the client requests last5 patient search with "E0008" starting with 0 and limited to 1
	Then the client receives 1 pagination results

@US1805 @f137_pagination_9 @DE54 @vxsync @patient @11016V630869
Scenario: When a client requests patient-record-labsbyorder with a start and a limit query parameter
	Given a patient with pid "11016V630869" has been synced through the RDK API
    When the client requests lab orders for the patient "11016V630869" and order "urn:va:order:9E7A:227:16682" in VPR format from RDK API
    And the client receives 7 VPR VistA result(s)
    When the client requests lab orders for the patient "11016V630869" and order "urn:va:order:9E7A:227:16682" starting with 2 and limited to 2
    And the client receives 2 VPR VistA result(s)
