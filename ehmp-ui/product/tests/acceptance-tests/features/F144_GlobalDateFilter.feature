@F144_Global_Date_Filter @regression
Feature: F144 - eHMP Viewer GUI - Global Date Filter

# Team: Andromeda

Background:
  Given user is logged into eHMP-UI
  And user searches for and selects "Eight,Patient"
  Then Cover Sheet is active

@f144_global_date_filter_open_close @US2640 @TA8566a
Scenario: Date filtering - opening and closing control by clicking outside of Date Filter.
  Then the coversheet is displayed
  And the "Date Filter" should be "Hidden" on the Coversheet
  When the user clicks the control "Date Filter Toggle" on the "Coversheet"
  #Then the "Date Filter" should be "Displayed" on the Coversheet
  When the user clicks the refresh button in the "Lab Results" applet
  Then the "Date Filter" should be "Hidden" on the Coversheet

@f144_global_date_filter_open_close @US2640 @TA8566b
Scenario: Date filtering - opening and closing control using "X" button.
  Then the coversheet is displayed
  And the "Date Filter" should be "Hidden" on the Coversheet
  When the user clicks the control "Date Filter Toggle" on the "Coversheet"
  #Then the "Date Filter" should be "Displayed" on the Coversheet
  #When the user clicks the control "Date Filter Close" on the "Coversheet"
  Then the "Date Filter" should be "Hidden" on the Coversheet

@f144_global_date_filter_open_close @US2640 @TA8566c 
Scenario: Date filtering - inclusion of the preset buttons.
  Then the coversheet is displayed
  When the user clicks the control "Date Filter Toggle" on the "Coversheet"
  #Then the "Date Filter" should be "Displayed" on the Coversheet
  And the following choices should be displayed for the "Coversheet" Date Filter
      | All | 2yr | 1yr | 3mo | 1mo | 7d | 72hr | 24hr |

#@f144_global_date_1yr_default @US2640 @TA8566d
#Scenario: Default date range of the applet is 1yr.
  #Then the "Viewing __ to __" text is correctly set to "18" months in the past and "6" months in the future

@f144_global_date_apply_enabled @US2640 @TA8566e @DE284
Scenario: Custom filters should be enabled by default.
  When the user clicks the control "Date Filter Toggle" on the "Coversheet"
  Then the Custom date fields should be "enabled" on the "Coversheet"
  When the user inputs "01/01/2010" in the "From Date" control in the "Coversheet"
  And the user inputs "10/10/2015" in the "To Date" control in the "Coversheet"
  Then the Custom date field "Apply" button should be "enabled" on the "Coversheet"
  When the user clicks the date control "2yr" on the "Coversheet"
  And the user clicks the control "Date Filter Toggle" on the "Coversheet"
  Then the Custom date fields should be "enabled" on the "Coversheet"
  #And the Custom date field "Apply" button should be "disabled" on the "Coversheet"

@f144_global_date_filter_persistence_single_page @US2761 @TA8896a 
Scenario: Global date carry over to the single-page extended view.
  When the user clicks the control "Date Filter Toggle" on the "Coversheet"
  And the user clicks the date control "2yr" on the "Coversheet"
  And the user clicks the control "Apply" on the "Coversheet"
  When the user clicks the control "Expand View" in the "Lab Results applet"
  #Then the active date control in the "Lab Results applet" is the "2yr" button

@f144_global_date_filter_persistence_modal @US2761 @TA8896b @modal_test
Scenario: Global date carry over to the modal view.
  When the user clicks the control "Date Filter Toggle" on the "Coversheet"
  And the Date Filter displays "18" months in the past and "6" months in the future
  And the user waits for 5 seconds
  And the user clicks the date control "2yr" on the "Coversheet"
  And the to date displays today's date
  And the user clicks the control "Apply" on the "Coversheet"
  And the "Viewing __ to __" text is correctly set to "24" months in the past and "0" months in the future  
  And the user clicks the first non-Panel result in the Lab Results applet
  Then the modal is displayed
  #And the active date control in the "Lab Results modal" is the "2yr" button

@f144_global_date_filter_persistence @US2761 @TA8896c
Scenario: Single-page extended view date changes to not carry back to global date filter.
  When the user clicks the control "Expand View" in the "Lab Results applet"
  And the user clicks the date control "All" on the "Lab Results applet"
  When the user clicks the control "Minimize View" in the "Lab Results applet"
  Then the coversheet is displayed
  #And the "Viewing __ to __" text is correctly set to "18" months in the past and "6" months in the future

