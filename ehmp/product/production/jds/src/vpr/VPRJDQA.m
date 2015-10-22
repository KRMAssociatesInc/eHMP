VPRJDQA ;SLC/KCM -- Query using attribute indexes for JSON objects
 ;;1.0;JSON DATA STORE;;Sep 01, 2012
 ;
 ;defined at the QINDEX level:
 ;   INDEX:  Name of the index
 ;   RANGE:  range of values, examples:  A..Z, GLUCOSE*>2010..2013, A,C,E
 ;   ORDER:  sequence of the returned valuse, examples:  desc | facilityName asc
 ;    BAIL:  maximum number of matches to return
 ;  METHOD:  style of index, "attr", "time"
 ;  FILTER:  criteria statement to further limit returned results
 ; CLAUSES:  clauses to apply filter to each object
 ;
QATTR ; return items where attribute value is in range
 ; Build ^TMP("VPRDATA",$J,sortkey,sortkey,...,key,instances) with keys of objects to return
 ; Expects:  VPRDATA,METHOD,RANGE,INDEX,ORDER,CLAUSES,BAIL
 N START,STOP,DIR,SUB,KEY,INST
 D PARSERNG^VPRJCR
 I $G(IDXLAST)=1 D  ; handle finding last or latest items
 . S DIR(INDEX("levels"))=$S(INDEX("collate",INDEX("levels"))="V":1,1:-1)
 . I INDEX("levels")=0  D L0 Q
 . I INDEX("levels")=1  D L1 Q
 . I INDEX("levels")=2  D L2 Q
 . I INDEX("levels")=3  D L3 Q
 E  D               ; normal search loops
 . I INDEX("levels")=0  D A0 Q
 . I INDEX("levels")=1  D A1 Q
 . I INDEX("levels")=2  D A2 Q
 . I INDEX("levels")=3  D A3 Q
 Q
A0 ; unsorted list
 S KEY="" F  S KEY=$O(^VPRJDX(METHOD,INDEX,KEY)) Q:KEY=""  Q:VPRDATA'<BAIL  D ADDONE(KEY,0)
 Q
A1 ; sorted list / attribute only
 S SUB(1)=START(1) F  S SUB(1)=$$NXT1 Q:SUB(1)=""  Q:SUB(1)]]STOP(1)  Q:VPRDATA'<BAIL  D
 . S KEY="" F  S KEY=$O(^VPRJDX(METHOD,INDEX,SUB(1),KEY)) Q:KEY=""  Q:VPRDATA'<BAIL  D
 . . S INST="" F  S INST=$O(^VPRJDX(METHOD,INDEX,SUB(1),KEY,INST)) Q:INST=""  Q:VPRDATA'<BAIL  D ADDONE(KEY,INST,.SUB)
 Q
A2 ; two attributes / attribute with sort
 S SUB(1)=START(1) F  S SUB(1)=$$NXT1 Q:SUB(1)=""  Q:SUB(1)]]STOP(1)  Q:VPRDATA'<BAIL  D
 . S SUB(2)=START(2) F  S SUB(2)=$$NXT2 Q:SUB(2)=""  Q:SUB(2)]]STOP(2)  Q:VPRDATA'<BAIL  D
 . . S KEY="" F  S KEY=$O(^VPRJDX(METHOD,INDEX,SUB(1),SUB(2),KEY)) Q:KEY=""  Q:VPRDATA'<BAIL  D
 . . . S INST="" F  S INST=$O(^VPRJDX(METHOD,INDEX,SUB(1),SUB(2),KEY,INST)) Q:INST=""  Q:VPRDATA'<BAIL  D ADDONE(KEY,INST,.SUB)
 Q
A3 ; three attributes
 S SUB(1)=START(1) F  S SUB(1)=$$NXT1 Q:SUB(1)=""  Q:SUB(1)]]STOP(1)  Q:VPRDATA'<BAIL  D
 . S SUB(2)=START(2) F  S SUB(2)=$$NXT2 Q:SUB(2)=""  Q:SUB(2)]]STOP(2)  Q:VPRDATA'<BAIL  D
 . . S SUB(3)=START(3) F  S SUB(3)=$$NXT3 Q:SUB(3)=""  Q:SUB(3)]]STOP(3)  Q:VPRDATA'<BAIL  D
 . . . S KEY="" F  S KEY=$O(^VPRJDX(METHOD,INDEX,SUB(1),SUB(2),SUB(3),KEY)) Q:KEY=""  Q:VPRDATA'<BAIL  D
 . . . . S INST="" F  S INST=$O(^VPRJDX(METHOD,INDEX,SUB(1),SUB(2),SUB(3),KEY,INST)) Q:INST=""  Q:VPRDATA'<BAIL  D ADDONE(KEY,INST,.SUB)
 Q
