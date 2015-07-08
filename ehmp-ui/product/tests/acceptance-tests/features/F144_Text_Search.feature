#POC: Team Jupiter

@f144_text_search @regression

Feature: F144-eHMP Viewer GUI - Text Search
#User shall type a set of words into the search text box
#After the user types 3 characters, the user shall be presented with a list of suggested search items/types
#Once the user clicks the search button or selects the search item/type,
#The system shall return a list of results for a previously selected patient, grouped by item type
#Each item in the search results shall activate a detail area for the item clicked

	
@f144_1_text_search @US2226  @debug
Scenario: User can conduct text search
  Given user is logged into eHMP-UI
  And user searches for and selects "TEN,PATIENT"
  And the coversheet is displayed
  #Then from the coversheet the user clicks on "Record Search"
  Then user searches for "lab"
  And user type text term and the page contains total items and search results
      | text           | total_items |
      | lab            | 375         |
      | med            | 305         |
      | fever          | 2           |
      | yellow fever   | 1           |
      #| progress notes | 51          |

@f144_2_text_search_group_result @US2226 @base
Scenario: Search results displays as a group
  Given user is logged into eHMP-UI
  And user searches for and selects "TEN,PATIENT"
  Then user searches for "vital"
  #Then search result header displays 377 number of results
  Then text search result contains
  |Grouped_search_results|
  |Discharge Summarization Note|
  |Vital Sign|
  

@f144_3_text_search_filtered_by_time @US2227 @vimm_observed @DE841
Scenario: User is able to filter the search based on time
  Given user is logged into eHMP-UI
  And user searches for and selects "Sixhundred,PATIENT"
  Then user searches for "vital"
  And the following choices should be displayed for the "Text Search" Date Filter
  | All | 2yr | 1yr | 3mo | 1mo | 7d | 72hr | 24hr |
  Then search result displays "13" search results
  Then text search result contains
  |Grouped_search_results|
  #|Discharge Summarization Note|
  |Vital Sign|
  
  Then the user clicks the date control "2yr" on the "Text Search"
  Then search result displays "0" search results
  #Then text search result contains
  #|Grouped_search_results|
  #|Vital Sign|
  
 Then the user clicks the date control "1yr" on the "Text Search"
 Then search result displays "0" search results
 
 Then the user clicks the date control "3mo" on the "Text Search"
 Then search result displays "0" search results
 
 Then the user clicks the date control "1mo" on the "Text Search"
 Then search result displays "0" search results
 
 Then the user clicks the date control "7d" on the "Text Search"
 Then search result displays "0" search results
 
 Then the user clicks the date control "72hr" on the "Text Search"
 Then search result displays "0" search results
 
 Then the user clicks the date control "24hr" on the "Text Search"
 Then search result displays "0" search results

#Debug tag because test works fine in firefox, but fails in Phantom JS
@f144_4_text_search_filter_by_custom_from_to @US2375 @US2617 @debug
	Scenario: Filter search result by providing custom to and from date
	Given user is logged into eHMP-UI
    And user searches for and selects "TEN,PATIENT"
	Then user type text term "vital" in the search text box
	And the user inputs "04/11/2013" in the "From Date" control in the "Text Search"
	#And the user enters "10252010" in the "From Date" control
	And the user inputs "04/11/2013" in the "To Date" control in the "Text Search"
	#And the user enters "12312011" in the "To Date" control
	And the user clicks the control "Apply" in the "Text Search"
	Then search result displays "5" search results

@f144_5_med_search_result_view_detail @US2374 @DE832
Scenario: Verify user is able to view the detail medication search results
  Given user is logged into eHMP-UI
  And user searches for and selects "TEN,PATIENT"
  Then user searches for "med"
  Then the user clicks one of the search result "Medication, Outpatient" 
  Then the user clicks one of the search result "Ascorbic Acid" 
  Then the modal is displayed
  And the modal's title is "Medication - ascorbic acid tab"
  

@f144_6_immunization_search_result_view_detail @US2364 @vimm
Scenario: User is able to view the detail immunization search results
  Given user is logged into eHMP-UI
  And user searches for and selects "TEN,PATIENT"
  Then user searches for "immunization"
  Then the user clicks one of the search result "Immunization" 
  Then the user clicks one of the search result "Cholera"
  Then the modal is displayed
  And the modal's title is "Vaccine - CHOLERA, ORAL (HISTORICAL)"

