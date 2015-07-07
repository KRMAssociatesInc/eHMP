VPRJPMX ;SLC/KCM -- Meta data for JSON indexes
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
 ; List type indexes are special case of attribute indexes.  The have 0 or 1
 ; fields, used for default sorting.  The definition structure is:
 ;
 ;;indexName
 ;;    collections: {collection}, {collection}, ...
 ;;    fields: {fieldName}({collation},{ifNull})  -or-  <none>
 ;;    sort:  {default orderBy string}  -or-  <none>
IDXLIST ; list type indexes (sortType defaults to string)
 ;;allergy
 ;;    collections: allergy
 ;;    fields: <none>
 ;;    sort: <none>
 ;;consult
 ;;    collections: consult
 ;;    fields: dateTime/V/0
 ;;    sort: dateTime desc
 ;;document
 ;;    collections: document
 ;;    fields: referenceDateTime/V/0
 ;;    sort: referenceDateTime desc
 ;;parent-documents
 ;;    collections: document, procedure, surgery, image, consult
 ;;    fields: dateTime/V/0
 ;;    fields.document: referenceDateTime
 ;;    sort: dateTime descs
 ;;    setif: $$PRNTDOCS^VPRJFPS
 ;;encounter
 ;;    collections: visit, appointment
 ;;    fields: dateTime/V/0
 ;;    sort: dateTime desc
 ;;healthfactor
 ;;    collections: factor
 ;;    fields: recorded/V/0
 ;;    sort: recorded desc
 ;;imaging
 ;;    collections: image
 ;;    fields: dateTime/V/0
 ;;    sort: dateTime desc
 ;;immunization
 ;;    collections: immunization
 ;;    fields: administeredDateTime/V/0
 ;;    sort: administeredDateTime desc
 ;;laboratory
 ;;    collections: lab
 ;;    fields: observed/V/0
 ;;    sort: observed desc
 ;;    setif: $$RSLT^VPRJFPS
 ;;result
 ;;    collections: lab
 ;;    fields: observed/V/0
 ;;    sort: observed desc
 ;;    setif: $$RSLT^VPRJFPS
 ;;accession
 ;;    collections: lab
 ;;    fields: observed/V/0
 ;;    sort: observed desc
 ;;    setif: $$ACC^VPRJFPS
 ;;medication
 ;;    collections: med
 ;;    fields: overallStop/V/0
 ;;    sort: overallStop desc
 ;;microbiology
 ;;    collections: lab
 ;;    fields: observed/V/0
 ;;    sort: observed desc
 ;;    setif: $$MICRO^VPRJFPS
 ;;observation
 ;;    collections: obs
 ;;    fields: observed/V/0
 ;;    sort: observed desc
 ;;order
 ;;    collections: order
 ;;    fields: entered/V/0
 ;;    sort: entered desc
 ;;order-status
 ;;    collections: order
 ;;    fields: statusName/V/0
 ;;    sort: entered desc
 ;;pathology
 ;;    collections: lab
 ;;    fields: observed/V/0
 ;;    sort: observed desc
 ;;    setif: $$PATH^VPRJFPS
 ;;problem
 ;;    collections: problem
 ;;    fields: <none>
 ;;    sort: <none>
 ;;problem-active
 ;;    collections: problem
 ;;    fields: onset/V/0
 ;;    sort: onset desc
 ;;    setif: $$PACT^VPRJFPS
 ;;problem-inactive
 ;;    collections: problem
 ;;    fields: onset/V/0
 ;;    sort: onset desc
 ;;    setif: $$PIACT^VPRJFPS
 ;;problem-both
 ;;    collections: problem
 ;;    fields: onset/V/0
 ;;    sort: onset desc
 ;;    setif: $$PBOTH^VPRJFPS
 ;;problem-removed
 ;;    collections: problem
 ;;    fields: onset/V/0
 ;;    sort: onset desc
 ;;    setif: $$PRMVD^VPRJFPS
 ;;procedure
 ;;    collections: procedure,surgery,image,consult
 ;;    fields: dateTime/V/0
 ;;    sort: dateTime desc
 ;;vitalsign
 ;;    collections: vital
 ;;    fields: observed/V/0
 ;;    sort: observed desc
 ;;    setif: $$VS^VPRJFPS
 ;;notesview
 ;;    collections: document, procedure, surgery, image, consult
 ;;    fields: dateTime/V/0
 ;;    fields.document: referenceDateTime
 ;;    sort: dateTime desc
 ;;cwad
 ;;    collections: document, allergy, alert
 ;;    fields: referenceDateTime/V/0
 ;;    sort: referenceDateTime desc
 ;;    setif: $$CWAD^VPRJFPS
 ;;med-active-inpt
 ;;    collections: med
 ;;    fields: overallStop/V/9
 ;;    sort: overallStop desc
 ;;    setif: $$IACT^VPRJFPS
 ;;med-active-outpt
 ;;    collections: med
 ;;    fields: overallStop/V/9
 ;;    sort: overallStop desc
 ;;    setif: $$OACT^VPRJFPS
 ;;appointment
 ;;    collections: appointment
 ;;    fields: dateTime/V/9
 ;;    sort: dateTime desc
 ;;curvisit
 ;;    collections: visit
 ;;    fields: dateTime/V/0
 ;;    sort: dateTime desc
 ;;    setif: $$CURVISIT^VPRJFPS
 ;;task
 ;;    collections: task
 ;;    fields: <none>
 ;;    sort: <none>
 ;;diagnosis
 ;;    collections: diagnosis
 ;;    fields: <none>
 ;;    sort: <none>
 ;;roadtrip
 ;;    collections: roadtrip
 ;;    fields: <none>
 ;;    sort: <none>
 ;;auxiliary
 ;;    collections: auxiliary
 ;;    fields: <none>
 ;;    sort: <none>
 ;;treatment
 ;;    collections: treatment
 ;;    fields: <none>
 ;;    sort: <none>
 ;;mentalhealth
 ;;    collections: mh
 ;;    fields: administeredDateTime/V/0
 ;;    sort: administeredDateTime desc
 ;;visittreatment
 ;;    collections: ptf
 ;;    fields: <none>
 ;;    sort: <none>
 ;;exam
 ;;    collections: exam
 ;;    fields: <none>
 ;;    sort: <none>
 ;;visitcptcode
 ;;    collections: cpt
 ;;    fields: <none>
 ;;    sort: <none>
 ;;educationtopic
 ;;    collections: education
 ;;    fields: <none>
 ;;    sort: <none>
 ;;purposeofvisit
 ;;    collections: pov
 ;;    fields: <none>
 ;;    sort: <none>
 ;;skintest
 ;;    collections: skin
 ;;    fields: <none>
 ;;    sort: <none>
 ;;patsyncerr
 ;;    collections: pat
 ;;    fields: syncErrorCount
 ;;    sort: syncErrorCount desc
 ;;    setif:$$SYNCERR^VPRJFPS
 ;;vlerdocument
 ;;    collections: vlerdocument
 ;;    fields: <none>
 ;;    sort: <none>
 ;;zzzzz
 ;
 ; --------------------------------------------------------
 ; Tally time indexes maintain counts of each value a field takes on
 ; The definition structure is:
 ;
 ;;indexName
 ;;    fields.{collection}: {tallyField}
