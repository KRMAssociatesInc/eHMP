VPRJPMR ;SLC/KCM -- Meta data for VPR object relations
 ;;1.0;JSON DATA STORE;;Sep 01, 2012
 ;
 ;;relationshipName
 ;;  collections: collection{, collection, ...}
 ;;  ref: {targetFieldName>}sourceFieldName
 ;;  rev: {reverseRelationFieldName}
LINKED ;; describes relationships (linkages) between collection types
 ;;utest-multiple
 ;;  collections: utestc
 ;;  ref: dest[].obj>items[].uid
 ;;  rev: testItems
 ;;utest-single
 ;;  collections: utestc
 ;;  ref: from
 ;;  rev: testFroms
 ;;utest-ods
 ;;  collections: utestods
 ;;  ref: from[]>items[].uid
 ;;  rev: testFroms
 ;;task-link
 ;;  collections: task
 ;;  ref: link>linkUid
 ;;  rev: tasks
 ;;task-pat-link
 ;;  collections: patient
 ;;  ref: patient>pid
 ;;order-link
 ;;  collections: order
 ;;  ref: results[].result>results[].uid
 ;;document-parent
 ;;  collections: document
 ;;  ref: parent>parentUid
 ;;  rev: childDocs
 ;;procedure-result
 ;;  collections: consult,visit,procedure,surgery,image
 ;;  ref: results[]>results[].uid
 ;;  rev: procedures
 ;;team-category-link
 ;;  collections: team
 ;;  ref: categories[]>categories[].uid
 ;;  rev: teams
 ;;team-positions-link
 ;;  collections: team
 ;;  ref: staff[].position>staff[].positionUid
 ;;  rev: teams
 ;;team-boards-link
 ;;  collections: team
 ;;  ref: staff[].board>staff[].boardUid
 ;;  rev: teams
 ;;team-people-link
 ;;  collections: team
 ;;  ref: staff[].person>staff[].personUid
 ;;  rev: teams
 ;;zzzzz
 ;
 ;
BROKEN(LINK) ;
 N LINKEE,LINKER
 S PID="" F  S PID=$O(^VPRPTI(PID)) Q:'$L(PID)  D
 . S LINKEE="" F  S LINKEE=$O(^VPRPTI(PID,"rev",LINKEE)) Q:'$L(LINKEE)  D
 . . Q:'$D(^VPRPTI(PID,"rev",LINKEE,LINK))
 . . I '$D(^VPRPT(PID,LINKEE)) W !,"Missing: ",LINKEE I 1
 . . E  W !,"Good: ",LINKEE
 Q
 ;N SPEC,CLTN
 ;S CLTN="" F  S CLTN=$O(^VPRMETA("link",LINK,"collection",CLTN)) Q:CLTN=""  D
 ;. N SPEC
 ;. M SPEC=^VPRMETA("link",LINK,"collection",CLTN,1)
