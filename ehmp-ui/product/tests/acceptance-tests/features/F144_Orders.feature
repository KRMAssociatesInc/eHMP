@F144_Orders @regression
Feature: F144 - eHMP Viewer GUI - Orders

# Team: Andromeda

Background:
  Given user is logged into eHMP-UI

@f144_orders_applet_inclusion @US1775 @TA5345a @DE511 @base
Scenario: Inclusion of the Orders applet into the coversheet.
  Given user searches for and selects "Eight,Patient"
  And Cover Sheet is active
  When the user has selected All within the global date picker
  Then the "Orders" applet is displayed
  And the "Orders Applet" table contains headers
    | Order Date | Status | Order | Facility |
  And the applet displays orders

@f144_orders_single_page @US2030 @TA5915a
Scenario: Opening and closing of the Orders single page view.
  Given user searches for and selects "Eight,Patient"
  And Cover Sheet is active
  When the user clicks the control "Expand View" in the "Orders applet"
  Then the "Orders" single page view is displayed
  When the user clicks the "Minimize" button in the Orders applet
  Then the coversheet is displayed

@f144_orders_single_page_headers @US2030 @TA5915b @US2440 @TA6894
Scenario: Opening and closing of the Orders single page view.
  Given user searches for and selects "Eight,Patient"
  And Cover Sheet is active
  When the user clicks the control "Expand View" in the "Orders applet"
  Then the "Orders Applet" table contains headers
    | Order Date | Status | Order | Type | Provider Name | Start Date | Stop Date | Facility |

@f144_orders_consult_modal @US2462 @TA7322 @modal_test @DE1232
Scenario: Viewing modal details for Consult Order.
  Given user searches for and selects "Eight,Patient"
  And Cover Sheet is active

  And the user has selected All within the global date picker

  And the applet displays orders
  When the user selects "Consult" in the Orders applet Order Type dropdown
  Then the "Orders" applet is finished loading
  #And clicks the first result in the "Orders Applet"
  And the user selects order "01AUDIOLOGY OUTPATIENT Cons Consultant's Choice"
  Then the modal is displayed
  And the modal's title is "01AUDIOLOGY OUTPATIENT Cons Consultant's Choice"
  And the modal has the following section headers
    | Section Header            |
    | Activity                  |
    | Current Data              |
    | Order                     |
  And under the "Activity" headers there are the following fields
    | Field                     |
    | Ordered by                |
    | Signature                 |
  And under the "Current Data" headers there are the following fields
    | Field                     |
    | Attending Physician       |
    | Ordering Location         |
    | Start Date/Time           |
    | Stop Date/Time            |
    | Current Status            |
    | Order #                   |
  And under the "Order" headers there are the following fields
    | Field                     |
    | Consult                   |
    | Category                  |


@f144_orders_dietetic_modal @US2520 @TA7611 @modal_test @vimm
Scenario: Viewing modal details for Dietetics Order.
  Given user searches for and selects "Eight,Patient"
  And Cover Sheet is active
  And the user has selected All within the global date picker
  And the applet displays orders
  When the user selects "Dietetics Order" in the Orders applet Order Type dropdown
  And clicks the first result in the "Orders Applet"
  Then the modal is displayed
  And the modal's title is "REGULAR Diet"
  And the modal has the following section headers
    | Section Header            |
    | Activity                  |
    | Current Data              |
    | Order                     |
  And under the "Activity" headers there are the following fields
    | Field                     |
    | Ordered by                |
    | Signature                 |
  And under the "Current Data" headers there are the following fields
    | Field                     |
    | Attending Physician       |
    | Ordering Location         |
    | Start Date/Time           |
    | Stop Date/Time            |
    | Current Status            |
    | Order #                   |
  And under the "Order" headers there are the following fields
    | Field                     |
    | Diet                      |
    | Effective Date            |

