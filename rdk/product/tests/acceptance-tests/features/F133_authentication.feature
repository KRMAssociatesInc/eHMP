@F133_authentication_api
Feature: F133 - SDK VistA Write-Back Architecture

#Authentication Resource Server

#Team Andromeda

  @F133_authentication_api_1 @US1835
  Scenario Outline: When a user does authentication, then this resource server is called
    When the client requests authentication with accessCode "<accesscode>" and verifyCode "<verifycode>" and site "<site>" and contentType "<contenttype>"
    Then a successful response is returned
    And the authentication result contains
      | field       | value                       |
      | firstname   | PANORAMA                    |
      | lastname    | USER                        |
      | facility    | PANORAMA                    |
      | title       | Clinician                   |
      | site        | 9E7A                        |
      Examples:
      | accesscode    | verifycode   | site       | contenttype         |
      | pu1234        | pu1234!!     | 9E7A       | application/json    |

  @F133_authentication_api_2 @US2990
  Scenario Outline: Authentication should fail if both CPRS tab settings are false
    When the client requests authentication with accessCode "<accesscode>" and verifyCode "<verifycode>" and site "<site>" and contentType "<contenttype>"
    #Then an unauthorized response is returned
    Then a forbidden response is returned
    And the authentication response contains error message
      | field       | value          |
      | error         | <error>        |
      Examples:
      | accesscode    | verifycode   | site       | contenttype         | error                                           |
      | lu1234        | lu1234!!     | 9E7A       | application/json    | User is not authorized to access this system.   |
