@F282_coditions_gist @regression
Feature: F82 - Conditions Gist View

#TEAM JUPITER
	
@F282_1_conditionsGist_problems @US3390 @US4317 @base
Scenario: User views the conditions gist view
	Given user is logged into eHMP-UI
	And user searches for and selects "ZZZRETFOURFIFTYEIGHT,PATIENT"	
  Then Overview is active
  And user sees Conditions Gist
  And the user has selected All within the global date picker
  And the conditions gist detail view has headers
  	  | Headers       |
      | Problem       |
      | Acuity        |
      | Hx Occurrence |
      | Last          |
	And the conditions gist detail view contains
	    | Problem                                    | Acuity  | Occurrence | Last |
      | MANIC DISORDER-MILD                          | Chronic | 6          | 16y  |
      | UPPER EXTREMITY                              | Unknown | 2          | 15y  |
      | Essential Hypertension                       | Acute   | 12         | 16y  |
      | ALCOH DEP NEC/NOS-REMISS                     | Unknown | 16         | 16y  |
      | Adjustment Reaction With Physical Symptoms   | Unknown | 14         | 17y  |
      | Chronic Sinusitis                            | Acute   | 2          | 16y  |


@F282_2_conditionsGist_ExpandView @US3390 @4317 @vimm_observed 
Scenario: View Conditions Applet Single Page by clicking on Expand View
  Given user is logged into eHMP-UI
  And user searches for and selects "FORTYSIX,PATIENT"
  Then Overview is active
  And user sees Conditions Gist
  When the user clicks the control "Expand View" in the "Conditions Gist applet"
  Then the Conditions Gist applet title is "CONDITIONS"
  And the Conditions Gist Applet table contains headers
    | header text |
    | Description | 
    | Standardized Description |  
    | Acuity | 
    | Onset Date | 
    | Last Updated | 
    | Provider | 
    | Facility |
  And the Conditions Gist contains rows
  | DESCRIPTION                                                                | STANDARDIZED DESCRIPTION                  | ACUITY  | ONSET DATE | LAST UPDATED | PROVIDER          | FACILITY | Comment |
  | Chronic Systolic Heart failure                                             | Chronic systolic heart failure (disorder) | Chronic | 03/15/2004 | 04/02/2004 | Vehu,Fortysix  | TST1     |         |
  | Diabetes Mellitus Type II or unspecified                                   |                                           | Chronic |            | 04/01/2004 | Vehu,Fortysix  | TST1     |         |
  | Acute myocardial infarction, unspecified site, episode of care unspecified |                                           | Unknown | 03/17/2005 | 03/19/2005 | Vehu,Fortysix  | TST1     |         |
  | Hypertension                                                               | Essential hypertension (disorder)         | Chronic | 04/07/2005 | 04/10/2007 | Vehu,Onehundred| TST1     |         |
  | Hyperlipidemia                                                             |                                           | Chronic | 04/07/2005 | 04/10/2007 | Vehu,Onehundred| TST1     |         |
  | Occasional, uncontrolled chest pain                                        | Impending infarction (disorder)           | Acute   | 03/15/1996 | 05/14/1996 | Programmer,Twenty | NJS      |         |
  | Chronic Systolic Heart failure                                             | Chronic systolic heart failure (disorder) | Chronic | 03/15/2004 | 04/02/2004 | Vehu,Fortysix  | TST2     |         |
  | Diabetes Mellitus Type II or unspecified                                   |                                           | Chronic |            | 04/01/2004 | Vehu,Fortysix  | TST2     |         |
  | Acute myocardial infarction, unspecified site, episode of care unspecified |                                           | Unknown | 03/17/2005 | 03/19/2005 | Vehu,Fortysix  | TST2     |         |
  | Hypertension                                                               | Essential hypertension (disorder)         | Chronic | 04/07/2005 | 04/10/2007 | Vehu,Onehundred| TST2     |         |
  | Hyperlipidemia                                                             |                                           | Chronic | 04/07/2005 | 04/10/2007 | Vehu,Onehundred| TST2     |         |

