@F353_Stacked_Graph_Picklist 

Feature: F353 Stacked Graph Picklists - Vitals, Labs, Meds


@F353_Labs_Picklist_1 @US5762 
Scenario: Viewing the list of all Labs data for picklist 
  When the client requests to see the labs picklist for 4 records
  Then a successful response is returned
  And the results contain
      | name                                | value                                                  |
      | data.updated                        | IS_SET                                                 |
      | data.totalItems                     | 1236                                                   |
      | data.currentItemCount               | 4                                                      |
      | data.itemsPerPage                   | 4                                                      |
      | data.startIndex                     | 0                                                      |
      | data.pageIndex                      | 0                                                      |
      | data.totalPages                     | 309                                                    |
      | jdsApiVersion                       | 1.0                                                    |
      | data.items.stampTime                | IS_SET                                                 |
      | data.items.dialogAdditionalInformation.sendPatientTimes.internal      | LT                   |
      | data.items.dialogAdditionalInformation.sendPatientTimes.name          | Today                |
      | data.items.dialogAdditionalInformation.sendPatientTimes.internal      | LT+1                 |
      | data.items.dialogAdditionalInformation.sendPatientTimes.name          | Tomorrow             |
      | data.items.internal                                                   | 1000                 |
      | data.items.labDetails.dailyOrderMax                                   |                      |
      | data.items.labDetails.labCollect                                      | false                |
      | data.items.labDetails.labTypeInternal                                 | N                    |
      | data.items.labDetails.labTypeName                                     | Neither              |
      | data.items.labDetails.maxOrderFrequency                               |                      |
      | data.items.labDetails.sequence                                        |                      |
      | data.items.labDetails.speciman                                        |                      |
      | data.items.link                     | 1071                                                   |
      | data.items.linktype                 | LRT                                                    |
      | data.items.name                     | TRAZODONE                                              |
      | data.items.synonym.name             | DESYREL                                                |
      | data.items.types.abb                |                                                        |
      | data.items.types.internal           |                                                        |
      | data.items.types.type               |                                                        |
      | data.items.types.uid                | CONTAINS urn:va:labTyp                                 |
      | data.items.uid                      | CONTAINS urn:va:orderable                              |


@F353_Meds_Picklist @US5762 
Scenario: Viewing the list of all Meds data for picklist 
  When the client requests to see the meds picklist for 6 records
  Then a successful response is returned
  And the results contain
      | name                                | value                                                  |
      | data.updated                        | IS_SET                                                 |
      | data.totalItems                     | 2825                                                   |
      | data.currentItemCount               | 6                                                      |
      | data.itemsPerPage                   | 6                                                      |
      | data.startIndex                     | 0                                                      |
      | data.pageIndex                      | 0                                                      |
      | data.totalPages                     | 471                                                    |
      | jdsApiVersion                       | 1.0                                                    |
      | data.items.stampTime                | IS_SET                                                 |
      | data.items.internal                 | 1344                                                   |
      | data.items.link                     | 1                                                      |
      | data.items.linktype                 | PSP                                                    |
      | data.items.name                     | CONTAINS ACETAMINOPHEN                                 |
      | data.items.types.type               | MEDS                                                   |
      | data.items.uid                      | CONTAINS urn:va:orderable                              |


@F353_Vitals_Picklist @US4791 
Scenario: Viewing the list of all Vitals data for picklist 
  When the client requests to see the vitals picklist for 5 records
  Then a successful response is returned
  And the results contain
      | name                                | value                                                  |
      | data.updated                        | IS_SET                                                 |
      | data.totalItems                     | 19                                                     |
      | data.currentItemCount               | 5                                                      |
      | data.itemsPerPage                   | 5                                                      |
      | data.startIndex                     | 0                                                      |
      | data.pageIndex                      | 0                                                      |
      | data.totalPages                     | 4                                                      |
      | jdsApiVersion                       | 1.0                                                    |

      | data.items.abbreviation             | BP                                                     |
      | data.items.effective            	  | 20070607120123                                         |
      | data.items.localId            	  | 1                                                      |
      | data.items.masterVuid            	  | YES                                                    |
      | data.items.name            		  | BLOOD PRESSURE                                         |
      | data.items.pce            		  | BP                                                     |
      | data.items.rate            		  | YES                                                    |
      | data.items.status            	  | ACTIVE                                                 |
      | data.items.uid            		  | CONTAINS urn:va:vitaltypes-list:9E7A:1     		     |
      | data.items.vuid                     | CONTAINS urn:va:vuid                                   |