IDXTALLY ; tally type indexes
 ;;kind
 ;;    collections: lab, med, vital
 ;;    fields: kind
 ;;lab-count-name
 ;;    collections: lab
 ;;    fields: qualifiedName
 ;;vs-count-name
 ;;    collections: vital
 ;;    fields: typeName
 ;;zzzzz
 ;
 ; --------------------------------------------------------
 ; Time type indexes organize data by start and stop times.
 ; the structure is:
 ;
 ;;indexName
 ;;    fields.{collection}: {startField}, {stopField}
IDXTIME ; time type indexes
 ;;all-time
 ;;    collections: allergy,appointment,consult,document,image,immunization,lab,med,mh,obs,order,problem,procedure,roadtrip,surgery,task,treatment,visit,vital
 ;;    fields: start/V/0, stop/V/9
 ;;    fields.allergy: entered
 ;;    fields.appointment: dateTime
 ;;    fields.consult: dateTime
 ;;    fields.document: referenceDateTime
 ;;    fields.image: dateTime
 ;;    fields.immunization: administeredDateTime
 ;;    fields.lab: observed
 ;;    fields.med: overallStart, overallStop
 ;;    fields.mh: administeredDateTime
 ;;    fields.obs: observed
 ;;    fields.order: start,stop
 ;;    fields.problem: onset
 ;;    fields.procedure: dateTime
 ;;    fields.roadtrip: date
 ;;    fields.surgery: dateTime
 ;;    fields.task: dueDate
 ;;    fields.treatment: dueDate
 ;;    fields.visit: dateTime
 ;;    fields.vital: observed
 ;;    sort: start desc
 ;;lab-time
 ;;    collections: lab
 ;;    fields: observed/V/0
 ;;    sort: observed descd
 ;;med-time
 ;;    collections: med
 ;;    fields: overallStart/V/0, overallStop/V/9
 ;;    sort: overallStart desc
 ;;vs-time
 ;;    collections: vital
 ;;    fields: observed/V/0
 ;;    sort: observed desc
 ;;visit-time
 ;;    collections:visit
 ;;    fields: dateTime/V/0
 ;;    sort: dateTime desc
 ;;    setif: $$NOOS^VPRJFPS
 ;;news-feed
 ;;    collections:consult,immunization,procedure,surgery,visit
 ;;    fields: dateTime/V
 ;;    fields.immunization: administeredDateTime
 ;;    fields.visit: dateTime|stay.dischargeDateTime
 ;;    sort: dateTime desc
 ;;    setif: $$NEWS^VPRJFPS
 ;;utest-time
 ;;    collections: utestc
 ;;    fields: stay.started|updated/V
 ;;    sort: updated desc
 ;;    setif: $$NOTORNG^VPRJFTST
 ;;zzzzz
 ;
 ; --------------------------------------------------------
 ; Attribute type indexes index first by field, then by sort
 ; The first collation is the field collation, followed by the sort collation.
 ; The default is s,s (both case-insensitive strings) if no other collation
 ; is defined.