@f144_7_Allergy_search_result_view_detail @US2241
Scenario: User is able to view the detail allergy search results
  Given user is logged into eHMP-UI
  And user searches for and selects "Four,PATIENT"
  Then user searches for "allergy"
  Then the user clicks one of the search result "Allergy/Adverse Reaction" 
  Then the user clicks one of the search result "Penicillin"
  Then the modal is displayed
  And the modal's title is "Allergen - PENICILLIN"
  And the "Penicillin details" contains
      | field        | value                                      |
      | field1       | Drug Classes:                              |
      | field1 value | PENICILLINS AND BETA-LACTAM ANTIMICROBIALS |
      | field2       | Originated:                                |
      | field2 value | 03/17/2005 - 19:56                         |
      | field3       | Observed/Historical:                       |
      | field3 value | Historical                                 |
  And the user clicks the modal "Close Button"
  And the modal is closed


@f144_8_Problem_list_search_result_view_detail @US2251 @US2792
  Scenario: User is able to view the detail of problem list search results
  Given user is logged into eHMP-UI
  And user searches for and selects "Four,PATIENT"
  Then user searches for "headache"
  Then text search result contains
  
  |Grouped_search_results|
  |Problem|
  Then the user clicks one of the search result "Problem" 
  Then the user clicks one of the search result "Headache"
  Then sub grouped search result for "Headache" contains
      | field    | Sub_group_search_results |
      | date     | 12/07/1994               |
      | status   | Inactive                 |
      | facility | CAMP MASTER              |
  Then the user clicks one of the search result "Sub Group List"
  Then the modal is displayed
  And the modal's title is "Headache"
  And the "Headache details" contains
      | field       | value             |
      | Field1Titel | Primary ICD-9-CM: |
      | Field1Value | 784.0             |
  And the user clicks the modal "Close Button"
  And the modal is closed
      
	
@f144_9_text_search_suggestion @debug
Scenario: When user types text in search text box search suggestions are displayed
    Given user is logged into eHMP-UI
    And user searches for and selects "Four,PATIENT"
	Then user type <text> term and the page displays total no of suggestions "<total_suggestions>"
      | text             | total_suggestions |
      | med              | 11                 |
      | patient movement | 2                 |
      | diagnosis        | 2                 |
      | conditions       | 3                 |
      | Allergy          | 3                 |
      | Ad liv           | 2                 |

      
      
@f144_10_lab_report_search_result_view_detail @US2242 @DE865 @triage @DE910
Scenario: User is able to view the detail of Lab result search results
  Given user is logged into eHMP-UI
  And user searches for and selects "Four,PATIENT"
  Then user searches for "hdl - serum"
  Then text search result contains
  
  |Grouped_search_results|
  |Laboratory|
  
  Then the user clicks one of the search result "Laboratory" 
  Then the user clicks one of the search result "HDL"
  Then the modal is displayed
  And the modal's title is "HDL - SERUM" 
  And the "Lab Detail" table contains headers
    | Date       | Lab Test          | Flag | Result | Unit  | Ref Range | Facility |
  And the "Lab Detail" row is
    | Date       | Lab Test          | Flag | Result | Unit  | Ref Range | 
    | 03/05/2010 | HDL - SERUM       |      | 58     | MG/DL | 40-60     | 
  And the user clicks the modal "Close Button"
  And the modal is closed
 
@f144_11_lab_order_search_result_view_detail @US2250
Scenario: User is able to view the detail of lab order search results
  Given user is logged into eHMP-UI
  And user searches for and selects "Four,PATIENT"
  Then user searches for "Urinalysis"
  Then text search result contains
  
  |Grouped_search_results|
  |Laboratory|
  
  Then the user clicks one of the search result "Laboratory" 
  Then the user clicks one of the search result "Urinalysis"
  And the modal is displayed
  And the modal's title is "URINALYSIS URINE WC LB #579"
  And Current Status for "Lab" is "ACTIVE"
  And the user clicks the modal "Close Button"
  And the modal is closed
    
 @f144_12_radiology_order_search_result_view_detail @US2256
Scenario: User is able to view the detail of radiology/Imaging orders search results
  Given user is logged into eHMP-UI
  And user searches for and selects "Four,PATIENT"
  Then user searches for "Radiology"
  Then text search result contains
  
  |Grouped_search_results|
  |Radiology Report|
  
  Then the user clicks one of the search result "Radiology Report" 
  Then the user clicks one of the search result "Knee" 
  And the modal's title is "KNEE 2 VIEWS RIGHT"
  And Current Status for "Rad" is "PENDING" 
  And the user clicks the modal "Close Button"
  And the modal is closed
    