@f144_orders_lab_modal @US2463 @TA7329 @modal_test 
Scenario: Viewing modal details for Laboratory.
  Given user searches for and selects "Eight,Patient"
  And Cover Sheet is active
  And the user has selected All within the global date picker

  And the applet displays orders
  When the user selects "Laboratory" in the Orders applet Order Type dropdown
  Then the "Orders" applet is finished loading
  And clicks the first result in the "Orders Applet"
  Then the modal is displayed
  And the modal's title is "CULTURE & SUSCEPTIBILITY UNKNOWN WC LB #18424"
  And the modal has the following section headers
    | Section Header       |
    | Activity             |
    | Current Data         |
    | Order                |
  And under the "Activity" headers there are the following fields
    | Field                |
    | Ordered by           |
    | Signature            |
  And under the "Current Data" headers there are the following fields
    | Field                |
    | Attending Physician  |
    | Ordering Location    |
    | Start Date/Time      |
    | Stop Date/Time       |
    | Current Status       |
    | Order #              |
  And under the "Order" headers there are the following fields
    | Field                |
    | Lab Test             |
    | Lab #                |
    | Collected By         |
    | Collection Sample    |
    | Specimen             |

@f144_orders_medication_modal @US1924 @TA5917a @modal_test 
Scenario: Viewing modal details for Medication, Inpatient.
  Given user searches for and selects "Bcma,Eight"
  Then Cover Sheet is active

  And the user has selected All within the global date picker

  Then the "Orders" applet is finished loading
  When the user selects "Medication, Inpatient" in the Orders applet Order Type dropdown
  And clicks the first result in the "Orders Applet"
  Then the modal is displayed
  And the modal's title is "ACETAMINOPHEN TAB 325MG PO Q4H"
  And the modal has the following section headers
    | Section Header        |
    | Activity              |
    | Current Data          |
    | Order                 |
  And under the "Activity" headers there are the following fields
    | Field                 |
    | Ordered by            |
    | Signature             |
  And under the "Current Data" headers there are the following fields
    | Field                 |
    | Attending Physician   |
    | Ordering Location     |
    | Start Date/Time       |
    | Stop Date/Time        |
    | Current Status        |
    | Order #               |
  And under the "Order" headers there are the following fields
    | Field                 |
    | Medication, Inpatient |

@f144_orders_medication_modal @US1924 @TA5917b @modal_test
Scenario: Viewing modal details for Medication, Non-VA.
  Given user searches for and selects "Eight,Patient"
  Then Cover Sheet is active

  And the user has selected All within the global date picker

  Then the "Orders" applet is finished loading
  When the user selects "Medication, Non-VA" in the Orders applet Order Type dropdown
  And clicks the first result in the "Orders Applet"
  Then the modal is displayed
  And the modal's title is "Non-VA ASPIRIN TAB,EC 81MG TAKE ONE TABLET BY MOUTH EVERY MORNING Non-VA medication recommended by VA provider."
  And the modal has the following section headers
    | Section Header        |
    | Activity              |
    | Current Data          |
    | Order                 |
  And under the "Activity" headers there are the following fields
    | Field                 |
    | Ordered by            |
    | Signature             |
  And under the "Current Data" headers there are the following fields
    | Field                 |
    | Attending Physician   |
    | Ordering Location     |
    | Start Date/Time       |
    | Stop Date/Time        |
    | Current Status        |
    | Order #               |
  And under the "Order" headers there are the following fields
    | Field                 |
    | Medication, Non-VA    |

# May need to look into sorting order for applet - doesn't appear to be working properly
@f144_orders_medication_modal @US1924 @TA5917c @modal_test @DE1232
Scenario: Viewing modal details for Medication, Outpatient.
  Given user searches for and selects "Eight,Patient"
  Then Cover Sheet is active

  And the user has selected All within the global date picker

  Then the "Orders" applet is finished loading
  When the user selects "Medication, Outpatient" in the Orders applet Order Type dropdown
  #And clicks the first result in the "Orders Applet"
  And the user selects order "METFORMIN TAB,SA 500MG TAKE ONE TABLET MOUTH TWICE A DAY Quantity: 180 Refills: 0"
  Then the modal is displayed
  And the modal's title is "METFORMIN TAB,SA 500MG TAKE ONE TABLET MOUTH TWICE A DAY Quantity: 180 Refills: 0"
  And the modal has the following section headers
    | Section Header        |
    | Activity              |
    | Current Data          |
    | Order                 |
  And under the "Activity" headers there are the following fields
    | Field                 |
    | Ordered by            |
    | Signature             |
  And under the "Current Data" headers there are the following fields
    | Field                 |
    | Attending Physician   |
    | Ordering Location     |
    | Start Date/Time       |
    | Stop Date/Time        |
    | Current Status        |
    | Order #               |
  And under the "Order" headers there are the following fields
    | Field                  |
    | Medication, Outpatient |


