@F295_encounters_gist @regression
Feature: F295 - Encounters Applet

# Team - Jupiter

@F295_encounters_initial_view @base
Scenario: User views the encounters gist view
	Given user is logged into eHMP-UI
	And user searches for and selects "Sixhundred,Patient"
  	Then Overview is active
  	And user sees Encounters Gist
  	And the Encounters Gist Applet details view has headers
  	| Header Id 	| Headers Text	|
  	| Description	| Encounter 	|
  	| Event			| Hx Occurrence	|
  	| Age			| Last 		  	|

@F295_encounters_initial_view @F295-1.1 @F295-1.2 @F295-1.3 @F295_4 @F295-1.5 @F295-1.7 @US3706 @US4001 @US4154 @US5126
Scenario: User views the encounters gist view
	Given user is logged into eHMP-UI
	And user searches for and selects "Sixhundred,Patient"
  	Then Overview is active
  	And user sees Encounters Gist
	And the user has selected All within the global date picker
  	And the Encounters Gist Applet details view has headers
  	| Header Id 	| Headers Text	|
  	| Description	| Encounter 	|
  	| Event			| Hx Occurrence	|
  	| Age			| Last 		  	|
	And the Encounters Gist Applet detail view contains
	| Description	| Occurrence| 
	| Visits		| 4			|
	| Appointments	| 10		| 
	| Admissions	| 0			| 
	| Procedures	| 2			| 

@F295_encounters_visit_view @F295-1.9 @295-10.1 @295-10.2 @295-10.3 @295-10.4 @295-10.5 @295-10.6 @295-10.7 @295-10.8 @295-10.9 @295-10.10 @US3706 @US4001 @US4154 @US5126
Scenario: Presence of dynamic arrow for Visits group and Visits expansion
	Given user is logged into eHMP-UI
	And user searches for and selects "Sixhundred,Patient"
  	Then Overview is active
  	And user sees Encounters Gist
  	And the user has selected All within the global date picker
  	And there is a dynamic arrow next to visits in Encounters Gist Applet
  	When the user expands "Visits" in Encounters Gist Applet
  	Then Encounters Gist Applet "Visits" grouping expanded view contains headers
 	| Visit Type	| Hx Occurrence	| Last	|
  	And the Encounters Gist Applet "Visits" grouping expanded view contains
	| Visit Type					| Hx Occurrence	| 	
	| GENERAL INTERNAL MEDICINE		| 2			    | 
	| CARDIOLOGY					| 2				| 
  	
@F295_encounterGist_expanded_view @F295-2.1 @F295-2.2 @F295-2.3 @F295-2.4 @F295-2.5 @F295-12.1 @F295-12.2 @US4154 @US5126
Scenario: View Encounters Applet Gist - Single Page by clicking on Expand View
  	Given user is logged into eHMP-UI
  	And user searches for and selects "Sixhundred,PATIENT"
  	Then Overview is active
  	And user sees Encounters Gist
  	When the user clicks the control "Expand View" in the "Encounters Gist applet"
  	Then "Timeline" is active   	
  	When user exits the Timeline Applet
  	Then user sees Encounters Gist

#test converted to new framework. Added debug tag to this  	
@F295_encounterGist_filtering @F295-3.1 @F295-3.2 @F295-3.3 @F295-3.4 @F295-11.1 @F295-11.2 @F295-11.3 @US4154 @US5126 @US4001 @DE1268 @debug
Scenario: Encounters Applet Gist - filter encounters
  	Given user is logged into eHMP-UI
  	Given user searches for and selects "Sixhundred,Patient"
  	Then Overview is active
  	And user sees Encounters Gist
  	And the user has selected All within the global date picker
    And the Encounters Gist Applet detail view contains
  | Description | Occurrence |
  | Visits      | 4  |
  	When the user clicks the control "Filter Toggle" in the "Encounters Gist applet"
  	And the user inputs "Cardiology" in the "Text Filter" control in the "Encounters Gist applet"
  	And the Encounters Gist Applet detail view contains
  | Description | Occurrence |
	| Visits    | 2	|
	And the user inputs "Agilex" in the "Text Filter" control in the "Encounters Gist applet"
	And the Encounters Gist Applet detail view contains
  | Description | Occurrence |
	| Visits		| 0	|
	| Appointments	| 0	|
	| Admissions	| 0	|
	| Procedures	| 0	|
	When the user closes the search filter in Encounters Gist Applet
	And the Encounters Gist Applet detail view contains
  | Description     | Occurrence |
	| Visits	    | 4			 |
	| Appointments	| 10		 |
	| Admissions	| 0			 |
	| Procedures	| 2			 |

