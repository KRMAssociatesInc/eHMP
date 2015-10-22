# Team Mercury
@F144 @US3584 @regression
Feature: F144-eHMP Viewer GUI - Crisis Notes, Warnings, Allergies, Directives (CWAD)
The user should be able look at CWAD flags in patient header and user looks for patient-status-icon

Background:
    Given user is logged into eHMP-UI
    When user searches for and selects "Eight,Patient"
    Then Overview is active
 
@US3584_cwad_crisisnotes @DE979 @DE1045 @reworked_in_firefox
Scenario: The user should be able to view Crisis Notes details
    Given the following postings are active
      | Posting    |
      | Crisis Notes |
    When the user opens the "Crisis Notes" details view
    Then the cwad details view contains 
      | field          | value            |
      | Crisis Note    | 05/21/2000       |
      | Local Title    | CRISIS NOTE      |
      | Standard Title |                  |
      | Date of Note   | 05/21/2000 12:01 |
      | Entry Date     | 05/21/2000 12:01 |
      | Author         | VEHU TWENTYONE   |

@US3584_cwad_allergies @DE979 @DE1045 @reworked_in_firefox
Scenario: The user should be able to view Allergies details
    Given the following postings are active
      | Posting    |
      | Allergies  |
    When the user opens the "Allergies" details view
    Then the cwad details view contains 
      | field               | value                                      |
      | Drug Classes        | PENICILLINS AND BETA-LACTAM ANTIMICROBIALS |
      #| Originator          | VEHU EIGHT                                 |
      | Originated          | 03/17/2005 20:09                           |
      | Verified            | 03/17/2005                                 |
      | Nature of reaction  | Adverse Reaction                           |
      | Observed/Historical | Historical                                 |

@US3584_cwad_directives @DE979 @DE1045 @reworked_in_firefox
Scenario: The user should be able to view Directives details
    Given the following postings are active
      | Posting    |
      | Directives  |
    When the user opens the "Directives" details view
    Then the cwad details view contains 
      | field        | value                       |
      | Local Title  | ADVANCE DIRECTIVE COMPLETED |
      | Date of Note | 05/16/2007 09:50            |
      | Entry Date   | 05/16/2007 09:50            |