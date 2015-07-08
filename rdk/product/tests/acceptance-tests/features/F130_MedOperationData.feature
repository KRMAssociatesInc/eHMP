@F130_MedicationData @F130  @onc

Feature: F130 Non-VA Medications (write-back)

  # Wiki Documentation: https://wiki.vistacore.us/display/~berry.davenport/Non-VA+Med+Operational+Data+HTTP+requests

  @MedicationSearchList @US1963 @US2426 @onc
  Scenario: Searching for Medication with ALCAINE
    #http://10.4.4.105:8888/resource/writeback/med/search?searchParam=alcaine
    When the clients searches for medications with the string "alcaine"
    Then a successful response is returned
    And the VPR results contain
      | name   | ALCAINE|

  @MedicationListbyCount  @US1963 @US2624 @onc
  Scenario: List of medications beginning witn "ALC" in alphabetical order and count 10 (10 itmes starts with name = ALC)
    Given a patient with pid "10114V651499" has been synced through the RDK API
    # /resource/writeback/med/searchlist?param={"search":"alc","count":"10"}
    Then the client Search  Medication List begin with ALC for the patient "10114V651499" and "path" in VPR format
    Then a successful response is returned
      And the VPR results contain
        |name |ALCAINE            |
      And the VPR results contain
        |name |ALCOHOL INJ            |
      And the VPR results contain
        |name |ALCOHOL LIQUID,TOP       |
      And the VPR results contain
        |name |ALCOHOL PAD          |
      And the VPR results contain
        |name |ALDACTAZIDE          |
      And the VPR results contain
        |name |ALDACTONE            |
      And the VPR results contain
        |name |ALDESLEUKIN INJ        |
      And the VPR results contain
        |name |ALDOMET            |
      And the VPR results contain
        |name |ALDOMET ester          |
      And the VPR results contain
        |name |ALEMTUZUMAB overreact, SOLN  |

  @MedicationScheduleList @US1963 @onc
  Scenario: Testing random Medication Schedule list
    Given a patient with pid "10114V651499" has been synced through the RDK API
    # /resource/writeback/med/schedule?param={"dfn":"100695","locien":"0"}
    Then the client Search  Medication Schedule for the patient "10114V651499" and "path" in VPR format
    Then a successful response is returned
    And the VPR results contain
      |name |   Q3H   | 
    And the VPR results contain
      |desc |   EVERY 3 HOURS | 
    And the VPR results contain
      |code |   C | 
    And the VPR results contain
      |time |   03-06-09-12-15-18-21-24 | 
    And the VPR results contain     
      |name |   Q4H | 
    And the VPR results contain 
      |desc |   EVERY 4 HOURS | 
    And the VPR results contain   
      |code |   C | 
    And the VPR results contain   
      |time |   0100-0500-0900-1300-1700-2100 | 
    And the VPR results contain     
      |name |   Q6H | 
    And the VPR results contain 
      |desc |   EVERY 6 HOURS | 
    And the VPR results contain 
      |code |   C | 
    And the VPR results contain 
      |time |   03-09-15-21 | 
    And the VPR results contain     
      |name |   Q8H | 
    And the VPR results contain   
      |desc |   EVERY 8 HOURS | 
    And the VPR results contain   
      |code |   C | 
    And the VPR results contain 
      |time |   0500-1300-2100  | 
    And the VPR results contain     
      |name |   QDAY-DIG  | 
    And the VPR results contain   
      |desc |   EVERY DAY AT 1 PM | 
    And the VPR results contain   
      |code |   C | 
    And the VPR results contain 
      |time |   1300  | 
    And the VPR results contain     
      |name |   QID | 
    And the VPR results contain 
      |desc |   FOUR TIMES A DAY  | 
    And the VPR results contain 
      |code |   C | 
    And the VPR results contain 
      |time |   09-13-17-21 | 

  @MedicationByDefaults @US1963 @onc
  Scenario: Selecting Default Medication Name
    Given a patient with pid "10114V651499" has been synced through the RDK API
    # /resource/writeback/med/defaults?param={"oi":"1348","pstype":"X","orvp": 100695,"needpi":"Y", "pkiactiv":"Y"}
    Then the client Search  Default Medication for the patient "10114V651499" and "path" in VPR format
    Then a successful response is returned
    And the VPR results contain
      |type |   display   | 
    And the VPR results contain
      |type |   internal  | 
    And the VPR results contain
      |value|ACETAMINOPHEN TAB |

  @DiscontinuedReason @US2620 @onc
  Scenario: Selecting Non VA Med order to discontinue the order
    # /resource/writeback/med/discontinuereason
    When the Non VA Med discontinue reasons List is requested
    Then a successful response is returned
    And the VPR results contain
      |id|7|
      |name|Duplicate Order |
    And the VPR results contain
      |id|16 |
      |name|Entered in error |
    And the VPR results contain
      |id|17|
      |name|Per Policy |
    And the VPR results contain
      |id|14|
      |name|Requesting Physician Cancelled |