@F295_encounterGist_quick_view_visits @F295-4.1 @F295-4.2 @F295-4.3 @F295-4.4 @F295-4.5 @F295-4.6 @US4154 @US5126
Scenario: Encounters Applet Gist - quick view of Visits
  	Given user is logged into eHMP-UI
  	Given user searches for and selects "Sixhundred,Patient"
  	Then Overview is active
  	And user sees Encounters Gist
  	And the user has selected All within the global date picker
  	When user hovers over and selects the right side of the "Visits" tile
  	Then quick view table with title "Recent Visits" appears
  	And the "Encounters Gist Quick View - Visits" table contains headers
    | Date | Appt Status | Clinic Name | Provider	| Facility	|
    And the "Encounters Gist Quick View - Visits" table contains 4 rows 
  	And the "Encounters Gist Quick View - Visits" table contains rows
	| Date 		 | Appt Status	| Clinic Name 				| Providers	| Facility	|
	| 11/02/2006 | Unknown 	  	| GENERAL INTERNAL MEDICINE | Unknown 	| 888		|
	| 11/02/2006 | Unknown 	  	| GENERAL INTERNAL MEDICINE | Unknown	| 888		|
	| 02/04/2005 | Unknown 		| CARDIOLOGY 				| Unknown 	| 888		|
	| 02/03/2005 | Unknown 		| CARDIOLOGY 				| Unknown 	| 888		|
	When user hovers over and selects the right side of the "Visits" tile
	Then Quick View draw box for "Visits" closes
  	
@F295_encounterGist_multioption_menu_visits @F295-4.7 @F295-4.8 @US4154 @US5126 @DE1388
Scenario: Encounters Applet Gist - Multi option menu display
  	Given user is logged into eHMP-UI
  	Given user searches for and selects "Sixhundred,Patient"
  	Then Overview is active
  	And user sees Encounters Gist
  	And the user has selected All within the global date picker 
  	When the user expands "Visits" in Encounters Gist Applet
 	When user clicks on the "Left" hand side of the "Visit Type" "GENERAL INTERNAL MEDICINE" 
  	Then a Menu appears on the Encounters Gist 
  	When user clicks on the "Right" hand side of the "Visit Type" "GENERAL INTERNAL MEDICINE"
  	Then a Menu appears on the Encounters Gist 
  	
@F295_encounterGist_multioption_menu_quick_view @F295-4.7 @F295-4.8 @F295-14.1 @F295-14.2 @F295-14.3 @F295-14.4 @F295-14.5 @F295-14.5 @F295-14.6 @F295-14.7 @F295-14.8 @US4154 @US5126 @future
Scenario: Encounters Applet Gist - quick view of Visit Type thro' multi option menu
  	Given user is logged into eHMP-UI
  	Given user searches for and selects "Sixhundred,Patient"
  	Then Overview is active
  	And user sees Encounters Gist
  	And the user has selected All within the global date picker 
  	When the user expands "Visits" in Encounters Gist Applet
 	When user clicks on the "Left" hand side of the "Visit Type" "GENERAL INTERNAL MEDICINE"
  	Then a Menu appears on the Encounters Gist 
  	When user select the menu "Quick View Icon" in Encounters Gist
  	Then the "Encounters Gist Quick View - Visit Type" table contains headers
    | Date | Appt status | Location | Provider | Facility |
  	And the "Encounters Gist Quick View - Visit Type" table contains rows
	| Date		 | Appt status	| Location	| Provider | Facility	|
	| 11/02/2006 | Unknown 		| 20 Minute | Unknown  | 888		|
	| 11/02/2006 | Unknown 		| 20 Minute | Unknown  | 888		|
	When user select the menu "Quick View Icon" in Encounters Gist
	Then Quick View draw box for "Visit Type" closes

