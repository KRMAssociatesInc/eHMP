@documents_summary_and_details @regression
Feature: F144 - eHMP Viewer GUI - Documents

#POC:Team Jupiter

@f144_documents_navigation_thro_dropdwon @US1914
Scenario: progress notes, clinical procedure and discharge summary are displayed in document applet
  Given user is logged into eHMP-UI
  And user searches for and selects "ZZZRETFOUREIGHTY,PATIENT"
  And Overview is active
  When user selects Documents from Coversheet dropdown
  Then "Documents" is active
  Then title of the Documents Applet says "Documents"
  Then the search results say "No Records Found" in Documents Applet
  
@f144_1_documents_default_display @US1914 @base @vimm_observed
Scenario: progress notes, clinical procedure and discharge summary are displayed in document applet
  Given user is logged into eHMP-UI
  And user searches for and selects "ZZZRETFOUREIGHTY,PATIENT"
  When user navigates to Documents Applet
  Then "Documents" is active
  Then title of the Documents Applet says "Documents"
  Then the search results say "No Records Found" in Documents Applet
  #When the user clicks the control "Date Filter" in the "Documents Applet"
  #And the user clicks the date control "All" in the "Documents Applet"
  #And the user clicks the control "Apply" on the "Documents Applet"
  And the user has selected All within the global date picker
  Then the Documents Applet table contains headers
      | Headers nos | Headers     |
      | Header1     | Date        |
      | Header2     | Description |
      | Header3     | Type        |
      | Header4     | Entered By  |
      | Header5     | Facility    |
  And the Document Applet table contains specific rows
     |row index | Date       | Description                  | Type              | Entered By        | Facility    |
     |4         | 04/27/1998 | RMS-OCCUPATIONAL THERAPY     | Progress Note     | Provider,Prf      | CAMP MASTER |
     |8         | 08/12/1992 | LAPARASCOPY                  | Procedure         | None              | CAMP MASTER |
     |10        | 01/03/1992 | Discharge Summary            | Discharge Summary | Programmer,Twenty | TROY        |
     |6         | 02/23/1994 | BIOSPY                       | Surgery           | None              | CAMP MASTER |


@f144_2_documents_discharge_summary @US2306 @US2592
Scenario: discharge summary detail view
  Given user is logged into eHMP-UI
  And user searches for and selects "ZZZRETFOUREIGHTY,PATIENT"
	When user navigates to Documents Applet
  Then "Documents" is active
  Then the search results say "No Records Found" in Documents Applet
	And the user has selected All within the global date picker
  And the user selects the "Discharge Summary" row in Documents Applet
  Then the Documents Applet detail "Discharge Summary" page title says "Discharge Summary Details"
  Then the Documents Applet detail "Discharge Summary" view contains fields
    | field						| value				|
    | Facility					| TROY				|
    | Author					| Programmer,Twenty	|
    | Expected Cosigner			| Programmer,Twenty	|
    | Status					| Deleted			|
    | Attending					| Programmer,Twenty	|
    | Date/Time					| 01/03/1992 - 00:00| 
  And the Documents Applet detail "Discharge Summary" view content contains
    | Content Text									 |
    | Document Deleted per Administrative Action.	 |

@f144_3_documents_progress_notes @US2542 @US2592
Scenario: progress notes detail view
  Given user is logged into eHMP-UI
  And user searches for and selects "ZZZRETFOUREIGHTY,PATIENT"
 	When user navigates to Documents Applet
  Then "Documents" is active
  Then the search results say "No Records Found" in Documents Applet
	And the user has selected All within the global date picker
  And the user selects the "Progress Note" row in Documents Applet
  Then the Documents Applet detail "Progress Note" page title says "rms-occupational therapy Details"
  Then the Documents Applet detail "Progress Note" view contains fields
    | field						| value				|
    | Facility					| CAMP MASTER		|
    | Author					| Provider,Prf		|
    | Status					| Completed			|
    | Date/Time					| 04/27/1998 - 11:05| 
  Then the Documents Applet detail view closes when user clicks the close button
    
