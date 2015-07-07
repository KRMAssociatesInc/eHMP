#Team Neptune
@US3702 @US4540 @regression
Feature:F172 User-Defined Screens
	
@DE949
Scenario: Users will be able to see dropdown option in coversheet for screen selection
	Given user is logged into eHMP-UI
	And user searches for and selects "Eight,Patient"
	Then Cover Sheet is active
	And the "patient identifying traits" is displayed with information
		| field			| value 				|
		| patient name	| Eight,Patient 	    |
	And the applets are displayed on the coversheet
		| applet 					|
		| CONDITIONS	 			|
		| LAB RESULTS				|
		| VITALS 					|
		| MEDICATIONS				|
		| ALLERGIES					|
		| IMMUNIZATIONS				|
		| ORDERS					|
		| APPOINTMENTS				|
		| COMMUNITY HEALTH SUMMARIES|
	When the user clicks the "CoversheetDropdown Button"
	Then the CoversheetDropdown table contains headers
	|Coversheet|
	|Timeline|
	|Meds Review|
	|Documents|
	|Overview|

@US4540a @future
Scenario: Users will be able to filter in the drop down menu 
	Given user is logged into eHMP-UI
	And user searches for and selects "Eight,Patient"
	And Cover Sheet is active
	And the "patient identifying traits" is displayed with information
		| field			| value 				|
		| patient name	| Eight,Patient			|
	When the user clicks the "Drop down" on the drop down menu
	And there are 5 "screens" on the drop down menu
	And the drop down menu contains the following rows
		| Coversheet |
		| Timeline |
		| Overview |
		| Meds Review |
		| Documents |