@F295_visit_quick_view @F295-14.1 @F295-14.2 @F295-14.3 @F295-14.4 @F295-14.5 @F295-14.6 @F295-14.7 @F295-14.8 @US4154 @US5126 @DE1388
Scenario: Encounters Applet Gist - quick view of Visit Type by right clicking
  	Given user is logged into eHMP-UI
  	Given user searches for and selects "Sixhundred,Patient"
  	Then Overview is active
  	And user sees Encounters Gist
  	And the user has selected All within the global date picker 
  	When the user expands "Visits" in Encounters Gist Applet
 	When user clicks on the "Right" hand side of the "Visit Type" "GENERAL INTERNAL MEDICINE" 
  	Then the "Encounters Gist Quick View - Visit Type" table contains headers
    | Date | Appt status | Location | Provider | Facility |
  	And the "Encounters Gist Quick View - Visit Type" table contains rows
	| Date		 | Appt status	| Location	| Provider | Facility	|
	| 11/02/2006 | Unknown 		| 20 Minute | Unknown  | 888		|
	| 11/02/2006 | Unknown 		| 20 Minute | Unknown  | 888		|
	When user clicks on the "Right" hand side of the "Visit Type" "GENERAL INTERNAL MEDICINE"
	Then Quick View draw box for "Visit Type" closes

#test converted to new framework. Adding debug tag to this test.  	
@F295_multioption_menu_visit_detail_view @F295-4.7 @F295-4.8 @F295-12.4 @F295-12.5 @F295-14.1 @F295-14.2 @F295-14.3 @F295-14.4 @F295-14.5 @F295-14.6 @F295-14.7 @F295-14.8 @US4154 @US5126 @debug
Scenario: Encounters Applet Gist - detail view of Visit Type thro' multi option menu
  	Given user is logged into eHMP-UI
  	Given user searches for and selects "Sixhundred,Patient"
  	Then Overview is active
  	And user sees Encounters Gist
  	And the user has selected All within the global date picker 
  	When the user expands "Visits" in Encounters Gist Applet
 	When user clicks on the "Left" hand side of the "Visit Type" "GENERAL INTERNAL MEDICINE" 
  	Then a Menu appears on the Encounters Gist 
  	When user select the menu "Detail View Icon" in Encounters Gist
  	Then it should show the detail modal of the most recent encounter
	And the modal's title is "GENERAL INTERNAL MEDICINE"
	And the "Visit" modal contains data
	| field 			| value				|	
	| Date				| 11/02/2006 - 15:28|
	| Type 				| 20 Minute Visit	|
	| Category 			| Outpatient Visit	|
	| Patient Class		| Ambulatory		|
	| Appointment Status| Unknown			|
	| Location 			| 20 Minute			|
	| Stop Code			| GENERAL INTERNAL MEDICINE|
	| Facility 			| FT. LOGAN			|
	And the user closes modal by clicking the "Close" control	

@F295_encounterGist_Column_Sorting_Visit_Type @F295-13.1 @F295-13.2 @US4684 @US4154 @US5126
Scenario: Encounter Gist Applet is sorted by the column header Visit Type under Visit.
  Given user is logged into eHMP-UI
  Given user searches for and selects "ZZZRETFOURFIFTYEIGHT,PATIENT"
  Then Overview is active
  And user sees Encounters Gist
  And the user has selected All within the global date picker
  When the user expands "Visits" in Encounters Gist Applet
  When user clicks on the column header "Visit Type" in Encounters Gist
  Then "Visit Type" column is sorted in ascending order in Encounters Gist
  When user clicks on the column header "Visit Type" in Encounters Gist
  Then "Visit Type" column is sorted in descending order in Encounters Gist
  
@F295_encounterGist_Column_Sorting_Hx_Occurrence @F295-13.1 @F295-13.2 @US4684 @US4154 @US5126
Scenario: Encounters Gist Applet is sorted by the column header Hx Occrrence
  Given user is logged into eHMP-UI
  And user searches for and selects "ZZZRETFOURFIFTYEIGHT,PATIENT"
  Then Overview is active
  And user sees Encounters Gist
  And the user has selected All within the global date picker
  When the user expands "Visits" in Encounters Gist Applet
  When user clicks on the column header "Hx Occurrence" in Encounters Gist
  Then "Hx Occurrence" column is sorted in ascending order in Encounters Gist
  When user clicks on the column header "Hx Occurrence" in Encounters Gist
  Then "Hx Occurrence" column is sorted in descending order in Encounters Gist

