Feature: F299 - Global Timeline Date Filter

#This is to complete the full timeline resource to support the full timeline and sparkline for encounters.
#http://10.4.4.105:8888/resource/globaltimeline?pid=9E7A;100022
#test patient is BCMA,EIGHT, patient has one admission and one Visit

@F299_global_timeline_history @US4119 @TA13943 @patient @9E7A100022 @F299-3.8
Scenario: For a patient full history of encounters is returned correctly

	Given the client requests visits for the patient "9E7A;100022"
	Then a successful response is returned
  Then wait 3 seconds
  And the results contain

      | name                            | value                   |
      | inpatient.kind                  | Admission               |
      | inpatient.stay.arrivalDateTime  | 20020130114524          |
      | inpatient.dateTime              | 20020130114524          |

	And the results contain

      | name                           | value                      |
      | inpatient.kind                 | Visit                      |
      | inpatient.dateTime             | 20020415111400             |
