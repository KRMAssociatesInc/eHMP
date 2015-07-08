@Filter @unstable 

Feature: Verify all filters with acceptance tests

@Filter_eq
Scenario: Client requests discharge summary in VPR format from RDK using filter equals exact comparison
    Given a patient with pid "10108V420871" has been synced through the RDK API
	When the client requests for the patient "10108V420871" and filter value "eq(summary,"Progress Note")" in RDK format 
	Then a successful response is returned
	And the client receives 9 result(s)

@Filter_ne
Scenario: Client requests discharge summary in VPR format from RDK using filter not equals exact comparison
    Given a patient with pid "10108V420871" has been synced through the RDK API
	When the client requests for the patient "10108V420871" and filter value "ne(facilityCode,"500")" in RDK format 
	Then a successful response is returned
	And the client receives 30 result(s)

@Filter_in
Scenario: Client requests discharge summary in VPR format from RDK using filter inside list exact comparison with list
    Given a patient with pid "10108V420871" has been synced through the RDK API
	When the client requests for the patient "10108V420871" and filter value "in(facilityName,["CAMP MASTER","DOD"])" in RDK format 
	Then a successful response is returned
	And the client receives 28 result(s)

@Filter_nin
Scenario: Client requests discharge summary in VPR format from RDK using filter not inside list exact comparison with list
    Given a patient with pid "10108V420871" has been synced through the RDK API
	When the client requests for the patient "10108V420871" and filter value "nin(kind,["Allergy/Adverse Reaction","Procedure Note"])" in RDK format 
	Then a successful response is returned
	And the client receives 52 result(s)


@Filter_exists @future
Scenario: Client requests discharge summary in VPR format from RDK using filter exists
    Given a patient with pid "10108V420871" has been synced through the RDK API
	When the client requests for the patient "10108V420871" and filter value "exists(kind)" in RDK format 
	Then a successful response is returned
	And the client receives 52 result(s)

@Filter_gt @future
Scenario: Client requests discharge summary in VPR format from RDK using filter greater than
    Given a patient with pid "10108V420871" has been synced through the RDK API
	When the client requests for the patient "10108V420871" and filter value "gt(referenceDateTime,"20140113175535")" in RDK format 
	Then a successful response is returned
	And the client receives 2 result(s)


@Filter_gte @future
Scenario: Client requests discharge summary in VPR format from RDK using filter greater than or equal
    Given a patient with pid "10108V420871" has been synced through the RDK API
	When the client requests for the patient "10108V420871" and filter value "gte(referenceDateTime,"20140113175535")" in RDK format 
	Then a successful response is returned
	And the client receives 3 result(s)


@Filter_lt @future
Scenario: Client requests discharge summary in VPR format from RDK using filter lesser than
    Given a patient with pid "10108V420871" has been synced through the RDK API
	When the client requests for the patient "10108V420871" and filter value "lt(referenceDateTime,"20140113175535")" in RDK format 
	Then a successful response is returned
	And the client receives 49 result(s)

@Filter_lte
Scenario: Client requests discharge summary in VPR format from RDK using filter lesser than or equal
    Given a patient with pid "10108V420871" has been synced through the RDK API
	When the client requests for the patient "10108V420871" and filter value "lte(facilityCode,"500")" in RDK format 
	Then a successful response is returned
	And the client receives 22 result(s)

@Filter_between
Scenario: Client requests discharge summary in VPR format from RDK using filter lesser than or equal
    Given a patient with pid "10108V420871" has been synced through the RDK API
	When the client requests for the patient "10108V420871" and filter value "between(entered,"20140926123525","20140926123530")" in RDK format 
	Then a successful response is returned
	And the client receives 0 result(s)


@Filter_like
Scenario: Client requests discharge summary in VPR format from RDK using filter M pattern match sensitive
    Given a patient with pid "10108V420871" has been synced through the RDK API
	When the client requests for the patient "10108V420871" and filter value "like(kind,"%Note")" in RDK format 
	Then a successful response is returned
	And the client receives 25 result(s)


@Filter_illike
Scenario: Client requests discharge summary in VPR format from RDK using filter M pattern match, case insensitive
    Given a patient with pid "10108V420871" has been synced through the RDK API
	When the client requests for the patient "10108V420871" and filter value "ilike(kind,"%note")" in RDK format 
	Then a successful response is returned
	And the client receives 25 result(s)

@orderby_desc
Scenario: Client requests discharge summary in VPR format from RDK using filter equals exact comparison
    Given a patient with pid "10108V420871" has been synced through the RDK API
	When the client requests for the patient "10108V420871" and filter value "eq(summary,"Progress Note")" and order "referenceDateTime desc"
	Then a successful response is returned
	And the client make sure referenceDateTime is in desc


@orderby_asc
Scenario: Client requests discharge summary in VPR format from RDK using filter equals exact comparison
    Given a patient with pid "10108V420871" has been synced through the RDK API
	When the client requests for the patient "10108V420871" and filter value "eq(summary,"Progress Note")" and order "referenceDateTime asc"
	Then a successful response is returned
	And the client make sure referenceDateTime is in asc


















