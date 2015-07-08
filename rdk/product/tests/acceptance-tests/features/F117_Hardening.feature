Feature: create a web application to be used as point-of-care healthcare application

@US1489
Scenario: Unauthorized Client receives a forbidden response when requesting user info
	When the client "9E7A;xx1234" requests user info 
	Then an unauthorized response is returned

@US1489
Scenario: Authorized Client receives data when requesting user info
	When the client "9E7A;pu1234" requests user info 
	Then a successful response is returned
	And the RDK user info response contains
	  | field     | value       |
      | firstname | PANORAMA    |
      | lastname  | USER        |
      | facility  | PANORAMA    |
