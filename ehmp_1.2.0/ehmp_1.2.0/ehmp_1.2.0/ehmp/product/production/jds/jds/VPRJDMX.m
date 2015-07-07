VPRJDMX ;SLC/KCM -- Meta data for JSON indexes
 ;;1.0;JSON DATA STORE;;Sep 01, 2012
 ;
 ; Types of collation:
 ;       V: Inverse HL7 Time (appends "=" after complementing time)
 ;       T: Forward HL7 Time (appends " " to time)
 ;       N: Numeric          (+value)
 ;       S: String           (appends " " to ensure string)
 ;       s: String           (case insensitive, appends " " to ensure string)
 ;       P: Plain            (uses value as is)
 ;       p: Plain            (case insensitive, use value as is)
 ;
 ; --------------------------------------------------------
 ; Tally time indexes maintain counts of each value a field takes on
 ; The definition structure is:
 ;
 ;;indexName
 ;;    fields.{collection}: {tallyField}
IDXTALLY ; tally type indexes
 ;;test-name-count
 ;;    collections: test
 ;;    fields: name
 ;;syncstatus-pid-count
 ;;    collections: syncstatus
 ;;    fields: pid
 ;;syncerror-pid-count
 ;;    collections: syncerror
 ;;    fields: pid
 ;;zzzzz
 ;
 ; --------------------------------------------------------
 ; Attribute type indexes index first by field, then by sort
 ; The first collation is the field collation, followed by the sort collation.
 ; The default is s,s (both case-insensitive strings) if no other collation
 ; is defined.
IDXATTR ;
 ;;test-name
 ;;    collections: test
 ;;    fields: name/s, updated/V/0
 ;;    sort: updated desc
 ;;utest-name
 ;;    collections: test, testb, utestods
 ;;    fields: name/s
 ;;    sort: name asc
 ;;vprupdate
 ;;    collections: vprupdate
 ;;person
 ;;    collections: user
 ;;    fields: name
 ;;    sort: name asc
 ;;    setif: $$ACT^VPRJFD
 ;;personphoto
 ;;    collections: personphoto
 ;;    fields: personUid
 ;;team-membership
 ;;    collections: team
 ;;    fields: staff[].personUid
 ;;    sort: displayName asc
 ;;team-categories
 ;;    collections: teamcategory
 ;;    fields: name
 ;;    sort: name asc
 ;;teams
 ;;    collections: team
 ;;    fields: displayName
 ;;    sort: displayName asc
 ;;team-positions
 ;;    collections: teamposition
 ;;    fields: name
 ;;    sort: name asc
 ;;categories
 ;;    collections: category
 ;;    fields: name,domain
 ;;    sort: name asc
 ;;orderable-types
 ;;    collections: orderable
 ;;    fields: types[].type,name
 ;;    sort: name asc
 ;;clioterminology
 ;;    collections: clioterminology
 ;;    fields: term, termType
 ;;    sort: term asc
 ;;rosters
 ;;    collections: roster
 ;;    fields: localId
 ;;syncstatus
 ;;    collections: syncstatus
 ;;    fields: pid
 ;;rosterpats
 ;;    collections: roster
 ;;    fields: patients[].pid, name, localId
 ;;locations-wards
 ;;    collections: location
 ;;    fields: name
 ;;    sort: name asc
 ;;    setif: $$WARDLOC^VPRJFPS
 ;;locations-clinics
 ;;    collections: location
 ;;    fields: name
 ;;    sort: name asc
 ;;    setif: $$CLINLOC^VPRJFPS
 ;;status-pt
 ;;    collections: syncstatus
 ;;    fields: pid
 ;;    setif: $$PTSYNCSTATUS^VPRJFPS
 ;;status-loading
 ;;    collections: syncstatus
 ;;    fields: pid
 ;;    setif: $$PTLOADNG^VPRJFPS
 ;;status-loaded
 ;;    collections: syncstatus
 ;;    fields: pid
 ;;    setif: $$PTLOADED^VPRJFPS
 ;;syncerror
 ;;    collections: syncerror
 ;;    fields: id
 ;;syncerror-pid
 ;;    collections: syncerror
 ;;    fields: pid
 ;;pt-select-pid
 ;;    collections: pt-select
 ;;    fields: pid/s
 ;;    sort: fullName asc
 ;;pt-select-icn
 ;;    collections: pt-select
 ;;    fields: icn/s
 ;;    sort: fullName asc
 ;;pt-select-name
 ;;    collections: pt-select
 ;;    fields: fullName/s
 ;;    sort: fullName asc
 ;;pt-select-ssn
 ;;    collections: pt-select
 ;;    fields: ssn/s
 ;;    sort: fullName asc
 ;;pt-select-last4
 ;;    collections: pt-select
 ;;    fields: last4/s
 ;;    sort: fullName asc
 ;;pt-select-last5
 ;;    collections: pt-select
 ;;    fields: last5/s
 ;;    sort: fullName asc
 ;;zzzzz
 ;