@f144_4_documents_procedure @US2197 @US2592
Scenario: clinical procedure detail view
  Given user is logged into eHMP-UI
  And user searches for and selects "ZZZRETFOUREIGHTY,PATIENT"
 	When user navigates to Documents Applet
  Then "Documents" is active
  Then the search results say "No Records Found" in Documents Applet
	And the user has selected All within the global date picker
  And the user selects the "Procedure" row in Documents Applet
  Then the Documents Applet detail "Procedure" page title says "laparascopy Details"
  Then the Documents Applet detail "Procedure" view contains fields
    | field						| value				|
    | Facility					| CAMP MASTER	 	|
    | Type						| Procedure			|
    | Status					| COMPLETE			|
    | Date/Time					| 08/12/1992 - 16:00 | 
 	Then the Documents Applet detail view closes when user clicks the close button
 	
@f144_5_documents_Surgery @US2592
Scenario: Surgery detail view
  Given user is logged into eHMP-UI
  And user searches for and selects "ZZZRETFOUREIGHTY,PATIENT"
 	When user navigates to Documents Applet
  Then "Documents" is active
  Then the search results say "No Records Found" in Documents Applet
	And the user has selected All within the global date picker
    And the user selects the "Surgery" row in Documents Applet
    Then the Documents Applet detail "Surgery" page title says "Biospy Details"
    Then the Documents Applet detail "Surgery" view contains fields
    | field						| value				|
    | Facility					| CAMP MASTER		|
    | Type						| Surgery			|
    | Status					| COMPLETED			|
    | Date/Time					| 02/23/1994 - 00:00|
    | Providers					|					| 
 	Then the Documents Applet detail view closes when user clicks the close button
           
@f144_6_documents_default_display @US1914
Scenario: advance directive and consult report are displayed in document applet
	Given user is logged into eHMP-UI
  And user searches for and selects "NINETYNINE,PATIENT"
 	When user navigates to Documents Applet
  Then "Documents" is active
	Then title of the Documents Applet says "Documents"
	Then the search results say "No Records Found" in Documents Applet
	And the user has selected All within the global date picker
  And the Document Applet table contains specific rows                
    | row index | Date       | Description                 		| Type              | Entered By    	| Facility		|
    | 4  		| 05/16/2007 | ADVANCE DIRECTIVE COMPLETED		| Advance Directive	| Labtech,Fiftynine	| New Jersey HCS	|
    | 11 		| 04/02/2004 | AUDIOLOGY OUTPATIENT Cons			| Consult			| Pathology,One		| CAMP MASTER	|

@f144_7_documents_consult_report @US2294 @US2592
Scenario: consult report detail view
	Given user is logged into eHMP-UI
  	And user searches for and selects "NINETYNINE,PATIENT"
 	When user navigates to Documents Applet
    Then "Documents" is active
    Then the search results say "No Records Found" in Documents Applet
	And the user has selected All within the global date picker
    And the user selects the "Consult Report" row in Documents Applet
    Then the Documents Applet detail "Consult Report" page title says "Audiology Outpatient Cons Details"
    Then the Documents Applet detail "Consult Report" view contains fields
      | field                     | value                                                 |
      | Facility                  | CAMP MASTER                                           |
      | Type                      | Consult                                               |
      | Status                    | COMPLETE                                              |
      | Date/Time                 | 04/02/2004 - 02:31                                    |
      | To Service                | AUDIOLOGY OUTPATIENT                                  |
      | From Service			  | GENERAL MEDICINE 									  |
      | Requesting Provider       | PATHOLOGY,ONE                                         |
      | Place                     | Consultant's choice                                   |
      | Urgency					  | Routine												  |
      | Orderable Item            | AUDIOLOGY OUTPATIENT                                  |
      | Procedure                 | Consult                                               |
      | Reason                    | 58 year old MALE referred for suspected hearing loss. |
      | Local Title				  | AUDIOLOGY - HEARING LOSS CONSULT 					  |
      And the Documents Applet detail "Consult Report" view content contains
      | Patient was seen for hearing aid fitting and orientation|
      |System and indicated appropriate gain for the demonstrated hearing loss|
      Then the Documents Applet detail view closes when user clicks the close button
      