@f144_global_date_filter_persistence @US2761 @TA8896d @modal_test @manual
Scenario: Modal view date changes to not carry back to global date filter.
  When the user clicks the control "Date Filter Toggle" on the "Coversheet"
  And the user clicks the date control "All" on the "Coversheet"
  And the user clicks the control "Apply" on the "Coversheet"
  When the user clicks the control "Expand View" in the "Lab Results applet"
  And the user clicks the first non-Panel result in the Lab Results applet
  Then the modal is displayed
  And the active date control in the "Lab Results modal" is the "All" button
  When the user clicks the date control "2yr" in the "Lab Results modal"
  Then the "Lab History" table contains 5 rows
  When the user closes modal by clicking the "Close" control
  Then the active date control in the "Lab Results applet" is the "All" button
  When the user clicks the control "Minimize View" in the "Lab Results applet"
  Then the coversheet is displayed
  #And the "Viewing __ to __" text is correctly set to "18" months in the past and "6" months in the future
  
#adding debug tag since we are getting different no. of counts
@f144_global_date_applet_integration @US2626 @TA8070a @DE387
Scenario: Global date filtering is applied to applets on the coversheet - Lab Results applet.
  Then no results should be found in the "Lab Results applet"
  When the user clicks the control "Date Filter Toggle" on the "Coversheet"
  And the user clicks the date control "All" on the "Coversheet"
  And the user clicks the control "Apply" on the "Coversheet"
  #Then the "Lab Results Applet" table contains 357 rows
  #And the "Lab Results Applet" table contains rows
  #  | Date             | Lab Test                                           | Flag | Result     |
  #  | 05/07/2013 10:43 | Sodium, Blood Quantitative - PLASMA                |      | 139 mmol/L |
  #  | 05/05/2013 14:10 | Chloride, Serum or Plasma Quantitative - PLASMA    |      | 101 mmol/L |
  #  | 05/05/2013 14:10 | Potassium, Serum or Plasma Quantitative - PLASMA   |      | 5.4 mmol/L |
  #  | 05/04/2013 08:25 | Glucose, Serum or Plasma Quantitative - PLASMA     |      | 100 mg/dL  |
  #  | 05/04/2013 08:25 | Potassium, Serum or Plasma Quantitative - PLASMA   |      | 5.1 mmol/L |
  #  | 05/03/2013 12:28 | Potassium, Serum or Plasma Quantitative - PLASMA   |      | 2.2 mmol/L |
  #  | 05/03/2013 11:37 | Cholesterol, Serum or Plasma Quantitative - PLASMA |      | 160 mg/dL  |
  #  | 04/11/2013 14:05 | Potassium, Serum or Plasma Quantitative - PLASMA   |      | 5.4 mmol/L |
  #  | 04/11/2013 08:49 | Potassium, Serum or Plasma Quantitative - PLASMA   |      | 5.3 mmol/L |
  #  | 04/11/2013 08:23 | Calcium, Serum or Plasma Quantitative - PLASMA     |      | 10.5 mg/dL |
  When the user clicks the control "Date Filter Toggle" on the "Coversheet"
  And the user clicks the date control "2yr" on the "Coversheet"
  And the user clicks the control "Apply" on the "Coversheet"
  #Then the "Lab Results Applet" table contains 34 rows
  #And the "Lab Results Applet" table contains rows
  #  | Date             | Lab Test                                           | Flag | Result     |
  #  | 05/07/2013 10:43 | Sodium, Blood Quantitative - PLASMA                |      | 139 mmol/L |
  #  | 05/05/2013 14:10 | Chloride, Serum or Plasma Quantitative - PLASMA    |      | 101 mmol/L |
  #  | 05/05/2013 14:10 | Potassium, Serum or Plasma Quantitative - PLASMA   |      | 5.4 mmol/L |
  #  | 05/04/2013 08:25 | Glucose, Serum or Plasma Quantitative - PLASMA     |      | 100 mg/dL  |
  #  | 05/04/2013 08:25 | Potassium, Serum or Plasma Quantitative - PLASMA   |      | 5.1 mmol/L |
  #  | 05/03/2013 12:28 | Potassium, Serum or Plasma Quantitative - PLASMA   |      | 2.2 mmol/L |
  #  | 05/03/2013 11:37 | Cholesterol, Serum or Plasma Quantitative - PLASMA |      | 160 mg/dL  |
  #  | 04/11/2013 14:05 | Potassium, Serum or Plasma Quantitative - PLASMA   |      | 5.4 mmol/L |
  #  | 04/11/2013 08:49 | Potassium, Serum or Plasma Quantitative - PLASMA   |      | 5.3 mmol/L |
  #  | 04/11/2013 08:23 | Calcium, Serum or Plasma Quantitative - PLASMA     |      | 10.5 mg/dL |
  When the user clicks the control "Date Filter Toggle" on the "Coversheet"
  And the user clicks the date control "1yr" on the "Coversheet"
  Then no results should be found in the "Lab Results applet"
  When the user clicks the control "Date Filter Toggle" on the "Coversheet"
  And the user clicks the date control "3mo" on the "Coversheet"
  Then no results should be found in the "Lab Results applet"
  When the user clicks the control "Date Filter Toggle" on the "Coversheet"
  And the user clicks the date control "1mo" on the "Coversheet"
  Then no results should be found in the "Lab Results applet"
  When the user clicks the control "Date Filter Toggle" on the "Coversheet"
  And the user clicks the date control "7d" on the "Coversheet"
  Then no results should be found in the "Lab Results applet"
  When the user clicks the control "Date Filter Toggle" on the "Coversheet"
  And the user clicks the date control "72hr" on the "Coversheet"
  Then no results should be found in the "Lab Results applet"
  When the user clicks the control "Date Filter Toggle" on the "Coversheet"
  And the user clicks the date control "24hr" on the "Coversheet"
  Then no results should be found in the "Lab Results applet"

