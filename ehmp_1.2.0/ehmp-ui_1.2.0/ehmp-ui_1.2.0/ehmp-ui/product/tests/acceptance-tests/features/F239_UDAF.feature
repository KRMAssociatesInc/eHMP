@F239_UDAF @future
Feature: F239 - User-Defined Applet Filters

# Team: Andromeda

Background:
  Given user is logged into eHMP-UI
  And user searches for and selects "Eight,Patient"
  And the user clicks the "Workspace Manager"
  When the user clicks "Plus Button"
  And the user clicks "Customize"
	
@F239_1.1_to_1.5_create_user_defined_applet_filters @US4424 @US4425 @US5700 @US5507 @future
Scenario: Creating, saving and deleting filter tags
  When drag and drop the Lab Results right by 0 and down by 10
  And user clicks "Lab Results Expanded View" on the screen editor
  And drag and drop the Orders right by 0 and down by 20
  And user clicks "Done" on the screen editor
  And user scrolls the window to bring applets to view
  And the user has selected All within the global date picker
  #Scenario F239-1.0 (Entering a basic text filter)
  And user clicks on the control "Lab Result - Text Filter" 
  And the user enters text "hematocrit" in the "Text Filter" control in the "Lab Results applet"
  Then user defined filter "hematocrit" is created 
  # And the user waits for 5 seconds
  And the "Lab Results Applet" table contains 1 rows
  And the "Lab Results Applet" table contains rows
    | Date               | Lab Test                                               | Flag | Result | Unit    | Ref Range | Facility |
    | 06/21/2007 - 10:26 | Hematocrit, Blood Quantitative Automated Count - BLOOD |  L   | 30.0   | %       | 35.5-49.1 | DOD      |
  # Scenario F239-1.3 (Entering multiple text filters)  
  And the user enters text "anion" in the "Text Filter" control in the "Lab Results applet"
  Then user defined filter "anion" is created 
  # And the user waits for 5 seconds
  And the "Lab Results Applet" table contains 3 rows
  And the "Lab Results Applet" table contains rows
    | Date               | Lab Test                                               | Flag | Result | Unit    | Ref Range | Facility |
    | 04/09/2013 - 10:08 | Anion Gap, Serum or Plasma Quantitative - PLASMA       |      | 17     | mmol/L  | 8-20      | DOD      |
    | 03/28/2013 - 14:09 | Anion Gap, Serum or Plasma Quantitative - PLASMA       |      | 20     | mmol/L  | 8-20      | DOD      |
    | 06/21/2007 - 10:26 | Hematocrit, Blood Quantitative Automated Count - BLOOD |  L   | 30.0   | %       | 35.5-49.1 | DOD      |
  #Scenario F239-1.2 (Delete a text filter)
  When user clicks on the control "Delete - UDAF - hematocrit" 
  And the "Lab Results Applet" table contains 2 rows
  And the "Lab Results Applet" table contains rows
    | Date               | Lab Test                                               | Flag | Result | Unit    | Ref Range | Facility |
    | 04/09/2013 - 10:08 | Anion Gap, Serum or Plasma Quantitative - PLASMA       |      | 17     | mmol/L  | 8-20      | DOD      |
    | 03/28/2013 - 14:09 | Anion Gap, Serum or Plasma Quantitative - PLASMA       |      | 20     | mmol/L  | 8-20      | DOD      |
  # US5507 - verifying remove all filters  
  And the user enters text "Granulocytes" in the "Text Filter" control in the "Lab Results applet"
  Then user defined filter "Granulocytes" is created 
  And the "Lab Results Applet" table contains 3 rows
  And the "Lab Results Applet" table contains rows
    | Date               | Lab Test                                                               | Flag | Result | Unit    | Ref Range | Facility |
    | 04/09/2013 - 10:08 | Anion Gap, Serum or Plasma Quantitative - PLASMA                       |      | 17     | mmol/L  | 8-20      | DOD      |
    | 03/28/2013 - 14:09 | Anion Gap, Serum or Plasma Quantitative - PLASMA                       |      | 20     | mmol/L  | 8-20      | DOD      |
    | 06/21/2007 - 10:26 | Granulocytes/100 Leukocytes, Blood Quantitative Automated Count - BLOOD|      | 55.0   | %       | 40.9-74.9 | DOD      |
  And user clicks on the control "Lab Result - Remove All link" 
  And the element "UDAF - anion" is not displayed anymore
  And the element "UDAF - Granulocytes" is not displayed anymore
  When the user clicks "Workspace Manager Button"
  And the user clicks "Delete"
  And the user clicks "Confirm Delete"
  Then the "User Defined Workspace 1" is not listed in the workspace manager page
  And the user clicks "Done editing" on the workspace manager
  