@f144_8_documents_advance_directive @US2592 @vimm_observed
Scenario: advance directive detail view
	Given user is logged into eHMP-UI
  	And user searches for and selects "NINETYNINE,PATIENT"
 	When user navigates to Documents Applet
    Then "Documents" is active
    Then the search results say "No Records Found" in Documents Applet
	And the user has selected All within the global date picker
    And the user selects the "Advance Directive" row in Documents Applet
    Then the Documents Applet detail "Advance Directive" page title says "Advance Directive Completed Details"
    Then the Documents Applet detail "Advance Directive" view contains fields
      | field                     | value                                                 |
      | Facility                  | CAMP MASTER                                           |
      | Author                    | Labtech,Fiftynine                                     |
      | Status                    | Completed                                             |
      | Date/Time                 | 05/17/2007 - 09:33                                     |
    And the Documents Applet detail "Advance Directive" view content contains                      
      | Content Text                     |
      | VistA Imaging - Scanned Document |
    Then the Documents Applet detail view closes when user clicks the close button
 
@f144_9_documents_default_display @US1914
Scenario: crisis notes are displayed in document applet
	Given user is logged into eHMP-UI
  	And user searches for and selects "Five,Patient"
 	When user navigates to Documents Applet
    Then "Documents" is active
	Then title of the Documents Applet says "Documents"
	Then the search results say "No Records Found" in Documents Applet
	And the user has selected All within the global date picker
	And the "Crisis Note" row is visible on the screen
    And the Document Applet table contains rows                
    | Date       | Description      | Type          | Entered By    	| Facility		|
    | 05/21/2000 | CRISIS NOTE		 | Crisis Note   | Vehu,Twentyone	| ABILENE (CAA)	|
          
@f144_10_documents_crisis_report @US2592
Scenario: crisis note detail view
	Given user is logged into eHMP-UI
  	And user searches for and selects "Five,Patient"
 	When user navigates to Documents Applet
    Then "Documents" is active
    Then the search results say "No Records Found" in Documents Applet
	And the user has selected All within the global date picker
	And the "Crisis Note" row is visible on the screen
    And the user selects the "Crisis Note" row in Documents Applet
    Then the Documents Applet detail "Crisis Note" page title says "Crisis Note Details"
    Then the Documents Applet detail "Crisis Note" view contains fields
      | field					  | value												  |
      | Facility                  | ABILENE (CAA)                                         |
      | Author                    | Vehu,Twentyone                                        |
      | Status                    | Completed                                             |
      | Date/Time                 | 05/21/2000 - 11:58                                    |
    And the Documents Applet detail "Advance Directive" view content contains
      | Content Text                    |
      | Patient is armed and dangerous. |
    Then the Documents Applet detail view closes when user clicks the close button

@f144_11_documents_default_display
Scenario:lab report and imaging are displayed in document applet
	Given user is logged into eHMP-UI
  	And user searches for and selects "ZZZRETFOURFORTYSEVEN"
 	When user navigates to Documents Applet
    Then "Documents" is active
	Then title of the Documents Applet says "Documents"
	Then the search results say "No Records Found" in Documents Applet
	And the user has selected All within the global date picker
    And the Document Applet table contains specific rows                
    | row index  | Date       | Description        								| Type          	| Entered By    	| Facility	 |
    | 17		 | 04/06/1995 | LR CYTOPATHOLOGY REPORT							| Laboratory Report | Provider,Sixteen	| TROY		 |
    | 2 		 | 11/13/1997 | RADIOLOGIC EXAMINATION, CHEST; SINGLE VIEW, FRONTAL| Imaging			| Programmer,Twenty	| CAMP MASTER|	
            
