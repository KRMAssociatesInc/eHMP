VPRJUCU ;SLC/KCM -- Unit tests for common utilities
 ;;1.0;JSON DATA STORE;;Sep 01, 2012
 ;
STARTUP  ; Run once before all tests
 Q
SHUTDOWN ; Run once after all tests
 Q
SETUP    ; Run before each test
 Q
TEARDOWN ; Run after each test
 Q
ASSERT(EXPECT,ACTUAL) ; convenience
 D EQ^VPRJT(EXPECT,ACTUAL)
 Q
 ;
SPACES ;; @TEST returning spaces piece
 D ASSERT("DEF",$$SPC^VPRJCU("ABC   DEF HIJ",2))
 D ASSERT("HIJ",$$SPC^VPRJCU("ABC   DEF HIJ",3))
 D ASSERT("ABC",$$SPC^VPRJCU("ABC   DEF HIJ"))
 Q
SPLIT ;; @TEST split function
 N LST D SPLIT^VPRJCU("one",.LST) D ASSERT(1,$$QCNT^VPRJTX("LST"))
 K LST D SPLIT^VPRJCU("1,2,3,4",.LST) D ASSERT(4,$$QCNT^VPRJTX("LST"))
 K LST D SPLIT^VPRJCU("1,2,3,",.LST) D ASSERT(3,$$QCNT^VPRJTX("LST"))
 K LST D SPLIT^VPRJCU("one/two/three",.LST,"/") D ASSERT(3,$$QCNT^VPRJTX("LST"))
 Q
NXTSTR ;; @TEST parsing quoted strings
 ;;"one","Hamlet said ""To be or not to be""","three"
 ;;'one','Hamlet said "To be or not to be"','three'
 N X,I,RSLT
 S X=$P($T(NXTSTR+1),";;",2,999),I=7 D NXTSTR^VPRJCU(.X,.I,.RSLT)
 D ASSERT(43,I)
 D ASSERT("Hamlet said ""To be or not to be""",RSLT)
 D ASSERT(32,$L(RSLT))
 S I=I+1 D NXTSTR^VPRJCU(.X,.I,.RSLT)
 D ASSERT("three",RSLT)
 S X=$P($T(NXTSTR+2),";;",2,999),I=7 D NXTSTR^VPRJCU(.X,.I,.RSLT,"'")
 D ASSERT("Hamlet said ""To be or not to be""",RSLT)
 D ASSERT(32,$L(RSLT))
 Q
ERRSTR ;; @TEST parsing quoted strings with errors
 ;;"this is a string without a close quote
 ;;"this is a string with the "wrong number" of quotes"
 N X,I,RSLT,HTTPERR
 S X=$P($T(ERRSTR+1),";;",2,999),I=1
 D NXTSTR^VPRJCU(.X,.I,.RSLT)
 D ASSERT(1,$D(HTTPERR))
 K HTTPERR
 S X=$P($T(ERRSTR+2),";;",2,999),I=1
 D NXTSTR^VPRJCU(.X,.I,.RSLT)
 D NXTSTR^VPRJCU(.X,.I,.RSLT)
 D NXTSTR^VPRJCU(.X,.I,.RSLT)
 D NXTSTR^VPRJCU(.X,.I,.RSLT)
 D ASSERT(1,$D(HTTPERR))
 D ASSERT(0,I)
 Q
NXTVAL ;; @TEST parsing until token
 ;;one..three>low,medium,high>"Doe,John".."Welby,Marcus"
 N X,I,RSLT
 S X=$P($T(NXTVAL+1),";;",2,999),I=1 D NXTVAL^VPRJCU(.X,.I,.RSLT,".,>")
 D ASSERT("one",RSLT)
 S I=6 D NXTVAL^VPRJCU(.X,.I,.RSLT,".,>")
 D ASSERT("three",RSLT)
 S I=28 d NXTVAL^VPRJCU(.X,.I,.RSLT,".,>")
 D ASSERT("""Doe",RSLT)
 D ASSERT(32,I)
 Q
