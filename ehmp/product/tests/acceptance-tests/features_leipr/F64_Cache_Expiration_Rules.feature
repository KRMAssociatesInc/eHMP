@cacheExpRules
Feature: Cache Expiration Rules
VistA Exchange will have the ability to expire all patient data for a patient after a configurable 
duration of time. Expired data will be purged or marked as deleted and fresh data will be retrieved 
from the source. 

Background:
	Given user logs in with valid credentials
	
@future
Scenario: Clear cache for a given patient
  Given the need to clear cache for a patient
  And data exist in the cache for the patient
  When a call is made to clear cache for a patient
  Then cache is cleared for the patient
  And that data does not exist in the cache for the patient
  And that data exist in cache for different patient.     

@US468 @future
Scenario: There is a need to clear entire cache
  Given data exist in the cache for multiple patients
  When a call is made to clear cache 
  Then the entire cache is cleared 
  And that data does not exist in the cache for any patient

@Manual @future @US465_expiredData @US465 
Scenario: A request is made for a patient with expired data.
  Given a patient with data that was synchronized at time x
  And the expiration duration is "10" seconds
  Then a request at or after "10" seconds results in a deferred response
  And a valid response is received

@Manual @future @US465_validData @US465
Scenario: A request is made for a patient without expired data.
  Given a patient with data that was synchronized at time x
  And the expiration duration is "10" seconds
  Then a request before "1" seconds results in a normal response
  And a valid response is received

@Manual @future @US465 
Scenario: A request is made for a patient with expired data and an allergy has been deleted since the last synchronization.
  Given a patient with data that was synchronized at time x
  And that data includes allergy A
  And the expiration duration is y
  And allergy A is deleted between x and x + y
  Then a request at or after x + y results in a deferred response
  And a valid response is received
  And allergy A is not present in the response

@Manual @future @US465 
Scenario: A request is made for a patient with expired data and a new allergy has been deleted since the last synchronization.
  Given a patient with data that was synchronized at time x
  And that data does not include allergy A
  And the expiration duration is y
  And allergy A is added between x and x + y
  Then a request at or after x + y results in a deferred response
  And a valid response is received
  And allergy A is present in the response

@Manual @future @US465 
Scenario: A request is made for a patient with expired data and an allergy has been edited since the last synchronization.
  Given a patient with data that was synchronized at time x
  And that data includea allergy A
  And the expiration duration is y
  And allergy A is edited between x and x + y
  Then a request at or after x + y results in a deferred response
  And a valid response is received
  And the edit made to allergy A is present in the response
  
@Manual @future
Scenario: Document instructions on how to alter the cache expiration settings in the config file
   Given the need to clear cache 
   And that the config file and the config file must be altered
   When there is the need to alter the clear cache settings
   Then instructions exist to alter the config file to clear the cache

#To be Determined later - Potential implementation optimizations include not actually purging the #data from cache until the data has been checked to see if it has changed