@f144_12_documents_lab_report @modal_test @US2242
Scenario: lab report detail view
	Given user is logged into eHMP-UI
  	And user searches for and selects "ZZZRETFOURFORTYSEVEN"
 	When user navigates to Documents Applet
    Then "Documents" is active
    Then the search results say "No Records Found" in Documents Applet
	And the user has selected All within the global date picker
    And the user selects the "Lab Report" row in Documents Applet
    Then the Documents Applet detail "Lab Report" page title says "Lr Cytopathology Report Details"
    Then the Documents Applet detail "Lab Report" view contains fields
      | field					  | value								|
      | Facility                  | TROY		                        |
      | Author                    | Provider,Sixteen                    |
      | Status                    | Completed                           |
      | Date/Time                 | 04/06/1995 - 00:00 					|
    And the Documents Applet detail "Lab Report" view content contains
      | Content Text                    		    |
      | Brief Clinical History		                |
      | Specimen consists of 2.5 ml of bloody fluid.|
    Then the Documents Applet detail view closes when user clicks the close button
    
@f144_13_documents_imaging_report @US2194
Scenario: imaging detail view
	Given user is logged into eHMP-UI
  	And user searches for and selects "ZZZRETFOURFORTYSEVEN"
 	When user navigates to Documents Applet
  	Then "Documents" is active
  	Then the search results say "No Records Found" in Documents Applet
	And the user has selected All within the global date picker
  	And the user selects the "Imaging" row in Documents Applet
  	Then the Documents Applet detail "Imaging" page title says "radiologic examination, chest; single view, frontal Details"
  	Then the Documents Applet detail "Imaging" view contains fields
      | field           | value              |
      | Facility        | CAMP MASTER        |
      | Type            | Imaging            |
      | Status          | COMPLETE           |
      | Date/Time       | 11/13/1997 - 11:10 |
      | Providers       | Programmer,Twenty  |
  And the Documents Applet detail "Imaging" view content contains
      | Content Text                    		|
      | CHEST SINGLE VIEW 		              |
      | THE LUNGS ARE NORMALLY AERATED			|
  Then the Documents Applet detail view closes when user clicks the close button

@f144_14_documents_default_display @US2592 @vimm
Scenario: Administrative Note is displayed in document applet
  Given user is logged into eHMP-UI
  And user searches for and selects "GRAPHINGPATIENT,TWO"
  When user navigates to Documents Applet
  Then "Documents" is active
  Then title of the Documents Applet says "Documents"
  And the user has selected All within the global date picker
  Then the Document Applet table contains specific rows                
      | Row Index | Date       | Description        | Type                | Entered By   |   Facility   | 
      | 18        | 04/10/2012 | Administrative Note| Administrative Note | LANF, THREE  |    DOD*      |
  Then take screenshot for comparison purposes with name "documents_default_display"
            
@f144_15_documents_administrative_note @US2592 @vimm
Scenario: administrative note detail view
	Given user is logged into eHMP-UI
  	And user searches for and selects "GRAPHINGPATIENT,TWO"
 	When user navigates to Documents Applet
  	Then "Documents" is active
	#Then the search results say "No Records Found" in Documents Applet
	And the user has selected All within the global date picker
  	And the user selects the "Administrative Note" row in Documents Applet
  	Then the Documents Applet detail "Administrative Note" page title says "Administrative Note Details"
  	Then the Documents Applet detail "Administrative Note" view contains fields
      | field           | value              |
      | Facility        | DOD                |
      | Author          | NONE               |
      | Status          | Completed          |
      | Date/Time       | 06/22/2010 - 11:29 |
  Then the Documents Applet detail view closes when user clicks the close button
    
