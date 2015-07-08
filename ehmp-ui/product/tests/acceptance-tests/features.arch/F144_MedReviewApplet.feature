@f144_MedReviewApplet  @regression

Feature: F144 - eHMP Viewer GUI -  Med Review applet display

#POC:Team Jupiter

@f144_medReviewApplet_navigation_thro_dropdown @US1153 @MM
Scenario: Display of the patients medication types & count
  Given user is logged into eHMP-UI
  And user searches for and selects "Zzzretiredonenineteen,Patient"
  Then Overview is active
  When user selects Meds Review from Coversheet dropdown
  Then "Meds Review" is active
  Then the search results say "No Records" in Med Review Applet
  	
@f144_1_medicationSummaryDisplay @US1153 @MM @base
Scenario: Display of the patients medication types & count
  Given user is logged into eHMP-UI
  And user searches for and selects "Zzzretiredonenineteen,Patient"
  When user navigates to Meds Review Applet
  Then "Meds Review" is active
  #Then the search results say "No Records" in Med Review Applet
  #And the user clicks the control "Date Filter" in the "Med Review Applet"
  #When the user clicks the date control "All" in the "Med Review Applet"
  #And the user clicks the control "Apply" on the "Med Review Applet"
  And the user has selected All within the global date picker
  Then user sees "4" "inpatient" search results
  Then user sees "4" "outpatient" search results

@f144_1a_medicationSummaryDisplay @US1153  
Scenario: Display of the in-patients medication(IV) types & count
  Given user is logged into eHMP-UI
  And user searches for and selects "Zzzretiredonenineteen,Patient"
  When user navigates to Meds Review Applet
  Then "Meds Review" is active
  #Then the search results say "No Records" in Med Review Applet
  And the user has selected All within the global date picker
  Then the user clicks on link "inpatient"
  Then user sees "2" IV search results
      
@f144_2_medicationSummaryDisplay  @US1153 
Scenario: Display of medication grouping by medication type
  Given user is logged into eHMP-UI
  And user searches for and selects "Zzzretiredonenineteen,Patient"
  When user navigates to Meds Review Applet
  Then "Meds Review" is active
  #Then the search results say "No Records" in Med Review Applet
  And the user has selected All within the global date picker
  Then the user clicks on link "inpatient" 
  Then the user clicks on link "outpatient" 
  
@f144_3_medicationSummaryDisplay @US1153 
Scenario: Display of the patients medication summary information for inpatient
  Given user is logged into eHMP-UI
  And user searches for and selects "Zzzretiredonenineteen,Patient"
  When user navigates to Meds Review Applet
  Then "Meds Review" is active
  #Then the search results say "No Records" in Med Review Applet
  And the user has selected All within the global date picker
  Then the user clicks on link "inpatient" 
  #And medication applet inpatient summary results contain
  And medication applet summary results contain "Digoxin Tab" with the details
  | field               | value                       |
  | qualifiedName       | Digoxin Tab                 |
  | vaStatus            | Expired                     |
  | overallStop         | 03/14/1999                  |
  | routeAndScheduleName| PO QD                       |
  | lastAdminLabel      | Last admin                  |
  | lastAdminValue      | No Data                     |
  | scheduledTimesLabel | Scheduled Times             |
  | scheduledTimesValue | No Data                     |
  #And medication applet inpatient summary results contain
  And medication applet summary results contain "Furosemide Tab" with the details
  | field               | value                       |
  | qualifiedName       | Furosemide Tab              |
  | vaStatus            | Expired                     |
  | overallStop         | 03/14/1999                  |
  | routeAndScheduleName| PO QD                       |
  | lastAdminLabel      | Last admin                  |
  | lastAdminValue      | No Data                     |
  | scheduledTimesLabel | Scheduled Times             |
  | scheduledTimesValue | No Data                     |
  
@f144_4_medicationDetailDisplay @US1154 @DE287 @US3710
Scenario: Display of all the headings in the detail display
  Given user is logged into eHMP-UI
  And user searches for and selects "Zzzretiredonenineteen,Patient"
  When user navigates to Meds Review Applet
  Then "Meds Review" is active
  #Then the search results say "No Records" in Med Review Applet
  And the user has selected All within the global date picker
  Then the user clicks on link "inpatient" 
  Then the user clicks on link "DIGOXIN TAB" 
  Then the user sees the heading "Digoxin Tab"
  Then the user sees the heading "Fill History"
  Then the user sees the heading "Order Hx"
  Then the user sees the heading "Links"
  Then the user sees the heading "Patient Education"
  
