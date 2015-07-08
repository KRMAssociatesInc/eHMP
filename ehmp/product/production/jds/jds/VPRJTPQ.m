VPRJTPQ ;SLC/KCM -- Integration tests for query indexes
 ;;1.0;JSON DATA STORE;;Sep 01, 2012
 ;
STARTUP  ; Run once before all tests
 N I,TAGS
 F I=1:1:5 S TAGS(I)="MED"_I_"^VPRJTP02"
 D BLDPT^VPRJTX(.TAGS)
 K TAGS
 F I=1:1:3 S TAGS(I)="UTST"_I_"^VPRJTP01"
 D ADDDATA^VPRJTX(.TAGS,VPRJTPID)
 Q
SHUTDOWN ; Run once after all tests
 D CLRPT^VPRJTX
 Q
ASSERT(EXPECT,ACTUAL,MSG) ; for convenience
 D EQ^VPRJT(EXPECT,ACTUAL,$G(MSG))
 Q
 ;
TMP2ARY(ARY) ; convert JSON object in ^TMP($J) to array
 ; ARY must be passed by reference
 N SIZE,PREAMBLE
 S HTTPREQ("store")="vpr" ; normally this gets set in RESPOND^VPRJRSP
 D PAGE^VPRJRUT("^TMP($J)",0,999,.SIZE,.PREAMBLE)
 N SRC,N,I,J
 S N=0,SRC(N)="{""apiVersion"":""1.0"",""data"":{""totalItems"":"_^TMP($J,"total")_",""items"":["
 S I="" F  S I=$O(^TMP($J,$J,I)) Q:I=""  D
 . I I S SRC(N)=SRC(N)_","
 . S J=0 F  S J=$O(^TMP($J,$J,I,J)) Q:'J  D
 . . S N=N+1,SRC(N)=^TMP($J,$J,I,J)
 S N=N+1,SRC(N)="]}}"
 D DECODE^VPRJSON("SRC","ARY","ERR")
 D ASSERT(0,$G(ERR(0),0),"JSON conversion error")
 Q
PARSERNG ;; @TEST parse range (using information in ^VPRMETA)
 N RANGE,INDEX,START,STOP,DIR
 S INDEX="lab-type"
 M INDEX=^VPRMETA("index",INDEX,"common")
 S RANGE="GLU..GLZ>2012..2013["
 D PARSERNG^VPRJCR
 D ASSERT("glz ",STOP(1))
 D ASSERT("7986=",START(2))
 D ASSERT(1,DIR(2))
 K START,STOP,DIR
 S RANGE="GLUCOSE, SODIUM, POTASSIUM>2012..2013["
 D PARSERNG^VPRJCR
 D ASSERT(1,$D(START(1,"list","sodium ")))
 D ASSERT(0,$D(START(2,"list")))
 D ASSERT($C(255,255,255),STOP(1))
 Q
JSON ;; @TEST json formatting
 N HTTPERR
 K ^TMP($J)
 D QINDEX^VPRJPQ(VPRJTPID,"med-ingredient-name","METFOR*",,,"uid")
 D ASSERT(0,$D(HTTPERR))
 N ARY D TMP2ARY(.ARY)
 ; reverse chronological order, so 16982 is 3rd item in list
 D ASSERT("urn:va:med:93EF:-7:16982",ARY("data","items",3,"uid"))
 D ASSERT(3,ARY("data","totalItems"))
 Q
TIME ;; @TEST time based query
 N HTTPERR
 K ^TMP($J)
 D QINDEX^VPRJPQ(VPRJTPID,"med-time","20060101..20061231")
 D ASSERT(0,$D(HTTPERR))
 N ARY D TMP2ARY(.ARY)
 D ASSERT(3,ARY("data","totalItems"))
 D ASSERT(20060531,ARY("data","items",1,"overallStart"))
 D ASSERT(20060318,ARY("data","items",3,"overallStop"))
 D ASSERT("250 MG",ARY("data","items",3,"dosages",1,"dose"))
 Q
TIMEASC ;; @TEST ascending order
 N HTTPERR
 K ^TMP($J)
 D QINDEX^VPRJPQ(VPRJTPID,"med-time","20060101..20061231","asc",4)
 N ARY D TMP2ARY(.ARY)
 D ASSERT(3,ARY("data","totalItems"))
 D ASSERT(20060318,ARY("data","items",1,"overallStop"))
 D ASSERT(20060531,ARY("data","items",3,"overallStart"))
 ; spot check a few values
 D ASSERT("urn:vuid:4023979",ARY("data","items",1,"products",1,"ingredientCode"))
 D ASSERT("VEHU,ONEHUNDRED",ARY("data","items",2,"orders",1,"provider","name"))
 D ASSERT("500 MG",ARY("data","items",3,"dosages",1,"dose"))
 Q
TIMEIF ;; @TEST setif on time index
 N HTTPERR
 K ^TMP($J)
 D QINDEX^VPRJPQ(VPRJTPID,"utest-time")
 N ARY,I
 D TMP2ARY(.ARY)
 S I=0 F  S I=$O(ARY("data","items",I)) Q:'I  D ASSERT(1,ARY("data","items",I,"color")'="yellow")
 D ASSERT(3,ARY("data","totalItems"))
 Q
