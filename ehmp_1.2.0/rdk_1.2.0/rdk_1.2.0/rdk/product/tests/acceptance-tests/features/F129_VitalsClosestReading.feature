@F129 @VitalsClosestReading @US2459 @onc
Feature: F129 – Vitals (Writeback)

@GetBP @onc
Scenario: Request BP vital sign for patient 10108V420871
	Given a patient with pid "10108V420871" has been synced through the RDK API
	When the client requests the closest reading of type "BP" for a patient with dfn "3"
	Then a successful response is returned
	Then the JSON response "reading" field is "80/30"

@GetWT @onc
Scenario: Request WT vital sign for patient 10108V420871
	Given a patient with pid "10108V420871" has been synced through the RDK API
	When the client requests the closest reading of type "WT" for a patient with dfn "3"
	Then a successful response is returned
	Then the JSON response "reading" field is "178"

@GetHT @onc
Scenario: Request HT vital sign for patient 10108V420871
	Given a patient with pid "10108V420871" has been synced through the RDK API
	When the client requests the closest reading of type "HT" for a patient with dfn "3"
	Then a successful response is returned
	Then the JSON response "reading" field is "71"

@BadVital @onc
Scenario: Request an invalid vital type for patient 10108V420871
	Given a patient with pid "10108V420871" has been synced through the RDK API
	When the client requests the closest reading of type "BS" for a patient with dfn "3"
	Then a successful response is returned
	Then the JSON response "reading" field is "Vital Type not found"