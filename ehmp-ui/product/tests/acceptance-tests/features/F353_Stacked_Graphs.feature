@F353_Stacked_Graphs  @future
Feature: F353 - Stacked Graphs

# Team: Andromeda 

Background:
  Given user is logged into eHMP-UI
  And user searches for and selects "Eight,Patient"
  And the user clicks the "Workspace Manager"
  When the user clicks "Plus Button"
  And the user clicks "Customize"
  And drag and drop the Stacked Graph right by 0 and down by 10
  And user clicks "Stacked Graph expanded view" on the screen editor
  And user clicks "Done" on the screen editor
  And user scrolls the window to bring graph applet to view
  And the user has selected All within the global date picker

@F353_Stacked_Graph_Persistance @US5838 @future @F353-2.1 @F353-2.2 @F353-2.3 @F353-4.1 @F353-4.3 @F353-14.1
Scenario: User creates a stack graph applet in workspace and add multiple graphs. Users logs off and logs back in to check persistance of the graphs. 

  And user verifies that "Stacked Graph Applet Header" is present 
  Then user searches for "Blood" and clicks on the "Vitals" search result
  Then user searches for "Weight" and clicks on the "Vitals" search result
  Then user searches for "LDL" and clicks on the "Labs" search result
  And user verifies row 1 concept details "ldl cholesterol", "77 MG/DL", days and graph
  And user verifies row 2 concept details "Weight", "135 lb", days and graph
  And user verifies row 3 concept details "BLOOD PRESSURE", "110/40 mmHg", days and graph
  #checking persistence of the stacked graphs
  And the user attempts signout
  And user is logged into eHMP-UI
  And user searches for and selects "Eight,Patient"
  When the user clicks the "CoversheetDropdown Button"
  And user clicks on the control "New Workspce"
  And user scrolls the window to bring applet 1 to view
  And user verifies that "Stacked Graph Applet Header" is present
  And user verifies row 1 concept details "ldl cholesterol", "77 MG/DL", days and graph
  And user verifies row 2 concept details "Weight", "135 lb", days and graph
  And user verifies row 3 concept details "BLOOD PRESSURE", "110/40 mmHg", days and graph
  When the user clicks "Workspace Manager Button"
  And the user clicks "Delete"
  And the user clicks "Confirm Delete"
  Then the "User Defined Workspace 1" is not listed in the workspace manager page
  And the user clicks "Done editing" on the workspace manager

@F353_Stacked_Graph_Deletion @US5839a @future @F353-10.1
Scenario: User creates a stack graph applet in workspace and add multiple graphs. User deletes some stacked graphs. Users logs off and logs back in to check persistance of the graphs. 

  And user verifies that "Stacked Graph Applet Header" is present 
  Then user searches for "Blood" and clicks on the "Vitals" search result
  Then user searches for "Weight" and clicks on the "Vitals" search result
  Then user searches for "LDL" and clicks on the "Labs" search result
  And user verifies row 1 concept details "ldl cholesterol", "77 MG/DL", days and graph
  And user verifies row 2 concept details "Weight", "135 lb", days and graph
  And user verifies row 3 concept details "BLOOD PRESSURE", "110/40 mmHg", days and graph
  Then user deletes graph on row 1
  And user verifies row 1 concept details "Weight", "135 lb", days and graph
  And user verifies row 2 concept details "BLOOD PRESSURE", "110/40 mmHg", days and graph
  And the user attempts signout
  And user is logged into eHMP-UI
  And user searches for and selects "Eight,Patient"
  When the user clicks the "CoversheetDropdown Button"
  And user clicks on the control "New Workspce"
  And user scrolls the window to bring applet 1 to view
  And user verifies that "Stacked Graph Applet Header" is present
  And user verifies row 1 concept details "Weight", "135 lb", days and graph
  And user verifies row 2 concept details "BLOOD PRESSURE", "110/40 mmHg", days and graph
  When the user clicks "Workspace Manager Button"
  And the user clicks "Delete"
  And the user clicks "Confirm Delete"
  Then the "User Defined Workspace 1" is not listed in the workspace manager page
  And the user clicks "Done editing" on the workspace manager

