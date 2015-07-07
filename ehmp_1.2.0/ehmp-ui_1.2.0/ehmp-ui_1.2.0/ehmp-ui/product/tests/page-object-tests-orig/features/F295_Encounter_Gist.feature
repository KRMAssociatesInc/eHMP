@F295_encounters_gist @future
Feature: F295 - Encounters Applet

  @F295_1_encounterGist_visit_admission @US3706 @US4001 @reglite
#  Scenario: User views the encounters gist view
#    Given user is logged into eHMP-UI
#    And user searches for and selects "Zzzretiredonenineteen,Patient"
#    And Cover Sheet is active
#    When user selects Overview from Coversheet dropdown
#    Then Overview is active
#    And user sees Encounters Gist
#    And the user clicks the control "Date Filter" on the "Overview"
#    And the user clicks the date control "All" on the "Overview"
#    And the user clicks the control "Apply" on the "Med Review Applet"
#    And the encounter gist details view has headers
#      | Headers 	  |
#      | Description |
#   #  	| Occurrence   |
#      | Age 		  |
#    And the encounter gist detail view contains
#      | Description	| Events	| age 	|
#      | Admission		| 3			| 20y	|
#      | Visit			| 3			| 19y	|

  @F295_1_encounterGist_Admission_Visit @US3706
  Scenario: User views Admissions and Vists on the encounters gist view
    Given user searches for and selects "Zzzretiredonenineteen,Patient"
    When user views the Overview
    Then the Encounters Gist applet is displayed
    And the Encounters Gist view contains "Admission"
      | Description	| Events	| age 	|
      | Admission		| 3			| 20y	|
    And the Encounters Gist view contains "Visit"
      | Description	| Events	| age 	|
      | Visit			| 3			| 19y	|

  @F295_2_encounterGist_procedure @US3706 @US4001 @reglite
  Scenario: User views the encounters gist view
    Given user is logged into eHMP-UI
    And user searches for and selects "ZZZRETFOUREIGHTY,PATIENT"
    And Cover Sheet is active
    When user selects Overview from Coversheet dropdown
    Then Overview is active
    And user sees Encounters Gist
    And the user clicks the control "Date Filter" on the "Overview"
    And the user clicks the date control "All" on the "Overview"
    And the user clicks the control "Apply" on the "Med Review Applet"
    And the encounter gist detail view contains
      | Description	| Events	| age 	|
      | Procedure		| 1			| 22y	|

  @F295_3_encounterGist_filter_capability @US4001
  Scenario: Encounters Applet Gist - filter encounters
    Given user is logged into eHMP-UI
    Given user searches for and selects "Zzzretiredonenineteen,Patient"
    Then Cover Sheet is active
    When user selects Overview from Coversheet dropdown
    Then Overview is active
    And user sees Encounters Gist
    And the user clicks the control "Date Filter" on the "Overview"
    And the user clicks the date control "All" on the "Overview"
    And the user clicks the control "Apply" on the "Med Review Applet"
    When the user clicks the control "Filter Toggle" in the "Encounters Gist applet"
    And the user inputs "Visit" in the "Text Filter" control in the "Encounters Gist applet"
    And the encounter gist detail view contains
      | Description	| Events	| age 	|
      | Visit			| 3			| 19y	|

  @f295_4_encounters_global_datefilter @US4001
  Scenario: Encounters gist applet is able to filter data based date filter search

    Given user is logged into eHMP-UI
    And user searches for and selects "ZZZRETFOUREIGHTY,PATIENT"
    Then Cover Sheet is active
    When user selects Overview from Coversheet dropdown
    Then Overview is active
    And user sees Encounters Gist
    And the user clicks the control "Date Filter" on the "Overview"
    And the following choices should be displayed for the "Overview" Date Filter
      | All | 2yr | 1yr | 3mo | 1mo | 7d | 72hr | 24hr |

    And the user clicks the date control "1yr" on the "Overview"
    And the user clicks the control "Apply" on the "Med Review Applet"
    Then the search results say "No Records Found" in Encounters Gist Applet

    And the user clicks the control "Date Filter" on the "Overview"
    And the user clicks the date control "3mo" on the "Overview"
    And the user clicks the control "Apply" on the "Med Review Applet"
    Then the search results say "No Records Found" in Encounters Gist Applet

    And the user clicks the control "Date Filter" on the "Overview"
    And the user clicks the date control "1mo" on the "Overview"
    And the user clicks the control "Apply" on the "Med Review Applet"
    Then the search results say "No Records Found" in Encounters Gist Applet

    And the user clicks the control "Date Filter" on the "Overview"
    And the user clicks the date control "7d" on the "Overview"
    And the user clicks the control "Apply" on the "Med Review Applet"
    Then the search results say "No Records Found" in Encounters Gist Applet

    And the user clicks the control "Date Filter" on the "Overview"
    And the user clicks the date control "72hr" on the "Overview"
    And the user clicks the control "Apply" on the "Med Review Applet"
    Then the search results say "No Records Found" in Encounters Gist Applet

    And the user clicks the control "Date Filter" on the "Overview"
    And the user clicks the date control "24hr" on the "Overview"
    And the user clicks the control "Apply" on the "Med Review Applet"
    Then the search results say "No Records Found" in Encounters Gist Applet

    And the user clicks the control "Date Filter" on the "Overview"
    And the user inputs "12/01/1990" in the "From Date" control on the "Overview"
    And the user inputs "12/31/1992" in the "To Date" control on the "Overview"
    And the user clicks the control "Apply" on the "Overview"
    And the encounter gist detail view contains
      | Description	| Events	| age 	|
      | Procedure		| 1			| 22y	|