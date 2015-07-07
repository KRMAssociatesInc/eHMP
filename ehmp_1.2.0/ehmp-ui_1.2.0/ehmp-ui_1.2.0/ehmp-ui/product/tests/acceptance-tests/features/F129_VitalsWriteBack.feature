@F129 @VitalsWriteBack @onc

Feature: F129 - Vitals (Writeback)

#POC: Team Saturn

Background:
	Given user is logged into eHMP-UI
	And user searches for and selects "thirteen,patient"
	Then Cover Sheet is active
	Then the "patient identifying traits" is displayed with information
		| field			| value 				|
		| patient name	| Thirteen,Patient 		|
	Then the user selects a visit

@VitalsWriteBack_DateTimeValidation @US1958 @onc 
Scenario: Change Date/Time Measured to future time.
	When the Vitals Write Back user Clicks the "Plus" button
	Then the Vitals modal title is "Add Vital Signs"
	And the Vitals Accept button is "disabled"
	Then the Vitals Write Back user enters Blood Pressure "120/70"
	Then the Vitals Write Back user enters Pulse "78"
	And the Vitals Accept button is "enabled"
	When the Vitals Write Back user enters a future time
	Then the client side validation time error displays "Future date not permitted"
	And the Vitals Accept button is "disabled"
	When the Vitals Write Back user enters past time
	And the Vitals Accept button is "enabled"
	Then the Vitals Write Back user clicks the cancel button to exit the vitals modal

@VitalsWriteBack_InvalidTimeFormat @US1958 @onc
Scenario: Change Time Measured to invalid format
	When the Vitals Write Back user Clicks the "Plus" button
	Then the Vitals modal title is "Add Vital Signs"
	And the Vitals Accept button is "disabled"
	Then the Vitals Write Back user enters Blood Pressure "4/4"
	Then the Vitals Write Back user enters Pulse "80"
	And the Vitals Accept button is "enabled"
	When the Vitals Write Back user enters invalid time
	Then the client side validation time error displays "Time format is HH:MM a/p"
	And the Vitals Accept button is "disabled"
	When the Vitals Write Back user enters past time
	And the client side validation time error displays ""
	And the Vitals Accept button is "enabled"
	Then the Vitals Write Back user clicks the cancel button to exit the vitals modal

@VitalsWriteBack_ValidationErrors @US1958 @onc
Scenario: Vital values have validation errors
	When the Vitals Write Back user Clicks the "Plus" button
	Then the Vitals modal title is "Add Vital Signs"
	Then the Vitals Write Back user enters Blood Pressure "301"
	Then the Vitals Write Back user enters Pulse "500"
	Then the Vitals Write Back user enters Respiration "900"
	Then the Vitals Write Back user enters Temperature "300"
	Then the Vitals Write Back user enters Pulse Oximetry "900"
	Then the Vitals Write Back user enters Height "900"
	Then the Vitals Write Back user enters Weight "1900"
	Then the Vitals Write Back user enters CVP "200"
	Then the Vitals Write Back user enters Circumference "999"
	And Add Vitals modal contains error "nnn/nnn 0 to 300" for "blood pressure"
	And Add Vitals modal contains error "0 to 300" for "pulse"
	And Add Vitals modal contains error "0 to 100" for "respiration"
	And Add Vitals modal contains error "45 to 120" for "temperature"
	And Add Vitals modal contains error "0 to 100" for "pulse oximetry"
	And Add Vitals modal contains error "10 to 100" for "height"
	And Add Vitals modal contains error "0 to 1500" for "weight"
	And Add Vitals modal contains error "-13.6 to 13.6" for "CVP"
	And Add Vitals modal contains error "1 to 200" for "circumference"
	And the Vitals Accept button is "disabled"
	Then the Vitals Write Back user clicks the cancel button to exit the vitals modal

@VitalsWriteBack_PatientOnPass @US1958 @onc
Scenario: Add vitals using patient on pass
	When the Vitals Write Back user Clicks the "Plus" button
	Then the Vitals modal title is "Add Vital Signs"
	Then the Vitals Write Back user Clicks the "Patient on Pass" button
	And the Vitals Write Back user Clicks the "Accept" button

@VitalsWriteBack_Unavailable @US1958 @onc
Scenario: Add vitals with unavailable flag
	When the Vitals Write Back user Clicks the "Plus" button
	Then the Vitals modal title is "Add Vital Signs"
	Then the Vitals Write Back user selects unavailable for all vitals
	When the Vitals Write Back user Clicks the "Accept" button
	And Vitals applet contains "Unavailable" for blood pressure
	And Vitals applet contains "Unavailable" for respiration
	And Vitals applet contains "Unavailable" for pulse
	And Vitals applet contains "Unavailable" for temperature
	And Vitals applet contains "Unavailable" for pulse oximetry
	And Vitals applet contains "Unavailable" for pain
	And Vitals applet contains "Unavailable" for weight
	
@VitalsWriteBack_Refused @US1958 @onc
Scenario: Add vitals with refused flag
	When the Vitals Write Back user Clicks the "Plus" button
	Then the Vitals modal title is "Add Vital Signs"
	Then the Vitals Write Back user selects refused for all vitals
	When the Vitals Write Back user Clicks the "Accept" button
	And Vitals applet contains "Refused" for blood pressure
	And Vitals applet contains "Refused" for respiration
	And Vitals applet contains "Refused" for pulse
	And Vitals applet contains "Refused" for temperature
	And Vitals applet contains "Refused" for pulse oximetry
	And Vitals applet contains "Refused" for pain
	And Vitals applet contains "Refused" for weight

@VitalsWriteBack_AddVitals @US1958 @onc
Scenario: Add Valid Readings for All Vitals
	When the Vitals Write Back user Clicks the "Plus" button
	Then the Vitals modal title is "Add Vital Signs"
	Then the Vitals Write Back user enters Blood Pressure "4/4"
	Then the Vitals Write Back user enters Pulse "80"
	Then the Vitals Write Back user enters Respiration "20"
	Then the Vitals Write Back user enters Temperature "99"
	Then the Vitals Write Back user enters Pulse Oximetry "33"
	Then the Vitals Write Back user enters Pain "4"
	Then the Vitals Write Back user enters Weight "150"
	When the Vitals Write Back user Clicks the "Accept" button
	And Vitals applet contains "4/4" for blood pressure
	And Vitals applet contains "80" for pulse
	And Vitals applet contains "20" for respiration
	And Vitals applet contains "99" for temperature
	And Vitals applet contains "33" for pulse oximetry
	And Vitals applet contains "4" for pain
	And Vitals applet contains "150" for weight

@VitalsWriteBack_AddVitalsWithRandomSelections @US1958 @onc
Scenario: Add Blood Pressure Vitals
	When the Vitals Write Back user Clicks the "Plus" button
	Then the Vitals modal title is "Add Vital Signs"
	Then the Vitals Write Back user enters Blood Pressure "5/4"
	When the Vitals Write Back user clicks "Blood Pressure" qualifier button
	Then the Vitals Write Back user selects Blood Pressure "R Arm" qualifier
	Then the Vitals Write Back user selects Blood Pressure "Palpated" qualifier
	Then the Vitals Write Back user selects Blood Pressure "Sitting" qualifier
	Then the Vitals Write Back user selects Blood Pressure "Adult" qualifier
	#Then the Vitals Write Back user selects unavailable for Temperature and refuse for pain
	Then the Vitals Write Back user selects refuse for Respiration
	When the Vitals Write Back user Clicks the "Accept" button
	And Vitals applet contains "5/4" for blood pressure
	And Vitals applet contains "Refused" for respiration
	