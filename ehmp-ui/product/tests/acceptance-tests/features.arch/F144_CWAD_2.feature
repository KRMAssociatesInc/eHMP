# Team Mercury
@F144 @regression
Feature: F144-eHMP Viewer GUI - Crisis Notes, Warnings, Allergies, Directives (CWAD)
The user should be able look at CWAD flags in patient header

Background:
    Given user is logged into eHMP-UI
    When user searches for and selects "Eight,Inpatient"
  	

@US3584_3_cwad @DE979 @reworked_in_firefox
Scenario: The user can identify when a patient has postings
  Given Overview is active
  Then the following postings are active
    | Posting   |
    | Allergies |
    # The Directive is from an external source, non-va
    | Directives|
  And the following postings are inactive
    | Posting       |
    | Crisis Notes  |
    | Warnings      |
    | Patient Flags |