@f144_5_medicationDetailDisplay @US1158  @DE287 @US3710 @DE948 @triage
Scenario: Display of the links

  Given user is logged into eHMP-UI
  And user searches for and selects "Zzzretiredonenineteen,Patient"
  When user navigates to Meds Review Applet
  Then "Meds Review" is active
  #Then the search results say "No Records" in Med Review Applet
  And the user has selected All within the global date picker
  Then the user clicks on link "inpatient" 
  Then the user clicks on link "DIGOXIN TAB"
  Then the user sees following links under "Links" heading
   | Links					  |
   | Clinical Pharmacology    |
   | MDConsult                | 
   | UpToDate                 |
   | VisualDx			 	  |
  Then the user sees following links under "Patient Education" heading
   | Patient Education		  |
   | Krames StayWell    	  |
   | UpToDate                 |
   | VisualDx				  |
  Then the user clicks on link "Clinical Pharmacology"
  Then the user clicks on link "MDConsult"
  Then the user clicks on link "UpToDate"
  Then the user clicks on link "VisualDx"
  Then the user clicks on link "Krames StayWell"

@f144_6_medicationDetailDisplay @US1154
Scenario: Display of the following detail information about the medication

  Given user is logged into eHMP-UI
  And user searches for and selects "Zzzretiredonenineteen,Patient"
  When user navigates to Meds Review Applet
  Then "Meds Review" is active
  #Then the search results say "No Records" in Med Review Applet
  And the user has selected All within the global date picker
  Then the user clicks on link "inpatient" 
  Then the user clicks on link "DIGOXIN TAB"  
  Then the user sees the heading "Prescription No."
  Then the user sees the heading "Supply"
  Then the user sees the heading "Dose/Schedule"
  Then the user sees the heading "Provider"
  Then the user sees the heading "Pharmacist"
  Then the user sees the heading "Location"
  Then the user sees the heading "Facility"
  
@f144_7_medicationDetailDisplay @US1154
Scenario: Display of the following detail information about the medication for inpatient

  Given user is logged into eHMP-UI
  And user searches for and selects "Zzzretiredonenineteen,Patient"
  When user navigates to Meds Review Applet
  Then "Meds Review" is active
  #Then the search results say "No Records" in Med Review Applet
  And the user has selected All within the global date picker
  Then the user clicks on link "inpatient" 
  Then the user clicks on link "DIGOXIN TAB"  
  And "DIGOXIN TAB" medication details results contain 
  | field               | value                       |
  | Sig                 | Give:                       |
  | Dose/Schedule       | PO QD                       |
  | Provider            | PROGRAMMER,TWENTYEIGHT      |
  | Pharmacist          | PROGRAMMER,TWENTYEIGHT      |
  | Location            | GEN MED                     |
  | Facility            | TROY                        |
    
@f144_8_medicationSummaryDisplay @US1153
Scenario: Display of the patients medication summary information for outpatient

  Given user is logged into eHMP-UI
  And user searches for and selects "Zzzretiredonenineteen,Patient"
  When user navigates to Meds Review Applet
  Then "Meds Review" is active
  #Then the search results say "No Records" in Med Review Applet
  And the user has selected All within the global date picker
  Then the user clicks on link "outpatient" 
  #And medication applet outpatient summary results contain
  And medication applet summary results contain "Cimetidine Tab" with the details
  | field                                | value                       |
  | qualifiedName                        | Cimetidine Tab              | 
  | vaStatus                             | Expired                     |
  | overallStop                          | 01/20/2000                  |
  | routeAndScheduleName                 | PO QD                       |
  | lastFilledLabel                      | Last filled                 |
  | lastFilled                           | 09/01/1999                  |
  | fillRemaining fillsAllowed daysSupply| 5 Refills (30 days each)    |
  
@f144_9_medicationDetailDisplay @US1154
Scenario: Display of the following detail information about the medication for outpatient

  Given user is logged into eHMP-UI
  And user searches for and selects "Zzzretiredonenineteen,Patient"
  When user navigates to Meds Review Applet
  Then "Meds Review" is active
  #Then the search results say "No Records" in Med Review Applet
  And the user has selected All within the global date picker
  Then the user clicks on link "outpatient" 
  Then the user clicks on link "CIMETIDINE TAB"  
  And "CIMETIDINE TAB" medication details results contain  
  | field               | value                            |
  | prescription id     | 100001912                        |  
  | supply              | 60 for 30 days (5 of 5 remaining)|     
  | Dose/Schedule       | PO QD                            |
  | Provider            | PROGRAMMER,TWENTY                |
  | Pharmacist          | PROGRAMMER,TWENTYEIGHT           |
  | Location            | GEN MED                          |
  | Facility            | TROY                             | 
  
