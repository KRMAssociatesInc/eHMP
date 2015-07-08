  @AllergiesDoD_rest @US980 
  Scenario: Client can request allergies
    Given a patient with "allergies" in multiple VistAs and in DoD
    When the client requests allergies for the patient "10108"
    Then eHMP returns "3" DoD result(s)
    And eHMP returns "4" VistA result(s)
    And the results contain data group
      | field            | value                                      |
      | summary          | PENICILLIN                                 |
      | uid              | urn:va:allergy:9E7A:3:751                  |
      | drugClasses.name | PENICILLINS AND BETA-LACTAM ANTIMICROBIALS |
      | reactions.name   | ITCHING,WATERING EYES                      |
    And the results contain data group
      | field          | value                     |
      | summary        | CHOCOLATE                 |
      | uid            | urn:va:allergy:9E7A:3:874 |
      | reactions.name | DIARRHEA                  |
    And the results contain data group
      | field             | value                            |
      | facilityCode      | DOD                              |
      | kind              | Allergy / Adverse Reaction       |
      | summary           | Tetracyclines                    |
      | uid               | urn:va:allergy:DOD:0000000003:1000000341|
      | products.name     | Tetracyclines                    |
      | comments.comment  | Rash                             |
    And the results contain data group
      | field             | value                            |
      | facilityCode      | DOD                              |
      | kind              | Allergy / Adverse Reaction       |
      | summary           | Penicillins                      |
      | uid               | urn:va:allergy:DOD:0000000003:1000000340|
      | products.name     | Penicillins                      |
      | comments.comment  | Vomiting                         |
    And the results contain data group
      | field             | value                            |
      | facilityCode      | DOD                              |
      | kind              | Allergy / Adverse Reaction       |
      | summary           | Iodine Containing Agents         |
      | uid               | urn:va:allergy:DOD:0000000003:1000000342|
      | products.name     | Iodine Containing Agents         |
      | comments.comment  | Nausea                           |

 @AllergiesDoD_view @UI @debug @US980
Scenario: User can view requested allergies in the eHMP UI
  Given user has successfully logged into HMP
  And a patient with allergies in multiple VistAs and in DoD
  When user requests allergies for that patient
  Then the eHMP UI displays allergy "Chocolate" with details
    | field              | value             |
    | Causative agent    | Chocolate         |
    | Nature of reaction | ALLERGY           |
    | Signs/Symptoms     | Diarrhea          |
    | Drug Classes       |                   |
    | Originator         | Provider,One      |
    | Originated         | 17-Dec-2007 15:13 |
  And the eHMP UI displays allergy "Penicillin" with details
    | field              | value                                      |
    | Causative agent    | Penicillin                                 |
    | Nature of reaction | PHARMACOLOGIC                              |
    | Signs/Symptoms     | Itching,Watering Eyes                      |
    | Drug Classes       | PENICILLINS AND BETA-LACTAM ANTIMICROBIALS |
    | Originator         | Vehu,Eight                                 |
    | Originated         | 17-Mar-2005 20:09                          |
  Then the user closes the posting panel

@AllergiesDoD_search @UI @debug @US980
Scenario: User can search for allergies in the eHMP UI
  Given user has successfully logged into HMP
  And a patient with allergies in multiple VistAs and in DoD
  When user searches for "allergy / adverse reaction" for that patient
  Then search results displays "1" titles
  When user opens title "Allergy / Adverse Reaction"
  Then search results include
    | summary_title | summary_date      |
    | PENICILLIN    | 17-Mar-2005 20:09 |
    | CHOCOLATE     | 17-Dec-2007 15:13 |