@f144_orders_nursing_modal @US2559 @TA7852 @modal_test
Scenario: Viewing modal details for Nursing Order.
  Given user searches for and selects "Eight,Patient"
  Then Cover Sheet is active

  And the user has selected All within the global date picker

  Then the "Orders" applet is finished loading
  When the user selects "Nursing" in the Orders applet Order Type dropdown
  And clicks the first result in the "Orders Applet"
  Then the modal is displayed
  And the modal's title is ">> Discontinue Instruct patient to be NPO for UGI procedure <Requesting Physician Cancelled>"
  And the modal has the following section headers
    | Section Header            |
    | Activity                  |
    | Current Data              |
    | Order                     |
  And under the "Activity" headers there are the following fields
    | Field                     |
    | Ordered Text              |
    | Ordered by                |
    | Signature                 |
  And under the "Current Data" headers there are the following fields
    | Field                     |
    | Attending Physician       |
    | Ordering Location         |
    | Start Date/Time           |
    | Stop Date/Time            |
    | Current Status            |
    | Order #                   |
  And under the "Order" headers there are the following fields
    | Field                     |
    | Nursing Order             |
    | Nurse                     |
    | Clerk                     |
    | Chart Review              |

@f144_orders_radiology_modal @US2465 @TA7342 @modal_test @DE1232
Scenario: Viewing modal details for Radiology Order.
  Given user searches for and selects "Eight,Patient"
  Then Cover Sheet is active

  And the user has selected All within the global date picker

  Then the "Orders" applet is finished loading
  When the user selects "Radiology" in the Orders applet Order Type dropdown
  #And clicks the first result in the "Orders Applet"
  And the user selects order "Discontinue UPPER GI WITH KUB <Requesting Physician Cancelled>"
  Then the modal is displayed
  And the modal's title is "Discontinue UPPER GI WITH KUB <Requesting Physician Cancelled>"
  And the modal has the following section headers
    | Section Header            |
    | Activity                  |
    | Current Data              |
  And under the "Activity" headers there are the following fields
    | Field                     |
    | Order Text                |
    | Ordered by                |
    | Signature                 |
  And under the "Current Data" headers there are the following fields
    | Field                       |
    | Attending Physician         |
    | Ordering Location           |
    | Start Date/Time             |
    | Stop Date/Time              |
    | Current Status              |
    | Order #                     |


@f144_orders_infusion_modal @US2756 @TA8884 @modal_test @DE1452 @debug
Scenario: Viewing modal details for IV Fluid Order.
  Given user searches for and selects "Ten,Patient"
  And Cover Sheet is active
  And the user has selected All within the global date picker
  When the user selects order "Change AMPICILLIN INJ IV 2 GM in 50 over 20 min"

  Then the modal is displayed
  And the modal's title is "Change AMPICILLIN INJ IV 2 GM in 50 over 20 min"
  And the modal has the following section headers
    | Section Header            |
    | Activity                  |
    | Current Data              |
    | Order                     |
  And under the "Activity" headers there are the following fields
    | Field                     |
    | Order Text                |
    | Signature                 |
  And under the "Current Data" headers there are the following fields
    | Field                       |
    | Current Primary Provider    |
    | Current Attending Physician |
    | Ordering Location           |
    | Start Date/Time             |
    | Stop Date/Time              |
    | Current Status              |
    | Order #                     |
  And under the "Order" headers there are the following fields
    | Field                     |
    | Type                      |
    | Solutions                 |
    | IV Print Name             |
    | Schedule Type             |

@f144_orders_default_sorting @US2512 @TA7590 
Scenario: Orders should be sorted by Order Type and then by Order Date after a global date
  #Given user searches for and selects "Eight,Patient"
  Given user searches for and selects "Onehundredsixteen,Patient"
  And Cover Sheet is active
  And the user has selected All within the global date picker
  
  When the user clicks the control "Expand View" in the "Orders applet"
  And the "Orders" single page view is displayed
  And the user selects "All" in the Orders applet Order Type dropdown
  Then the "Orders" applet is finished loading
  Then the Orders should be sorted by "Type" and then "Order Date"

