@f338_MedReviewApplet @regression

Feature: F338 - Meds Review Sparkline 2 -  Med Review applet display

#POC:Team Jupiter

@f338_1_medReviewApplet_navigation_thro_dropdown @US5421 @base
Scenario: User navigates to Meds Review Applet from default screen.
  Given user is logged into eHMP-UI
  And user searches for and selects "fourteen,Patient"
  Then Overview is active
  When user selects Meds Review from drop down menu
  Then "Meds Review" is active
  
@F338-1.7 @f338_2_medication_grouping @US5421
Scenario: Display of medication grouping by medication type for inpatient and outpatient
  Given user is logged into eHMP-UI
  And user searches for and selects "fourteen,Patient"
  When user navigates to Meds Review Applet
  Then "Meds Review" is active
  And the title of the page says "MEDICATION REVIEW" in Meds Review Applet
  And user sees "Outpatient Meds Group" and "Inpatient Meds Group" in Meds Review Applet
  
@F338-1 @F338-1.6 @F338-1.9 @F1.16 @f338_3_medication_summary_outpatient_meds @US5421 @US4608 @US5429
Scenario: Display of medication summary for outpatient medications
  Given user is logged into eHMP-UI
  And user searches for and selects "fourteen,Patient"
  When user navigates to Meds Review Applet
  Then "Meds Review" is active
  And the user has selected All within the global date picker
  #When user expands "Outpatient Meds Group" in Meds Review Applet
  And "Outpatient Meds Group" summary view contains headers in Meds Review Applet
  | Name  | Sig | Last | Status/Fillable |
  And "Outpatient Meds Group" summary view contains medications in Meds Review Applet
  | Name                    | Sig            | Last | Status/Fillable   |
  | METFORMIN TAB,SA        | 500MG PO BID   |      | Expired 5y		|
  | METOPROLOL TARTRATE TAB | 50MG PO BID    |      | Expired 4y  		|
  | SIMVASTATIN TAB         | 40MG PO QPM    |      | Expired 4y		|
  | WARFARIN TAB            | 5MG PO QD-WARF |      | Discontinued 8y  	|
  | ASPIRIN TAB,EC          | 81MG PO QAM    |      | Non VA 			|

@F338-8 @f338_4_medication_detail_outpatient_meds @US5421 @triage @DE1421 @DE1564
Scenario: Display of medication details for outpatient medications
  Given user is logged into eHMP-UI
  And user searches for and selects "fourteen,Patient"
  When user navigates to Meds Review Applet
  Then "Meds Review" is active
  And the user has selected All within the global date picker
  #When user expands "Outpatient Meds Group" in Meds Review Applet
  Then user selects medication "WARFARIN TAB" in Meds Review Applet
  #Then print debug information
  Then user selects from the menu medication review detail icon for "WARFARIN TAB" in Meds Review Applet
  And the medication detail header section in Meds Review Applet contains 
  | field         		| value                     					|
  | Med Name_Warfarin   | Warfarin tab 5 MG               				|
  | Status_Warfarin     | DISCONTINUED                  				|
  | Sig_Warfarin      	| TAKE ONE TABLET BY BY MOUTH EVERY DAY AT 1 PM |
  And medication detail description section in Meds Review Applet contains
  | field         		| value              				|
  | Prescription No.    | 500418              				|
  | Supply          	| 30 for 30 days (5 of 5 remaining) |
  | Dose/Schedule     	| 5 PO QD-WARF            			|
  | Provider        	| VEHU,ONEHUNDRED         			|
  | Pharmacist        	| PHARMACIST,THIRTY         		|
  | Location        	| VIST CLINIC           			|
  | Facility        	| CAMP MASTER           			|
  And the medication detail fill history section in Meds Review Applet contains
  |row index| dispensedate  | quantityAnddaysSupplyDispensed | routing | empty  |
  | 1   	| 06/04/2006    | 30 For 30 Days                 | Window  |        |  

@f338_5_medication_column_default_and_sorting_name @US5903 @DE1479
Scenario: Med Review Applet is sorted by the status first and then by name in alpha order.
  Given user is logged into eHMP-UI
  Given user searches for and selects "EIGHT,INPATIENT"
  When user navigates to Meds Review Applet
  Then "Meds Review" is active
  And the user has selected All within the global date picker
  When user expands "Outpatient Meds Group" in Meds Review Applet
  Then "Name" column is sorted in default sorting order in Med Review Applet
  | med names			|  
  | ascorbic acid tab	|
  | methocarbamol tab   |
  | phytonadione tab	|  
  | acetaminophen		|
  | astemizole			|  
  | ibuprofen tab  		|
  | omeprazole cap,ec	|
  | cyanocobalamin inj,soln|   
  When user clicks on the column header "Outpatient Name" in Med Review Applet
  Then "Name" column is sorted in ascending order in Med Review Applet
  When user clicks on the column header "Outpatient Name" in Med Review Applet
  Then "Name" column is sorted in descending order in Med Review Applet
  
@f338_6_medication_column_sorting_sig @US5421
Scenario: Med Review Applet is sorted by the column header Sig.
  Given user is logged into eHMP-UI
  Given user searches for and selects "FOURTEEN,PATIENT"
  When user navigates to Meds Review Applet
  Then "Meds Review" is active
  And the user has selected All within the global date picker
  #And user expands "Outpatient Meds Group" in Meds Review Applet
  When user clicks on the column header "Outpatient Sig" in Med Review Applet
  Then "Sig" column is sorted in ascending order in Med Review Applet
  When user clicks on the column header "Outpatient Sig" in Med Review Applet
  Then "Sig" column is sorted in descending order in Med Review Applet