#Following test has a tendency to fail since the data is not constant.  Due to calculation of dates, data is prone to chagne.
# so the test needs to be tested manually
@F295_encounterGist_Column_Sorting_last @F295-13.1 @F295-13.2 @US4684 @US4154 @US5126 @debug
Scenario: Encounters Gist Applet is sorted by the column header Last
  Given user is logged into eHMP-UI
  And user searches for and selects "ZZZRETFOURFIFTYEIGHT,PATIENT"
  Then Overview is active
  And user sees Encounters Gist
  And the user has selected All within the global date picker
  When the user expands "Visits" in Encounters Gist Applet
  When user clicks on the column header "Last" in Encounters Gist
  Then Last column is sorted in "ascending" order in Encounters Gist
  | 16y | 16y | 16y | 16y | 16y | 15y | 15y | 15y | 15y | 15y |
  When user clicks on the column header "Last" in Encounters Gist
  Then Last column is sorted in "descending" order in Encounters Gist
  | 15y | 15y | 15y | 15y | 15y | 16y | 16y | 16y | 16y | 16y |

@F295_encounters_global_datefilter @F295-9.2 @US4001
Scenario: Encounters gist applet is able to filter data based date filter search
  Given user is logged into eHMP-UI
  And user searches for and selects "Sixhundred,Patient"
  Then Overview is active
  And user sees Encounters Gist
  And the user clicks the control "Date Filter" on the "Overview"
  And the following choices should be displayed for the "Overview" Date Filter
    | Any | 2yr | 1yr | 3mo | 1mo | 7d | 72hr | 24hr |

  And the user clicks the date control "1yr" on the "Overview"
  And the user clicks the control "Apply" on the "Overview"
  And the Encounters Gist Applet detail view contains
	| Description	| Occurrence|
	| Visits		| 0			| 
	| Appointments	| 0 		| 
	| Admissions	| 0			| 
	| Procedures	| 0			| 

  And the user clicks the control "Date Filter" on the "Overview"
  And the user inputs "01/01/2006" in the "From Date" control on the "Overview"
  And the user clicks the control "Apply" on the "Overview"
  And the Encounters Gist Applet detail view contains
	| Description	| Occurrence| 
	| Visits		| 2			| 
	| Appointments	| 0 		| 
	| Admissions	| 0			| 
	| Procedures	| 0			| 


  @F295_encounters_procedures_view_b @F295-27.1 @F295-27.2 @F295-27.3 @F295-27.4 @F295-27.5 @F295-27.6 @F295-27.7 @F295-27.8 @US3706 @US4001 @US4154 @US5126
Scenario: Expansion of procedures object
  Given user is logged into eHMP-UI
  And user searches for and selects "Sixhundred,Patient"
    Then Overview is active
    And user sees Encounters Gist
    And the user has selected All within the global date picker
    When the user expands "Procedures" in Encounters Gist Applet
    Then Encounters Gist Applet "Procedures" grouping expanded view contains headers
  | Procedure name  | Hx Occurrence | Last  |
    And the Encounters Gist Applet "Procedures" grouping expanded view contains
  | Procedure name        | Hx Occurrence |  
  | PULMONARY FUNCTION INTERPRET  | 1     |
  | PULMONARY FUNCTION TEST     | 1       | 
		
@F295_encounterGist_quick_view_procedures @F295-27.1 @F295-27.2 @F295-27.3 @F295-27.4 @F295-27.5 @F295-27.6 @F295-27.7 @F295-27.8 @US4154 @US5126
Scenario: Encounters Applet Gist - quick view of Procedures
  	Given user is logged into eHMP-UI
  	Given user searches for and selects "Sixhundred,Patient"
  	Then Overview is active
  	And user sees Encounters Gist
  	And the user has selected All within the global date picker
  	When user hovers over and selects the right side of the "Procedures" tile
  	Then quick view table with title "Recent Procedures" appears
  	And the "Encounters Gist Quick View - Procedures" table contains headers
    |Date |	Procedure Name | Service | Facility|
    And the "Encounters Gist Quick View - Procedures" table contains 2 rows 
  	And the "Encounters Gist Quick View - Procedures" table contains rows
	| Date		 | Procedure Name 				| Service 		| Facility 	|
	| 02/04/2005 | PULMONARY FUNCTION INTERPRET | Unknown 		| BAY	   	|
	| 02/03/2005 | PULMONARY FUNCTION TEST 		| CP CARDIOLOGY	| TST1 		|
	When user hovers over and selects the right side of the "Procedures" tile
	Then Quick View draw box for "Procedures" closes
 	