IDXATTR ;
 ;;utest
 ;;    collections: utesta, utestb
 ;;    fields: <none>
 ;;    sort: <none>
 ;;utest-c
 ;;    collections: utestc
 ;;    fields: name/s
 ;;    sort: name
 ;;lab-lnc-code
 ;;    collections: lab
 ;;    fields: lnccodes[]/s, observed/V/0
 ;;    sort: observed desc
 ;;lab-type
 ;;    collections: lab
 ;;    fields: typeName/s, observed/V/0
 ;;    sort: observed desc
 ;;vs-type
 ;;    collections: vital
 ;;    fields: typeName/s, observed/V/0
 ;;    sort: observed desc
 ;;lab-qualified-name
 ;;    collections: lab
 ;;    fields: qualifiedName/s, observed/V/0
 ;;    sort: observed desc
 ;;vs-qualified-name
 ;;    collections: vital
 ;;    fields: qualifiedName/s, observed/V/0
 ;;    sort: observed desc
 ;;med-qualified-name
 ;;    collections: med
 ;;    fields: qualifiedName/s, overallStop/V/0
 ;;    sort: overallStop desc
 ;;med-class-code
 ;;    collections: med
 ;;    fields: products[].drugClassCode/s, overallStop/V/0
 ;;    sort: overallStop desc
 ;;med-ingredient-name
 ;;    collections: med
 ;;    fields: products[].ingredientName/s, overallStop/V/0
 ;;    sort: overallStop desc
 ;;med-provider
 ;;    collections: med
 ;;    fields: orders[].provider.name/s, overallStop/V/0
 ;;    sort: overallStop desc
 ;;visit-stop-code
 ;;    collections: visit
 ;;    fields: stopCodeUid/S, dateTime/V
 ;;    sort: dateTime desc
 ;;proc-type
 ;;    collections: consult
 ;;    fields: typeName/s, dateTime/V/0
 ;;imm-name
 ;;    collections: immunization
 ;;    fields: name/s, administeredDateTime/V/0
 ;;    sort: adminisiteredDateTime desc
 ;;provider
 ;;    collections: allergy,consult,document,visit,appointment,immunization,med,order,problem,procedure,surgery,image
 ;;    fields: providerName/s, dateTime/V
 ;;    fields.allergy: enteredByName, entered
 ;;    fields.allergy: verifiedByName, entered
 ;;    fields.consult: providers[].provider.name, dateTime
 ;;    fields.document: clinicians[].clinician.name, referenceDateTime
 ;;    fields.visit: providers[].provider.name, dateTime
 ;;    fields.appointment: providers[].provider.name, dateTime
 ;;    fields.immunization: perfomer, administeredDateTime
 ;;    fields.med: orders[].provider.name, overallStop
 ;;    fields.order: providerName, start
 ;;    fields.problem: providerName, updated
 ;;    fields.procedure: providers[].provider.name, dateTime
 ;;    fields.surgery: providers[].provider.name, dateTime
 ;;    fields.image: providers[].provider.name, dateTime
 ;;    sort: dateTime desc, providerName asc
 ;;io-observations
 ;;    collections: obs
 ;;    fields: typeName, observed
 ;;    sort: observed desc, typeName asc
 ;;    setif: $$IO^VPRJFPS
 ;;docs-view
 ;;    collections: consult,document,procedure,surgery,image
 ;;    fields: dateTime/V
 ;;    fields.document: referenceDateTime
 ;;    fields.lab: observed
 ;;    sort: datetime desc
 ;;    setif: $$ALLDOC^VPRJFPS
 ;;zzzzz
 ;
 ; --------------------------------------------------------