@f144_orders_stepping_all @US2338 @TA6760a @modal_test
Scenario: Stepping through the Orders in the list.
  Given user searches for and selects "Eight,Patient"
  Then Cover Sheet is active

  #When the user clicks the control "Date Filter Toggle" on the "Coversheet"
  #And the user waits for 5 seconds 
  #And the user clicks the date control "All" on the "Coversheet"
  #And the user clicks the control "Apply" on the "Coversheet"
  And the user has selected All within the global date picker

  When the user selects "All" in the Orders applet Order Type dropdown
  #And clicks the first result in the "Orders Applet"
  When the user selects order "01AUDIOLOGY OUTPATIENT Cons Consultant's Choice"
  Then the modal is displayed
  Then the modal's title is "01AUDIOLOGY OUTPATIENT Cons Consultant's Choice"
  When the user clicks the control "Next Button" in the "Orders modal"
  Then the modal's title is "01HEMATOLOGY CONSULT Cons Consultant's Choice"
  When the user clicks the control "Next Button" in the "Orders modal"
  Then the modal's title is "01AUDIOLOGY OUTPATIENT Cons Consultant's Choice"
  When the user clicks the control "Next Button" in the "Orders modal"
  Then the modal's title is "01HEMATOLOGY CONSULT Cons Consultant's Choice"
  When the user clicks the control "Next Button" in the "Orders modal"
  Then the modal's title is "CARDIOLOGY Cons Consultant's Choice"
  When the user clicks the control "Previous Button" in the "Orders modal"
  Then the modal's title is "01HEMATOLOGY CONSULT Cons Consultant's Choice"
  When the user clicks the control "Previous Button" in the "Orders modal"
  Then the modal's title is "01AUDIOLOGY OUTPATIENT Cons Consultant's Choice"
  When the user clicks the control "Previous Button" in the "Orders modal"
  Then the modal's title is "01HEMATOLOGY CONSULT Cons Consultant's Choice"
  When the user clicks the control "Previous Button" in the "Orders modal"
  Then the modal's title is "01AUDIOLOGY OUTPATIENT Cons Consultant's Choice"




# replace data specific, row counting test with f144_orders_filter_clearingb
# @f144_orders_filter_clearing @US2497 @TA7853 @DE1237 @triage @reworked_in_firefox
# Scenario: Orders - Clear text filters when switching quick filters.
#   Given user searches for and selects "Eight,Patient"
#   And Cover Sheet is active
#   And the user has selected All within the global date picker
#   When the user scrolls to the bottom of the Orders Applet
#   And the "Orders Applet" table contains 447 rows
#   When the user clicks the control "Filter Toggle" in the "Orders applet"
#   And the user inputs "Cardiology" in the "Text Filter" control in the "Orders applet"
#   Then the "Orders Applet" table contains 4 rows
#   And the "Orders Applet" table contains rows
#     | Order Date | Status   | Order                               | Facility |
#     | 05/21/2000 | COMPLETE | CARDIOLOGY Cons Consultant's Choice | BAY      |
#     | 05/21/2000 | COMPLETE | CARDIOLOGY Cons Consultant's Choice | BAY      |
#   When the user selects "Lab" in the Orders applet Order Type dropdown
#   And the user clicks the control "Filter Toggle" in the "Orders applet"
#   And the "Text Filter" input should have the value "" in the Orders applet
#   When the user scrolls to the bottom of the Orders Applet
#   Then the "Orders Applet" table contains 349 rows

@f144_orders_filter_clearingb @US2497 @TA7853 @DE1237 @triage 
Scenario: Orders - Clear text filters when switching quick filters.
  Given user searches for and selects "Eight,Patient"
  And Cover Sheet is active
  And the user has selected All within the global date picker
  When the user scrolls to the bottom of the Orders Applet
  #And the "Orders Applet" table contains 447 rows
  When the user clicks the control "Filter Toggle" in the "Orders applet"
  When the user filters the Orders Applet by text "Cardiology"
  When the user selects "Lab" in the Orders applet Order Type dropdown
  And the user clicks the control "Filter Toggle" in the "Orders applet"
  And the "Text Filter" input should have the value "" in the Orders applet
  When the user scrolls to the bottom of the Orders Applet
  Then the Orders Applet is not filtered by text "Cardiology"