@f144_13_display_text_snippest_and_searched_text_is_highlighted @US2906
 Scenario: Text snippets should display when the requested text is found in the search result and the selected word should be highlighted.
 Given user is logged into eHMP-UI
 And user searches for and selects "Four,PATIENT"
 Then user searches for "blood" 
 Then text search result contains
  
  	  | Grouped_search_results |
      | Discharge Summary      |
      | Laboratory             |
      | Problem                |
      | Progress Note          |
      | Surgery Report         |
      | Vital Sign             |

 Then the user clicks one of the search result "Progress Note"
 Then text search result contains
      | sub_grouped_results |
      | Diabetes            |

 Then the user clicks one of the search result "Diabetes" 
 Then sub grouped search result for "Diabetes" contains
      | field    | Sub_group_search_results                                             |
      | date     | 03/31/2004 - 12:06                                                   |
      | provider | Labtech,Special                                                      |
      | facility | CAMP MASTER                                                          |
      | snippest | ... had in the past when he's had low blood sugar. His wife had ...\n... his capillary blood sugars closely. Initiate diuresis... |
 
 Then the user sees the search text "blood" in yellow   
  
  
 @f144_14_data_for_subgroup_not_loaded_until_clicked @US2791
 Scenario: Data under subgroup is not loaded until the User expands the sub group.
 Given user is logged into eHMP-UI
  And user searches for and selects "Four,PATIENT"
  Then user searches for "Progress Notes"
  Then text search result contains
  
  	  | Grouped_search_results |
      | Advance Directive      |
      | Consult Report         |
      | Progress Note          |
      | Crisis Note            |
      
  Then the user clicks one of the search result "Progress Note"
  Then text search result contains
      | sub_grouped_results   |
      | GENERAL MEDICINE NOTE |
      | DIABETES              |
      | CAMPER84              |
      | CAMPER02              |
   Then the user clicks one of the search result "General Medicine Note" 
   And the following subgroups data are not loaded
      | sub_grouped_results   |
      | CAMPER84              |
      | CAMPER02              |
   

 @f144_15_subgrouping_view_of_progress_notes @US2376
 Scenario:Text Search: Document data drill down "Progress Notes(Documents)" in Text Search
  Given user is logged into eHMP-UI
  And user searches for and selects "Four,PATIENT"
  Then user searches for "Progress Notes"
  Then text search result contains
  
  	  | Grouped_search_results |
      | Advance Directive      |
      | Consult Report         |
      | Progress Note          |
      | Crisis Note            |
  Then the user clicks one of the search result "Progress Note"
  Then text search result contains
      | sub_grouped_results   |
      | GENERAL MEDICINE NOTE |
      | DIABETES              |
      | CAMPER84              |
      | CAMPER02              |

  
  Then the user clicks one of the search result "General Medicine Note" 
  Then sub grouped search result for "General Medicine Note" contains
      | field    | Sub_group_search_results |
      | date     | 03/31/2004 - 15:20       |
      | provider | Labtech,Special          |
      | facility | CAMP BEE                 |
      
@f144_16_subgrouping_view_of_Administrative_notes @US2792
Scenario:Text Search: Document data drill down "Administrative Notes(Documents)" in Text Search
Given user is logged into eHMP-UI
  And user searches for and selects "Ten,PATIENT"
  Then user searches for "Administrative"
  Then text search result contains
  
  	  | Grouped_search_results |
      | Administrative Note      |
    
  Then the user clicks one of the search result "Administrative Note"
  Then text search result contains
      | sub_grouped_results   |
      | ADMINISTRATIVE NOTE |
     
  Then the user clicks one of the search result "Administrative Note2" 
  Then sub grouped search result for "Administrative Note2" contains
      | field    | Sub_group_search_results |
      | date     | 04/10/2012 - 16:54       |
      | provider | LANF, THREE              |
      | facility | DOD                      |
 
@f144_17_subgrouping_view_of_Advancedirective @US2792
Scenario:Text Search: Document data drill down "Advancedirective (Documents)"
Given user is logged into eHMP-UI
  And user searches for and selects "Ten,PATIENT"
  Then user searches for "directive"
  Then text search result contains
  
  	  | Grouped_search_results |
      | Advance Directive      |
    
  Then the user clicks one of the search result "Advance Directive"
  Then text search result contains
      | sub_grouped_results   |
      | Advance Directive  |
     
  Then the user clicks one of the search result "Advance Directive2" 
  Then sub grouped search result for "Advance Directive2" contains
      | field    | Sub_group_search_results |
      | date     | 10/18/2000 - 16:02      |
      | provider | Wardclerk,Sixtyeight          |
      | facility | ABILENE (CAA)                 |
      
 @f144_18_subgrouping_view_of_Clinical_Procedcure @US2792
