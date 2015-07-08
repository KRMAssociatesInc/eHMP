@sync_priority @unstable
Feature: F142 VX Cache Management and Expiration/Sync Stabilization
           

@f142_1_parioitized @US2001 @US2008 @DE158
Scenario: Client can request sync prioritized sites in RDK
    Given the client requests that the patient with pid "5000000217V519385" be cleared through the RDK API
    And a successful response is returned
    When the client requests load parioitized for the patient "5000000217V519385" base on priority site list in RDK format
      | prioritized_site_list |
      | Kodak                 |
      | Panorama        |
    Then the site "Kodak" should be sync before "DoD"
    Then the site "Panorama" should be sync before "DoD"


@f142_2_parioitized @US2001 @US2008 @DE158 @future
Scenario: Client can request sync prioritized sites in RDK
  Given the client requests that the patient with pid "10101V964144" be cleared through the RDK API
    And a successful response is returned
    When the client requests load parioitized for the patient "10101V964144" base on priority site list in RDK format
      | prioritized_site_list |
      | VLER                |
    Then the site "VLER" should be sync before "Kodak"
    Then the site "VLER" should be sync before "Panorama"


@f142_3_parioitized @US2001 @US2008 @DE158 @future
Scenario: Client can request sync prioritized sites in RDK
  Given the client requests that the patient with pid "10110V004877" be cleared through the RDK API
    And a successful response is returned
    When the client requests load parioitized for the patient "10110V004877" base on priority site list in RDK format
      | prioritized_site_list |
      | DOD                 |

    Then the site "DOD" should be sync before "Kodak"
    Then the site "DOD" should be sync before "Panorama"

