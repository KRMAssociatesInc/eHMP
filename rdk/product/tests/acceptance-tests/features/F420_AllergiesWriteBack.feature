#Team Orion

Feature: F420 - Allergies Write-back in the new framework

@US8024 @F420-01 @future
Scenario: success message will be received when the RDK post data are good 
	Given a patient "ELEVEN,PATIENT"
	When the request data was sent for patient "10111V183702" with content "{"allergyName":"AMPICILLIN^79;PSNDF(50.6,","dfn":"3",  "natureOfReaction":"A^ALLERGY","comment":"This is a test comment","severity":"1","eventDateTime":"20150120114900","name":"CHEESE",    "IEN":"20","location":"GMRD(120.82,","historicalOrObserved":"o^OBSERVED","observedDate":"201501200100","symptoms":[{"IEN":"173",  "name":"STROKE","dateTime":"201501200200","symptomDate":"01/20/2015","symptomTime":"02:00 a"}]}"
	Then the allergy data is stored successsully

@US8024 @F420-01 @future
Scenario: Error message will be received when the RDK post data are missing allergy's name
	Given a patient "ELEVEN,PATIENT"
	When the request data was sent for patient "10111V183702" with content "{"dfn":"3","natureOfReaction":"A^ALLERGY","comment":"This is a test comment","severity":"1","eventDateTime":"20150120114900","name":"CHEESE","IEN":"20","location":"GMRD(120.82,","historicalOrObserved":"o^OBSERVED","observedDate":"201501200100","symptoms":[{"IEN":"173", "name":"STROKE","dateTime":"201501200200","symptomDate":"01/20/2015","symptomTime":"02:00 a"}]}"
	Then the server status error code returned

@US8024 @F420-01 @future
Scenario: Error message will be received when the RDK post data are missing dfn
	Given a patient "ELEVEN,PATIENT"
	When the request data was sent for patient "10111V183702" with content "{"allergyName":"AMPICILLIN^79;PSNDF(50.6,", "natureOfReaction":"A^ALLERGY","comment":"This is a test comment","severity":"1","eventDateTime":"20150120114900","name":"CHEESE",    "IEN":"20","location":"GMRD(120.82,","historicalOrObserved":"o^OBSERVED","observedDate":"201501200100","symptoms":[{"IEN":"173",  "name":"STROKE","dateTime":"201501200200","symptomDate":"01/20/2015","symptomTime":"02:00 a"}]}"
	Then the server status error code returned

@US8024 @F420-01 @future
Scenario: Error message will be received when the RDK post data are missing  nature Of Reaction
	Given a patient "ELEVEN,PATIENT"
	When the request data was sent for patient "10111V183702" with content "{"allergyName":"AMPICILLIN^79;PSNDF(50.6,","dfn":"3","comment":"This is a test comment","severity":"1","eventDateTime":"20150120114900","name":"CHEESE",    "IEN":"20","location":"GMRD(120.82,","historicalOrObserved":"o^OBSERVED","observedDate":"201501200100","symptoms":[{"IEN":"173",  "name":"STROKE","dateTime":"201501200200","symptomDate":"01/20/2015","symptomTime":"02:00 a"}]}"
	Then the server status error code returned

@US8024 @F420-01 @future
Scenario: Error message will be received when the RDK post data are missing Severity
	Given a patient "ELEVEN,PATIENT"
	When the request data was sent for patient "10111V183702" with content "{"allergyName":"AMPICILLIN^79;PSNDF(50.6,","dfn":"3",  "natureOfReaction":"A^ALLERGY","comment":"This is a test comment","eventDateTime":"20150120114900","name":"CHEESE",    "IEN":"20","location":"GMRD(120.82,","historicalOrObserved":"o^OBSERVED","observedDate":"201501200100","symptoms":[{"IEN":"173",  "name":"STROKE","dateTime":"201501200200","symptomDate":"01/20/2015","symptomTime":"02:00 a"}]}"
	Then the server status error code returned

@US8024 @F420-01 @future
Scenario: Error message will be received when the RDK post data are missing observed Date
	Given a patient "ELEVEN,PATIENT"
	When the request data was sent for patient "10111V183702" with content "{"allergyName":"AMPICILLIN^79;PSNDF(50.6,","dfn":"3",  "natureOfReaction":"A^ALLERGY","comment":"This is a test comment","severity":"1","eventDateTime":"20150120114900","name":"CHEESE",    "IEN":"20","location":"GMRD(120.82,","historicalOrObserved":"o^OBSERVED","symptoms":[{"IEN":"173",  "name":"STROKE","dateTime":"201501200200","symptomDate":"01/20/2015","symptomTime":"02:00 a"}]}"
	Then the server status error code returned

@US8024 @F420-01 @future
Scenario: Error message will be received when the RDK post data are missing  historicalOrObserved
	Given a patient "ELEVEN,PATIENT"
	When the request data was sent for patient "10111V183702" with content "{"allergyName":"AMPICILLIN^79;PSNDF(50.6,","dfn":"3",  "natureOfReaction":"A^ALLERGY","comment":"This is a test comment","severity":"1","eventDateTime":"20150120114900","name":"CHEESE",    "IEN":"20","location":"GMRD(120.82,","observedDate":"201501200100","symptoms":[{"IEN":"173",  "name":"STROKE","dateTime":"201501200200","symptomDate":"01/20/2015","symptomTime":"02:00 a"}]}"
	Then the server status error code returned

@US8024 @F420-01 @future
Scenario: Error message will be received when the RDK post data are missing eventDateTime
	Given a patient "ELEVEN,PATIENT"
	When the request data was sent for patient "10111V183702" with content "{"allergyName":"AMPICILLIN^79;PSNDF(50.6,","dfn":"3",  "natureOfReaction":"A^ALLERGY","comment":"This is a test comment","severity":"1","name":"CHEESE","IEN":"20","location":"GMRD(120.82,","historicalOrObserved":"o^OBSERVED","observedDate":"201501200100","symptoms":[{"IEN":"173",  "name":"STROKE","dateTime":"201501200200","symptomDate":"01/20/2015","symptomTime":"02:00 a"}]}"
	Then the server status error code returned