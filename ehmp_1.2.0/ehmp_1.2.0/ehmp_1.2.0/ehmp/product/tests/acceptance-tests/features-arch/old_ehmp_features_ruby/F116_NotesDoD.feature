@NotesDoD @single
Feature: F116 Return and display of and clinical notes with DoD data

  Background:
    Given a patient with pid "10108V420871" has been synced through Admin API

  @notes
  Scenario: Client can request notes
    Given a patient with "DoD clinical notes" in multiple VistAs and in DoD
    When the client requests document for the patient "10108V420871" in VPR format
    Then the client receives 34 VPR VistA result(s)
    Then the client receives 17 VPR DoD result(s)
    And the VPR results contain "document"
      | field            | value                                                         |
      | summary          | Procedure Note (Provider) Document                            |
      | uid              | urn:va:document:DOD:0000000003:1000000648                     |
      | kind             | Procedure Note (Provider) Document                            |
      | author           | BHIE, USERONE                                                 |
      | dodComplexNoteUri| CONTAINS /1000000648.html           |
      | facilityCode     | DOD                                                           |
      | facilityName     | DOD                                                           |
      | documentTypeName | Procedure Note (Provider) Document                            |
      | localTitle       | Procedure Note (Provider) Document                            |
      | status           | completed                                                     |
      | statusName       | completed                                                     |
    
  @notes_complex_note
  Scenario: Client can request complex DoD note
    Given a patient with "DoD clinical notes" in multiple VistAs and in DoD
    When the client requests document "394537413b33", "1000010655", "html"
    Then a successful response is returned