Scenario:Text Search: Document data drill down "Clinical Procedure (Documents)"
Given user is logged into eHMP-UI
  And user searches for and selects "Ten,PATIENT"
  Then user searches for "clinical procedure"
  Then text search result contains
  
  	  | Grouped_search_results |
      | Clinical Procedure      |
      
    
  Then the user clicks one of the search result "Clinical Procedure"
  Then text search result contains
      | sub_grouped_results   |
      | COL                   |
      | HOLTER                |
     
  Then the user clicks one of the search result "Col" 
  Then sub grouped search result for "Col" contains
      | field    | Sub_group_search_results |
      | date     | 03/18/1996 - 14:18       |
      | provider | Programmer,Eleven        |
      | facility | CAMP MASTER              |
      
      
   
@f144_19_subgrouping_view_of_Consult_Report @US2792
Scenario:Text Search: Document data drill down "Consult Report"
Given user is logged into eHMP-UI
  And user searches for and selects "Ten,PATIENT"
  Then user searches for "consult report"
  Then text search result contains
  
  	  | Grouped_search_results |
      | Consult Report         |
      
    
  Then the user clicks one of the search result "Consult Report"
  Then text search result contains
      | sub_grouped_results               |
      | AUDIOLOGY - HEARING LOSS CONSULT  |
      | BLEEDING DISORDER                 |
     
  Then the user clicks one of the search result "Audiology Hearing Loss Consult" 
  Then sub grouped search result for "Audiology Hearing Loss Consult" contains
      | field    | Sub_group_search_results |
      | date     | 04/01/2004 - 23:04       |
      | provider | Pathology,One            |
      | facility | CAMP BEE                 |
      
      
@f144_20_subgrouping_view_of_Consultation_Note_Document @US2792
Scenario:Text Search: Document data drill down "Consultation Note (Provider) Document"
Given user is logged into eHMP-UI
  And user searches for and selects "eight,PATIENT"
  Then user searches for "consultation note (provider) document"
  Then text search result contains
  
  	  | Grouped_search_results                     |
      | consultation note (provider) document      |
      
    
  Then the user clicks one of the search result "Consultation Note"
  Then text search result contains
      | sub_grouped_results                    |
      | consultation note (provider) document  |
      
     
  Then the user clicks one of the search result "Consultation Note Document" 
  Then sub grouped search result for "Consultation Note Document" contains
      | field    | Sub_group_search_results |
      | date     | 01/10/2014 - 17:15       |
      | facility | DOD                      |
      
@f144_21_subgrouping_view_of_Crisis_Note_Document @US2792
Scenario:Text Search: Document data drill down "Crisis Note"
Given user is logged into eHMP-UI
  And user searches for and selects "four,PATIENT"
  Then user searches for "crisis note"
  Then text search result contains
  
  	  | Grouped_search_results |
      | Crisis Note            |
      
    
  Then the user clicks one of the search result "Crisis Note"
  Then text search result contains
      | sub_grouped_results   |
      | Crisis Note           |
      
     
  Then the user clicks one of the search result "Crisis Note subgroup" 
  Then sub grouped search result for "Crisis Note subgroup" contains
      | field    | Sub_group_search_results |
      | date     | 05/21/2000 - 11:52       |
      | provider | Vehu,Twentyone           |
      | facility | ABILENE (CAA)            |
      
@f144_22_subgrouping_view_of_Discharge_Summary_Document @US2792
Scenario:Text Search: Document data drill down "Discharge Summary"
Given user is logged into eHMP-UI
  And user searches for and selects "four,PATIENT"
  Then user searches for "Discharge Summary"
  Then text search result contains
  
  	  | Grouped_search_results |
      |Discharge Summary       |
      
    
  Then the user clicks one of the search result "Discharge Summary"
  Then text search result contains
      | sub_grouped_results   |
      | Discharge Summary     |
      
     
  Then the user clicks one of the search result "Discharge Summary subgroup" 
  Then sub grouped search result for "Discharge Summary subgroup" contains
      | field    | Sub_group_search_results |
      | date     | 03/25/2004 - 19:16       |
      | provider | Vehu,Ten                 |
      | facility | ABILENE (CAA)            |
      