@f144_16_documents_default_display  @US2593
Scenario: Documents grouping by Date/Time
  Given user is logged into eHMP-UI
  And user searches for and selects "ZZZRETFOUREIGHTY,PATIENT"
  When user navigates to Documents Applet
  Then "Documents" is active
  Then the search results say "No Records Found" in Documents Applet
  And the user has selected All within the global date picker
  And the user sees the following groups in Documents Applet
      | group #     | groupName     |
      | date_group1 | April 1999    |
      | date_group2 | April 1998    |
      | date_group3 | February 1994 |
      | date_group4 | August 1992   |
      | date_group5 | January 1992  |

@f144_17_documents_default_display  @US2593
Scenario: date/time can be clicked and collapsed
  Given user is logged into eHMP-UI
  And user searches for and selects "ZZZRETFOUREIGHTY,PATIENT"
  When user navigates to Documents Applet
  Then "Documents" is active
  Then the search results say "No Records Found" in Documents Applet
  And the user has selected All within the global date picker
  And the user clicks on date/time "August 1992" in the Documents Applet
  Then the date/time collapses and shows "1" result for "August 1992" in the Documents Applet
  
@f144_18_documents_default_display  @US2684
Scenario: Documents Applet displays sorting by Date/Time correctly

  Given user is logged into eHMP-UI
  And user searches for and selects "ZZZRETFOUREIGHTY,PATIENT"
  When user navigates to Documents Applet
  Then "Documents" is active
  Then the search results say "No Records Found" in Documents Applet
 And the user has selected All within the global date picker
  And the default sorting by Date/Time is in descending in Documents Applet
  And the first row is as below when grouped by "Date" in Documents Applet
  | row index	| Date       | Description                 	| Type              | Entered By    	| Facility		|
  |	2			| 04/21/1999 | ASI-ADDICTION SEVERITY INDEX   	| Progress Note		| Radtech,Twenty	| CAMP MASTER	|	
  And the last row is as below when grouped by "Date" in Documents Applet
  | row index   | Date       | Description                 	| Type              | Entered By    	| Facility		|
  | 10			| 01/03/1992 | Discharge Summary				| Discharge Summary	| Programmer,Twenty	| TROY			|  
  When user clicks on "Date/Time" column header in Documents Applet
  Then the sorting by Date/Time is in ascending in Documents Applet
  And the first row is as below when grouped by "Date" in Documents Applet
  | row index	| Date       | Description                 	| Type              | Entered By    	| Facility		|
  | 2			| 01/03/1992 | Discharge Summary				| Discharge Summary	| Programmer,Twenty	| TROY			|  
  And the last row is as below when grouped by "Date" in Documents Applet
  | row index	| Date       | Description                 	| Type              | Entered By    	| Facility		|
  | 10      | 04/21/1999 | ASI-ADDICTION SEVERITY INDEX     | Progress Note   | Radtech,Twenty  | CAMP MASTER | 

@f144_19_documents_default_display @US2684
Scenario: Document applet displays sorting by Type correctly

  Given user is logged into eHMP-UI
  And user searches for and selects "ZZZRETFOUREIGHTY,PATIENT"
  When user navigates to Documents Applet
  Then "Documents" is active
  Then the search results say "No Records Found" in Documents Applet
  And the user has selected All within the global date picker
  And the default sorting by Date/Time is in descending in Documents Applet
  When user clicks on "Type" column header in Documents Applet
  And the user sees the following groups in Documents Applet
  | group # 	| groupName 		|
  | type_group1	| Discharge Summary |
  | type_group2 | Procedure			|
  | type_group3	| Progress Note		|
  | type_group4	| Surgery			|
  And the first row is as below when grouped by "Type" in Documents Applet
  | row index	| Date       | Description                 	| Type              | Entered By    	| Facility		|
  | 2			| 01/03/1992 | Discharge Summary				| Discharge Summary	| Programmer,Twenty	| TROY			|
  And the last row is as below when grouped by "Type" in Documents Applet
  | row index	| Date       | Description                 	| Type              | Entered By    	| Facility		|
  | 9			| 02/23/1994 | BIOSPY							| Surgery			| None				| CAMP MASTER	|
  When user clicks on "Type" column header in Documents Applet
  And the first row is as below when grouped by "Type" in Documents Applet
  | row index	| Date       | Description                 	| Type              | Entered By    	| Facility		|
  | 2			| 02/23/1994 | BIOSPY							| Surgery			| None				| CAMP MASTER	|
  And the last row is as below when grouped by "Type" in Documents Applet
  | row index	| Date       | Description                 	| Type              | Entered By    	| Facility		|
  | 9			| 01/03/1992 | Discharge Summary				| Discharge Summary	| Programmer,Twenty	| TROY			|
  When user clicks on "Type" column header in Documents Applet
  And the default sorting by Date/Time is in descending in Documents Applet	
 
