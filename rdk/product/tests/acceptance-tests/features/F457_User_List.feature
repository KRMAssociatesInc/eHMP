@UserList @F457

Feature: F457 - View Listing of Users

@F457_Get_User_List
Scenario: View listing of Users
When the client requests to view list users
Then a successful response is returned
Then the results contains all required fields