@f144_orders_filter_text_persistence @US2496 @TA7984b @DE1080
Scenario: Filter text is persisted when switching Orders applet views.
  Given user searches for and selects "Eight,Patient"
  Then Cover Sheet is active

  And the user has selected All within the global date picker

  When the user clicks the control "Filter Toggle" in the "Orders applet"
  And the user inputs "Cardiology" in the "Text Filter" control in the "Orders applet"
  And the user clicks the control "Expand View" in the "Orders applet"
  Then the "Orders" single page view is displayed
  And the "Text Filter" input should have the value "Cardiology" in the Orders applet
  When the user clicks the "Minimize" button in the Orders applet
  Then the coversheet is displayed
  And the "Text Filter" input should have the value "Cardiology" in the Orders applet

@f144_orders_filter_button_and_text_persistence @US2496 @TA7984c @DE1080
Scenario: Filter text and button are both persisted when switching Orders applet views.
  Given user searches for and selects "Eight,Patient"
  Then Cover Sheet is active

  And the user has selected All within the global date picker

  Then the "Orders" applet is finished loading
  When the user selects "Radiology" in the Orders applet Order Type dropdown
  And the user clicks the control "Filter Toggle" in the "Orders applet"
  And the user inputs "Cardiology" in the "Text Filter" control in the "Orders applet"
  And the user clicks the control "Expand View" in the "Orders applet"
  Then the "Orders" single page view is displayed
  And the selected Order type is "Radiology"
  And the "Text Filter" input should have the value "Cardiology" in the Orders applet
  When the user clicks the "Minimize" button in the Orders applet
  Then the coversheet is displayed
  And the selected Order type is "Radiology"
  And the "Text Filter" input should have the value "Cardiology" in the Orders applet

@f144_orders_date_filter_open_close @US2926 @TA9674a 
Scenario: Date filtering - opening and closing control.
  Given user searches for and selects "Eight,Patient"
  Then Cover Sheet is active
  When the user clicks the control "Expand View" in the "Orders applet"
  Then the "Date Filter" should be "Displayed" in the "Orders applet"
  When the user clicks the control "Filter Toggle" in the "Orders applet"
  Then the "Date Filter" should be "Hidden" in the "Orders applet"
  When the user clicks the control "Filter Toggle" in the "Orders applet"
  Then the "Date Filter" should be "Displayed" in the "Orders applet"

@f144_orders_date_filter_preset_dates @US2926 @TA9674b
Scenario: Inclusion of the preset buttons.
  Given user searches for and selects "Eight,Patient"
  Then Cover Sheet is active
  When the user clicks the control "Expand View" in the "Orders applet"
  Then the "Date Filter" should be "Displayed" in the "Orders applet"
  And the following choices should be displayed for the "Orders applet" Date Filter
    | All | 2yr | 1yr | 3mo | 1mo | 7d | 72hr | 24hr |