@f144_20_documents_default_display @US2684 
Scenario: Document applet displays sorting by Facility correctly

  Given user is logged into eHMP-UI
  And user searches for and selects "ZZZRETFOUREIGHTY,PATIENT"
  When user navigates to Documents Applet
  Then "Documents" is active
  Then the search results say "No Records Found" in Documents Applet
   And the user has selected All within the global date picker
  And the default sorting by Date/Time is in descending in Documents Applet
  When user clicks on "Facility" column header in Documents Applet
  And the user sees the following groups in Documents Applet
  | group # 		| groupName 	|
  | facility_group1	| CAMP MASTER	|
  | facility_group2 | TROY  		|
 And the first row is as below when grouped by "Facility" in Documents Applet
  | row index	| Date       | Description                 	| Type              | Entered By    	| Facility		|
  | 2     | 04/21/1999 | ASI-ADDICTION SEVERITY INDEX     | Progress Note   | Radtech,Twenty  | CAMP MASTER | 
  And the last row is as below when grouped by "Facility" in Documents Applet
  | row index	| Date       | Description                 	| Type              | Entered By    	| Facility		|
  | 7			| 01/03/1992 | Discharge Summary				| Discharge Summary	| Programmer,Twenty	| TROY			|
  When user clicks on "Facility" column header in Documents Applet
  And the first row is as below when grouped by "Facility" in Documents Applet
  | row index	| Date       | Description                 	| Type              | Entered By    	| Facility		|
  | 2			| 01/03/1992 | Discharge Summary				| Discharge Summary	| Programmer,Twenty	| TROY			|
  And the last row is as below when grouped by "Facility" in Documents Applet
  | row index	| Date       | Description                 	| Type              | Entered By    	| Facility		|
  | 7			| 08/12/1992 | LAPARASCOPY					| Procedure			| None				| CAMP MASTER	|
  When user clicks on "Facility" column header in Documents Applet
  And the default sorting by Date/Time is in descending in Documents Applet

@f144_21_documents_default_display @US2684 
Scenario: Document applet displays sorting by Entered By correctly

  Given user is logged into eHMP-UI
  And user searches for and selects "ZZZRETFOUREIGHTY,PATIENT"
  When user navigates to Documents Applet
  Then "Documents" is active
  Then the search results say "No Records Found" in Documents Applet
  And the user has selected All within the global date picker
  When user clicks on "Entered By" column header in Documents Applet
  And the user sees the following groups in Documents Applet
  | group # 			| groupName 		|
  | enteredBy_group1	| None				|
  | enteredBy_group2 	| Programmer,Twenty |
  | enteredBy_group3 	| Provider,Prf 		|
  | enteredBy_group4  | Radtech,Twenty |
 And the first row is as below when grouped by "Entered By" in Documents Applet
  | row index	| Date       | Description                 	| Type              | Entered By    	| Facility		|
  | 2			| 02/23/1994 | BIOSPY							| Surgery			| None				| CAMP MASTER	|
  And the last row is as below when grouped by "Entered By" in Documents Applet
  | row index	| Date       | Description                 	| Type              | Entered By    	| Facility		|
  | 9     | 04/21/1999 | ASI-ADDICTION SEVERITY INDEX     | Progress Note   | Radtech,Twenty  | CAMP MASTER | 
  When user clicks on "Entered By" column header in Documents Applet
  And the first row is as below when grouped by "Entered By" in Documents Applet
  | row index	| Date       | Description                  | Type              | Entered By      | Facility    |
  | 2     | 04/21/1999 | ASI-ADDICTION SEVERITY INDEX     | Progress Note   | Radtech,Twenty  | CAMP MASTER | 
  And the last row is as below when grouped by "Entered By" in Documents Applet
  | row index	| Date       | Description                 	| Type              | Entered By    	| Facility		|
  | 9			| 08/12/1992 | LAPARASCOPY					| Procedure			| None				| CAMP MASTER	|
  When user clicks on "Entered By" column header in Documents Applet
  And the default sorting by Date/Time is in descending in Documents Applet