@F353_Stacked_Graph_Deletion_Using_Picklist @US5839b @future @F353-9.2
Scenario: User creates a stack graph applet in workspace and adds a graph. User searches for same content and clicks on search result to remove the graph from the stack graph list. 

  And user verifies that "Stacked Graph Applet Header" is present 
  Then user searches for "Blood" and clicks on the "Vitals" search result
  Then user searches for "Weight" and clicks on the "Vitals" search result
  Then user searches for "LDL" and clicks on the "Labs" search result
  And user verifies row 1 concept details "ldl cholesterol", "77 MG/DL", days and graph
  And user verifies row 2 concept details "Weight", "135 lb", days and graph
  And user verifies row 3 concept details "BLOOD PRESSURE", "110/40 mmHg", days and graph
  # Searching and clicking on same content will allow user to remove graph
  Then user searches for "Weight" and clicks on the "Vitals" search result
  And user verifies row 1 concept details "ldl cholesterol", "77 MG/DL", days and graph
  And user verifies row 2 concept details "BLOOD PRESSURE", "110/40 mmHg", days and graph
  Then user searches for "LDL" and clicks on the "Labs" search result
  And user verifies row 1 concept details "BLOOD PRESSURE", "110/40 mmHg", days and graph
  When the user clicks "Workspace Manager Button"
  And the user clicks "Delete"
  And the user clicks "Confirm Delete"
  Then the "User Defined Workspace 1" is not listed in the workspace manager page
  And the user clicks "Done editing" on the workspace manager


@F353_Stacked_Graph_Detail_Modal_View @US5839c @future @F353-10.1
Scenario: User create a stack graph applet in workspace and adds a graph. User clicks on the concept and then clicks on the detail view icon to view the detail modal view of the graph. 

  And user verifies that "Stacked Graph Applet Header" is present 
  Then user searches for "LDL" and clicks on the "Labs" search result
  And user verifies row 1 concept details "ldl cholesterol", "77 MG/DL", days and graph
  Then user clicks on detail view button for row 1
  Then the modal is displayed
  And the user clicks the date control "All" in the "Lab Results modal"
  And the modal's title is "LDL CHOLESTEROL"
  And the "Lab Detail" row is
    | Date       | Lab Test               | Flag | Result | Unit   | Ref Range | Facility |
    | 03/05/2010 | LDL CHOLESTEROL -      |      |        |        |           |          |
    And the "Lab History" table contains rows
    | Date               | Flag | Result     | Facility |
    | 03/05/2010 - 10:00 |      | 77 MG/DL   | TST1     |
    | 03/05/2010 - 10:00 |      | 77 MG/DL   | TST2     |
  And the user closes modal by clicking the "Close" control
  When the user clicks "Workspace Manager Button"
  And the user clicks "Delete"
  And the user clicks "Confirm Delete"
  Then the "User Defined Workspace 1" is not listed in the workspace manager page
  And the user clicks "Done editing" on the workspace manager

@F353_Stacked_Graph_Info_Page @US5839d @future @F353-10.1
Scenario: User creates a stack graph applet in workspace and add a graph. User clicks on the concept and then clicks on the info 'i' icon to view the Info page in different window. 

  And user verifies that "Stacked Graph Applet Header" is present 
  Then user searches for "Blood" and clicks on the "Vitals" search result
  And user verifies row 1 concept details "BLOOD PRESSURE", "110/40 mmHg", days and graph
  Then user clicks on info icon button for row 1 and info page is loaded
  When the user clicks "Workspace Manager Button"
  And the user clicks "Delete"
  And the user clicks "Confirm Delete"
  Then the "User Defined Workspace 1" is not listed in the workspace manager page
  And the user clicks "Done editing" on the workspace manager

@F353_Stacked_Graph_Quick_View @US5839e @future @F353-10.1 
Scenario: User creates a stack graph applet in workspace and add a graph. User clicks on the concept and then clicks on the Quick View 'eye' icon to view the Quick View popup. 

  And user verifies that "Stacked Graph Applet Header" is present 
  Then user searches for "Blood" and clicks on the "Vitals" search result
  And user verifies row 1 concept details "BLOOD PRESSURE", "110/40 mmHg", days and graph
  Then user clicks on quick view button for row 1
  And the "Stacked Graph Quick View Table" table contains rows
  | Date | Result | Ref. Range | Facility |
  | 01/10/2014 - 17:10  | 110/40 mmHg | 90/140mmHg - 60/90mmHg  | DOD |
  | 01/09/2014 - 20:03  | 110/40 mmHg | 90/140mmHg - 60/90mmHg  | DOD |
  | 12/05/2013 - 17:15  | 110/40 mmHg | 90/140mmHg - 60/90mmHg  | DOD |
  | 12/02/2013 - 21:01  | 110/80 mmHg | 90/140mmHg - 60/90mmHg  | DOD |
  | 11/18/2013 - 17:10  | 110/80 mmHg | 90/140mmHg - 60/90mmHg  | DOD |
  When the user clicks "Workspace Manager Button"
  And the user clicks "Delete"
  And the user clicks "Confirm Delete"
  Then the "User Defined Workspace 1" is not listed in the workspace manager page
  And the user clicks "Done editing" on the workspace manager

