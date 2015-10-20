@F431_Task_Lifecycle

Feature: F431 Task Lifecycle Management

@F431_Get_All_Data_For_A_Role @US7729 @US8035 @future
Scenario: Create 2 processes and then view list of all tasks that are assigned to a particular user or role
  # Create a process
  When the client creates a process with content "{"deploymentId":"All","processDefId":"VistaTasks.GenericTask","parameter":{"patientname":"Seven,Patient","patientid":"7","service":"home_telehealth","team":"team1","role":"nurse_rn","tasktype":"Diabeties","taskreason":"Preventative","priority":"Normal","duedate":"2015-06-27 13:00","todonote":"Test77"}}"
  Then a successful response is returned
  # Create a process
  When the client creates a process with content "{"deploymentId":"All","processDefId":"VistaTasks.GenericTask","parameter":{"patientname":"Eight,Patient","patientid":"8","service":"home_telehealth","team":"team1","role":"nurse_rn","tasktype":"Diabeties","taskreason":"Preventative","priority":"Normal","duedate":"2015-06-27 13:00","todonote":"Test88"}}"
  Then a successful response is returned
  # Get list of tasks for a Role
  When the client requests to see the list of tasks assigned to a role
  Then a successful response is returned
  And the results contain
      | name                                | value                                                  |
      | data.items.name                     | To Do Task                                             |
	    | data.items.subject                  | 		                                                   |
      | data.items.description              | 		                                                   |
      | data.items.status	                  | Ready													                         |
	    | data.items.priority                 | 0		                                                   |
      | data.items.skipable                 | false                                                  |
      | data.items.actualOwnerId            | 	 													                           |
	    | data.items.createdById              | 		                                                   |
      | data.items.createdOn                | IS_SET                                                 |
      | data.items.activationTime           | IS_SET												                         |
	    | data.items.expirationTime           | 		                                                   |
      | data.items.processInstanceId        | IS_SET                                                 |
      | data.items.processId                | VistaTasks.GenericTask  								               |
      | data.items.processSessionId         | 0														                           |
      | data.items.deploymentId             | VistaCore:VistaTasks:1.0  							               |
      | data.items.quickTaskSummary         | false 												                         |
      | data.items.parentId                 | -1 													                           |
      | data.items.potentialOwners          | 														                           |
      | data.items.variables.modificationDate | IS_SET                                               |
      | data.items.variables.name           | patientid                       											 |
      | data.items.variables.value          | 7                                  										 |
      | data.items.variables.value          | 8                            		 										 	 |
      | data.items.variables.name           | patientname                   											 	 |
      | data.items.variables.value          | Seven,Patient                                          |
      | data.items.variables.value          | Eight,Patient                    										 	 |


@F431_Get_All_Data_For_A_Patient @US7729 @US8035 @future
Scenario: Create 3 processes and then view list of all tasks that are associated with a particular Patient
  # Create a process
  When the client creates a process with content "{"deploymentId":"All","processDefId":"VistaTasks.GenericTask","parameter":{"patientname":"Nine,Patient","patientid":"9","service":"home_telehealth","team":"team1","role":"nurse_rn","tasktype":"Diabeties","taskreason":"Preventative","priority":"Normal","duedate":"2015-06-27 13:00","todonote":"Test99"}}"
  Then a successful response is returned
  # Create a process
  When the client creates a process with content "{"deploymentId":"All","processDefId":"VistaTasks.GenericTask","parameter":{"patientname":"Ten,Patient","patientid":"pid10","service":"home_telehealth","team":"team1","role":"nurse_rn","tasktype":"Diabeties","taskreason":"Preventative","priority":"Normal","duedate":"2015-06-27 13:00","todonote":"Test10"}}"
  Then a successful response is returned
  # Create a process
  When the client creates a process with content "{"deploymentId":"All","processDefId":"VistaTasks.GenericTask","parameter":{"patientname":"Nine,Patient","patientid":"9","service":"home_telehealth","team":"team1","role":"nurse_rn","tasktype":"Diabeties","taskreason":"Preventative","priority":"Normal","duedate":"2015-06-27 13:00","todonote":"Test9999"}}"
  Then a successful response is returned
  # Get list of tasks for a Patient
  When the client requests to see the list of tasks for patient "9"
  Then a successful response is returned
  And the results do not contain "pid10"
  And the results contain
      | name                                | value                                                  |
      | data.items.name                     | To Do Task                                             |
      | data.items.subject                  |                                                        |
      | data.items.description              |                                                        |
      | data.items.status                   | Ready                                                  |
      | data.items.priority                 | 0                                                      |
      | data.items.skipable                 | false                                                  |
      | data.items.actualOwnerId            |                                                        |
      | data.items.createdById              |                                                        |
      | data.items.createdOn                | IS_SET                                                 |
      | data.items.activationTime           | IS_SET                                                 |
      | data.items.expirationTime           |                                                        |
      | data.items.processInstanceId        | IS_SET                                                 |
      | data.items.processId                | VistaTasks.GenericTask                                 |
      | data.items.processSessionId         | 0                                                      |
      | data.items.deploymentId             | VistaCore:VistaTasks:1.0                               |
      | data.items.quickTaskSummary         | false                                                  |
      | data.items.parentId                 | -1                                                     |
      | data.items.potentialOwners          |                                                        |
      | data.items.variables.modificationDate | IS_SET                                               |
      | data.items.variables.name           | patientid                                              |
      | data.items.variables.value          | 9                                                      |
      | data.items.variables.name           | patientname                                            |
      | data.items.variables.value          | Nine,Patient                                           |

