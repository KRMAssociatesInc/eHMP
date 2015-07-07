@timeline @US5650 @vxsync @patient

Feature: F564 - Encounters Applet Enhancements

@F295__timeline_Admitting_Discharge_Diagnosis @F564-1 @F564-2 @VPR @US5650 @9E7A8

Scenario: Timeline: Add additional data types Admitting and Discharge diagnosis for adminsion deatail view
Given a patient with pid "9E7A;8" has been synced through the RDK API
When the client requests timeline for the patient "9E7A;8" in RDK format
Then a successful response is returned
And the client receives 1221 result(s)
And the VPR results contain
      | field                        | value                           |
      | uid                          | urn:va:visit:9E7A:8:H493        |
      | dischDiagn.admissionUid      | urn:va:visit:9E7A:8:H493        |
      | dischDiagn.arrivalDateTime   | 19910904094159                  |
      | dischDiagn.dischargeDateTime | 199201281600                    |
      | dischDiagn.drg               | 470                             |
      | dischDiagn.facilityCode      | 515.6                           |
      | dischDiagn.facilityName      | TROY                            |
      | dischDiagn.icdCode           | urn:icd:305.02                  |
      | dischDiagn.icdName           | ALCOHOL ABUSE-EPISODIC          |
      | dischDiagn.lastUpdateTime    | 19920128160000                  |
      | dischDiagn.localId           | 130;70;DXLS                     |
      | dischDiagn.pid               | 9E7A;8                          |
      | dischDiagn.principalDx       | true                            |
      | dischDiagn.stampTime         | 19920128160000                  |
      | dischDiagn.uid               | urn:va:ptf:9E7A:8:130;70;DXLS   |