@f144_global_date_applet_integration_custom @US2626 @TA8070b
Scenario: Global date filtering is applied to applets on the coversheet - Lab Results applet.
  Then no results should be found in the "Lab Results applet"
  When the user clicks the control "Date Filter Toggle" on the "Coversheet"
  When the user inputs "05/01/2013" in the "From Date" control on the "Coversheet"
  And the user inputs "10/10/2015" in the "To Date" control on the "Coversheet"
  And the user clicks the control "Apply" on the "Coversheet"
  #Then the "Lab Results Applet" table contains 7 rows
  #And the "Lab Results Applet" table contains rows
  #  | Date             | Lab Test                                           | Flag | Result     |
  #  | 05/07/2013 10:43 | Sodium, Blood Quantitative - PLASMA                |      | 139 mmol/L |
  #  | 05/05/2013 14:10 | Chloride, Serum or Plasma Quantitative - PLASMA    |      | 101 mmol/L |
  #  | 05/05/2013 14:10 | Potassium, Serum or Plasma Quantitative - PLASMA   |  H   | 5.4 mmol/L |
  #  | 05/04/2013 08:25 | Glucose, Serum or Plasma Quantitative - PLASMA     |  H   | 100 mg/dL  |
  #  | 05/04/2013 08:25 | Potassium, Serum or Plasma Quantitative - PLASMA   |  H   | 5.1 mmol/L |
  #  | 05/03/2013 12:28 | Potassium, Serum or Plasma Quantitative - PLASMA   |  L*  | 2.2 mmol/L |
  #  | 05/03/2013 11:37 | Cholesterol, Serum or Plasma Quantitative - PLASMA |      | 160 mg/dL  |

