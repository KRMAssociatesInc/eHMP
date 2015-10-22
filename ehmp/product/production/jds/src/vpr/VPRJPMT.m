VPRJPMT ;SLC/KCM -- Meta data for VPR JSON templates
 ;;1.0;JSON DATA STORE;;Sep 01, 2012
 ;
TLT ;;
 ;;summary
 ;;  collections: allergy,consult,document,visit,appointment,factor,immunization,med,obs,order,problem,procedure,surgery,image,lab,vital,patient
 ;;  directives: include, applyOnSave
 ;;  fields: uid, dateTime, facilityName, summary
 ;;  fields.allergy: dateTime=<none>
 ;;  fields.consult: typeName, summary=<none>
 ;;  fields.document: referenceDateTime, localTitle, subject, summary=<none>, dateTime=<none>
 ;;  fields.visit: kind, locationName, specialty, summary=<none>, dateTime=<none>
 ;;  fields.appointment: kind, locationName, specialty, summary=<none>, dateTime=<none>
 ;;  fields.factor: recorded, dateTime=<none>
 ;;  fields.immunization: administeredDateTime, dateTime=<none>
 ;;  fields.med: overallStart, overallStop, medStatusName, dateTime=<none>
 ;;  fields.obs: observed, dateTime=<none>
 ;;  fields.order: start, stop, dateTime=<none>
 ;;  fields.problem: statusName, dateTime=<none>
 ;;  fields.procedure: typeName, summary=<none>
 ;;  fields.surgery: typeName, summary=<none>
 ;;  fields.image: typeName, summary=<none>
 ;;  fields.lab: observed, typeName, specimen, result, units, interpretationName, low, high, comment, summary=<none>, dateTime=<none>
 ;;  fields.vital: observed, typeName, result, units, interpretationName, low, high, summary=<none>, dateTime=<none>
 ;;  fields.patient: pid, dateOfBirth, died, familyName, givenNames, displayName, genderName, ssn, icn, sensitive, summary=<none>, dateTime=<none>, facilityName=<none>
 ;;child-document
 ;;  collections: document
 ;;  directives: exclude, applyOnSave
 ;;  fields: localId
 ;;notext
 ;;  collections: document
 ;;  directives: exclude, applyOnSave
 ;;  fields: content, text
 ;;dose
 ;;  collections: med
 ;;  directives: include, applyOnSave
 ;;  fields: uid, qualifiedName, kind, medStatusName, facilityName, lastFilled, vaStatus, vaType, overallStart, overallStop, dosages[].dose, dosages[].start, dosages[].stop,dosages[].relativeStop,dosages[].relativeStart,orders[].fillsRemaining,orders[].daysSupply,orders[].quantityOrdered,orders[].predecessor,orders[].successor
 ;;identifiers
 ;;  collections: allergy,consult,document,visit,appointment,factor,immunization,med,obs,order,problem,procedure,surgery,image,lab,vital,patient
 ;;  directives: include, applyOnSave
 ;;  fields: uid, pid, localId
 ;;
 ;;unit-test-general
 ;;  collections: utesta, utestb
 ;;  directives: include, applyOnSave
 ;;  fields: uid, clinicians=authors[*/].provider.name, dateTime, lastFill=fills[-1].*, ingredients[].name=products[].ingredient
 ;;  fields.utestb: dateTime=adminDateTime
 ;;unit-test-instance
 ;;  collections: utesta
 ;;  directives: include, applyOnSave
 ;;  fields: uid, qualifiedName, dose=dosages[#].dose, start=dosages[#].start, stop=dosages[#].stop
 ;;unit-test-exclude
 ;;  collections: utesta
 ;;  directives: exclude, applyOnSave
 ;;  fields: content, fills, products[].drugClass
 ;;unit-test-summary
 ;;  collections: utesta,utestb,utestc
 ;;  directives: include, applyOnSave
 ;;  fields: uid, dateTime, facilityName, summary
 ;;  fields.utestb: dateTime=adminDateTime
 ;;  fields.utestc: name, dateTime=<none>, summary=<none>
 ;;unit-test-expand-1
 ;;  collections: utestc
 ;;  directives: include, applyOnSave
 ;;  fields: uid, localId, from>from
 ;;unit-test-expand-2
 ;;  collections: utestc
 ;;  directives: include, applyOnSave
 ;;  fields: uid, items[]>items[].uid
 ;;unit-test-query
 ;;  collections: utestc
 ;;  directives: include, applyOnQuery
 ;;  fields: uid, localId, name, text
 ;;zzzzz
