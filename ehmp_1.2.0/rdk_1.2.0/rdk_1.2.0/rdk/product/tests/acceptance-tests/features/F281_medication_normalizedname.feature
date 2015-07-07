@f281_medication_normalizedname @patient

Feature: F281 - Intervention Gist View

@f281_1_medication @VPR @US3729 @9E7A164

Scenario: A user can request medication information in VPR format through RDK API. User is able to see normalized name of medication.
Given a patient with pid "9E7A;164" has been synced through the RDK API
When the client requests medication for the patient "9E7A;164" in RDK format
Then a successful response is returned
And the client receives 8 result(s)
And the VPR results contain

      | field                               | value                        |
      | uid                                 | urn:va:med:9E7A:164:10248    |
      | normalizedName                      | Nitroglycerin 0.4 MG/ACTUAT Mucosal Spray |
	
