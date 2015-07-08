Feature: This user story did no have an associated feature: US1538

@future @US1538
Scenario: Client can request the lab orders in VPR format
    Given a patient with "labs" in multiple VistAs
    #And a patient with pid "11016" has been synced through Admin API
    When the client requests lab orders for the patient "11016V630869" and order "urn:va:order:9E7A:227:16682" in VPR format
    And the client receives 8 VPR VistA result(s)
    And the VPR results contain
      | field                 | panorama_value              |
      | summary               | DOG HAIR ( FREE TEXT )      |