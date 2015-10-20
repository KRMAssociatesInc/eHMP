#Team Neptune
@US1787 @US1509  @regression
Feature:F144-eHMP Viewer GUI - Problem List

@base @US1787_base
Scenario: User will be able view conditions
    Given user is logged into eHMP-UI
    And user searches for and selects "Eight,Patient"
    Then Cover Sheet is active
    Then the Active Problems coversheet table contains headers
       | Headers     |
       | Description |
       | Acuity      |
       | Status      |
    Then user sees Active Problems table display
        |Description                                | Acuity  | Status |
        |Diabetes Mellitus Type II or unspecified   | Chronic | Active |

@US1787 @US1509
Scenario: Users will be able to navigate coversheet, maximized and modal view 
	Given user is logged into eHMP-UI
	And user searches for and selects "Eight,Patient"
	Then Cover Sheet is active
	Then the "patient identifying traits" is displayed with information
		| field			| value 				|
		| patient name	| Eight,Patient 	    |
	And the applets are displayed on the coversheet
		| applet 					|
		| CONDITIONS 		 	    |

     Then the Active Problems coversheet table contains headers
       | Headers     |
       | Description |
       | Acuity      |
       | Status      |

    Then the user clicks the "Problems Expand Button"

    Then user sees Active Problems table display
	|Description      | Standardized Description         | Acuity  | Status                           |Onset Date | Last Updated    | Provider        |Facility | |
	|Diabetes Mellitus Type II or unspecified|           | Chronic | Active                           |05/02/1998 |03/30/2004      |Vehu,Eight       | TST1     | |

    When the user clicks the "Occasional, uncontrolled chest pain"
    And the user clicks the "Info button"
    And the modal's title is "Occasional, uncontrolled chest pain (ICD-9-CM 411.1)"
    Then user sees Active Problems Modal table display
     | header 1         | header 2              |
     | Primary ICD-9-CM:| 411.1                 |
     | SNOMED CT:       | 25106000              |
     | Onset:           | 03/15/1996            |
    When the user clicks the "Modal Close Button"
    Then the modal closes
    And the user clicks the "Problems Filter Button"
    When the user enters "Hyperlipidemia" into the "Problems Filter Field"