@f338_7_medication_column_sorting_last @US5421 @future
Scenario: Med Review Applet is sorted by the column header Last.
  Given user is logged into eHMP-UI
  Given user searches for and selects "FOURTEEN,PATIENT"
  When user navigates to Meds Review Applet
  Then "Meds Review" is active
  And the user has selected All within the global date picker
  #And user expands "Outpatient Meds Group" in Meds Review Applet
  When user clicks on the column header "Outpatient Last" in Med Review Applet
  Then "Last" column is sorted in "descending" order in Med Review Applet
  | 8y | 8y | 8y | 8y | 5y | 5y | 4y | 4y | 4y | 4y |
  When user clicks on the column header "Outpatient Last" in Med Review Applet
  Then "Last" column is sorted in "ascending" order in Med Review Applet
  | 4y | 4y | 4y | 4y | 5y | 5y | 8y | 8y | 8y | 8y |
  
@F338-2 @F338-2.1 @f338_8_medication_summary_inpatient_meds @US5421
Scenario: Display of medication summary for inpatient medications
  Given user is logged into eHMP-UI
  And user searches for and selects "zzzretiredonenineteen,Patient"
  When user navigates to Meds Review Applet
  Then "Meds Review" is active
  And the user has selected All within the global date picker
  #When user expands "Inpatient Meds Group" in Meds Review Applet
  And "Inpatient Meds Group" summary view contains headers in Meds Review Applet
  | Name  | Sig | Last | Status/Next |
  And "Inpatient Meds Group" summary view contains medications in Meds Review Applet
  | Name                                       | Sig             | Last | Status/Next   |
  | AMPICILLIN INJ in SODIUM CHLORIDE 0.9% INJ | 1 GM            |      | Expired 16y	|
  | CEFAZOLIN INJ in SODIUM CHLORIDE 0.9% INJ  | 1 GM            |      | Expired 16y	|
  | DIGOXIN TAB                                | TAB Give:       |      | Expired 16y	|
  | FUROSEMIDE TAB                             | 40 MG TAB Give: |      | Expired 16y	|
  
@f338_9_medication_detail_inpatient_meds @US5421 @triage @DE1421 @DE1564
Scenario: Display of medication details for inpatient medications
  Given user is logged into eHMP-UI
  And user searches for and selects "zzzretiredonenineteen,Patient"
  When user navigates to Meds Review Applet
  Then "Meds Review" is active
  And the user has selected All within the global date picker
  #When user expands "Inpatient Meds Group" in Meds Review Applet
  Then user selects medication "DIGOXIN TAB" in Meds Review Applet
  #Then user selects from the menu medication review detail icon for "DIGOXIN TAB" in Meds Review Applet
  Then user selects the "DIGOXIN TAB" detail icon in Meds Review Applet
  And the medication detail header section in Meds Review Applet contains 
  | field                 | value         |
  | Med Name_Digoxin      | Digoxin Tab   |
  | Status_Digoxin        | EXPIRED       |
  | Sig_Digoxin           | Give:         |
 
@F338-6 @F338-1.4 @f338_10_medication_global_datefilter @US5421 @future
Scenario: Display of medication summary for outpatient for a custom date range
  Given user is logged into eHMP-UI
  And user searches for and selects "Fourteen,Patient"
  When user navigates to Meds Review Applet
  Then "Meds Review" is active
  And the user clicks the control "Date Filter" in the "Med Review Applet"
  And the user inputs "01/01/2009" in the "From Date" control in the "Med Review Applet"
  And the user clicks the control "Apply" in the "Med Review Applet"
  #When user expands "Outpatient Meds Group" in Meds Review Applet
  And "Outpatient Meds Group" summary view contains medications in Meds Review Applet
      | Name                    | Sig          | Last | Fillable 	|
      | METFORMIN TAB,SA        | 500MG PO BID |      | Expired 5y	|
      | METOPROLOL TARTRATE TAB | 50MG PO BID  |      | Expired 4y	|
      | SIMVASTATIN TAB         | 40MG PO QPM  |      | Expired 4y	|

  When user selects medication "METFORMIN TAB,SA" in Meds Review Applet
  Then user selects from the menu medication review detail icon for "METFORMIN TAB,SA" in Meds Review Applet
  Then OrderHx date range shows
  | 02/27/2010 - 05/28/2010 |
  | 02/27/2010 - 05/28/2010 |
  

@f338_11_medication_filtering @US5421
Scenario: Display of medication summary for outpatient medications after searching for a specific string
  Given user is logged into eHMP-UI
  And user searches for and selects "fourteen,Patient"
  When user navigates to Meds Review Applet
  Then "Meds Review" is active
  And the user has selected All within the global date picker
  And the user clicks on search filter in Meds Review Applet
  And the user types "Aspirin" in search box of the Meds Review Applet
  #When user expands "Outpatient Meds Group" in Meds Review Applet
  And "Outpatient Meds Group" summary view contains medications in Meds Review Applet

  | Name                | Sig            | Last	| Fillable  |
  | ASPIRIN TAB,EC      | 81MG PO QAM    |      | Non VA 	|