SORTSTOP ;; @TEST sorting by the stop time on time based index
 N HTTPERR
 K ^TMP($J)
 D QINDEX^VPRJPQ(VPRJTPID,"med-time","","overallStop asc")
 N ARY D TMP2ARY(.ARY)
 D ASSERT("20060318",ARY("data","items",1,"overallStop")) ; ascending
 D ASSERT(0,$D(ARY("data","items",5,"overallStop")))      ; last item has no stop date
 D ASSERT("urn:va:med:93EF:-7:18068",ARY("data","items",5,"uid"))
 Q
ATTR ;; @TEST attribute query
 N HTTPERR
 K ^TMP($J)
 D QINDEX^VPRJPQ(VPRJTPID,"med-ingredient-name","METFOR*")
 N ARY D TMP2ARY(.ARY)
 D ASSERT(3,ARY("data","totalItems"))
 K ^TMP($J)
 D QINDEX^VPRJPQ(VPRJTPID,"med-ingredient-name","[ASPIRIN..METFORMIN]")
 K ARY D TMP2ARY(.ARY)
 D ASSERT(4,ARY("data","totalItems"))
 Q
ATTRLIM ;; @TEST attribute query with bail limits on return
 N HTTPERR
 K ^TMP($J)
 D QINDEX^VPRJPQ(VPRJTPID,"med-ingredient-name","METFOR*",,1)
 N ARY D TMP2ARY(.ARY)
 D ASSERT(1,ARY("data","totalItems"))
 Q
LIST ;; @TEST list based query
 N HTTPERR
 K ^TMP($J)
 D QINDEX^VPRJPQ(VPRJTPID,"med-active-outpt")
 N ARY D TMP2ARY(.ARY)
 D ASSERT(2,ARY("data","totalItems"))
 Q
LAST ;; @TEST most recent query
 N HTTPERR
 K ^TMP($J)
 D QLAST^VPRJPQ(VPRJTPID,"med-qualified-name")
 N ARY D TMP2ARY(.ARY)
 D ASSERT("urn:va:med:93EF:-7:18069",ARY("data","items",1,"uid"))
 D ASSERT("urn:va:med:93EF:-7:17203",ARY("data","items",2,"uid"))
 D ASSERT("urn:va:med:93EF:-7:18068",ARY("data","items",3,"uid"))
 K ^TMP($J)
 D QLAST^VPRJPQ(VPRJTPID,"med-class-code","urn:vadc:HS502, urn:vadc:CN103, urn:vadc:XX000")
 K ARY D TMP2ARY(.ARY)
 D ASSERT(2,ARY("data","totalItems"))
 D ASSERT("urn:va:med:93EF:-7:18069",ARY("data","items",1,"uid"))
 D ASSERT("urn:va:med:93EF:-7:18068",ARY("data","items",2,"uid"))
 Q
MATCH ;; match query (DISABLED for NOW)
 N HTTPERR
 K ^TMP($J)
 ;D QINDEX^VPRJPQ(VPRJTPID,"condition.bleedingrisk")
 ;N ARY D TMP2ARY(.ARY)
 D ASSERT(1,$G(ARY("data","totalItems")))
 D ASSERT("urn:vadc:BL110",$G(ARY("data","items",1,"products",1,"drugClassCode")))
 Q
TALLY ;; @TEST tally items
 N HTTPERR
 K ^TMP($J)
 D QTALLY^VPRJPQ(VPRJTPID,"kind")
 N ARY
 D DECODE^VPRJSON("^TMP($J)","ARY","ERR")
 D ASSERT(0,$G(ERR(0),0),"JSON conversion error")
 D ASSERT(2,ARY("data","totalItems"))
 D ASSERT(4,ARY("data","items",2,"count"))
 Q
UID ;; @TEST get uid
 N HTTPERR
 K ^TMP($J)
 D QKEY^VPRJPQ(VPRJTPID,"urn:va:med:93EF:-7:17266")
 N ARY D TMP2ARY(.ARY)
 D ASSERT("402924;O",ARY("data","items",1,"localId"))
 D ASSERT("urn:vuid:4023979",ARY("data","items",1,"products",1,"ingredientCode"))
 Q
ORDER ;; @TEST sorting on different field
 N HTTPERR
 K ^TMP($J)
 D QINDEX^VPRJPQ(VPRJTPID,"medication","","qualifiedName")
 N ARY D TMP2ARY(.ARY)
 D ASSERT("ASPIRIN",ARY("data","items",1,"qualifiedName"))
 K ^TMP($J)
 D QINDEX^VPRJPQ(VPRJTPID,"medication","","qualifiedName desc")
 K ARY D TMP2ARY(.ARY)
 D ASSERT("WARFARIN",ARY("data","items",1,"qualifiedName"))
 Q
1 ; do one test
 D STARTUP,SORTSTOP,SHUTDOWN
 Q
