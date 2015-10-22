@DE1323

Feature: DE1323: Active user endpoint is not returning all active users in response

@DE1323_1 @debug
Scenario: Osync active users list is undefined
  Given an undefined active users list
  When the client requests authentication with accessCode "pu1234" and verifyCode "pu1234!!" and site "9E7A" and contentType "application/json"
  Then a successful response is returned