@f144_orders_date_filter_preset_dates @US2926 @TA9674c @vimm
Scenario: Date filtering using the preset buttons.
  Given user searches for and selects "Five,Patient"
  Then Cover Sheet is active
  When the user clicks the control "Expand View" in the "Orders applet"
  Then the "Date Filter" should be "Displayed" in the "Orders applet"
  When the user clicks the date control "All" in the "Orders applet"
  And the Orders Applet table contains specific rows
      | row index | Order Date | Status       | Order                                           | Type                     | Provider Name      | Start Date | Stop Date  | Facility |
      | 1         | 04/01/2004 | COMPLETE     | 01AUDIOLOGY OUTPATIENT Cons Consultant's Choice | Consult                  | Pathology,One      | 04/01/2004 | 04/01/2004 | TST1     |
      | 2         | 04/01/2004 | DISCONTINUED | 01HEMATOLOGY CONSULT Cons Consultant's Choice   | Consult                  | Pathology,One      | 04/01/2004 | 12/31/2007 | TST1     |
      | 3         | 04/01/2004 | COMPLETE     | 01AUDIOLOGY OUTPATIENT Cons Consultant's Choice | Consult                  | Pathology,One      | 04/01/2004 | 04/01/2004 | TST2     |
      | 4         | 04/01/2004 | DISCONTINUED | 01HEMATOLOGY CONSULT Cons Consultant's Choice   | Consult                  | Pathology,One      | 04/01/2004 | 12/31/2007 | TST2     |
      | 5         | 05/21/2000 | COMPLETE     | CARDIOLOGY Cons Consultant's Choice             | Consult                  | Vehu,Sixtyone      | 05/21/2000 | 12/31/2007 | BAY      |
      | 6         | 05/21/2000 | COMPLETE     | CARDIOLOGY Cons Consultant's Choice             | Consult                  | Vehu,Sixtyone      | 05/21/2000 | 12/31/2007 | BAY      |
      #| 7         | 08/14/2014 | ACTIVE       | REGULAR Diet                                    | Dietetics Order          | Programmer,One     | 08/13/2014 |            | BAY      |
      #| 8         | 08/14/2014 | ACTIVE       | REGULAR Diet                                    | Dietetics Order          | Programmer,One     | 08/13/2014 |            | BAY      |
  When the user clicks the date control "2yr" in the "Orders applet"
  Then no results should be found in the "Orders applet"
  When the user clicks the date control "1yr" in the "Orders applet"
  Then no results should be found in the "Orders applet"
  When the user clicks the date control "3mo" in the "Orders applet"
  Then no results should be found in the "Orders applet"
  When the user clicks the date control "1mo" in the "Orders applet"
  Then no results should be found in the "Orders applet"
  When the user clicks the date control "7d" in the "Orders applet"
  Then no results should be found in the "Orders applet"
  When the user clicks the date control "72hr" in the "Orders applet"
  Then no results should be found in the "Orders applet"
  When the user clicks the date control "24hr" in the "Orders applet"
  Then no results should be found in the "Orders applet"

@f144_orders_date_filter_custom_from_to @US2926 @TA9674d @DE1262
Scenario: Date filtering using the Custom button.
  Given user searches for and selects "Five,Patient"
  Then Cover Sheet is active
  When the user clicks the control "Expand View" in the "Orders applet"
  Then the "Date Filter" should be "Displayed" in the "Orders applet"
  And the user inputs "01/28/2010" in the "From Date" control in the "Orders applet"
  And the user inputs "02/28/2010" in the "To Date" control in the "Orders applet"
  And the user clicks the control "Apply" in the "Orders applet"
  Then the "Orders Applet" table contains 6 rows
  And the "Orders Applet" table contains rows
    | Order Date | Status  | Order                                                                                      | Type                   | Provider Name | Start Date | Stop Date  | Facility |
    | 02/27/2010 | EXPIRED | METFORMIN TAB,SA 500MG TAKE ONE TABLET MOUTH TWICE A DAY Quantity: 180 Refills: 0          | Medication, Outpatient | Provider,One  | 02/27/2010 | 05/28/2010 | TST1     |
    | 02/27/2010 | EXPIRED | METOPROLOL TARTRATE TAB 50MG TAKE ONE TABLET BY MOUTH TWICE A DAY Quantity: 180 Refills: 3 | Medication, Outpatient | Provider,One  | 02/27/2010 | 02/28/2011 | TST1     |
    | 02/27/2010 | EXPIRED | SIMVASTATIN TAB 40MG TAKE ONE TABLET BY MOUTH EVERY EVENING Quantity: 90 Refills: 3        | Medication, Outpatient | Provider,One  | 02/27/2010 | 02/28/2011 | TST1     |
    | 02/27/2010 | EXPIRED | METFORMIN TAB,SA 500MG TAKE ONE TABLET MOUTH TWICE A DAY Quantity: 180 Refills: 0          | Medication, Outpatient | Provider,One  | 02/27/2010 | 05/28/2010 | TST2     |
    | 02/27/2010 | EXPIRED | METOPROLOL TARTRATE TAB 50MG TAKE ONE TABLET BY MOUTH TWICE A DAY Quantity: 180 Refills: 3 | Medication, Outpatient | Provider,One  | 02/27/2010 | 02/28/2011 | TST2     |
    | 02/27/2010 | EXPIRED | SIMVASTATIN TAB 40MG TAKE ONE TABLET BY MOUTH EVERY EVENING Quantity: 90 Refills: 3        | Medication, Outpatient | Provider,One  | 02/27/2010 | 02/28/2011 | TST2     |


