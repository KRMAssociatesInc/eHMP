@AnatomicPathologyDoD @US1417
Feature: F116 Return of DoD Anatomic Pathology

#This feature item returns DoD Anatomic Pathology

Background:
  Given a patient with pid "10110V004877" has been synced through Admin API

@pathology @single
Scenario: Client can request anatomic pathology
  Given a patient with anatomic pathology in multiple VistAs and in DoD
  When the client requests anatomic pathology for the patient "10110V004877" in VPR format
  Then the client receives 14 VPR VistA result(s)
  Then the client receives 8 VPR DoD result(s)
  And the VPR results contain "accession"
    | field          | value                                  |
    | uid            | urn:va:lab:DOD:0000000008:20080523160000_080523-BM-15-AP   |
    | facilityCode   | DOD                                    |
    | observed       | 20080523160000                         |
    | statusName     | COMPLETE                               |
    | localId        | 080523 BM 15^AP                        |
    | pid            | CONTAINS ;0000000008                   |
    | kind           | Pathology                              |
    | categoryName   | Pathology			                  |           
               
