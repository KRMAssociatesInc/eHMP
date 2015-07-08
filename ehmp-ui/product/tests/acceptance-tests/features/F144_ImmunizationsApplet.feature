@US2171 @regression @debug
Feature: F144 - eHMP viewer GUI - Immunizations
#Team Neptune

@base @US2171_coversheet_only
Scenario: User uses the Immunizations coversheet to sort and filter
	Given user is logged into eHMP-UI
	And user searches for and selects "Eight,Patient"
	Then Cover Sheet is active
	Then the "patient identifying traits" is displayed with information
		| field			| value 				|
		| patient name	| Eight,Patient			|
    Then the immunizations coversheet table contains headers
	 | Headers |
	 | Vaccine Name |
	 | Reaction |
	 | Date | 
	 | Facility |
	And the immunizations table contains rows
	 | Vaccine Name | Reaction | Date | Facility | 
	 | Tdap | <p class="text-muted"><em></em></p> | 01/13/2014 | DOD |

@US2171a
Scenario: User uses the Immunizations coversheet to sort and filter
	Given user is logged into eHMP-UI
	And user searches for and selects "Eight,Patient"
	Then Cover Sheet is active
	Then the "patient identifying traits" is displayed with information
		| field			| value 				|
		| patient name	| Eight,Patient			|
    When the "Immunizations table" contain 22 items
    Then the immunizations coversheet table contains headers
	 | Headers |
	 | Vaccine Name |
	 | Reaction |
	 | Date | 
	 | Facility |
	And the immunizations table contains rows
	 | Vaccine Name | Reaction | Date | Facility | 
	 | Tdap | <p class="text-muted"><em></em></p> | 01/13/2014 | DOD |
	And the user clicks the "Immunizations Filter Button"
	And the user enters "pne" into the "Immunizations Filter Field"
	Then the "Immunizations table" contain 1 items
	And the immunizations table contains rows
	 | Vaccine Name | Reaction | Date | Facility | 
	 | PNEUMOCOCCAL | <p class="text-muted"><em></em></p>| 04/04/2000 | NJS |

@US2171b
Scenario: User uses the Immunizations expanded to sort and filter
	Given user is logged into eHMP-UI
	And user searches for and selects "Eight,Patient"
	Then Cover Sheet is active
	Then the "patient identifying traits" is displayed with information
		| field			| value 				|
		| patient name	| Eight,Patient			|
	When the user clicks the "Immunizations Expand Button"
    And the "Immunizations table" contain 22 items
    Then the immunizations expanded table contains headers
	 | Headers |
	 | Vaccine Name |
	 | Standardized Name |
	 | Reaction | 
	 | Series |
	 | Repeat Contraindicated |
	 | Date |
	 | Facility |
	 | Comments |
	And the immunizations table contains rows
	 | Vaccine Name | Standardized Name | Reaction | Series | Repeat Contraindicated | Date | Facility | Comments | 
	 | Tdap | tetanus toxoid, reduced diphtheria toxoid, and acellular pertussis vaccine, adsorbed | <p class="text-muted"><em></em></p> | 0 | No | 01/13/2014 | DOD | <span class="fa fa-transparent-comment"></span>|
	And the user clicks the "Immunizations Filter Button"
	And the user enters "Ant" into the "Immunizations Filter Field Expand"
	Then the "Immunizations table" contain 2 items