NXT1() ;
 I START(1,"collate")="L" S SUB(1)=$O(START(1,"list",SUB(1))) Q SUB(1)
 Q $O(^VPRJDX(METHOD,INDEX,SUB(1)),DIR(1))
 ;
NXT2() ;
 I START(2,"collate")="L" S SUB(2)=$O(START(2,"list",SUB(2))) Q SUB(2)
 Q $O(^VPRJDX(METHOD,INDEX,SUB(1),SUB(2)),DIR(2))
 ;
NXT3() ;
 I START(3,"collate")="L" S SUB(3)=$O(START(3,"list",SUB(3))) Q SUB(3)
 Q $O(^VPRJDX(METHOD,INDEX,SUB(1),SUB(2),SUB(3)),DIR(3))
 ;
L0 ; unsorted list
 S KEY="" S KEY=$O(^VPRJDX(METHOD,INDEX,KEY),-1) Q:KEY=""  Q:VPRDATA'<BAIL  D ADDONE(KEY,0)
 Q
L1 ; sorted list / attribute only
 S SUB(1)="" S SUB(1)=$$NXT1 Q:SUB(1)=""  Q:SUB(1)]]STOP(1)  Q:VPRDATA'<BAIL  D
 . S KEY=$O(^VPRJDX(METHOD,INDEX,SUB(1),"")) Q:KEY=""  Q:VPRDATA'<BAIL  D
 . . S INST=$O(^VPRJDX(METHOD,INDEX,SUB(1),KEY,"")) Q:INST=""  Q:VPRDATA'<BAIL  D ADDONE(KEY,INST,.SUB)
 Q
L2 ; two attributes / attribute with sort
 S SUB(1)=START(1) F  S SUB(1)=$$NXT1 Q:SUB(1)=""  Q:SUB(1)]]STOP(1)  Q:VPRDATA'<BAIL  D
 . S SUB(2)="" S SUB(2)=$$NXT2 Q:SUB(2)=""  Q:SUB(2)]]STOP(2)  Q:VPRDATA'<BAIL  D
 . . S KEY=$O(^VPRJDX(METHOD,INDEX,SUB(1),SUB(2),"")) Q:KEY=""  Q:VPRDATA'<BAIL  D
 . . . S INST=$O(^VPRJDX(METHOD,INDEX,SUB(1),SUB(2),KEY,"")) Q:INST=""  Q:VPRDATA'<BAIL  D ADDONE(KEY,INST,.SUB)
 Q
L3 ; three attributes
 S SUB(1)=START(1) F  S SUB(1)=$$NXT1 Q:SUB(1)=""  Q:SUB(1)]]STOP(1)  Q:VPRDATA'<BAIL  D
 . S SUB(2)=START(2) F  S SUB(2)=$$NXT2 Q:SUB(2)=""  Q:SUB(2)]]STOP(2)  Q:VPRDATA'<BAIL  D
 . . S SUB(3)="" S SUB(3)=$$NXT3 Q:SUB(3)=""  Q:SUB(3)]]STOP(3)  Q:VPRDATA'<BAIL  D
 . . . S KEY=$O(^VPRJDX(METHOD,INDEX,SUB(1),SUB(2),SUB(3),"")) Q:KEY=""  Q:VPRDATA'<BAIL  D
 . . . . S INST=$O(^VPRJDX(METHOD,INDEX,SUB(1),SUB(2),SUB(3),KEY,"")) Q:INST=""  Q:VPRDATA'<BAIL  D ADDONE(KEY,INST,.SUB)
 Q
ADDONE(KEY,INST,SUB) ; add uid, calculating new sort key if necessary
 ; Expects: .ORDER,.CLAUSES
 I $D(CLAUSES) Q:'$$EVALAND^VPRJCF(.CLAUSES,KEY)  ;apply filter, quit if not true
 N I,SORT,KINST
 S I=0 F  S I=$O(ORDER(I)) Q:'I  S SORT(I)=$S(+ORDER(I):SUB(+ORDER(I)),1:$$SORTVAL(I))
 S VPRDATA=VPRDATA+1
 ; case
 I ORDER(0)=0 S ^TMP("VPRDATA",$J,KEY,INST)="" G X1
 I ORDER(0)=1 S ^TMP("VPRDATA",$J,SORT(1),KEY,INST)="" G X1
 I ORDER(0)=2 S ^TMP("VPRDATA",$J,SORT(1),SORT(2),KEY,INST)="" G X1
 I ORDER(0)=3 S ^TMP("VPRDATA",$J,SORT(1),SORT(2),SORT(3),KEY,INST)="" G X1
 I ORDER(0)=4 S ^TMP("VPRDATA",$J,SORT(1),SORT(2),SORT(3),SORT(4),KEY,INST)="" G X1
 I ORDER(0)=5 S ^TMP("VPRDATA",$J,SORT(1),SORT(2),SORT(3),SORT(4),SORT(5),KEY,INST)="" G X1
 I ORDER(0)=6 S ^TMP("VPRDATA",$J,SORT(1),SORT(2),SORT(3),SORT(4),SORT(5),SORT(6),KEY,INST)="" G X1
 I ORDER(0)=7 S ^TMP("VPRDATA",$J,SORT(1),SORT(2),SORT(3),SORT(4),SORT(5),SORT(6),SORT(7),KEY,INST)="" G X1