@F295_procedures_quick_view @F295-27.1 @F295-27.2 @F295-27.3 @F295-27.4 @F295-27.5 @F295-27.6 @F295-27.7 @F295-27.8 @US4154 @US5126 @DE1388
Scenario: Encounters Applet Gist - quick view of a particular Procedure 
  	Given user is logged into eHMP-UI
  	Given user searches for and selects "Sixhundred,Patient"
  	Then Overview is active
  	And user sees Encounters Gist
  	And the user has selected All within the global date picker 
  	When the user expands "Procedures" in Encounters Gist Applet
 	When user clicks on the "Right" hand side of the "Procedure Name" "PULMONARY FUNCTION INTERPRET"
  	Then the "Encounters Gist Quick View - Procedure Name" table contains headers
    |Date 	| Service |	Provider |	Facility |
  	And the "Encounters Gist Quick View - Procedure Name" table contains rows
	| Date		| Service | Provider| Facility	|
	| 02/04/2005| Unknown |	Unknown	| BAY		|
	When user clicks on the "Right" hand side of the "Procedure Name" "PULMONARY FUNCTION INTERPRET" 	
	Then Quick View draw box for "Procedure Name" closes

@F295_multioption_menu_procedure_quick_view @F295-27.1 @F295-27.2 @F295-27.3 @F295-27.4 @F295-27.5 @F295-27.6 @F295-27.7 @F295-27.8 @US4154 @US5126 @future
Scenario: Encounters Applet Gist - quick view of a particular procedure thro' multi option menu
  	Given user is logged into eHMP-UI
  	Given user searches for and selects "Sixhundred,Patient"
  	Then Overview is active
  	And user sees Encounters Gist
  	And the user has selected All within the global date picker 
  	When the user expands "Procedures" in Encounters Gist Applet
 	When user clicks on the "Left" hand side of the "Procedure Name" "PULMONARY FUNCTION INTERPRET"
  	Then a Menu appears on the Encounters Gist 
  	When user select the menu "Quick View Icon" in Encounters Gist
  	Then the "Encounters Gist Quick View - Procedure Name" table contains headers
    |Date 	| Service |	Provider |	Facility |
  	And the "Encounters Gist Quick View - Procedure Name" table contains rows
	| Date		| Service | Provider| Facility	|
	| 02/04/2005| Unknown |	Unknown	| BAY		|
	When user select the menu "Quick View Icon" in Encounters Gist
	Then Quick View draw box for "Procedure Name" closes
	  	
@F295_multioption_menu_procedure_detail_view @F295-27.1 @F295-27.2 @F295-27.3 @F295-27.4 @F295-27.5 @F295-27.6 @F295-27.7 @F295-27.8 @US4154 @US5126
Scenario: Encounters Applet Gist - detail view of Procedure thro' multi option menu
  	Given user is logged into eHMP-UI
  	Given user searches for and selects "Sixhundred,Patient"
  	Then Overview is active
  	And user sees Encounters Gist
  	And the user has selected All within the global date picker 
  	When the user expands "Procedures" in Encounters Gist Applet
 	  When user clicks on the "Left" hand side of the "Procedure Name" "PULMONARY FUNCTION INTERPRET" 
  	Then a Menu appears on the Encounters Gist for the item "PULMONARY FUNCTION INTERPRET"
  	#When user select the menu "Detail View Icon" in Encounters Gist
    Then user selects the "PULMONARY FUNCTION INTERPRET" detail icon in Encounters Gist
  	Then it should show the detail modal of the most recent encounter
	And the modal's title is "pulmonary function interpret Details" 
  	And the "Procedure" modal contains data
  	| field			| value			|
  	| Facility 		| ABILENE (CAA)	| 
	| Type			| Procedure		| 
	| Status 		| COMPLETE		| 
	| Date/Time		| 02/04/2005 - 10:51|
	And the user closes modal by clicking the "Header_Close" control
	
@F295_encounters_Appointments_view  @US3706 @US4001 @US4154 @US5126
Scenario: Expansion of Appointments object
	Given user is logged into eHMP-UI
	And user searches for and selects "Sixhundred,Patient"
  	Then Overview is active
  	And user sees Encounters Gist
  	And the user has selected All within the global date picker
  	When the user expands "Appointments" in Encounters Gist Applet
  	Then Encounters Gist Applet "Appointments" grouping expanded view contains headers
 	| Appointment Type 	| Hx Occurrence	| Last	|
  	And the Encounters Gist Applet "Appointments" grouping expanded view contains
	| Appointment Type				| Hx Occurrence	| 	
	| GENERAL INTERNAL MEDICINE 	| 10		    | 
	
