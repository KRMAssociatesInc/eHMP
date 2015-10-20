@F304_HealthSummaries_manual @manual

Feature: F304 - Health Summaries Manual Tests

#Team Orion
# This test is being moved to archive.
# Manual test is defined in functional test UAT_1.2_VistA Health Summaries Applet
# or is testing 508 which we are not covering right now

@manual @F304-1.6
Scenario: Gracefully handle no Health Summary Reports list
    Given no Health Summary reports are configured in Kodak
    When a user views the "VistA Health Summaries" applet
	And Kodak is expanded to show all reports there
    Then a message "No Health Summaries Available" is displayed
	And no Health Summary reports are listed

@manual @F304-2.2
Scenario:  No other site than primary VistA contains patient data
    Given Kodak contains patient data for "EIGHTEEN,IMAGEPATIENT"
	And Panorama does NOT contain patient data for "EIGHTEEN,IMAGEPATIENT"
    When a user views the "VistA Health Summaries" applet
    Then Kodak shows a count of available Health Summaries
	And no additional sites appear below Kodak

@manual @F304-2.4 @F304-2.5 @F304-3.3
Scenario:  Failure to reach remote VistA sites means hiding counts and lists beyond primary, and displaying error
    When a patient record is at both Kodak and Panorama
    And Panorama is unavailable
    And the user views the VistA Health Summaries applet
    Then the user will see Kodak and Panorama listed
	And the user will see a count of reports for Kodak
	And the user will not see a count of reports for Panorama
    When the user expands the list of reports under Kodak
	And the user expands the list of reports under Panorama
    Then the user sees a list of reports under Kodak
	And the user sees an error under Panorama saying "Site temporarily unavailable"

@manual @F304-2.4 @F304-2.5 @F304-3.3
Scenario: Failure to reach remote VistA sites after lists and counts generated
    When  a patients record is at both Kodak and Panorama
	And both sites are available
	And the user views the VistA Health Summaries applet
	And the user will see Kodak and Panorama listed
	And the user will see a count of reports for Kodak and Panorama
	And the user expands the list of reports under Kodak
	And the user expands the list of reports under Panorama
	And the user sees a list of reports under Kodak and Panorama
	And the user selects a report under Kodak
	And Kodak becomes unavailable
    Then a modal will appear and display an error saying "Site temporarily unavailable"

@manual @F304-3.4
Scenario:  Validate report output against CPRS in local VistAs
    When a health summary report called "Local HS Report for eHMP" is run in eHMP on Kodak
	And the same report name exists in Panorama with a different set of components
	And the report for Kodak is run in CPRS
    Then the report content is the same in eHMP and CPRS on Kodak
	And the report content is different between Kodak and Panorama

@manual @F304-??
Scenario: All information on the VistA Health Summary applet conveyed through color are identified without color
    When testing with IE browser
    And the Web Accessibility Toolbar is installed on IE
    And choose Greyscale from the Colour menu
    Then user views the applet titled "VistA Health Summaries"
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

@manual @F304-??
Scenario: All information on the VistA Health Summary summary modal conveyed through color are identified without color
    When testing with IE browser
    And the Web Accessibility Toolbar is installed on IE
    And choose Greyscale from the Colour menu
    Then user views the applet titled "VistA Health Summaries"
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


@manual @F304-??
Scenario: Color Contrast Without Assistive Technology
    When testing with IE browser
    And the Web Accessibility Toolbar is installed on IE
    And choose Greyscale from the Colour menu
    Then user views the applet titled "VistA Health Summaries"
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

@manual @F304-??
Scenario: Testing color contrast With Assistive Technology
    Given IE browser and the Web Accessibility Toolbar installed
    When choose Contrast Analyzer(application)from the Colour menu
    Then the text of "VistA Health Summary" applet provide sufficient contrast.
    And text measuring 18 points (14 if bolded) or larger has a contrast ratio of at least of 3:1.
    And text smaller than 18 points has a contrast ratio of at least 4.5:1
    And text provide sufficient color contrast
    And icons use appropriate contrast levels

@manual @F304-??
Scenario: Testing rows in VistA Health Summary applet can be selected from the keyboard
    Given IE browser and the Web Accessibility Toolbar installed
    When choose Contrast Analyzer(application)from the Colour menu
    Then the text of "VistA Health Summary" applet provide sufficient contrast.
    And text measuring 18 points (14 if bolded) or larger has a contrast ratio of at least of 3:1.
    And text smaller than 18 points has a contrast ratio of at least 4.5:1
    And text provide sufficient color contrast
    And icons use appropriate contrast levels