IDXMATCH ; match type indexes (sortType defaults to string)
 ;;condition.hyperlipidemia
 ;;    collections: med
 ;;    fields: products[].ingredientName
 ;;    values: SIMVASTATIN
 ;;condition.cardiac
 ;;    collections: med
 ;;    fields: products[].drugClassCode
 ;;    values: urn:vadc:CV050,urn:vadc:CV100,urn:vadc:CV702,urn:vadc:CV250
 ;;condition.bleedingrisk
 ;;    collections: med
 ;;    fields:products[].drugClassCode
 ;;    values: urn:vadc:BL110
 ;;condition.diabetes
 ;;    collections: med
 ;;    fields: products[].drugClassCode
 ;;    values: urn:vadc:HS502
 ;;zzzzz
 ;
 ; --------------------------------------------------------
XIDXATTR ; cross-patient attribute indexes
 ;;patient
 ;;    collections: patient
 ;;    sort: name asc
 ;;alert
 ;;    collections: alert
 ;;    fields: links[].uid
 ;;    sort: referenceDateTime desc
 ;;document-all
 ;;    collections: document
 ;;    fields: uid/s
 ;;    sort: referenceDateTime desc
 ;;task-pending
 ;;    collections: task
 ;;    fields: taskName/s, createdByCode, dueDate/V/0
 ;;    sort: dueDate asc
 ;;    setif: $$TASKPND^VPRJFPS
 ;;zzzzz
 ;
 ; --------------------------------------------------------
DOMAIN ; map collections to domains
 ;;allergy:allergy
 ;;document:document
 ;;visit:encounter
 ;;appointment:encounter
 ;;factor:healthfactor
 ;;immunization:immunization
 ;;med:medication
 ;;obs:observation
 ;;order:order
 ;;consult:consult
 ;;procedure:procedure
 ;;surgery:procedure
 ;;image:procedure
 ;;consult:procedure
 ;;problem:problem
 ;;lab:laboratory
 ;;vital:vitalsign
 ;;mh:mentalhealth
 ;;patient:demographics
 ;;task:task
 ;;diagnosis:diagnosis
 ;;roadtrip:roadtrip
 ;;auxiliary:auxiliary
 ;;treatment:treatment
 ;;zzzzz