@f144_global_date_applet_integration @US2626 @TA8070c @DE387
Scenario: Global date filtering is applied to applets on the coversheet - Orders applet.
  Then no results should be found in the "Orders applet"
  When the user clicks the control "Date Filter Toggle" on the "Coversheet"
  #And the user clicks the date control "All" on the "Coversheet"
  #And the user clicks the control "Apply" on the "Coversheet"
  #Then the "Orders Applet" table contains 391 rows
    #Then the "Orders Applet" table contains rows
    #| Order Date | Status       | Order                                           | Facility |
    #| 04/01/2004 | COMPLETE     | 01AUDIOLOGY OUTPATIENT Cons Consultant's Choice | TST1     |
    #| 04/01/2004 | DISCONTINUED | 01HEMATOLOGY CONSULT Cons Consultant's Choice   | TST1     |
    #| 04/01/2004 | COMPLETE     | 01AUDIOLOGY OUTPATIENT Cons Consultant's Choice | TST2     |
    #| 04/01/2004 | DISCONTINUED | 01HEMATOLOGY CONSULT Cons Consultant's Choice   | TST2     |
    #| 05/21/2000 | COMPLETE     | CARDIOLOGY Cons Consultant's Choice             | BAY      |
    #| 05/21/2000 | COMPLETE     | CARDIOLOGY Cons Consultant's Choice             | BAY      |
    #| 03/25/2004 | DISCONTINUED | REGULAR Diet <Discharge>                        | BAY      |
    #| 03/25/2004 | DISCONTINUED | REGULAR Diet <Discharge>                        | BAY      |
    #| 03/23/2010 | COMPLETE     | HDL BLOOD SERUM WC LB #17433                    | TST1     |
    #| 03/23/2010 | COMPLETE     | HDL BLOOD SERUM WC LB #17433                    | TST2     |
  When the user clicks the control "Date Filter Toggle" on the "Coversheet"
  And the user clicks the date control "2yr" on the "Coversheet"
  And the user clicks the control "Apply" on the "Coversheet"
  Then no results should be found in the "Orders applet"
  When the user clicks the control "Date Filter Toggle" on the "Coversheet"
  And the user clicks the date control "1yr" on the "Coversheet"
  And the user clicks the control "Apply" on the "Coversheet"
  Then no results should be found in the "Orders applet"
  When the user clicks the control "Date Filter Toggle" on the "Coversheet"
  And the user clicks the date control "3mo" on the "Coversheet"
  And the user clicks the control "Apply" on the "Coversheet"
  Then no results should be found in the "Orders applet"
  When the user clicks the control "Date Filter Toggle" on the "Coversheet"
  And the user clicks the date control "1mo" on the "Coversheet"
  And the user clicks the control "Apply" on the "Coversheet"
  Then no results should be found in the "Orders applet"
  When the user clicks the control "Date Filter Toggle" on the "Coversheet"
  And the user clicks the date control "7d" on the "Coversheet"
  And the user clicks the control "Apply" on the "Coversheet"
  Then no results should be found in the "Orders applet"
  When the user clicks the control "Date Filter Toggle" on the "Coversheet"
  And the user clicks the date control "72hr" on the "Coversheet"
  And the user clicks the control "Apply" on the "Coversheet"
  Then no results should be found in the "Orders applet"
  When the user clicks the control "Date Filter Toggle" on the "Coversheet"
  And the user clicks the date control "24hr" on the "Coversheet"
  And the user clicks the control "Apply" on the "Coversheet"
  Then no results should be found in the "Orders applet"

@f144_global_date_applet_integration_custom @US2626 @TA8070d
Scenario: Global date filtering is applied to applets on the coversheet - Orders applet.
  Then no results should be found in the "Orders applet"
  When the user clicks the control "Date Filter Toggle" on the "Coversheet"
  When the user inputs "02/01/2010" in the "From Date" control on the "Coversheet"
  And the user inputs "10/10/2015" in the "To Date" control on the "Coversheet"
  And the user clicks the control "Apply" on the "Coversheet"
  #Then the "Orders Applet" table contains 6 rows
  #Then the "Orders Applet" table contains rows
  #  | Order Date | Status  | Order                                                                                      | Facility |
  #  | 02/27/2010 | EXPIRED | METFORMIN TAB,SA 500MG TAKE ONE TABLET MOUTH TWICE A DAY Quantity: 180 Refills: 0          | TST1     |
  #  | 02/27/2010 | EXPIRED | METOPROLOL TARTRATE TAB 50MG TAKE ONE TABLET BY MOUTH TWICE A DAY Quantity: 180 Refills: 3 | TST1     |
  #  | 02/27/2010 | EXPIRED | SIMVASTATIN TAB 40MG TAKE ONE TABLET BY MOUTH EVERY EVENING Quantity: 90 Refills: 3        | TST1     |
  #  | 02/27/2010 | EXPIRED | METFORMIN TAB,SA 500MG TAKE ONE TABLET MOUTH TWICE A DAY Quantity: 180 Refills: 0          | TST2     |
  #  | 02/27/2010 | EXPIRED | METOPROLOL TARTRATE TAB 50MG TAKE ONE TABLET BY MOUTH TWICE A DAY Quantity: 180 Refills: 3 | TST2     |
  #  | 02/27/2010 | EXPIRED | SIMVASTATIN TAB 40MG TAKE ONE TABLET BY MOUTH EVERY EVENING Quantity: 90 Refills: 3        | TST2     |