@f144_23_subgrouping_view_of_Laboratory_Report_Document @US2792
Scenario:Text Search: Document data drill down "Laboratory Report"
Given user is logged into eHMP-UI
  And user searches for and selects "ten,PATIENT"
  Then user searches for "Laboratory Report"
  Then text search result contains
  
  	  | Grouped_search_results |
      | Laboratory Report      |
      
    
  Then the user clicks one of the search result "Laboratory Report"
  Then text search result contains
      | sub_grouped_results            |
      | LR ELECTRON MICROSCOPY REPORT  |
      | LR MICROBIOLOGY REPORT         |
      | LR SURGICAL PATHOLOGY REPORT   |
      
     
  Then the user clicks one of the search result "LR ELECTRON MICROSCOPY REPORT" 
  Then sub grouped search result for "LR ELECTRON MICROSCOPY REPORT" contains
      | field    | Sub_group_search_results |
      | date     | 10/23/1997               |
      | provider | Provider,Sixteen         |
      | facility | CAMP BEE                 |
      
@f144_24_subgrouping_view_of_Radiology_Report_Document @US2792
Scenario:Text Search: Document data drill down "Radiology Report"
Given user is logged into eHMP-UI
  And user searches for and selects "ten,PATIENT"
  Then user searches for "Radiology Report"
  Then text search result contains
  
  	  | Grouped_search_results |
      | Radiology Report       |
  Then the user clicks one of the search result "Radiology Report"
  Then text search result contains
      | sub_grouped_results     |
      | ANKLE 2 VIEWS           |
      | ARTHROGRAM ANKLE S&I    |
      | CHEST 2 VIEWS PA&LAT    |
      | CHEST INCLUDE FLUORO    |
      | CORDOTOMY               |
      | KNEE 2 VIEWS            |
      | SPINE ENTIRE AP&LAT     |
      | VAS-CAROTID DUPLEX SCAN |
  Then the user clicks one of the search result "ANKLE 2 VIEWS" 
  Then sub grouped search result for "ANKLE 2 VIEWS" contains
      | field    | Sub_group_search_results |
      | date     | 05/19/1995 - 14:45       |
      | facility | CAMP BEE                 |
  
      
 @f144_25_subgrouping_view_of_Surgery_Report_Document @US2792
Scenario:Text Search: Document data drill down "Surgery Report"
Given user is logged into eHMP-UI
  And user searches for and selects "ten,PATIENT"
  Then user searches for "Surgery Report"
  Then text search result contains
  	  | Grouped_search_results |
      | Surgery Report         |
  Then the user clicks one of the search result "Surgery Report"
  Then text search result contains
      | sub_grouped_results         |
      | ANESTHESIA REPORT           |
      | NURSE INTRAOPERATIVE REPORT |
      | OPERATION REPORT            |  
  Then the user clicks one of the search result "ANESTHESIA REPORT" 
  Then sub grouped search result for "ANESTHESIA REPORT" contains
      | field    | Sub_group_search_results |
      | date     | 12/08/2006 - 07:30       |
      | facility | CAMP BEE                 |
      
      
@f144_26_Radiology_Report_detail_view_from_tex_search @US2363
Scenario:User is able to view Radiology/Imaging Report detail from Text Search 
Given user is logged into eHMP-UI
  And user searches for and selects "ten,PATIENT"
  Then user searches for "Radiology Report"
  Then text search result contains
  
  	  | Grouped_search_results |
      | Radiology Report       |
  Then the user clicks one of the search result "Radiology Report"
  Then text search result contains
      | sub_grouped_results     |
      | ANKLE 2 VIEWS           |
      | ARTHROGRAM ANKLE S&I    |
      | CHEST 2 VIEWS PA&LAT    |
      | CHEST INCLUDE FLUORO    |
      | CORDOTOMY               |
      | KNEE 2 VIEWS            |
      | SPINE ENTIRE AP&LAT     |
      | VAS-CAROTID DUPLEX SCAN |
      
 Then the user clicks one of the search result "ANKLE 2 VIEWS" 
 Then sub grouped search result for "ANKLE 2 VIEWS" contains
      | field    | Sub_group_search_results |
      | date     | 05/19/1995 - 14:45       |
      | facility | CAMP BEE                 |
  
  Then the user clicks one of the search result "Sub Group List"
  Then the modal is displayed
  And the modal's title is "radiologic examination, ankle; 2 views Details"
  And the user clicks the modal "Close Button"
  And the modal is closed

@f144_27_text_search_using_clicking_searchbutton
Scenario: User is able to search by clicking on search button
  Given user is logged into eHMP-UI
  And user searches for and selects "TEN,PATIENT"
  And user type text term "vital" in the search text box
  Then text search result contains
  |Grouped_search_results|
  |Discharge Summarization Note|
  |Vital Sign|
  