@F295_encounterGist_quick_view_appointments @F295-34.1 @F295-34.2 @F295-34.3 @F295-34.4 @F295-34.5 @F295-34.6 @F295-34.7 @US4154 @US5126
Scenario: Encounters Applet Gist - quick view of Appointments
  	Given user is logged into eHMP-UI
  	Given user searches for and selects "Sixhundred,Patient"
  	Then Overview is active
  	And user sees Encounters Gist
  	And the user has selected All within the global date picker
  	When user hovers over and selects the right side of the "Appointments" tile
  	Then quick view table with title "Recent Appointments" appears
  	And the "Encounters Gist Quick View - Appointments" table contains headers
    | Date	| Appt Status | Clinic Name	| Provider | Facility |
    And the "Encounters Gist Quick View - Appointments" table contains 5 rows 
  	And the "Encounters Gist Quick View - Appointments" table contains rows
	| Date		| Appt Status 		| Clinic Name				| Provider 			| Facility	|
	| 05/28/2004|  SCHEDULED/KEPT 	| GENERAL INTERNAL MEDICINE	| Provider, Eight 	| TST1		|
	| 05/27/2004|  SCHEDULED/KEPT	| GENERAL INTERNAL MEDICINE	| Provider, Eight 	| TST1		|
	| 05/26/2004|  SCHEDULED/KEPT	| GENERAL INTERNAL MEDICINE | Provider, Eight 	| TST1		|
	| 05/25/2004|  SCHEDULED/KEPT	| GENERAL INTERNAL MEDICINE | Provider, Eight 	| TST1		|
	| 05/24/2004|  SCHEDULED/KEPT	| GENERAL INTERNAL MEDICINE | Provider, Eight 	| TST1		|
	When user hovers over and selects the right side of the "Appointments" tile
	Then Quick View draw box for "Appointments" closes
  	
@F295_appointment_type_quick_view @F295-34.1 @F295-34.2 @F295-34.3 @F295-34.4 @F295-34.5 @F295-34.6 @F295-34.7 @US4154 @US5126 @DE1388
Scenario: Encounters Applet Gist - quick view of a particular Appointment 
  	Given user is logged into eHMP-UI
  	Given user searches for and selects "Sixhundred,Patient"
  	Then Overview is active
  	And user sees Encounters Gist
  	And the user has selected All within the global date picker 
  	When the user expands "Appointments" in Encounters Gist Applet
 	When user clicks on the "Right" hand side of the "Appointment Type" "GENERAL INTERNAL MEDICINE"
  	Then the "Encounters Gist Quick View - Appointment Type" table contains headers
    | Date	| Appt Status | Location | Provider | Facility |
  	And the "Encounters Gist Quick View - Appointment Type" table contains rows
	| Date		| Appt Status 		| Location			| Provider 			| Facility	|
	| 05/28/2004|  SCHEDULED/KEPT 	| General Medicine	| Provider, Eight 	| TST1		|
	| 05/27/2004|  SCHEDULED/KEPT	| General Medicine	| Provider, Eight 	| TST1		|
	| 05/26/2004|  SCHEDULED/KEPT	| General Medicine 	| Provider, Eight 	| TST1		|
	| 05/25/2004|  SCHEDULED/KEPT	| General Medicine 	| Provider, Eight 	| TST1		|
	| 05/24/2004|  SCHEDULED/KEPT	| General Medicine 	| Provider, Eight 	| TST1		|
	When user clicks on the "Right" hand side of the "Appointment Type" "GENERAL INTERNAL MEDICINE"	
	Then Quick View draw box for "Appointment Type" closes

