Feature: Labs Applet Test

@labs_applet @table @future
Scenario: First test to verify labs applet
	Given user is logged into eHMP-UI
	And user views screen "lab-list" in the eHMP-UI
	Given user enters "Eight,Patient" in the search box
	Then the search results display 2 results
	Given user selects patient 0 in the list
	Then the panel title is "Labs"
	And the Lab table contains headers
		|Headers|
		|Type|
		|Specimen|
		|Result|
		|Units|
		|Low|
		|High|
		
	And the table contains rows
	  | Observed Date | Test Name                    | Specimen  | Source System          | 
      | 2007-06-21    | Ammonia, Plasma Quantitative |  PLASMA   | 4th Medical Group/0090 | 
      | 2007-11-28    | CHLORIDE |  SERUM   | CAMP MASTER | 
      | 2007-11-28    | CHLORIDE |  SERUM   | CAMP BEE | 