@F239_10.1_to_10.N_group_name_for_udafs @US5352 @future
Scenario: Ability to give a name to the group of filters 
  When drag and drop the Lab Results right by 0 and down by 10
  And user clicks "Lab Results Expanded View" on the screen editor
  And drag and drop the Orders right by 0 and down by 20
  And user clicks "Done" on the screen editor
  And user scrolls the window to bring applets to view
  # And user refeshes the app
  And the user has selected All within the global date picker
  And user clicks on the control "Lab Result - Text Filter" 
  And the user enters text "hematocrit" in the "Text Filter" control in the "Lab Results applet"
  Then user defined filter "hematocrit" is created
  And the user waits for 5 seconds
  And the "Lab Results Applet" table contains 1 rows 
  And the user enters text "anion" in the "Text Filter" control in the "Lab Results applet"
  And user defined filter "anion" is created 
  And the user waits for 5 seconds
  And the "Lab Results Applet" table contains 3 rows
  # Scenario F239-10.3 (Filtered is the default name)
  Then filter name field displays text "Filtered"
  And user clicks on the control "Filter Name"
  When enters "Test" to the filter name field
  Then filter name field displays text "Test"
  # Scenario F239-10.1 (The name of the filter will be added to the header of the applet)
  And applet header displays filter name "Test"
  # Scenario F239-10.6 (The filter name can have 30 chars)
  # Scenario F239-10.7 (The filter name supports spaces)
  And user clicks on the control "Filter Name"
  When enters "1234567890 1234567890 1234567890" to the filter name field
  Then filter name field displays text "1234567890 1234567890 12345678"
  # Scenario F239-10.2 (The name of the filter will persist on the applet)
  And the user attempts signout
  And user is logged into eHMP-UI
  And user searches for and selects "Eight,Patient"
  When the user clicks the "CoversheetDropdown Button"
  And user clicks on the control "New Workspce"
  And user scrolls the window to bring applet 1 to view
  And user refeshes the app
  Then filter name field displays text "1234567890 1234567890 12345678"
  # Scenario F239-10.N (The filter name copies on duplicate/copy workspace)
  When the user clicks "Workspace Manager Button"
  And the user clicks "Duplicate" 
  And user clicks on the control "Lauch duplicated UDS"
  And user refeshes the app
  And user scrolls the window to bring applets to view
  Then filter name field displays text "1234567890 1234567890 12345678"
  And the user clicks the "Workspace Manager"
  And the user clicks "Delete"
  And the user clicks "Confirm Delete"
  Then the "User Defined Workspace 1" is not listed in the workspace manager page
  And the user clicks "Delete User Defined Workspace 1 Copy Link"
  And the user clicks "Confirm Delete"
  And the "User Defined Workspace 1 Copy" is not listed in the workspace manager page
  And the user clicks "Done editing" on the workspace manager

@F239_10_filter_name_is_required_and_other_checks @US5869 @future
Scenario: Required Name for Filters 
  When drag and drop the Lab Results right by 0 and down by 10
  And user clicks "Lab Results Expanded View" on the screen editor
  And drag and drop the Orders right by 0 and down by 20
  And user clicks "Done" on the screen editor
  And user scrolls the window to bring applets to view
  # And user refeshes the app
  And the user has selected All within the global date picker
  #words separated by space create separate filters
  And user clicks on the control "Lab Result - Text Filter" 
  And the user enters text "carbon anion" in the "Text Filter" control in the "Lab Results applet"
  Then user defined filter "carbon" is created
  And user defined filter "anion" is created 
  And the user waits for 5 seconds
  And the "Lab Results Applet" table contains 5 rows
  Then filter name field displays text "Filtered"
  #seecial character error message verification
  And user clicks on the control "Filter Name"
  When enters "Test/" to the filter name field
  Then a filter tooltip is displayed containing message "Filter name may not contain special characters"
  #filter name is required
  When enters "" to the filter name field
  Then filter name field displays text "Filtered"
  And applet header displays filter name "Filtered"
  And user clicks on the control "Lab Result - Remove All link" 
  And the element "Filter Title" is not displayed anymore
  When the user clicks "Workspace Manager Button"
  And the user clicks "Delete"
  And the user clicks "Confirm Delete"
  Then the "User Defined Workspace 1" is not listed in the workspace manager page
  And the user clicks "Done editing" on the workspace manager

