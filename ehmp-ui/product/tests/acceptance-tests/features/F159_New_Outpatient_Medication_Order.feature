@F159_New_Outpatient_Medications_Order @OBE @future
Feature: F159 CPOE - Outpatient Medications (ONC)

#This feature allows an eHMP user, to electronically record, change, and access a non-complex VA Outpatient Medication order.

# Team Andromeda

Background:
	Given user is logged into eHMP-UI
    #Zzzretiredfortyeight,Patient can be used too
	And user searches for and selects "Onehundred,Patient"
	Then Cover Sheet is active
	Then the "patient identifying traits" is displayed with information
		| field			| value 				    |
		| patient name	| Onehundred,Patient 		|

@Add_Outpatient_Medication_1 @US3130 @OBE 
Scenario: Create new outpatient med order for a patient with Clinic Appointments visit. The order must be able to be saved to VistA (Does not include Signature) and verifying results in coversheet
    When user selects Meds Review from Coversheet dropdown
    When the user clicks the "Add Medication Order" button
    Then the modal title is "Location for Current Activity"
    Then if user is provider then it displays in Encounter Provider field
    Then the modal view contains the headers
     | Clinic Appointments, Hospital Admissions, New Visit|
    And the location modal contains button "Cancel"
    And the user clicks on "Clinic Appointments" tab
    And the user selects clinic appt first row "General Medicine"
    Then "General Medicine" should be populated in Encounter Location field
    When the user clicks the "Confirm" button
    Then the modal title is "Add Order"
    And the user clicks on "Outpatient Medication" link
    Then the modal title is "Add Outpatient Medication Order"
    Then the outpatient med panel title is "OUTPATIENT MEDICATIONS"
	Then the modal contains the outpatient Med search input
	Given the user enters in the Med Search "Simvastatin"
	Given the user selects outpatient Med "SIMVASTATIN TAB"
    Then the modal title is "Add Outpatient Medication Order"
    Then the outpatient med panel title is "SIMVASTATIN TAB"
    And the user clicks on "Visit Information" link
    Then the outpatient "Change" button appears
	Given the user has selected a dosage "20MG"
	Given the user has selected a route "ORAL (BY MOUTH)"
	Given the user has selected a schedule "QDAY"
	Then the user entered comments: "Test1"
	Given the user selects "30" days supply
    Given the user selects "30" tablets
    Given the user selects "1" refills
    Given the user selects "window" Radio button for pick up
    #Then the outpatient preview contains text "SIMVASTATIN TAB 20MG"
    #Then the outpatient preview contains text "TAKE ONE TABLET BY MOUTH EVERY DAY Test1"
    #Then the outpatient preview contains text "Quantity: 30 Refills: 1"
    Then the outpatient Med user clicks "Accept Order"
    Then the modal contains successful order numbers

@Add_Outpatient_Medication_2 @US3130 @OBE
Scenario: Create new outpatient med order for a patient with Hospital Admissions visit. The order must be able to be saved to VistA (Does not include Signature) and verifying results in coversheet
    When user selects Meds Review from Coversheet dropdown
    When the user clicks the "Add Medication Order" button
    Then the modal title is "Location for Current Activity"
    Then if user is provider then it displays in Encounter Provider field
    Then the modal view contains the headers
     | Clinic Appointments, Hospital Admissions, New Visit|
    And the location modal contains button "Cancel"
    When the user clicks on "Hospital Admissions" tab
    And the user selects hospital admissions first row "7A Gen Med"
    Then "7A Gen Med" should be populated in Encounter Location field
    When the user clicks the "Confirm" button
    Then the modal title is "Add Order"
    And the user clicks on "Outpatient Medication" link
    Then the modal title is "Add Outpatient Medication Order"
    Then the outpatient med panel title is "OUTPATIENT MEDICATIONS"
    Then the modal contains the outpatient Med search input
    Given the user enters in the Med Search "Lorazepam"
    Given the user selects outpatient Med "LORAZEPAM TAB"
    Then the modal title is "Add Outpatient Medication Order"
    Then the outpatient med panel title is "LORAZEPAM TAB"
    And the user clicks on "Visit Information" link
    Then the outpatient "Change" button appears
    Given the user has selected a dosage "0.5MG"
    Given the user has selected a route "ORAL (BY MOUTH)"
    Given the user has selected a schedule "Q3H"
    Then the user entered comments: "Test2"
    Given the user selects "10" days supply
    Given the user selects "30" tablets
    Given the user selects "2" refills
    Given the user selects "window" Radio button for pick up
    #Then the outpatient preview contains text "LORAZEPAM TAB 0.5MG"
    #Then the outpatient preview contains text "TTAKE ONE TABLET BY MOUTH EVERY 3 HOURS Test2"
    #Then the outpatient preview contains text "Quantity: 30 Refills: 2"
    Then the outpatient Med user clicks "Accept Order"
    Then the modal contains successful order numbers

@Add_Outpatient_Medication_3 @US3813 @OBE
Scenario: Check a warning page appears when a Non-Formulary medicine is selected in outpatient med order.
    When user selects Meds Review from Coversheet dropdown
    When the user clicks the "Add Medication Order" button
    Then the modal title is "Location for Current Activity"
    Then if user is provider then it displays in Encounter Provider field
    Then the modal view contains the headers
     | Clinic Appointments, Hospital Admissions, New Visit|
    And the location modal contains button "Cancel"
    And the user clicks on "Clinic Appointments" tab
    And the user selects clinic appt first row "General Medicine"
    Then "General Medicine" should be populated in Encounter Location field
    When the user clicks the "Confirm" button
    Then the modal title is "Add Order"
    And the user clicks on "Outpatient Medication" link
    Then the modal title is "Add Outpatient Medication Order"
    Then the outpatient med panel title is "OUTPATIENT MEDICATIONS"
    Then the modal contains the outpatient Med search input
    Given the user enters in the Med Search "Sodium Chloride G"
    Given the user selects outpatient Med "SODIUM CHLORIDE GRANULES NF"
    #Then the user gets a warning window
    When the user clicks the "OK" button
    Then the modal title is "Add Outpatient Medication Order"
    Then the outpatient med panel title is "OUTPATIENT MEDICATIONS"
    Then the modal contains the outpatient Med search input