@f144_global_date_ui_functionality @US2746 @TA8851a
Scenario: The All option menu text will now say "Viewing All".
  #Then the "Viewing __ to __" text is correctly set to "18" months in the past and "6" months in the future
  When the user clicks the control "Date Filter Toggle" on the "Coversheet"
  #And the user clicks the date control "All" on the "Coversheet"
  #Then the "Viewing __ to __" text is correctly set to "Viewing All"

@f144_global_date_ui_functionality @US2746 @TA8851b
Scenario: The global date for 2yr, 1yr, (etc.) should default to 6 months into the future and the selected range into the past, from the current date.
  #Then the "Viewing __ to __" text is correctly set to "18" months in the past and "6" months in the future
  When the user clicks the control "Date Filter Toggle" on the "Coversheet"
  #And the user clicks the date control "All" on the "Coversheet"
  #Then the "Viewing __ to __" text is correctly set to "Viewing All"
  When the user clicks the control "Date Filter Toggle" on the "Coversheet"
  And the user clicks the date control "2yr" on the "Coversheet"
  #And the "Viewing __ to __" text is correctly set to "24" months in the past and "6" months in the future
  When the user clicks the control "Date Filter Toggle" on the "Coversheet"
  And the user clicks the date control "1yr" on the "Coversheet"
  #And the "Viewing __ to __" text is correctly set to "12" months in the past and "6" months in the future
  When the user clicks the control "Date Filter Toggle" on the "Coversheet"
  And the user clicks the date control "3mo" on the "Coversheet"
  #And the "Viewing __ to __" text is correctly set to "3" months in the past and "6" months in the future
  When the user clicks the control "Date Filter Toggle" on the "Coversheet"
  And the user clicks the date control "1mo" on the "Coversheet"
  #And the "Viewing __ to __" text is correctly set to "1" months in the past and "6" months in the future
  When the user clicks the control "Date Filter Toggle" on the "Coversheet"
  And the user clicks the date control "7d" on the "Coversheet"
  #And the "Viewing __ to __" text is correctly set to "7" days in the past and "6" months in the future
  When the user clicks the control "Date Filter Toggle" on the "Coversheet"
  And the user clicks the date control "72hr" on the "Coversheet"
  #And the "Viewing __ to __" text is correctly set to "3" days in the past and "6" months in the future
  When the user clicks the control "Date Filter Toggle" on the "Coversheet"
  And the user clicks the date control "24hr" on the "Coversheet"
  #And the "Viewing __ to __" text is correctly set to "1" days in the past and "6" months in the future

@f144_global_date_ui_functionality @US2746 @TA8851c
Scenario: The date menu options will not display as selected when a user applies a custom date filter.
  When the user clicks the control "Date Filter Toggle" on the "Coversheet"
  When the user inputs "02/01/2010" in the "From Date" control on the "Coversheet"
  And the user inputs "10/10/2015" in the "To Date" control on the "Coversheet"
  And the user clicks the control "Apply" on the "Coversheet"
  When the user clicks the control "Date Filter Toggle" on the "Coversheet"
  Then there is no active date control on the "Coversheet"

@f144_global_date_ui_functionality @DE284
Scenario: The custom date range will NOT remain if a user changes to a default selection.
  When the user clicks the control "Date Filter Toggle" on the "Coversheet"
  When the user inputs "05/01/2013" in the "From Date" control on the "Coversheet"
  And the user inputs "10/10/2015" in the "To Date" control on the "Coversheet"
  And the user clicks the control "Apply" on the "Coversheet"
  #Then the "Lab Results Applet" table contains 7 rows
  #And the "Lab Results Applet" table contains rows
  #  | Date             | Lab Test                                           | Flag | Result     |
  #  | 05/07/2013 10:43 | Sodium, Blood Quantitative - PLASMA                |      | 139 mmol/L |
  #  | 05/05/2013 14:10 | Chloride, Serum or Plasma Quantitative - PLASMA    |      | 101 mmol/L |
  #  | 05/05/2013 14:10 | Potassium, Serum or Plasma Quantitative - PLASMA   |  H   | 5.4 mmol/L |
  #  | 05/04/2013 08:25 | Glucose, Serum or Plasma Quantitative - PLASMA     |  H   | 100 mg/dL  |
  #  | 05/04/2013 08:25 | Potassium, Serum or Plasma Quantitative - PLASMA   |  H   | 5.1 mmol/L |
  #  | 05/03/2013 12:28 | Potassium, Serum or Plasma Quantitative - PLASMA   |  L*  | 2.2 mmol/L |
  #  | 05/03/2013 11:37 | Cholesterol, Serum or Plasma Quantitative - PLASMA |      | 160 mg/dL  |
  When the user clicks the control "Date Filter Toggle" on the "Coversheet"
  And the user clicks the date control "1yr" on the "Coversheet"
  Then no results should be found in the "Lab Results applet"
  When the user clicks the control "Date Filter Toggle" on the "Coversheet"
  #Then the "From Date" input should have the value "" on the "Coversheet"
  #And the "To Date" input should have the value "" on the "Coversheet"