@manual @F304-??
Scenario: Testing report column and facility column in VistA Health Summary appletcan be sorted with the keyboard
    Given IE browser and the Web Accessibility Toolbar installed
    When choose Contrast Analyzer(application)from the Colour menu
    Then the text of "VistA Health Summary" applet provide sufficient contrast.
    And text measuring 18 points (14 if bolded) or larger has a contrast ratio of at least of 3:1.
    And text smaller than 18 points has a contrast ratio of at least 4.5:1
    And text provide sufficient color contrast
    And icons use appropriate contrast levels

@manual @F304-??
Scenario: Verify a user can navigate though the VistA Health Summary applet and VistA Health Summary report by using a screenreader
    navigating through a table, clicking on a row, focus on a modal that has opened, close the modal.


@manual @F304-??
Scenario: Ensure text and images of text provide sufficient color contrast
    Given IE browser and the Web Accessibility Toolbar installed
    When open the page with the text you wish to test
    And in the WAT, select the Color option, and then the Color Contrast Analyzer
    And There are two field with eyedropper images next to them.
    And Click the first eyedropper and then click on the text that is in the foreground that is to be tested
    And Click on the second eyedropper and click on the background color
    Then The tool will display the ratio.
    And the ratio to be greater than the rule, for example a 7.7:1 will pass
    And it is okay for a check of 4.5:1, but a lower number will not


@manual @F304-??
Scenario: Ensure focus is logically set when a modal opens and close
    When user open a modal window(VistA Health Summary report),
    Then the focus will move to the most logical spot
    When a window is brought up and the focus is moved to it
    Then focus is correct within modal
    When a module closes
    Then the focus should return to a logical spot on the initiating page


@manual @F304-??
Scenario: Ensure the focus order of interactive elements is logical
    When use the keyboard to tab through the VistA Health Summary applet
    Then the focus is always be on the correct element
    And each actionable element gains a visible focus
    And there is only one visual focus on the screen
    And the focus follows a logical order that makes sense

@manual @F304-??
Scenario: verify that each element has an appropriate label that identifies what the element is by using the WAT
    When open the VistA Health Summary applet in the browser
    And on the WAT, click on the Structures option and then on the Fieldsets/Labels option
    And on the WAT, click on the Doc Info option, and then on the Show Titles option
    Then view the displayed tags
    And each form element has a Label-For/Id combination
    And If a Label-For/Id combination is not able to coded, verify those elements have a descriptive Title attribute

@manual @F304-??
Scenario: verify that each element has an appropriate label that identifies what the element is by using AT tool
    When turn on VoiceOver
    And turn off the monitor
    Then each element is identified to the extent

@manual @F304-??
Scenario: verify that each symbol on VistA Health Summary applet has an appropriate tool tip that identifies what the symbol is
    When visually scan through the page
    Then the description for that symbol, is described and presented to the user

@manual @F304-??
Scenario: anything a mouse can do, a keyboard should be able to do
    When tab through everything, and make sure everything can accessible via the keyboard
    And user is able to select report, open the report and close the report by the keyboard

@manual @F304-??
Scenario: Ensure element state and role are correct
    When tab through elements in VistA Health Summary applet
    Then each element is in correct state

@manual @F304-??
Scenario: Ensure shape is not the sole methods used to communicate information
    When go through those fields with a screen reader
    Then the information displayed by way of color, font,is also being made clear to users of the AT

@manual @F304-??
Scenario:Ensure element text is meaningful within context
    When Tab through each field using a screen reader
    Then the text clearly describes the target of the control
    And the text is unique for each control and is not used for any other action

@manual @F304-??
Scenario: Ensure non-decorative images provide informative alternative text
    When Open the page to be tested by the WAT
    And Tab through the page using a screen reader
    Then each non-decorative Image has an appropriate ALT tag
    And decorative Images are skipped by the screen reader

@manual @F304-??
Scenario: Ensure that the reading order of the content is logical
    When user "Tab" through the VistA Health Summary applet and Report Modal using the keyboard
    Then the tab order appears for each actionable element
