@debug @UserRoles @F457

Feature: F457 - View and update user roles

@F457_Get_Roles_List
Scenario: View array of roles
When the client requests to view all user roles
Then a successful response is returned
And the roles results contain more than 0 records

@F457_Get_User_Roles_before
Scenario: View user roles
When the client requests to view roles for a specific user "urn:va:user:9E7A:10000000266"
Then a successful response is returned
Then the response is "{"data"=>{"roles"=>["standard-doctor", "acc"]}}"

@F457_Update_Roles
Scenario: Update roles
When the client requests to updte user roles with content "{"user":{"uid":"urn:va:user:9E7A:10000000266","roles":["medical","provider"]},"roles":["standard-doctor","acc"]}"
Then a successful response is returned
Then the response is "{"data"=>["standard-doctor", "acc"]}"

@F457_Remove_Roles
Scenario: Remove roles
When the client requests to updte user roles with content "{"user":{"uid":"urn:va:user:9E7A:10000000266","roles":["standard-doctor","acc","medical"]},"roles":[]}"
Then a successful response is returned
Then the response is "{"data"=>[]}"

@F457_Add_Roles
Scenario: Add a new roles
When the client requests to updte user roles with content "{"user":{"uid":"urn:va:user:9E7A:10000000266","roles":[]},"roles":["standard-doctor","acc"]}"
Then a successful response is returned
Then the response is "{"data"=>["standard-doctor", "acc"]}"

@F457_Get_User_Roles_after
Scenario: View user roles
When the client requests to view roles for a specific user "urn:va:user:9E7A:10000000266"
Then a successful response is returned
Then the response is "{"data"=>{"roles"=>["standard-doctor", "acc"]}}"