@F431_Create_Claim_Complete_A_Process @US7729 @US8035 @future
Scenario: Create a process, then claim, start and complete that process
  # Create a process
  When the client creates a process with content "{"deploymentId":"All","processDefId":"VistaTasks.GenericTask","parameter":{"patientname":"One,Patient","patientid":"pid1","service":"home_telehealth","team":"team1","role":"nurse_rn","tasktype":"Diabeties","taskreason":"Preventative","priority":"Normal","duedate":"2015-06-27 13:00","todonote":"Test1"}}"
  Then a successful response is returned
  # Get list of tasks for a patient
  When the client requests to see the list of tasks for patient "pid1"
  Then a successful response is returned
  And the results contain
      | name                                | value                                                  |
      | data.items.status                   | Ready                                                  |
      | data.items.processId                | VistaTasks.GenericTask                                 |
      | data.items.deploymentId             | VistaCore:VistaTasks:1.0                               |
      | data.items.variables.name           | patientid                                              |
      | data.items.variables.value          | pid1                                                   |
      | data.items.variables.name           | patientname                                            |
      | data.items.variables.value          | One,Patient                                            |
      | data.items.variables.name           | service                                                |
      | data.items.variables.value          | home_telehealth                                        |
      | data.items.variables.name           | team                                                   |
      | data.items.variables.value          | team1                                                  |
      | data.items.variables.name           | role                                                   |
      | data.items.variables.value          | nurse_rn                                               |
      | data.items.variables.name           | tasktype                                               |
      | data.items.variables.value          | Diabeties                                              |
      | data.items.variables.name           | taskreason                                             |
      | data.items.variables.value          | Preventative                                           |
      | data.items.variables.name           | priority                                               |
      | data.items.variables.value          | Normal                                                 |
      | data.items.variables.name           | duedate                                                |
      | data.items.variables.value          | 2015-06-27 13:00                                       |
      | data.items.variables.name           | todonote                                               |
      | data.items.variables.value          | Test1                                                  |
  # Claim a process
  When the client changes state of the new process to "claim"
  Then a successful response is returned
  # Get list of tasks for a patient
  When the client requests to see the list of tasks for patient "pid1"
  Then a successful response is returned
  And the results contain
      | name                                | value                                                  |
      | data.items.status	                  | Reserved 												                       |
  # Make process in-progress
  When the client changes state of the new process to "start"
  Then a successful response is returned
  # Get list of tasks for a patient
  When the client requests to see the list of tasks for patient "pid1"
  Then a successful response is returned
  And the results contain
      | name                                | value                                                  |
      | data.items.status	                  | InProgress 											                       |
  # Complete a process
  When the client changes state of the new process to complete with content "{"deploymentid":"All","user":"Susan","parameter":{"out_completionnote":"Completion Test 16"}}"
  Then a successful response is returned
  # Get list of tasks for a patient
  When the client requests to see the list of tasks for patient "pid"
  Then a successful response is returned
  And the result is an empty array