@f144_global_date_functionality @DE218
Scenario: Global Date filter should be including results from the last day in the range.
  When the user clicks the control "Date Filter Toggle" on the "Coversheet"
  When the user inputs "04/11/2013" in the "From Date" control on the "Coversheet"
  And the user inputs "10/10/2015" in the "To Date" control on the "Coversheet"
  And the user clicks the control "Apply" on the "Coversheet"
  #And the "Lab Results Applet" table contains rows
  #  | Date             | Lab Test                                           | Flag | Result     |
  #  | 05/07/2013 10:43 | Sodium, Blood Quantitative - PLASMA                |      | 139 mmol/L |
  #  | 05/05/2013 14:10 | Chloride, Serum or Plasma Quantitative - PLASMA    |      | 101 mmol/L |
  #  | 05/05/2013 14:10 | Potassium, Serum or Plasma Quantitative - PLASMA   |  H   | 5.4 mmol/L |
  #  | 05/04/2013 08:25 | Glucose, Serum or Plasma Quantitative - PLASMA     |  H   | 100 mg/dL  |
  #  | 05/04/2013 08:25 | Potassium, Serum or Plasma Quantitative - PLASMA   |  H   | 5.1 mmol/L |
  #  | 05/03/2013 12:28 | Potassium, Serum or Plasma Quantitative - PLASMA   |  L*  | 2.2 mmol/L |
  #  | 05/03/2013 11:37 | Cholesterol, Serum or Plasma Quantitative - PLASMA |      | 160 mg/dL  |
  #  | 04/11/2013 14:05 | Potassium, Serum or Plasma Quantitative - PLASMA   |  H   | 5.4 mmol/L |
  #  | 04/11/2013 08:49 | Potassium, Serum or Plasma Quantitative - PLASMA   |  H   | 5.3 mmol/L |
  #  | 04/11/2013 08:23 | Calcium, Serum or Plasma Quantitative - PLASMA     |  H   | 10.5 mg/dL |

@f144_global_date_functionality @DE219
Scenario: Entering dates in reverse order in global date filter will produce results regardless of order.
  When the user clicks the control "Date Filter Toggle" on the "Coversheet"
  When the user inputs "05/07/2013" in the "From Date" control on the "Coversheet"
  And the user inputs "10/10/2015" in the "To Date" control on the "Coversheet"
  And the user clicks the control "Apply" on the "Coversheet"
  #And the "Lab Results Applet" table contains rows
  #  | Date             | Lab Test                                           | Flag | Result     |
  #  | 05/07/2013 10:43 | Sodium, Blood Quantitative - PLASMA                |      | 139 mmol/L |
  #  | 05/05/2013 14:10 | Chloride, Serum or Plasma Quantitative - PLASMA    |      | 101 mmol/L |
  #  | 05/05/2013 14:10 | Potassium, Serum or Plasma Quantitative - PLASMA   |  H   | 5.4 mmol/L |
  #  | 05/04/2013 08:25 | Glucose, Serum or Plasma Quantitative - PLASMA     |  H   | 100 mg/dL  |
  #  | 05/04/2013 08:25 | Potassium, Serum or Plasma Quantitative - PLASMA   |  H   | 5.1 mmol/L |
  #  | 05/03/2013 12:28 | Potassium, Serum or Plasma Quantitative - PLASMA   |  L*  | 2.2 mmol/L |
  #  | 05/03/2013 11:37 | Cholesterol, Serum or Plasma Quantitative - PLASMA |      | 160 mg/dL  |
  #  | 04/11/2013 14:05 | Potassium, Serum or Plasma Quantitative - PLASMA   |  H   | 5.4 mmol/L |
  #  | 04/11/2013 08:49 | Potassium, Serum or Plasma Quantitative - PLASMA   |  H   | 5.3 mmol/L |
  #  | 04/11/2013 08:23 | Calcium, Serum or Plasma Quantitative - PLASMA     |  H   | 10.5 mg/dL |