@F353_Stacked_Graph_Expanded_View @US5839f @future @F353-2.3
Scenario: User creates a stack graph applet in workspace and adds multiple graphs. User clicks on 'show options' button and clicks on expanded view. User verifies that same graphs are loaded again. 

  And user verifies that "Stacked Graph Applet Header" is present 
  Then user searches for "Blood" and clicks on the "Vitals" search result
  Then user searches for "LDL" and clicks on the "Labs" search result
  And user verifies row 1 concept details "ldl cholesterol", "77 MG/DL", days and graph
  And user verifies row 2 concept details "BLOOD PRESSURE", "110/40 mmHg", days and graph
  Then the user clicks on button "Show Options"
  And the user clicks on button "Expanded View"
  And user verifies row 1 concept details "ldl cholesterol", "77 MG/DL", days and graph
  And user verifies row 2 concept details "BLOOD PRESSURE", "110/40 mmHg", days and graph
  When the user clicks "Workspace Manager Button"
  And the user clicks "Delete"
  And the user clicks "Confirm Delete"
  Then the "User Defined Workspace 1" is not listed in the workspace manager page
  And the user clicks "Done editing" on the workspace manager


@F353_Stacked_Graph_BMI_Vitals @US5840 @future @F353-20.1
Scenario: User create multiple stack graph applets in a workspace and add multiple graphs. Users logs off and logs back in to check persistance of the graphs. 

  And user verifies that "Stacked Graph Applet Header" is present 
  Then user searches for "BMI" and clicks on the "Vitals" search result
  And user verifies row 1 concept details "bmi", "23.9", days and graph
  When the user clicks "Workspace Manager Button"
  And the user clicks "Delete"
  And the user clicks "Confirm Delete"
  Then the "User Defined Workspace 1" is not listed in the workspace manager page
  And the user clicks "Done editing" on the workspace manager

@F353_Del_Stacked_Graph_Applet @US6316 @future @F353-13.1
Scenario: User creates a stack graph applet in workspace and adds a graph. User deletes the applet. Then adds back the applet and verify that it is empty.

  And user verifies that "Stacked Graph Applet Header" is present 
  Then user searches for "Blood" and clicks on the "Vitals" search result
  And user verifies row 1 concept details "BLOOD PRESSURE", "110/40 mmHg", days and graph
  Then the user clicks on button "Show Options"
  And the user clicks on button "Remove"
  When the user clicks "Workspace Manager Button"
  And the user clicks "Customize"
  And drag and drop the Stacked Graph right by 0 and down by 10
  And user clicks "Stacked Graph expanded view" on the screen editor
  And user clicks "Done" on the screen editor
  And user scrolls the window to bring graph applet to view
  And user verifies that the stacked graph applet is empty
  When the user clicks "Workspace Manager Button"
  And the user clicks "Delete"
  And the user clicks "Confirm Delete"
  Then the "User Defined Workspace 1" is not listed in the workspace manager page
  And the user clicks "Done editing" on the workspace manager

@F353_Meds_Stacked_Graph @US5984 @future 
Scenario: User creates a stack graph applet in workspace and adds multiple graphs including Meds graphs and verifies the data. User clicks on the trend menu buttons for Med graph i.e. info icon, detail view and delete button. 

  And user verifies that "Stacked Graph Applet Header" is present
  Then user searches for "Weight" and clicks on the "Vitals" search result
  Then user searches for "LDL" and clicks on the "Labs" search result
  Then user searches for "Aspirin" and clicks on the "Meds" search result
  And user verifies row 1 Meds concept details "aspirin tab,ec", "81MG PO QAM" and graph
  And user verifies row 2 concept details "ldl cholesterol", "77 MG/DL", days and graph
  And user verifies row 3 concept details "Weight", "205 lb", days and graph
  Then user clicks on info icon button for row 1 and info page is loaded "Meds"
  Then user clicks on detail view button for row 1 "Meds"
  Then the modal is displayed
  And the modal's title is "Medication - aspirin tab,ec"
  And the user clicks the modal "Close Button"
  And the modal is closed
  Then user deletes graph on row 1 "Meds"
  And user verifies row 1 concept details "ldl cholesterol", "77 MG/DL", days and graph
  And user verifies row 2 concept details "Weight", "205 lb", days and graph
  When the user clicks "Workspace Manager Button"
  And the user clicks "Delete"
  And the user clicks "Confirm Delete"
  Then the "User Defined Workspace 1" is not listed in the workspace manager page
  And the user clicks "Done editing" on the workspace manager
