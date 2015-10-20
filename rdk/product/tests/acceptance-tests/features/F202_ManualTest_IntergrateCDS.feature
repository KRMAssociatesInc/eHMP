# Team Europa

@manual

Feature: F202 - Integrate Clinical Decision Support 

@US5471_cdsadvice_list @F202-3 @manual
Scenario: List of advice is returned with successful response
    Given a patient "EIGHT,PATIENT"
    When a GET request is made using postman
    Then the list of advice and reminder is displayed
    And the successful response is returned
  
@US5471_cdsadvice_detail_200 @F202-3 @manual
Scenario: Detail of advice is returned with successful response
    Given a patient "EIGHT,PATIENT"
    When a GET request is made using postman
    Then the detail of advice or reminder is displayed
    And the successful response is returned
    
@US5471_cdsadvice_detail_404 @F202-3 @manual
Scenario: A message is returned with 404 response code
    Given a patient "EIGHT,PATIENT"
    When a GET request is made using postman with random advice id 
    Then the message is returned
    And the 404 response code is returned

@US5471_cdsadvice_detail_404 @F202-3 @manual
Scenario: A message is returned with 400 response code for invalid GET request
    Given a patient "EIGHT,PATIENT"
    When a GET request is made using postman with random advice id 
    Then the message is returned
    And the 400 response code is returned

@US5471_cdsschedule_Get_200 @F202-3 @manual
Scenario: A job is returned with successful response
    Given a patient "EIGHT,PATIENT"
    When a GET request is made using postman
    Then cds job is returned
    And the successful response is returned
    
@US5471_cdsschedule_Get_404 @F202-3 @manual
Scenario: The 404 response code is returned with invalid request
    Given a patient "EIGHT,PATIENT"
    When invalid GET request is made using postman
    Then the 404 response code is returned

@US5471_cdsschedule_Post_201 @F202-3 @manual
Scenario: A message is returned with created response code 201 for POST
    Given a patient "EIGHT,PATIENT"
    When a POST request is made using postman
    Then the message is returned
    And the created response code 201 is returned

@US5471_cdsschedule_Post_400 @F202-3 @manual
Scenario: An error message is returned with 400 response code for POST
    Given a patient "EIGHT,PATIENT"
    When an invalid POST request is made using postman
    Then the error message is returned
    And the 400 response code is returned

@US5471_cdsschedule_Put_200 @F202-3 @manual
Scenario: A message is returned with 200 response code for PUT
    Given a patient "EIGHT,PATIENT"
    When a PUT request is made using postman
    Then the message is returned
    And the successful response is returned

@US5471_cdsschedule_Put_400 @F202-3 @manual
Scenario: An error message is returned with 400 response code for PUT
    Given a patient "EIGHT,PATIENT"
    When an invalid PUT request is made using postman
    Then the error message is returned
    And the 400 response code is returned

@US5471_cdsschedule_Delete_200 @F202-3 @manual
Scenario: A message is returned with 200 response code for DELETE
    Given a patient "EIGHT,PATIENT"
    When a DELETE request is made using postman
    Then the message is returned
    And the successful response is returned

@US5471_cdsschedule_Delete_404 @F202-3 @manual
Scenario: The 404 response code is returned with invalid request for DELETE
    Given a patient "EIGHT,PATIENT"
    When invalid DELETE request is made using postman for new job
    Then the 404 response code is returned

@US5471_cdsworkproduct_Post_201 @F202-3 @manual
Scenario: A message is returned with created response code 201 for work product
    Given a patient "EIGHT,PATIENT"
    When a POST request is made using postman to create a work product
    Then the message is returned
    And the created response code 201 is returned

@US5471_cdsworkproduct_Get_200 @F202-3 @manual
Scenario: A work product is returned with successful response
    Given a patient "EIGHT,PATIENT"
    When a GET request is made using postman for work product
    Then work product is returned
    And the successful response is returned

@US5471_cdsworkproductslist_Get_200 @F202-3 @manual
Scenario: A work products list is returned with successful response
    Given a patient "EIGHT,PATIENT"
    When a GET request is made using postman for work products list
    Then work products list is returned
    And the successful response is returned

@US5471_cdsworkproduct_Get_404 @F202-3 @manual
Scenario: A message is returned with 404 response code when requesting work product with invalid id
    Given a patient "EIGHT,PATIENT"
    When a GET request is made using postman with invalid work product id 
    Then the message is returned
    And the 404 response code is returned

@US5471_cdsworkproduct_Put_200 @F202-3 @manual
Scenario: A message is returned with 200 response code for PUT work product
    Given a patient "EIGHT,PATIENT"
    When a PUT request is made using postman to update a work product
    Then the message is returned
    And 200 response code is returned

@US5471_cdsworkproduct_Put_404 @F202-3 @manual
Scenario: A message is returned with 404 response code when requesting to update work product with invalid id
    Given a patient "EIGHT,PATIENT"
    When a PUT request is made using postman with invalid work product id 
    Then the message is returned
    And the 404 response code is returned

@US5471_cdsworkproduct_Delete_200 @F202-3 @manual
Scenario: A message is returned with 200 response code for Delete work product
    Given a patient "EIGHT,PATIENT"
    When a DELETE request is made using postman to delete a work product
    Then the message is returned
    And 200 response code is returned

@US5471_cdsworkproduct_Put_404 @F202-3 @manual
Scenario: A message is returned with 404 response code when requesting to delete work product with invalid id
    Given a patient "EIGHT,PATIENT"
    When a DELETE request is made using postman with invalid work product id 
    Then the message is returned
    And the 404 response code is returned

@US5471_cdssubscription_Get_200 @F202-3 @manual
Scenario: Subscriptions are returned with successful response
    Given a patient "EIGHT,PATIENT"
    When a GET request is made using postman for subscriptions
    Then all subscriptions are returned
    And the successful response is returned

@US5471_cdssubscriptions_Put_200 @F202-3 @manual
Scenario: A message is returned with 200 response code for PUT subscriptions
    Given a patient "EIGHT,PATIENT"
    When a PUT request is made using postman to update subscriptions
    Then the message is returned
    And 200 response code is returned

@US5471_cdsworkproduct_Delete_200 @F202-3 @manual
Scenario: A message is returned with 200 response code for Delete subscriptions
    Given a patient "EIGHT,PATIENT"
    When a DELETE request is made using postman to delete subscriptions
    Then the message is returned
    And 200 response code is returned

@US8534_vitals_usecase @manual
Scenario: Pass historic height, weight and date in vitals use case
  Given a patient "EIGHT,PATIENT"
  When a POST request "http://10.2.2.49:8080/cds-results-service/cds/invokeRules" is made for vitals via postman with context "{"context":{"location":{"entityType":"Location","id":"Location1","name":"Test Location"},"subject":{"entityType":"Subject","id":"9E7A;253","name":"TestSubject"},"user":{"entityType":"User","id":"Id1","name":"Tester"}},"parameters":{"Weight":{"resourceType":"Observation","code":{"coding":[{"system":"http://loinc.org","code":"29463-7"}]},"valueQuantity":{"value":295,"units":"lb"},"issued":"2015-06-11T13:24:21.080-07:00","comments":"Comment","status":"preliminary"},"Height":{"resourceType":"Observation","code":{"coding":[{"system":"http://loinc.org","code":"8302-2"}]},"valueQuantity":{"value":95,"units":"inches"},"issued":"2004-03-30T21:54:42-00:00","comments":"Comment","status":"preliminary"}},"target":{"intentsSet":["VitalsValidation"],"mode":"Normal","type":"Direct"}}"
  Then advices are returned in the response for height and weight