@F295_multioption_menu_appointment_quick_view @F295-34.2 @US5386 @future
Scenario: Encounters Applet Gist - quick view of a particular appointment thro' multi option menu
  	Given user is logged into eHMP-UI
  	Given user searches for and selects "Sixhundred,Patient"
  	Then Overview is active
  	And user sees Encounters Gist
  	And the user has selected All within the global date picker 
  	When the user expands "Appointments" in Encounters Gist Applet
 	When user clicks on the "Left" hand side of the "Appointment Type" "GENERAL INTERNAL MEDICINE"
  	Then a Menu appears on the Encounters Gist 
  	When user select the menu "Quick View Icon" in Encounters Gist
  	Then the "Encounters Gist Quick View - Appointment Type" table contains headers
    | Date	| Appt Status | Location | Provider | Facility |
  	And the "Encounters Gist Quick View - Appointment Type" table contains rows
	| Date		| Appt Status 		| Location			| Provider 			| Facility	|
	| 05/28/2004|  SCHEDULED/KEPT 	| General Medicine	| Provider, Eight 	| TST1		|
	| 05/27/2004|  SCHEDULED/KEPT	| General Medicine	| Provider, Eight 	| TST1		|
	| 05/26/2004|  SCHEDULED/KEPT	| General Medicine 	| Provider, Eight 	| TST1		|
	| 05/25/2004|  SCHEDULED/KEPT	| General Medicine 	| Provider, Eight 	| TST1		|
	| 05/24/2004|  SCHEDULED/KEPT	| General Medicine 	| Provider, Eight 	| TST1		|
	When user select the menu "Quick View Icon" in Encounters Gist
	Then Quick View draw box for "Appointment Type" closes
	  	
@F295_multioption_menu_appointment_detail_view @F295-32.5 @US4154 @US5126 @DE1388
Scenario: Encounters Applet Gist - detail view of Appointment thro' multi option menu
  	Given user is logged into eHMP-UI
  	Given user searches for and selects "Sixhundred,Patient"
  	Then Overview is active
  	And user sees Encounters Gist
  	And the user has selected All within the global date picker 
  	When the user expands "Appointments" in Encounters Gist Applet
 	When user clicks on the "Left" hand side of the "Appointment Type" "GENERAL INTERNAL MEDICINE" 
  	#Then a Menu appears on the Encounters Gist 
    Then a Menu appears on the Encounters Gist for the item "GENERAL INTERNAL MEDICINE"
     Then user selects the "GENERAL INTERNAL MEDICINE" detail icon in Encounters Gist
  	#When user select the menu "Detail View Icon" in Encounters Gist
  	Then it should show the detail modal of the most recent encounter
	And the modal's title is "GENERAL INTERNAL MEDICINE" 
  	And the "Appointment" modal contains data
  	| field				| value					|
	| Date				| 05/28/2004 - 15:00	|
	| Type				| Regular				|
	| Category			| Outpatient Visit		|
	| Patient Class		| Ambulatory			|
	| Appointment Status| SCHEDULED/KEPT		|
	| Location			| General Medicine		|
	| Stop Code			| GENERAL INTERNAL MEDICINE|
	| Facility			| CAMP MASTER			|
	And the user closes modal by clicking the "Close" control
	
@F295_encounters_Admissions_view  @US3706 @US4001 @US4154 @US5126
Scenario: Expansion of Admission object
	Given user is logged into eHMP-UI
	And user searches for and selects "zzzretiredonenineteen,patient"
  	Then Overview is active
  	And user sees Encounters Gist
  	And the user has selected All within the global date picker
  	When the user expands "Admissions" in Encounters Gist Applet
  	Then Encounters Gist Applet "Admissions" grouping expanded view contains headers
 	| Diagnosis 	| Hx Occurrence	| Last	|
  	And the Encounters Gist Applet "Admissions" grouping expanded view contains
	| Diagnosis		| Hx Occurrence	|  	
	| SLKJFLKSDJF 	| 1			    | 
	| OBSERVATION	| 1				| 
		
@F295_encounterGist_quick_view_admissions @F295-5.6 @US4154 @US5126 @DE1388
Scenario: Encounters Applet Gist - quick view of admissions
  	Given user is logged into eHMP-UI
  	Given user searches for and selects "zzzretiredonenineteen,Patient"
  	Then Overview is active
  	And user sees Encounters Gist
  	And the user has selected All within the global date picker
  	When user hovers over and selects the right side of the "Admissions" tile
  	Then quick view table with title "Recent Admissions" appears
  	And the "Encounters Gist Quick View - Admissions" table contains headers
    | Date	| Diagnosis | Facility |
    And the "Encounters Gist Quick View - Admissions" table contains 2 rows 
  	And the "Encounters Gist Quick View - Admissions" table contains rows
	| Date			| Diagnosis		| Facility	|
	| 01/25/1995	| SLKJFLKSDJF 	| TRY		|
	| 05/20/1993	| OBSERVATION 	| TST1		|
	When user hovers over and selects the right side of the "Admissions" tile
	Then Quick View draw box for "Admissions" closes

