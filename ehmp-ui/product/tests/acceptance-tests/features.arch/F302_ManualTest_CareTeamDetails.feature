@F302 @CareTeamDetails @manual @future

Feature: F302 - Enhance Care Team Header

# POC: Team Saturn
# This test is being moved to archive.
# Manual test is defined in functional test F302_US5260_ Quick Look Pop-Up for Provider Contact Information from Non-Local eHMP Site
@F302-5.2_PatientCareTeamDetails @US5456 @US5260 @manual
    Scenario: A user can hover over a provider row that does not have supplemental data, row will not be highlighted.
    Given user is logged into eHMP-UI
    And user searches for and selects "twentythree,Ouptatient"
    Then Cover Sheet is active
    Then the "patient identifying traits" is displayed with information
    | field     | value         |
    | patient name  | Twentythree,Outpatient   |
    Then Cover Sheet is active
    Then user selects "Care Team Information" drop down
    And the "Care Team Details" table contains headers
    | Provider Title | Name | Analog Pager | Digital Pager | Office Phone |
    And the "Care Team Details" table contains rows
    | Provider Title                  | Name                |  Analog Pager    | Digital Pager    | Office Phone    |
    | Primary Care Provider           | Unassigned          |  not specified | (843) 555-5456    | (843) 555-5454   |
    | Primary Care Assoc Provider     | Unassigned          |  not specified  | (555) 555-8876    | (555) 555-8837   |
    | Inpatient Attending Provider    | Unassigned          |  not specified  | (555) 555-7688    | (555) 555-7678   |
    | Inpatient Provider              | Unassigned          |  not specified  | (555) 555-7688    | (555) 555-7678   |
    | MH Treatment Team               | Unassigned          |  not specified  | not specified     | (555) 555-5453   |
    | MH Treatment Coordinator        | Unassigned          |  not specified   | (555) 555-3242    | (555) 555-5453   |

    Then user Selects "MH Treatment Team"
    And the Row is not hightlight as no supplenental data availbe
