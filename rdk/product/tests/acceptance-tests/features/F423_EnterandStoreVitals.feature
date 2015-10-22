#Team Orion

Feature: F423 - Enter and Store Vitals

@US7295 @F423-1 @F423-2 @F423-3 @future @US7965
Scenario: Server Internal error message received when the RDK post data is without dateTime
	Given a patient "EIGHT,IMAGEPATIENT"
	When a request data was sent for patient "5000000317V387446" without dateTime "{"param":{"dfn":"3","locIEN":"67","vitals":[{"fileIEN":"1","reading":"80/20","qualifiers":["23","59","100"]},{"fileIEN":"3","reading":"57","qualifiers":["47","50"]}]}}"
	Then server status error returned

@US7295 @F423-1 @F423-2 @F423-3 @future @US7965
Scenario: success message received when the RDK post data are good 
	Given a patient "EIGHT,IMAGEPATIENT"
	When a request data was sent for patient "5000000317V387446" with content "{"dateTime":"20150511","dfn":"3","locIEN":"67","vitals":[{"fileIEN":"1","reading":"80/20","qualifiers":["23","59","100"]},{"fileIEN":"3","reading":"57","qualifiers":["47","50"]}]}"
	Then the vitals data stored success

@US7295 @F423-1 @F423-2 @F423-3 @future @US7965
Scenario: Server Internal error message received when the RDK post data is without patient dfn
	Given a patient "EIGHT,IMAGEPATIENT"
	When a request data was sent for patient "5000000317V387446" without dfn "{"dateTime":"20150511","locIEN":"67","vitals":[{"fileIEN":"1","reading":"80/20","qualifiers":["23","59","100"]},{"fileIEN":"3","reading":"57","qualifiers":["47","50"]}]}"
	Then server status error returned

# @US7295 @F423-1 @F423-2 @F423-3 @future @US7965
# Scenario: Server Internal error message received when the RDK post data is without duz
	# Given a patient "EIGHT,IMAGEPATIENT"
	# When a request data was sent for patient "5000000317V387446" without duz "{"dateTime":"20150511","dfn":"3","locIEN":"67","vitals":[{"fileIEN":"1","reading":"80/20","qualifiers":["23","59","100"]},{"fileIEN":"3","reading":"57","qualifiers":["47","50"]}]}"
	# Then server status error returned

@US7295 @F423-1 @F423-2 @F423-3 @future @US7965
Scenario: Server Internal error message received when the RDK post data is without locIEN
	Given a patient "EIGHT,IMAGEPATIENT"
	When a request data was sent for patient "5000000317V387446" without locIEN "{"dateTime":"20150511","dfn":"3","duz":"10000000224","vitals":[{"fileIEN":"1","reading":"80/20","qualifiers":["23","59","100"]},{"fileIEN":"3","reading":"57","qualifiers":["47","50"]}]}"
	Then server status error returned

@US7295 @F423-1 @F423-2 @F423-3 @future @US7965
Scenario: Server Internal error message received when the RDK post data with invalid dateTime
	Given a patient "EIGHT,IMAGEPATIENT"
	When a request data was sent for patient "5000000317V387446" with bad dateTime "{"dateTime":"BadDateTime","dfn":"3","locIEN":"67","vitals":[{"fileIEN":"1","reading":"80/20","qualifiers":["23","59","100"]},{"fileIEN":"3","reading":"57","qualifiers":["47","50"]}]}"
	Then server status error returned