@F282_3_conditionsGist_filter_capability @US3390 @4317 @vimm_observed 
Scenario: Conditions Applet Gist - filter problems
  Given user is logged into eHMP-UI
  Given user searches for and selects "ZZZRETFOURFIFTYEIGHT,PATIENT"
  Then Overview is active
  And user sees Conditions Gist
  And the user has selected All within the global date picker
  When the user clicks the control "Filter Toggle" in the "Conditions Gist applet"
  And the user inputs "Acute" in the "Text Filter" control in the "Conditions Gist applet"
  And the conditions gist detail view contains
	| Problem									| Acuity	| Hx Occurrence	| Last	|
	| Essential Hypertension					| Acute		| 12		    | 16y	|
	| Chronic Sinusitis  						| Acute		| 2				| 16y	|

@F282_4_conditionsGist_global_datefilter @US3390 @4317 @vimm_observed 
Scenario: Conditions gist applet is able to filter data based date filter search
 Given user is logged into eHMP-UI
  And user searches for and selects "ZZZRETFOURFIFTYEIGHT,PATIENT"
  Then Overview is active
  And user sees Encounters Gist
  And the user clicks the control "Date Filter" on the "Overview"
  And the Date Filter displays "18" months in the past and "6" months in the future
  And the user inputs "01/01/1999" in the "From Date" control on the "Overview"
  And the user inputs "12/31/2099" in the "To Date" control on the "Overview"
  And the user clicks the control "Apply" on the "Overview"
  And the conditions gist detail view contains
	| Problem									| Acuity	| Occurrence	| Last	|
	| MANIC DISORDER-MILD 						| Chronic	| 6				| 16y	|
	| UPPER EXTREMITY							| Unknown	| 2				| 15y	|

@F282_5_conditionsGist_quick_view @US4155 @4317 @vimm_observed @triage
Scenario: Conditions Applet Gist - quick view of problems
  Given user is logged into eHMP-UI
  Given user searches for and selects "ZZZRETFOURFIFTYEIGHT,PATIENT"
  Then Overview is active
  And user sees Conditions Gist
  And the user has selected All within the global date picker
  And hovering over the histogram of a problem and selecting the "quick view" pop-up link
  Then the "Problems Gist Quick View Table" table contains headers
    | Date | Description | Facility |
  And the "Problems Gist Quick View Table" table contains rows
	| Date			| Description				| Facility	 	|
	| 04/22/1999	| MANIC DISORDER-MILD		| CAMP MASTER 	|
	| 04/22/1999	| MANIC DISORDER-MILD		| CAMP BEE	 	|
	| 03/22/1999	| MANIC DISORDER-MILD		| FT. LOGAN		|
	| 03/22/1999	| MANIC DISORDER-MILD		| FT. LOGAN		|
	| 02/03/1999  	| MANIC DISORDER-MILD		| FT. LOGAN		|
  And clicking a second time on the "quick view" hover button will result in the closure of the quick draw data box

@F282_6_conditionsGist_Column_Sorting_Problem @US4684
  Scenario: Conditions Gist Applet is sorted by the column header Problems
    Given user is logged into eHMP-UI
    And user searches for and selects "ZZZRETFOURFIFTYEIGHT,PATIENT"
    Then Overview is active
    And user sees Conditions Gist
    And the user has selected All within the global date picker
    When user clicks on the column header "Problem" in Conditions Gist
    Then "Problem" column is sorted in ascending order in Conditions Gist
    When user clicks on the column header "Problem" in Conditions Gist
    Then "Problem" column is sorted in descending order in Conditons Gist
  
@F282_7_conditionsGist_Column_Sorting_Problem @US4684
Scenario: Conditions Gist Applet is sorted by the column header Problems
  Given user is logged into eHMP-UI
  And user searches for and selects "ZZZRETFOURFIFTYEIGHT,PATIENT"
  Then Overview is active
  And user sees Conditions Gist
  And the user has selected All within the global date picker
  When user clicks on the column header "Problem" in Conditions Gist
  Then "Problem" column is sorted in ascending order in Conditions Gist
  When user clicks on the column header "Problem" in Conditions Gist
  Then "Problem" column is sorted in descending order in Conditons Gist
  
@F282_8_conditionsGist_Column_Sorting_Acuity @US4684
Scenario: Conditions Gist Applet is sorted by the column header Acuity
  Given user is logged into eHMP-UI
  And user searches for and selects "ZZZRETFOURFIFTYEIGHT,PATIENT"
  Then Overview is active
  And user sees Conditions Gist
  And the user has selected All within the global date picker
  When user clicks on the column header "Acuity" in Conditions Gist
  Then "Acuity" column is sorted in ascending order in Conditions Gist
  When user clicks on the column header "Acuity" in Conditions Gist
  Then "Acuity" column is sorted in descending order in Conditons Gist
  
