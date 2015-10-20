@debug @future
Feature: F518 - Integrate Clinical Decision Support 

@US8390_htnrule
Scenario: Create patient list
    Given user sends request to create patient list with content "{"name":"TestPatientList","definition":{"name":"TestPatientList","description":"user defined description of this definition template","expression":"{and: [ {or: ['A.A','B.B'], {'A.A'} ]}","date":"2015-02-27T20:33:41.308Z","scope":"private","owner":"unknown"}}"
    Then a successful response is returned for created
    And the patient list id is returned
    And user adds a patient in the patient list
    And a successful response is returned
    And the cdsjob is scheduled for patient list with content "{"description":"A Test job from the unit tests","disabled":false,"execution":{"baseContext":{"location":{"codeSystem":null,"entityType":"Location","id":null,"name":null,"type":null},"specialty":{"codeSystem":null,"entityType":"Specialty","id":null,"name":null,"type":null},"subject":{"codeSystem":null,"entityType":"Subject","id":null,"name":null,"type":null},"user":{"codeSystem":"VA:DUZ","entityType":"User","id":"9E7A:10000000255","name":"USER PANORAMA","type":"provider"}},"jobId":null,"subjectIds":null,"subjectListReferences":[{"id":"TestPatientList","type":"Patient"}],"target":{"intentsSet":["HTN"],"mode":"Normal","perceivedExecutionTime":null,"supplementalMappings":null,"type":"Background"}},"lastRun":1429161765119,"name":"TestPatientList","owner":{"codeSystem":"VA:DUZ","entityType":"User","id":"9E7A:10000000255","name":"USER PANORAMA","type":"provider"}}"
    And a successful response is returned for created
    When a Hypertension rule is ran for patient list
    Then a workproduct is created for Hypertension
    And a successful response is returned

@US8390_patientlist_CRUD
Scenario: Perform CRUD on patient list
    Given user sends request to create patient list with content "{"name":"Testlist","definition":{"name":"Testlist","description":"user defined description of this definition template","expression":"{and: [ {or: ['A.A','B.B'], {'A.A'} ]}","date":"2015-02-27T20:33:41.308Z","scope":"private","owner":"unknown"}}"
    Then a successful response is returned for created
    And the patient list id is returned
    And user sends GET request for a created patient list
    And a successful response is returned
#    And user sends PUT request to update patient list with content "{"name":"Testlist","definition":{"name":"Testlistupdated","description":"This is updated list","expression":"{and: [ {or: ['A.A','B.B'], {'A.A'} ]}","date":"2015-02-27T20:33:41.308Z","scope":"private","owner":"unknown"}}"
#    And a successful response is returned
    And user sends DELETE request to delete a patient list
    And a successful response is returned
    
@US8390_workproducts_CRUD @US8161
Scenario: Perform CRUD on work products 
    Given user sends request to create a work product with content "{"categories":[419192003],"context":{"location":{"codeSystem":"VA:Location","entityType":"Location","id":"2883","name":"ClinicOne","type":"ClinicName"},"specialty":{"codeSystem":"VA:Specialty","entityType":"Specialty","id":"FM","name":"Family Medicine","type":"Speciality"},"subject":{"codeSystem":"VA:UniversalId","entityType":"Subject","id":"5000000317V387446","name":null,"type":"Patient"},"user":{"codeSystem":"VA:Provider","entityType":"User","id":"unitTestUserId","name":"TEST,USER","type":"Provider"}},"duplicateCheckKey":{"checkSum":"","subject":{"codeSystem":"VA:UniversalId","entityType":"Subject","id":"5000000317V387446","name":null,"type":"Patient"},"type":"advice"},"expirationDate":1443989700000,"generationDate":1443903300000,"id":"2929289789573","invocationInfo":{"callId":"UUID of CallId","generatedBy":"UnitTestRulesEngine","targetInfo":{"intentsSet":["InvocationIntentA"],"mode":"Normal","perceivedExecutionTime":null,"supplementalMappings":null,"type":"Background"}},"payload":[{"data":{"details":{"detail":"This is the Body","provenance":"Test Data"},"doneDate":null,"dueDate":1443989700000,"generatedBy":"GeneratedBYUnitTest","id":null,"pid":"5000000317V387446","priority":50,"provider":"ProviderId","title":"A Test Result","type":"advice"},"type":"advice"}],"priority":0,"type":"advice"}"
   Then a successful response is returned for created
   And a work product id is returned
   And user sends GET request for a created work product
   And a successful response is returned
   And user sends PUT request to update a work product with content "{"categories":[419192003],"context":{"location":{"codeSystem":"VA:Location","entityType":"Location","id":"2883","name":"ClinicOne","type":"ClinicName"},"specialty":{"codeSystem":"VA:Specialty","entityType":"Specialty","id":"FM","name":"Family Medicine","type":"Speciality"},"subject":{"codeSystem":"VA:UniversalId","entityType":"Subject","id":"5000000317V387446","name":null,"type":"Patient"},"user":{"codeSystem":"VA:Provider","entityType":"User","id":"unitTestUserId","name":"TEST,USER","type":"Provider"}},"duplicateCheckKey":{"checkSum":"","subject":{"codeSystem":"VA:UniversalId","entityType":"Subject","id":"5000000317V387446","name":null,"type":"Patient"},"type":"advice"},"expirationDate":1443989700000,"generationDate":1443903300000,"id":"2929289789573","invocationInfo":{"callId":"UUID of CallId","generatedBy":"UnitTestRulesEngine","targetInfo":{"intentsSet":["InvocationIntentA"],"mode":"Normal","perceivedExecutionTime":null,"supplementalMappings":null,"type":"Background"}},"payload":[{"data":{"details":{"detail":"This is the Body","provenance":"Test Data"},"doneDate":null,"dueDate":1443989700000,"generatedBy":"GeneratedBYUnitTest","id":null,"pid":"5000000317V387446","priority":50,"provider":"ProviderId","title":"A Test Result updated","type":"advice"},"type":"advice"}],"priority":0,"type":"advice"}"
   And a successful response is returned
   Then user sends DELETE request to delete a work product
   And a successful response is returned
   
@US8161_subscriptions
Scenario: Get, update and delete subscription
    Given subscriptions are available fo the user
    And user sends GET request for subscriptions
    And a successful response is returned
    And user sends PUT request to update subscriptions with content "{"specialty":[408439002,408478003,394582007],"priority":"URG","type":["P"]}"
    And a successful response is returned
    When user sends DELETE request to delete the subscription
    Then a successful response is returned
   
@US8360_cdsjob_CRUD
Scenario: Perform CRUD on cds job
    Given user sends request to create patient list with content "{"name":"CDSJobList","definition":{"name":"CDSJobList","description":"user defined description of this definition template","expression":"{and: [ {or: ['A.A','B.B'], {'A.A'} ]}","date":"2015-02-27T20:33:41.308Z","scope":"private","owner":"unknown"}}"
    Then a successful response is returned for created
    And the patient list id is returned
    And user adds a patient in the patient list
    And a successful response is returned
    And the cdsjob is scheduled for patient list with content "{"description":"A Test job from the unit tests","disabled":false,"execution":{"baseContext":{"location":{"codeSystem":null,"entityType":"Location","id":null,"name":null,"type":null},"specialty":{"codeSystem":null,"entityType":"Specialty","id":null,"name":null,"type":null},"subject":{"codeSystem":null,"entityType":"Subject","id":null,"name":null,"type":null},"user":{"codeSystem":"VA:DUZ","entityType":"User","id":"9E7A:10000000255","name":"USER PANORAMA","type":"provider"}},"jobId":null,"subjectIds":null,"subjectListReferences":[{"id":"CDSJobList","type":"Patient"}],"target":{"intentsSet":["HTN"],"mode":"Normal","perceivedExecutionTime":null,"supplementalMappings":null,"type":"Background"}},"lastRun":1429161765119,"name":"TestCDSJob","owner":{"codeSystem":"VA:DUZ","entityType":"User","id":"9E7A:10000000255","name":"USER PANORAMA","type":"provider"}}"
    And a successful response is returned for created
    And a cdsjob id is returned
    And user sends GET request for a created cdsjob
    And a successful response is returned
    And user sends PUT request to update a cdsjob with content "{"description":"A Test job from the unit tests is updated","disabled":false,"execution":{"baseContext":{"location":{"codeSystem":null,"entityType":"Location","id":null,"name":null,"type":null},"specialty":{"codeSystem":null,"entityType":"Specialty","id":null,"name":null,"type":null},"subject":{"codeSystem":null,"entityType":"Subject","id":null,"name":null,"type":null},"user":{"codeSystem":"VA:DUZ","entityType":"User","id":"9E7A:10000000255","name":"USER PANORAMA","type":"provider"}},"jobId":null,"subjectIds":null,"subjectListReferences":[{"id":"CDSJobList","type":"Patient"}],"target":{"intentsSet":["HTN"],"mode":"Normal","perceivedExecutionTime":null,"supplementalMappings":null,"type":"Background"}},"lastRun":1429161765119,"name":"TestCDSJob","owner":{"codeSystem":"VA:DUZ","entityType":"User","id":"9E7A:10000000255","name":"USER PANORAMA","type":"provider"}}"
    And a successful response is returned
    And user sends DELETE request to delete a cdsjob
    And a successful response is returned
    
@US8360_schedulejob_CRUD
Scenario: Perform CRUD on schedule job
    Given user sends request to create patient list with content "{"name":"ScheduleJobList","definition":{"name":"ScheduleJobList","description":"user defined description of this definition template","expression":"{and: [ {or: ['A.A','B.B'], {'A.A'} ]}","date":"2015-02-27T20:33:41.308Z","scope":"private","owner":"unknown"}}"
    Then a successful response is returned for created
    And the patient list id is returned
    And user adds a patient in the patient list
    And a successful response is returned
    And the cdsjob is scheduled for patient list with content "{"description":"A Test job from the unit tests","disabled":false,"execution":{"baseContext":{"location":{"codeSystem":null,"entityType":"Location","id":null,"name":null,"type":null},"specialty":{"codeSystem":null,"entityType":"Specialty","id":null,"name":null,"type":null},"subject":{"codeSystem":null,"entityType":"Subject","id":null,"name":null,"type":null},"user":{"codeSystem":"VA:DUZ","entityType":"User","id":"9E7A:10000000255","name":"USER PANORAMA","type":"provider"}},"jobId":null,"subjectIds":null,"subjectListReferences":[{"id":"ScheduleJobList","type":"Patient"}],"target":{"intentsSet":["HTN"],"mode":"Normal","perceivedExecutionTime":null,"supplementalMappings":null,"type":"Background"}},"lastRun":1429161765119,"name":"ScheduleJobList","owner":{"codeSystem":"VA:DUZ","entityType":"User","id":"9E7A:10000000255","name":"USER PANORAMA","type":"provider"}}"
    And a successful response is returned for created
    And user sends POST request to schedule a job
    And a successful response is returned for created
    And user sends GET request for a scheduled job
    And a successful response is returned
    And user sends PUT request to update a scheduled job
    And a successful response is returned
    And user sends DELETE request to delete a scheduled job
    And a successful response is returned

@US8155_Definition_CRUD
Scenario: Perform CRUD on definitions
    Given user sends request to create definition with content "{"name":"Test Def","description":"user defined description of this definition template","expression":"{and: [ {or: ['A.A','B.B'], {'A.A'} ]}"}"
    And a successful response is returned for created
    And the definition id is returned
    And user sends GET request for a definition 
    And a successful response is returned
    And user sends POST request to copy the created definition
    And a successful response is returned for created
    When user sends DELETE request to delete the defintion
    Then a successful response is returned
    
@US8154_criteria_CRUD
Scenario: Perform CRUD on criteria
  Given user sends request to create criteria with content "{"name":"Test Criteria","accessor":"vital:items[]:qualifiedName","datatype":"integer"}"
  And a successful response is returned for created
  And the criteria id is returned
  And user sends GET request for a criteria 
  And a successful response is returned
  When user sends DELETE request to delete a criteria
  Then a successful response is returned
  
  