@F295_diagnosis_quick_view @F295-5.8 @F295-20a1 @F295-20a2 @F295-20a3 @F295-20a4 @F295-20a5 @F295-20a6 @US4154 @US5126 @DE1388
Scenario: Encounters Applet Gist - quick view of a particular Diagnosis 
  	Given user is logged into eHMP-UI
  	Given user searches for and selects "zzzretiredonenineteen,Patient"
  	Then Overview is active
  	And user sees Encounters Gist
  	And the user has selected All within the global date picker 
  	When the user expands "Admissions" in Encounters Gist Applet
 	When user clicks on the "Right" hand side of the "Diagnosis" "OBSERVATION"
  	Then the "Encounters Gist Quick View - Diagnosis" table contains headers
    | Date	| Location | Facility |
  	And the "Encounters Gist Quick View - Diagnosis" table contains rows
	| Date		| Location 	| Facility	|
	| 05/20/1993| Drugster 	| TST1		|	
	When user clicks on the "Right" hand side of the "Diagnosis" "OBSERVATION"	
	Then Quick View draw box for "Diagnosis" closes

@F295_multioption_menu_admission_quick_view @F295-5.7 @F295-5.8 @US4154 @US5126 @future
Scenario: Encounters Applet Gist - quick view of a particular admission thro' multi option menu
  	Given user is logged into eHMP-UI
  	Given user searches for and selects "zzzretiredonenineteen,Patient"
  	Then Overview is active
  	And user sees Encounters Gist
  	And the user has selected All within the global date picker 
  	When the user expands "Admissions" in Encounters Gist Applet
 	When user clicks on the "Left" hand side of the "Diagnosis" "OBSERVATION"
  	Then a Menu appears on the Encounters Gist 
  	When user select the menu "Quick View Icon" in Encounters Gist
  	Then the "Encounters Gist Quick View - Diagnosis" table contains headers
    | Date	| Location | Facility |
  	And the "Encounters Gist Quick View - Diagnosis" table contains rows
	| Date		| Location 	| Facility	|
	| 05/20/1993| Drugster 	| TST1		|	
	When user select the menu "Quick View Icon" in Encounters Gist
	Then Quick View draw box for "Diagnosis" closes
	  	
@F295_multioption_menu_admission_detail_view @F295-35.4 @US4154 @US5126 @US4805 @DE1388
Scenario: Encounters Applet Gist - detail view of admission thro' multi option menu
  	Given user is logged into eHMP-UI
  	Given user searches for and selects "zzzretiredonenineteen,Patient"
  	Then Overview is active
  	And user sees Encounters Gist
  	And the user has selected All within the global date picker 
  	When the user expands "Admissions" in Encounters Gist Applet
 	When user clicks on the "Left" hand side of the "Diagnosis" "OBSERVATION" 
  	#Then a Menu appears on the Encounters Gist 
  	#When user select the menu "Detail View Icon" in Encounters Gist
    Then a Menu appears on the Encounters Gist for the item "OBSERVATION"
     Then user selects the "OBSERVATION" detail icon in Encounters Gist
  	Then it should show the detail modal of the most recent encounter
	And the modal's title is "Hospitalization" 
  	And the "Appointment" modal contains data
  	| field				| value					|
	| Date				| 05/20/1993 - 10:00	|
	| Type				| Hospitalization		|
	| Category			| Admission				|
	| Patient Class		| Inpatient				|
	| Location			| Drugster				|
	| Stop Code			| Blank					|
	| Facility			| CAMP MASTER			|
	And the user closes modal by clicking the "Close" control

@DE1375
Scenario: Encounters Applet Gist - Verify expected buttons are present, visible and accessable
  Given user is logged into eHMP-UI
  Given user searches for and selects "Sixhundred,Patient"
  Then Overview is active
  And user sees Encounters Gist
  And the user has selected All within the global date picker 
  When the user expands "Procedures" in Encounters Gist Applet
  When user clicks on the "Left" hand side of the "Procedure Name" "PULMONARY FUNCTION INTERPRET" 
  Then a Menu appears on the Encounters Gist for the item "PULMONARY FUNCTION INTERPRET"
  #When user select the menu "Detail View Icon" in Encounters Gist
  Then user selects the "PULMONARY FUNCTION INTERPRET" detail icon in Encounters Gist
  Then it should show the detail modal of the most recent encounter
  And the modal's title is "pulmonary function interpret Details" 
  And the user can view and interact with the "Close" control
