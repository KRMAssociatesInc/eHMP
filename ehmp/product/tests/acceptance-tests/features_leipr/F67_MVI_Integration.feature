@MVI_Integration
Feature: F67 Patient Identity and Search (MVI integration Planning)
  Integration planning with MVI for lookup of VistA Identifiers (DFN) used while doing the pull of data from VistA to populate the cache in response to a API request for patient data. Web Service API to support lookup of patient by identifier or name traits, such as last name and first name.

  Background: 
    Given user logs in with valid credentials

  @US511 @here
  Scenario Outline: Request to MVI with valid DFN/Site Code combination.
    Given a DFN "<DFN>" and site code "<SiteCode>" combination
    When a request is made to MVI with that combination
    Then a response will be received from MVI with the appropriate ICN(s) "<ICNs>"

    Examples: 
      | DFN    | SiteCode   | ICNs   |
      | 100716 | 200        | E1   |
      | 100615 | 542GA      | E2   |
      | 100022 | 200        | E101 |
      |	99	   | 542GA		|	E901,E902|
      
  @US511
  Scenario Outline: Request to MVI with invalid DFN/Site Code combination.
    #Given an invalid DFN/Site Code combination
    Given a DFN "<DFN>" and site code "<sitecode>" combination
    When a request is made to MVI with that combination
    Then a response will be received from MVI with no ICN(s)

    Examples: 
      | DFN     | sitecode    |
      | invalid | 200         |
      | 100022  | badsitecode |
      | invalid | invalid |

  @US511
  Scenario Outline: Request to MVI with valid ICN.
    Given a "valid" ICN "<ICN>"
    When a request is made to MVI with that ICN
    Then a response will be received from MVI with the DFN "<DFN>" and site codes "<SiteCodes>"

    Examples: 
      | ICN  | DFN    | SiteCodes |
      | E1   | 100716 | 200       |
      | E2   | 100615 | 542GA     |
      | E102 | 227    | 200,542GA |

  @US511
  Scenario: Request to MVI with invalid ICN.
    Given a "invalid" ICN "E_INVALID"
    When a request is made to MVI with that ICN
    Then a response will be received from MVI with no DFN/Site Code combination(s)
