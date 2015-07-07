@Orders @future
Feature: F102 Return and Display of Orders
# This feature file has UI test and the background UI rest request.  Since we don't want either to run in the jenkins pipeline
# I have marked the Feature as @future so the background step will also not be run

Background:
	Given a patient with pid "10108" has been synced through FHIR
   
@orders_rest
Scenario: Client can request orders
	Given a patient with orders in multiple VistAs
	When the client requests orders for that patient
	Then eHMP returns all orders in the results
	And the results contain data group
      | field        | value                     |
      | uid          | urn:va:order:9E7A:3:30564 |
      | oiCode       | urn:va:oi:293             |
      | facilityCode | 500                       |
      | providerUid  | urn:va:user:9E7A:20364    |
      | oiPackageRef | 177;99LRT                 |
      | entered      | 20100323105951            |
      | localId      | 30564                     |
      | pid          | 10108                     |
      | locationName | GENERAL MEDICINE          |
      | displayGroup | CH                        |
      | kind         | Lab Order                 |
      | statusCode   | urn:va:order-status:pend  |
      | Status       | PENDING                   |
      | locationUid  | urn:va:location:9E7A:23   |
      | providerName | Labtech,Seventeen         |
      | start        | 201003231059              |
      | Facility     | CAMP MASTER               |
      | oiName       | POTASSIUM                 |
      | name         | POTASSIUM                 |
      | service      | LR                        |
      | statusVuid   | urn:va:vuid:4501114       |
      #|Summary		| "POTASSIUM BLOOD   SERUM WC LB #14908\r\n"|
	  #|content		| POTASSIUM BLOOD   SERUM WC LB #14908\r\n|
       

@orders_search @UI
Scenario: User can search for active and pending orders in the eHMP UI
 	Given user has successfully logged into HMP
	And a patient with orders in multiple VistAs
	When user searches for "order" for that patient
	Then search results displays "1" titles
	When user opens title "Laboratory"
	Then search results include
      | summary_title                                          | summary_date      |
      | POTASSIUM BLOOD   SERUM WC LB #14807\n (PENDING Order) | 23-Mar-2010 10:59 |
      | POTASSIUM BLOOD   SERUM WC LB #14908\n (PENDING Order) | 23-Mar-2010 10:59 |
      | POTASSIUM BLOOD   SERUM WC LB #14706\n (PENDING Order) | 23-Mar-2010 10:58 |
      | POTASSIUM BLOOD   SERUM WC LB #14605\n (PENDING Order) | 23-Mar-2010 10:57 |
      | POTASSIUM BLOOD   SERUM WC LB #14504\n (PENDING Order) | 23-Mar-2010 10:56 |
      | GLUCOSE BLOOD   SERUM SP LB #2804\n (ACTIVE Order)     | 07-Jul-2005 10:31 |
      | INR BLOOD   PLASMA SP LB #2681\n (ACTIVE Order)        | 17-Mar-2005 01:59 |
      | PROTIME BLOOD   PLASMA SP LB #2681\n (ACTIVE Order)    | 17-Mar-2005 01:59 |
      | HEMOGLOBIN A1C SERUM SP LB #2681\n (ACTIVE Order)      | 17-Mar-2005 01:59 |
		


		