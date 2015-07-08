@F117
Feature: provide login services.

@site_list
Scenario: Client will be able to retrieve site list without authentication
	When client requests the authentication list without authentication
	Then a successful response is returned
	And the authentication list response contains fields
		| field    | value  |
		| name     | IS_SET |
		| division | IS_SET |
		| siteCode | IS_SET |

@login_cookie
Scenario: Client will be able to log in with cookie
	Given the client has logged in with a cookie
	And the client has requested a restricted resource
	Then a successful response is returned

@refresh
Scenario: Client will be able to maintain authentication after refresh
	Given the client has logged in with a cookie
	And the client has verified it can access a restricted resource
	When the client refreshes the session
	And the client has requested a restricted resource
	Then a successful response is returned

@logout_cookie
Scenario: Client will not be able to access restricted resources after a session is destroyed
	Given the client has logged in with a cookie
	And the client has verified it can access a restricted resource
	When the client destroys the sesion
	And the client has requested a restricted resource
	And a bad request response is returned