X1 ; end case
 Q
 ;
SORTVAL(LEVEL) ; return a value or 0 from data gbl for sorting
 ; Expects: KEY,INST,.ORDER   derived from GETVALS^VPRJCV
 ; LEVEL is the subscript position of the sort key
 ; ORDER(LEVEL) described the value in the format returned by FLDSPEC^VPRJCD
 ; if there is no value, a 0 is used so the sort subscript remains non-null
 N CLTN
 S CLTN=0
 I ORDER(LEVEL,CLTN,"srcMethod")=0 Q $$SRTVAL0
 N IARY
 D EXPINST^VPRJCU(INST,IARY)  ; INST=a#1|b#2>b.c#3 to IARY(arrayPath)=number
 I ORDER(LEVEL,CLTN,"srcMethod")=1 Q $$SRTVAL1
 I ORDER(LEVEL,CLTN,"srcMethod")=2 Q $$SRTVAL2
 I ORDER(LEVEL,CLTN,"srcMethod")=99 Q $$SRTVALR
 Q 0
 ;
SRTVAL0() ; return value for x
 N X,STAMP
 S STAMP=$O(^VPRJD(KEY,""),-1)
 S X=$G(^VPRJD(KEY,STAMP,ORDER(LEVEL,CLTN,"srcPath",1)),0) I $D(^(ORDER(LEVEL,CLTN,"srcPath",1),"\s")) S X=X_" "
 Q $S(X]"":X,1:0)
 ;
SRTVAL1() ; return value for x[instance].y
 N I,X,STAMP
 S STAMP=$O(^VPRJD(KEY,""),-1)
 S I=$G(IARY(ORDER(LEVEL,CLTN,"srcArrays",1,"path"))) Q:'I ""
 S X=$G(^VPRJD(KEY,STAMP,ORDER(LEVEL,CLTN,"srcPath",1),I,ORDER(LEVEL,CLTN,"srcPath",2)),0) I $D(^(ORDER(LEVEL,CLTN,"srcPath",2),"\s")) S X=X_" "
 Q $S(X]"":X,1:0)
 ;
SRTVAL2() ; return value for x[instance].y[instance].z
 N I,J,X,STAMP
 S STAMP=$O(^VPRJD(KEY,""),-1)
 S I=$G(IARY(ORDER(LEVEL,"srcArrays",1,"path"))) Q:'I ""
 S J=$G(IARY(ORDER(LEVEL,"srcArrays",2,"path"))) Q:'J ""
 S X=$G(^VPRJD(KEY,STAMP,ORDER(LEVEL,CLTN,"srcPath",1),I,ORDER(LEVEL,CLTN,"srcPath",2),J,ORDER(LEVEL,CLTN,"srcPath",3)),0) I $D(^(ORDER(LEVEL,CLTN,"srcPath",3),"\s")) S X=X_" "
 Q $S(X]"":X,1:0)
 ;
SRTVALR() ; return value using indirection
 I +$G(ORDER(LEVEL,CLTN,"srcArrays"))=0 Q $G(@ORDER(LEVEL,CLTN,"srcRef"))
 N I,N,X
 D NXTNODE(1)
 Q X
NXTNODE(N) ; loop on the next node given instance
 ; FROM: GETVALR  traverse nodes using recursion
 S I(N)=$G(IARY(ORDER(LEVEL,CLTN,"srcArrays",N,"path"))) I 'I(N) S X=0 QUIT
 I N<ORDER(LEVEL,CLTN,"srcArrays") D NXTNODE(N+1) Q
 S X=$G(@ORDER(LEVEL,CLTN,"srcRef"),0) I $D(@ORDER(LEVEL,CLTN,"srcRef")@("\s")) S X=X_" "
 S:X="" X=0
 Q
 ;