@f144_22_documents_default_display @US2684 
Scenario: Document applet displays sorting by Description correctly

  Given user is logged into eHMP-UI
  And user searches for and selects "ZZZRETFOUREIGHTY,PATIENT"
  When user navigates to Documents Applet
  Then "Documents" is active
  Then the search results say "No Records Found" in Documents Applet
  And the user has selected All within the global date picker
  And the default sorting by Date/Time is in descending in Documents Applet
  When user clicks on "Description" column header in Documents Applet
  And the user sees the following groups in Documents Applet
  | group # 			| groupName 					|
  | description_group1 	| BIOSPY						|
  | description_group2 	| Discharge Summary 			|
  | description_group3 	| LAPARASCOPY  					|
  | description_group4 	| RMS-OCCUPATIONAL THERAPY  	|
  | description_group5  | ASI-ADDICTION SEVERITY INDEX |
 And the first row is as below when grouped by "Description" in Documents Applet
  | row index	| Date       | Description                 	| Type              | Entered By    	| Facility		|
  | 2     | 04/21/1999 | ASI-ADDICTION SEVERITY INDEX     | Progress Note   | Radtech,Twenty  | CAMP MASTER | 
  And the last row is as below when grouped by "Description" in Documents Applet
  | row index	| Date       | Description                 	| Type              | Entered By    	| Facility		|
  | 10        | 04/27/1998 | RMS-OCCUPATIONAL THERAPY   | Progress Note   | Provider,Prf    | CAMP MASTER |
  When user clicks on "Description" column header in Documents Applet
  And the first row is as below when grouped by "Description" in Documents Applet
  | row index	| Date       | Description                 	| Type              | Entered By    	| Facility		|
  | 2         | 04/27/1998 | RMS-OCCUPATIONAL THERAPY   | Progress Note   | Provider,Prf    | CAMP MASTER |
  And the last row is as below when grouped by "Description" in Documents Applet
  | row index	| Date       | Description                 	| Type              | Entered By    	| Facility		|
  | 10        | 04/21/1999 | ASI-ADDICTION SEVERITY INDEX     | Progress Note   | Radtech,Twenty  | CAMP MASTER | 
  When user clicks on "Description" column header in Documents Applet
  And the default sorting by Date/Time is in descending in Documents Applet
  
@f144_23_documents_filtering
Scenario: Documents applet is able to filter data based on search

  Given user is logged into eHMP-UI
  And user searches for and selects "ZZZRETFOUREIGHTY,PATIENT"
  When user navigates to Documents Applet
  Then "Documents" is active
  Then the search results say "No Records Found" in Documents Applet
  And the user has selected All within the global date picker
  And the user clicks on search filter in Documents Applet
  And the user types "Surgery" in search box of the Documents Applet
  And the Document Applet table contains specific rows
  | row index	| Date       | Description                 	| Type              | Entered By    	| Facility		|
  | 2			| 02/23/1994 | BIOSPY							| Surgery			| None				| CAMP MASTER	| 
  And only this 1 row is visible in Document Applet