# in the above data supply computed from these fields: quantityordered, daysSupply, fillsAllowed, fillsRemaining	

@f144_10_medicationDetailDisplay @US2291
Scenario: Verify med review applet displays the following detail information about the fill history

  Given user is logged into eHMP-UI
  And user searches for and selects "Zzzretiredonenineteen,Patient"
  When user navigates to Meds Review Applet
  Then "Meds Review" is active
  #Then the search results say "No Records" in Med Review Applet
  And the user has selected All within the global date picker
  Then the user clicks on link "outpatient" 
  Then the user clicks on link "CIMETIDINE TAB"
  And the user sees "Order Hx Date" as "09/01/1999 - 01/20/2000"
  And the fill history table contains rows 
  |row index| dispensedate  | quantityAnddaysSupplyDispensed | routing | empty  |
  | 1		| 09/01/1999  	| 60 for 30 days                 | Window  |        |
    
@f144_11_medicationDetailDisplay @US2238 @DE628
Scenario: Display of the site correctly.

  Given user is logged into eHMP-UI
  And user searches for and selects "Graphingpatient,Two"
  When user navigates to Meds Review Applet
  Then "Meds Review" is active
  Then user sees "10" "outpatient" search results
  And the user has selected All within the global date picker
  Then user sees "44" "outpatient" search results
  Then the user clicks on link "outpatient" 
#  And medication applet outpatient summary results contain
  And medication applet summary results contain "Terazosin Cap,oral" with the details
  | field                                | value                       |
  | qualifiedName                        | Terazosin Cap,oral          | 
  | vaStatus                             | 3 Active Orders             |
  | overallStop                          | 10/03/2008                  |
  | routeAndScheduleName                 | 5 MG PO HS                  |
  | lastFilledLabel                      | Last filled                 |
  | lastFilled                           | 10/03/2007                  |
  | fillRemaining fillsAllowed daysSupply| 3 Refills (90 days each)    |
  | totalDailyLabel                      | Total Daily                 |
  | doseAndUnits                         | 5 MG                        |
  #| facilityName                         | NCH                         |
#facilityName 500 is translated as NCH.
#when there are multiple medicines lastfilled date latest is displayed on the GUI.  
  
@f144_12_medicationDetailDisplay @US2234 @DE628 
Scenario: Display of the order history for medication grouping correctly.

  Given user is logged into eHMP-UI
  And user searches for and selects "Graphingpatient,Two"
  When user navigates to Meds Review Applet
  Then "Meds Review" is active
  #Then user sees "10" "outpatient" search results
  And the user has selected All within the global date picker
  #Then user sees "44" "outpatient" search results
  Then the user clicks on link "outpatient"   
  Then the user clicks on link "TERAZOSIN CAP,ORAL"
  Then the Order Hx Date are grouped as below
  | startstoppanorama1 | 09/18/2006 - 09/19/2007 |
  #| startstopkodak1    | 09/18/2006 - 09/19/2007 |
  | startstopanorama2  | 02/16/2007 - 02/17/2008 |
  #| startstopkodak2    | 02/16/2007 - 02/17/2008 |
  | startstoppanorama3 | 10/03/2007 - 10/03/2008 |
  #| startstoppkodak3   | 10/03/2007 - 10/03/2008 |
  Then the user clicks on link "Order Hx date 5"
  And "TERAZOSIN CAP,ORAL" medication details results contain
  | field               | value                            |
  | prescription id     | 500927                           |  
  | supply              | 90 for 90 days (3 of 3 remaining)|     
  | Dose/Schedule       | 5 PO HS                          |
  | Provider            | PROVIDER,ONE                     |
  | Pharmacist          | PHARMACIST,ONE                   |
  | Location            |                                  |
  | Facility            | CAMP MASTER                      | 
  
  