@F282_9_conditionsGist_Column_Sorting_Hx_Occurrence @US4684
Scenario: Conditions Gist Applet is sorted by the column header Hx Occrrence
  Given user is logged into eHMP-UI
  And user searches for and selects "ZZZRETFOURFIFTYEIGHT,PATIENT"
  Then Overview is active
  And user sees Conditions Gist
 And the user has selected All within the global date picker
  When user clicks on the column header "Hx Occurrence" in Conditions Gist
  Then "Hx Occurrence" column is sorted in ascending order in Conditions Gist
  When user clicks on the column header "Hx Occurrence" in Conditions Gist
  Then "Hx Occurrence" column is sorted in descending order in Conditons Gist

@F282_10_conditionsGist_Column_Sorting_last @US4684 
Scenario: Conditions Gist Applet is sorted by the column header Last
  Given user is logged into eHMP-UI
  And user searches for and selects "ZZZRETFOURFIFTYEIGHT,PATIENT"
  Then Overview is active
  And user sees Conditions Gist
  And the user has selected All within the global date picker
  When user clicks on the column header "Last" in Conditions Gist
  Then Last column is sorted in "ascending" order in Conditions Gist
  | 19y | 17y | 16y | 16y | 16y | 16y | 15y |
  When user clicks on the column header "Last" in Conditions Gist
  Then Last column is sorted in "descending" order in Conditions Gist
  | 15y | 16y | 16y | 16y | 16y | 17y | 19y |
  
@F282_11_conditionsGist_menu @US4317 @US4805
Scenario: Conditions Applet Gist - menu appears in any chosen problem 
  Given user is logged into eHMP-UI
  Given user searches for and selects "ZZZRETFOURFIFTYEIGHT,PATIENT"
  Then Overview is active
  And user sees Conditions Gist
  And the user has selected All within the global date picker
  When user clicks on the left hand side of the item "Manic Disorder" 
  Then a Menu appears on the Conditions Gist for item "Mainic Disorder"

@F282_12_conditionsGist_detail_view @US4317 @US4805
Scenario: Conditions Applet Gist - detail view of most recent problem 
  Given user is logged into eHMP-UI
  Given user searches for and selects "ZZZRETFOURFIFTYEIGHT,PATIENT"
  Then Overview is active
  And user sees Conditions Gist
  And the user has selected All within the global date picker
  When user clicks on the left hand side of the item "Manic Disorder" 
  Then a Menu appears on the Conditions Gist for item "Mainic Disorder"
  #When user select the menu "Detail View Icon" in Conditions Gist
  Then user selects the "Mainic Disorder" detail icon in Conditions Gist
  Then it should show the detail modal of the most recent for this problem
  And the modal's title is "MANIC DISORDER-MILD (ICD-9-CM 296.01)"
  
@F282_13_conditionsGist_quick_view_from_menu @US4317 @US4805
Scenario: Conditions Applet Gist - quick view of chosen problem 
  Given user is logged into eHMP-UI
  Given user searches for and selects "ZZZRETFOURFIFTYEIGHT,PATIENT"
  Then Overview is active
  And user sees Conditions Gist
  And the user has selected All within the global date picker
  When user clicks on the left hand side of the item "Manic Disorder" 
  Then a Menu appears on the Conditions Gist for item "Mainic Disorder"
  #When user select the menu "Quick View Icon" in Conditions Gist
  Then user selects the "Mainic Disorder" quick view icon in Conditions Gist
  Then the "Problems Gist Quick View Table" table contains headers
    | Date | Description | Facility | 
  And the "Problems Gist Quick View Table" table contains rows
	| Date			| Description				| Facility	 	|
	| 04/22/1999	| MANIC DISORDER-MILD		| CAMP MASTER 	|
	| 04/22/1999	| MANIC DISORDER-MILD		| CAMP BEE	 	|
	| 03/22/1999	| MANIC DISORDER-MILD		| FT. LOGAN		|
	| 03/22/1999	| MANIC DISORDER-MILD		| FT. LOGAN		|
	| 02/03/1999  	| MANIC DISORDER-MILD		| FT. LOGAN		|
  