@f144_24_documents_date_filter @US2594
Scenario: Documents applet is able to filter data based date filter search
  Given user is logged into eHMP-UI
  And user searches for and selects "ZZZRETFOUREIGHTY,PATIENT"
  When user navigates to Documents Applet
  Then "Documents" is active
  And the user clicks the control "Date Filter" in the "Documents Applet"
  Then the following choices should be displayed for the "Documents Applet" Date Filter
    | All | 2yr | 1yr | 3mo | 1mo | 7d | 72hr | 24hr |

  When the user clicks the date control "1yr" on the "Documents Applet"
  And the user clicks the control "Apply" on the "Documents Applet"
  Then the search results say "No Records Found" in Documents Applet

  When the user clicks the control "Date Filter" in the "Documents Applet"
  And the user clicks the date control "3mo" on the "Documents Applet"
  And the user clicks the control "Apply" on the "Documents Applet"
  Then the search results say "No Records Found" in Documents Applet

  When the user clicks the control "Date Filter" in the "Documents Applet"
  And the user clicks the date control "1mo" on the "Documents Applet"
  And the user clicks the control "Apply" on the "Documents Applet"
  Then the search results say "No Records Found" in Documents Applet

  When the user clicks the control "Date Filter" in the "Documents Applet"
  And the user clicks the date control "7d" on the "Documents Applet"
  And the user clicks the control "Apply" on the "Documents Applet"
  Then the search results say "No Records Found" in Documents Applet

  When the user clicks the control "Date Filter" in the "Documents Applet"
  And the user clicks the date control "72hr" on the "Documents Applet"
  And the user clicks the control "Apply" on the "Documents Applet"
  Then the search results say "No Records Found" in Documents Applet

  When the user clicks the control "Date Filter" in the "Documents Applet"
  And the user clicks the date control "24hr" on the "Documents Applet"
  And the user clicks the control "Apply" on the "Documents Applet"
  Then the search results say "No Records Found" in Documents Applet

  When the user clicks the control "Date Filter" in the "Documents Applet"
  And the user inputs "01/01/1998" in the "From Date" control in the "Documents Applet"
  And the user inputs "10/10/2015" in the "To Date" control in the "Documents Applet"
  And the user clicks the control "Apply" on the "Documents Applet"
  And the Document Applet table contains specific rows
  | row index	| Date       | Description                 	| Type              | Entered By    	| Facility		|
  | 2        | 04/21/1999 | ASI-ADDICTION SEVERITY INDEX     | Progress Note   | Radtech,Twenty  | CAMP MASTER | 
  | 4        | 04/27/1998 | RMS-OCCUPATIONAL THERAPY		| Progress Note		| Provider,Prf		| CAMP MASTER	|
  And only these 2 rows are visible in Document Applet

#following scenario works only with firefox.  iframes are not working in phatomJS.  so added debug tag.  
@f144_25_documents_dod_notes @US4273 @debug
Scenario: Display of DOD complex notes in the documents screen

  Given user is logged into eHMP-UI
  And user searches for and selects "Onehundredsixteen, Patient"
  When user navigates to Documents Applet
  Then the search results say "No Records Found" in Documents Applet
  And the user has selected All within the global date picker
  And the user selects the "Progress Note DoD*" row in Documents Applet
  Then the Documents Applet detail "DoD* Note" page title says "progress note Details"
  Then the Documents Applet detail "DoD*" view contains fields
      | field           | value              |
      | Facility        | DOD		       	 |
      | Author          | SJF, FOUR          |
      | Status          | Completed          |
      | Date/Time       | 03/07/2012 - 23:50 |
  And the Documents Applet detail DoD* Content view content contains
      | Content Text                    		|
	  | Patient: DDTEST, DAMON					|
      | Date: 07 Mar 2012 1728 EDT				|
	  | Appt Type: PROC							|
	  | Treatment Facility: 4TH MEDICAL GROUP	|
	  | Clinic: BLUE MTF						|
	  | Patient Status: Outpatient			 	|
	  | Bacterial acute ascending myelitis		|
	  | No Social History Found					|
  Then the Documents Applet detail view closes when user clicks the close button

