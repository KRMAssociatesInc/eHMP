#Team Orion

Feature: F304 - Health Summaries (VistAWeb Health Exchange)
#Provide Health Summary Report functionality within eHMP. Recreate CPRS Reports - Health Summaries tab.

Background:
    Given user is logged into eHMP-UI
    And user searches for and selects "EIGHTEEN,IMAGEPATIENT"
    And Cover Sheet is active
    And the "patient identifying traits" is displayed with information
        | field         | value                 |
        | patient name  | EIGHTEEN,IMAGEPATIENT |
    When the user clicks "Workspace Manager Button"
    And delete user defined workspaces
    And the user clicks Add New Workspace Button
    And the user clicks the Customize
    And the user drags and drops the VistA Health Summaries right by "1" and down by "400"
    And the user clicks the Summary View
    And user clicks "Done" on the screen editor
    And the user is viewing the screen titled "VistA Health Summary"


@F304-1 @F304-3 @F304-1.1 @F304-1.2 @F304-1.3 @F304-1.4 @F304-1.5 @F304-3.1 @F304-3.5 @F304-3.6 @F304-3.7 @US6146
Scenario:  View a local VistA Health Summary Report
When user views the applet titled "VistA Health Summaries"
    And selects the TST1 local facility
    And selects the Health Summary Report title "CAMP CPRS HEALTH SUMMARY"
    Then a modal with the title "TST1 - CAMP CPRS HEALTH SUMMARY" appears
    And the content of the report is displayed
    And an x button exists in the modal
    And a Close button exists in the modal
    And a Next button exists in the modal
    When the user selects the "Next" button
    Then the content of the "TST1 - CARDIOLOGY REPORTS" report is displayed
    When the user selects the "Previous" button
    Then the content of the "TST1 - CAMP CPRS HEALTH SUMMARY" report is displayed
    When the user selects the "Close" button
    Then the modal is closed
    #And user hits workspace button
    #And user deletes user defined workspace

@F304-2 @F304-3 @F304-2.1 @F304-2.3 @F304-3.1 @F304-3.5 @F304-3.6 @F304-3.7 @US6146 @debug
Scenario:  View a remote VistA Health Summary Report
When user views the applet titled "VistA Health Summaries"
    And selects the TST2 remote facility
    And selects remote Health Summary Report title "CAMP CPRS HEALTH SUMMARY"
    Then a modal with the title "TST2 - CAMP CPRS HEALTH SUMMARY" appears
    And the content of the report is displayed
    And an x button exists in the modal
    And a Close button exists in the modal
    And a Next button exists in the modal
    When the user selects the "Next" button
    Then the content of the "TST2 - CARDIOLOGY REPORTS" report is displayed
    When the user selects the "Previous" button
    Then the content of the "TST2 - CAMP CPRS HEALTH SUMMARY" report is displayed
    When the user selects the "Close" button
    Then the modal is closed
    #And user hits workspace button
    #And user deletes user defined workspace

@F304 @US6146
Scenario: VistA Health Summary Applet is compliance with section 508
    When user views the applet titled "VistA Health Summaries"
    And user clicks "refresh" icon
    And user hits tab key
    #Then the focus is on the "?" icon
    #And user hits tab key again
    Then the focus is on the option icon
    And user hits tab key from option icon
    Then the focus is on the "VISTA HEALTH SUMMARIES" title
    And user hits tab key from the vistA Health Summaries title
    Then the focus is on "Facility"
    And user hits tab key from the facility
    Then the focus is on the Report
    And user hits tab key from report
    Then the focus is on the first site
    And user click the first site to expnd the site
    And user hits tab key from the first site
    Then the focus is on the first report
    And user hits tab key from the first report
    Then the focus is on the second report
    And user hits tab+shift keys
    Then the focus is on the first report
    And user hits tab+shift keys from the first report
    Then the focus is on the first site
    And user hits tab+shift keys from the first site
    Then the focus is on the Report
    #And user hits workspace button
    #And user deletes user defined workspace

@F304 @US6146
Scenario: VistA Health Summary Report Modal is compliance with section 508
    When user views the applet titled "VistA Health Summaries"
    And user clicks the report
    Then the report is displaying
    And user clicks modal body scroll bar
    And user hits tab key from report body
    Then the focus is on the Next button
    And user hits tab key from Next button
    Then the focus is on the X icon
    And user hits tab key from X icon
    Then the focus is on the Close button
    And user hits shift+tab keys from Close button
    Then the focus is on the X icon
    And user hits shift+tab keys from X icon
    Then the focus is on the Next button
    And user clicks Close button
    Then the modal is closed
    #And user hits workspace button
    #And user deletes user defined workspace