@f144_13_medreview_date_filter 
Scenario: Filter data based on date filter search(integration of global date picker)

  Given user is logged into eHMP-UI
  And user searches for and selects "Zzzretiredonenineteen,Patient"
  When user navigates to Meds Review Applet
  Then "Meds Review" is active
  And the user clicks the control "Date Filter" in the "Med Review Applet"
  And the following choices should be displayed for the "Med Review Applet" Date Filter
    | All | 2yr | 1yr | 3mo | 1mo | 7d | 72hr | 24hr |
    
  And the user clicks the date control "1yr" on the "Med Review Applet"
  And the user clicks the control "Apply" on the "Med Review Applet"
  Then the search results say "No Records" in Med Review Applet
  
  And the user clicks the control "Date Filter" in the "Med Review Applet"
  And the user clicks the date control "3mo" on the "Med Review Applet"
  And the user clicks the control "Apply" on the "Med Review Applet"
  Then the search results say "No Records" in Med Review Applet
  
  And the user clicks the control "Date Filter" in the "Med Review Applet"
  And the user clicks the date control "1mo" on the "Med Review Applet"
  And the user clicks the control "Apply" on the "Med Review Applet"
  Then the search results say "No Records" in Med Review Applet
  
  And the user clicks the control "Date Filter" in the "Med Review Applet"
  And the user clicks the date control "7d" on the "Med Review Applet"
  And the user clicks the control "Apply" on the "Med Review Applet"
  Then the search results say "No Records" in Med Review Applet
  
  And the user clicks the control "Date Filter" in the "Med Review Applet"
  And the user clicks the date control "72hr" on the "Med Review Applet"
  And the user clicks the control "Apply" on the "Med Review Applet"
  Then the search results say "No Records" in Med Review Applet
  
  And the user clicks the control "Date Filter" in the "Med Review Applet"
  And the user clicks the date control "24hr" on the "Med Review Applet"
  And the user clicks the control "Apply" on the "Med Review Applet"
  Then the search results say "No Records" in Med Review Applet
  
  And the user clicks the control "Date Filter" in the "Med Review Applet"
  And the user inputs "01/01/1999" in the "From Date" control in the "Med Review Applet"
  And the user inputs "03/15/2020" in the "To Date" control in the "Med Review Applet"
  And the user clicks the control "Apply" in the "Med Review Applet"
  Then user sees "4" "inpatient" search results
  Then the user clicks on link "inpatient" 
  And medication applet summary results contain "Digoxin Tab" with the details
  | field               | value                       |
  | qualifiedName       | Digoxin Tab                 |   
  | vaStatus            | Expired                     |
  | overallStop         | 03/14/1999                  |
  | routeAndScheduleName| PO QD                       |
  | lastAdminLabel      | Last admin                  |
  | lastAdminValue      | No Data                     |
  | scheduledTimesLabel | Scheduled Times             |
  | scheduledTimesValue | No Data                     |
  
  And medication applet summary results contain "Furosemide Tab" with the details
  | field               | value                       |
  | qualifiedName       | Furosemide Tab              | 
  | vaStatus            | Expired                     |
  | overallStop         | 03/14/1999                  |
  | routeAndScheduleName| PO QD                       |
  | lastAdminLabel      | Last admin                  |
  | lastAdminValue      | No Data                     |
  | scheduledTimesLabel | Scheduled Times             |
  | scheduledTimesValue | No Data                     |

@f144_14_medicationSummaryDisplay @US2451 @US2909 @vimm
Scenario: Display of the patients medication types clinic orders and Non-Va medication
  Given user is logged into eHMP-UI
  And user searches for and selects "Bcma,Eight"
  And Overview is active
  When user navigates to Meds Review Applet
  Then "Meds Review" is active
  And the user has selected All within the global date picker
  Then user sees "11" "outpatient" search results
  Then user sees "3" "Non Va" search results
  Then user sees "5" "clinic order" search results  
  Then user sees "9" "inpatient" search results
  
@f144_15_medicationSummaryDisplay @US2451 @US2909 @vimm
Scenario: Display of medication grouping by medication type for clinical order and Non-Va
  Given user is logged into eHMP-UI
  And user searches for and selects "Bcma,Eight"
  And Overview is active
  When user navigates to Meds Review Applet
  Then "Meds Review" is active
  And the user has selected All within the global date picker
  Then the user clicks on link "clinic order" 
  Then the user clicks on link "Non Va" 

@f144_16_medicationSummaryDisplay @US2451  @US2909
Scenario: Display of the patients medication types supplies
  Given user is logged into eHMP-UI
  And the User selects mysite and All
  And user enters full last name "ZZZRETFIVEFIFTYONE,PATIENT"
  And the user select patient name "ZZZRETFIVEFIFTYONE,PATIENT"
  And the user click on acknowledge restricted record
  Then the user click on Confirm Selection
  Then Default Screen is active
  When user navigates to Meds Review Applet
  Then "Meds Review" is active
  Then the search results say "No Records" in Med Review Applet
  And the user has selected All within the global date picker
  Then user sees "2" "supplies" search results
  Then the user clicks on link "supplies" 
