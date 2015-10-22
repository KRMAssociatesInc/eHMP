@US2411 @regression 
Feature: F144 - eHMP viewer GUI - Active Problems
#Team Neptune 

@US2411a
Scenario: User uses the active problems coversheet to view modal
	Given user is logged into eHMP-UI
	And user searches for and selects "Eight,Patient"
	Then Cover Sheet is active
	Then the "patient identifying traits" is displayed with information
		| field			| value 				|
		| patient name	| Eight,Patient			|
    #When the "Problems table" contain 15 items
	When the user clicks the "Diabetes Mellitus Type II or unspecified"	
    Then the modal view contains the headers
     |Diabetes Mellitus Type II or unspecified (ICD-9-CM 250.00)|
   # And the "Modal Body" contain 11 items
    And the modal body contains the rows
     | Primary ICD-9-CM:| 250.00 |
     |SNOMED CT: |  |
     | Onset: | 05/02/1998 | 
     | Acuity:| Chronic |
     | Status:| Active |
     | Provider: | Vehu,Eight |
     |Facility:  | CAMP MASTER | 
     |Location:  | Primary Care | 
     | Entered: |05/08/2000 | 
     | Updated: |03/30/2004 |    
    Then the user clicks the "Modal X Button"
   # When the "Problems table" contain 15 items
    Then the Problems coversheet headers are
	 | Headers |
	 | Description |
	 | Acuity |
	 | Status |
	#And the Problems table contains the rows
	 #| Description | Acuity | Status |
     #|Acute myocardial infarction, unspecified site, episode of care unspecified|  <!-- \n  \n    <span class="text-muted">Unknown</span>\n  \n -->\n\n<span class="acuityType">Unknown</span> | 
	 #| Hyperlipidemia | <!-- \n  <span class="text-muted">Chronic</span>\n -->\n\n<span class="acuityType">Chronic</span>| 
	 
@US2411b @DE1056
Scenario: User uses the active problems coversheet to filter and sort
    Given user is logged into eHMP-UI
	And user searches for and selects "Eight,Patient"
	Then Cover Sheet is active
	Then the "patient identifying traits" is displayed with information
		| field			| value 				|
		| patient name	| Eight,Patient			|
    When the "Problems table" contain 27 items
    #And the Problems coversheet contains 3 pages
    Then the Problems coversheet headers are
	 | Headers |
	 | Description |
	 | Acuity |
	 | Status|
	Then the Problems table contains the first row
	 | Description | Acuity | Status |
	 | Diabetes Mellitus Type II or unspecified | Chronic | Active |
	When the user clicks the "Problems Description"
	When the user clicks the "Problems Filter Button"
	And the user enters "Dia" into the "Problems Filter Field"
	And the "Problems table" contain 5 items
	#And the Problems coversheet contains 1 pages
  	Then the Problems table contains the first row
	 | Description | Acuity | Status |
	 | Diabetes Mellitus Type II or unspecified |Chronic|Active|

@US2411c @DE1056
Scenario: User uses the active problems expanded to view modal
Given user is logged into eHMP-UI
	And user searches for and selects "Eight,Patient"
	Then Cover Sheet is active
	Then the "patient identifying traits" is displayed with information
		| field			| value 				|
		| patient name	| Eight,Patient			|
	When the user clicks the "Problems Expand Button"
	When the user clicks the "Diabetes Mellitus Type II or unspecified"	
    And the "Modal Body" contain 12 items
    And the modal body contains the rows
      | Primary ICD-9-CM:| 250.00 |
     |SNOMED CT: |  |
     | Onset: | 05/02/1998 | 
     | Acuity:| Chronic |
     | Provider: | Vehu,Eight |
     |Facility:  | CAMP MASTER | 
     |Location:  | Primary Care | 
     | Entered: |05/08/2000 | 
     | Updated: |03/30/2004 |
    Then the user clicks the "Modal X Button"
    And the Problems expanded headers are
	 | Headers |
	 | Description |
	 | Standardized Description |
	 | Acuity |
	 | Status |
	 | Onset Date | 
	 | Last Updated| 
	 | Provider| 
	 | Facility | 
	 | Comments | 
	And the Problems table contains the rows
	 | Description | Standardized Description | Acuity | Status | Onset Date | Last Updated | Provider | Facility | Comments |
	 | limb swelling | Swelling of limb (finding) | <!-- \n  <span class="text-muted">Chronic</span>\n -->\n\n<span class="acuityType">Chronic</span> | Active| 12/05/2013 | 12/05/2013| Midtier, Cgl Two | DOD | <span class="fa fa-transparent-comment"></span> |

@US2411d @DE1056
Scenario: User uses the active problems expanded to filter and sort
    Given user is logged into eHMP-UI
	And user searches for and selects "Eight,Patient"
	Then Cover Sheet is active
	Then the "patient identifying traits" is displayed with information
		| field			| value 				|
		| patient name	| Eight,Patient			|
	When the user clicks the "Problems Expand Button"
    Then the Problems expanded headers are
	 | Headers |
	 | Description |
	 | Standardized Description |
	 | Acuity |
	 | Status |
	 | Onset Date | 
	 | Last Updated| 
	 | Provider| 
	 | Facility | 
	 | Comments | 
	Then the Problems table contains the first row
	 | Description | Standardized Description | Acuity | Status | Onset Date | Last Updated | Provider | Facility | Comments |
	 |Diabetes Mellitus Type II or unspecified| | Chronic | Active | 05/02/1998 | 03/30/2004 | Vehu,Eight|  TST1 | |
	When the user clicks the "Problems Acuity"
	And the "Problems table" contain 27 items
	And the user clicks the "Problems Filter Button"
	And the user enters "Dia" into the "Problems Filter Field"
	And the "Problems table" contain 5 items
	