@f144_orders_modal_order_number @US1775 @DE263 @modal_test
Scenario: Ensure order number format is correct.
  Given user searches for and selects "Eight,Patient"
  Then Cover Sheet is active

  And the user has selected All within the global date picker

  When the user selects "Consult" in the Orders applet Order Type dropdown
  And clicks the first result in the "Orders Applet"
  Then the "Order #" is in the correct format: all digits
  When the user clicks the control "Next Button" in the "Orders modal"
  Then the "Order #" is in the correct format: all digits
  When the user clicks the control "Next Button" in the "Orders modal"
  Then the "Order #" is in the correct format: all digits
  When the user clicks the control "Next Button" in the "Orders modal"
  Then the "Order #" is in the correct format: all digits
  When the user clicks the control "Next Button" in the "Orders modal"
  Then the "Order #" is in the correct format: all digits
  When the user clicks the control "Next Button" in the "Orders modal"
  Then the "Order #" is in the correct format: all digits

@f144_orders_modal_order_start_stop_date @US1775 @DE262 @modal_test @triage
Scenario: Ensure order number format is correct.
  Given user searches for and selects "Eight,Patient"
  Then Cover Sheet is active

  And the user has selected All within the global date picker

  When the user selects "Consult" in the Orders applet Order Type dropdown
  And clicks the first result in the "Orders Applet"
  Then the "Start Date/Time" is in the correct format: mm/dd/yyyy hh:mm
  And the "Stop Date/Time" is in the correct format: mm/dd/yyyy hh:mm
  When the user clicks the control "Next Button" in the "Orders modal"
  Then the "Start Date/Time" is in the correct format: mm/dd/yyyy hh:mm
  And the "Stop Date/Time" is in the correct format: mm/dd/yyyy hh:mm
  When the user clicks the control "Next Button" in the "Orders modal"
  Then the "Start Date/Time" is in the correct format: mm/dd/yyyy hh:mm
  And the "Stop Date/Time" is in the correct format: mm/dd/yyyy hh:mm
  When the user clicks the control "Next Button" in the "Orders modal"
  Then the "Start Date/Time" is in the correct format: mm/dd/yyyy hh:mm
  And the "Stop Date/Time" is in the correct format: mm/dd/yyyy hh:mm
  When the user clicks the control "Next Button" in the "Orders modal"
  Then the "Start Date/Time" is in the correct format: mm/dd/yyyy hh:mm
  And the "Stop Date/Time" is in the correct format: mm/dd/yyyy hh:mm
  When the user clicks the control "Next Button" in the "Orders modal"
  Then the "Start Date/Time" is in the correct format: mm/dd/yyyy hh:mm
  And the "Stop Date/Time" is in the correct format: mm/dd/yyyy hh:mm

@f144_order_applet_loads_new_rows @DE510 @DE599 @DE1398 @triage
  Scenario: Verify scrolling to the bottom of the order applet loads more records
  Given user searches for and selects "Eighteen,Patient"
  Then Cover Sheet is active

  And the user has selected All within the global date picker

  Then the "Orders" applet is finished loading
  When the user scrolls to the bottom of the Orders Applet
  # 187 in TST1 and TST2
  # 14 in BAY
  # 1 in NJS
  Then the "Orders Applet" table contains 389 rows
  When the user clicks the control "Expand View" in the "Orders applet"
  Then the "Orders" single page view is displayed
  Then the "Orders" applet is finished loading
  When the user scrolls to the bottom of the Orders Applet
  And the "Orders Applet" table contains 389 rows
  When the user clicks the "Minimize" button in the Orders applet
  Then the coversheet is displayed
  Then the "Orders" applet is finished loading
  When the user scrolls to the bottom of the Orders Applet
  Then the "Orders Applet" table contains 389 rows

