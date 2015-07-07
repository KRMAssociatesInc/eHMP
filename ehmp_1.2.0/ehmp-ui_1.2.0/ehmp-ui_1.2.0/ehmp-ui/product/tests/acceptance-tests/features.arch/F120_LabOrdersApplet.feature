@F120_LabOrdersApplet @future
Feature: F120 JLV GUI Refactoring to use VistA Exchange Lab Orders Applet Test

@f120_1_lab_orders_summary @US1503
Scenario: View Lab Orders Summary Applet
	Given user is logged into eHMP-UI
	And user views screen "lab-orders-list" in the eHMP-UI
	#Given user enters "OneHundredSixteen,Patient" in the search box
	Given user enters "Eight,Patient" in the search box
	Then the search results display 2 results
	Given user selects patient 0 in the list
	Then the panel title is "Lab Orders/Panel Results"
	Then the Lab Orders table contains headers
		|Headers|
		|Date |
		|Orders/Results |
		|Source System|
	And the table contains rows
        | Date          | Orders/Results      | Source System         | 
        | 2005-03-17    | CPK PROFILE         | CAMP MASTER           | 
        | 2005-03-17    | HEMOGLOBIN A1C      | CAMP MASTER           | 
        | 2005-03-17    | CHOLESTEROL         | CAMP MASTER           | 
        | 2004-03-28    | CHEM 7              | TROY                  | 


@f120_2_lab_orders_details @US1502
Scenario: View Lab Orders Detail Modal
	Given user is logged into eHMP-UI
	And user views screen "lab-orders-list" in the eHMP-UI
	#Given user enters "OneHundredSixteen,Patient" in the search box
	Given user enters "Eight,Patient" in the search box
	Then the search results display 2 results
	Given user selects patient 0 in the list
	Then the lab order panel title is "Lab Orders/Panel Results"
	When the user clicks "Lab Orders Row Click"
    Then the modal title is "Lab Results/Details"
	Then the Lab Results Details modal contains headers
		|Headers                |
		|Observed Date          |
		|Test Name              |
		|Standardized Test Name |
		|Specimen               |
		|Results                |
		|Units                  |
		|Reference Range        |
		|Source System          |
    And the modal contains rows
	  | Observed Date| Test Name                    | Standardized Test Name                    | Specimen | Results | Units | Reference Range | Source System          | 
      | 2007-06-21   | Ammonia, Plasma Quantitative | Ammonia [Mass/volume] in Plasma           | PLASMA   | 5       | Units | (19-60)         | 4th Medical Group/0090 | 
      | 2007-11-28   | CHLORIDE                     | Chloride [Moles/volume] in Serum or Plasma| SERUM    | 100     | meq/L |                 | CAMP MASTER            | 
      | 2007-11-28   | CHLORIDE                     | Chloride [Moles/volume] in Serum or Plasma| SERUM    | 100     | meq/L |                 | CAMP BEE               | 
      | 2013-05-07   | Sodium, Blood Quantitative   | Sodium [Moles/volume] in Blood            | PLASMA   | 139     | meq/L |  134-146        | NH Great Lakes IL/0056 | 
    When the user clicks "Lab Results Close"
    Then the panel title is "Lab Orders/Panel Results"



@f120_3_lab_orders_details @US1502a
Scenario: View Lab Orders Detail Modal
	Given user is logged into eHMP-UI
	And user views screen "lab-orders-list" in the eHMP-UI
	#Given user enters "OneHundredSixteen,Patient" in the search box
	Given user enters "Eight,Patient" in the search box
	Then the search results display 2 results
	Given user selects patient 0 in the list
	Then the lab order panel title is "Lab Orders/Panel Results"
	When the user clicks "Lab Orders Row Click"
    Then the modal title is "Lab Results/Details"
	Then the Lab Results Details modal contains headers
		|Headers                |
		|Observed Date          |
		|Test Name              |
		|Standardized Test Name |
		|Specimen               |
		|Results                |
		|Units                  |
		|Reference Range        |
		|Source System          |
    And the modal contains rows
	  | Observed Date| Test Name                    | Standardized Test Name                    | Specimen | Results | Units | Reference Range | Source System          | 
      | 2007-06-21   | Ammonia, Plasma Quantitative | Ammonia [Mass/volume] in Plasma           | PLASMA   | 5       | Units | (19-60)         | 4th Medical Group/0090 | 
      | 2007-11-28   | CHLORIDE                     | Chloride [Moles/volume] in Serum or Plasma| SERUM    | 100     | meq/L |                 | CAMP MASTER            | 
      | 2007-11-28   | CHLORIDE                     | Chloride [Moles/volume] in Serum or Plasma| SERUM    | 100     | meq/L |                 | CAMP BEE               | 
      | 2013-05-07   | Sodium, Blood Quantitative   | Sodium [Moles/volume] in Blood            | PLASMA   | 139     | meq/L |  134-146        | NH Great Lakes IL/0056 | 
    When the user clicks "Lab Results X Close"
    Then the panel title is "Lab Orders/Panel Results"