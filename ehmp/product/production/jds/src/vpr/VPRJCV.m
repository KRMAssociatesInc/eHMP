VPRJCV ;SLC/KCM -- Extract Values and Compute Combinations
 ;;1.0;JSON DATA STORE;;Sep 01, 2012
 ;
IDXVALS(OBJECT,VALUES,IDXSPEC) ; return values for indexing
 ; .VALUES(instanceString,subscriptPosition)=value
 ;
 N POSITION,IDXVALS,IDXNAMED
 ; if value at any subscript position is empty string, return no values
 ; IDXVALS(subscript position, instance...)=VALUE
 S POSITION=0 F  S POSITION=$O(IDXSPEC(POSITION)) Q:'POSITION  D GETVALS(.OBJECT,.IDXVALS,.IDXSPEC,POSITION) I '$D(IDXVALS(POSITION)) K IDXVALS Q
 Q:'$D(IDXVALS)
 ;
 ; VALUES(combined instance string, subscript position)=VALUE
 D COMBINE(.IDXVALS,.VALUES,.IDXSPEC)
 ;W ! ZW VALUES
 Q
 ;
 ;
GETVALS(OBJECT,VALS,SPEC,POS) ; put values defined by SPEC into VALS
 ;.VALS(POS,F)=top level value
 ;.VALS(POS,inst,inst,...)=value inside array(s)
 ; POS may be a subscript position (for indexes)
 ; F is field number when multiple fields are in same position
 N F
 S F=0 F  S F=$O(SPEC(POS,F)) Q:'F  D
 . I SPEC(POS,F,"srcMethod")=0  D IVAL0
 . I SPEC(POS,F,"srcMethod")=1  D IVAL1
 . I SPEC(POS,F,"srcMethod")=2  D IVAL2
 . I SPEC(POS,F,"srcMethod")=99 D GETVALR
 Q
 ;
IVAL0 ; get single value with no arrays
 N X
 S X=$G(OBJECT(SPEC(POS,F,"srcPath",1)))
 I X="" S X=$G(SPEC(POS,"ifNull")) Q:X=""
 S X=$$COLLATE(X,$G(SPEC(POS,"collate")))
 S VALS(POS,F)=X
 Q
IVAL1 ; build VALS(n) for x[].y
 N I,X
 S I=0 F  S I=$O(OBJECT(SPEC(POS,F,"srcPath",1),I)) Q:'I  D
 . S X=$G(OBJECT(SPEC(POS,F,"srcPath",1),I,SPEC(POS,F,"srcPath",2)))
 . I X="" S X=$G(SPEC(POS,"ifNull")) Q:X=""
 . S X=$$COLLATE(X,$G(SPEC(POS,"collate")))
 . S VALS(POS,SPEC(POS,F,"srcArrays",1,"path")_"#"_I)=X
 Q
IVAL2 ; build VALS(n) for x[].y[].z
 N I,J,X
 S I=0 F  S I=$O(OBJECT(SPEC(POS,F,"srcPath",1),I)) Q:'I  D
 . S J=0 F  S J=$O(OBJECT(SPEC(POS,F,"srcPath",1),I,SPEC(POS,F,"srcPath",2),J)) Q:'J  D
 . . S X=$G(OBJECT(SPEC(POS,F,"srcPath",1),I,SPEC(POS,F,"srcPath",2),J,SPEC(POS,F,"srcPath",3)))
 . . I X="" S X=$G(SPEC(POS,"ifNull")) Q:X=""
 . . S X=$$COLLATE(X,$G(SPEC(POS,"collate")))
 . . S VALS(POS,SPEC(POS,F,"srcArrays",1,"path")_"#"_I_">"_SPEC(POS,F,"srcArrays",2,"path")_"#"_J)=X
 Q
GETVALR ; build VALS(n) based on .SPEC
 ; VALS(n{,o,p,...})=values subscripted by path of instances
 N I,N,ISTR
 I +$G(SPEC(POS,F,"srcArrays"))=0 S ISTR=F D SET1VAL($G(@SPEC(POS,F,"srcRef"))) Q
 S ISTR=""
 D NXTNODE(1)
 Q
NXTNODE(N) ; loop on the next node
 ; recursive, initially from GETVALR where I,N are newed
 S I(N)=0
 F  S I(N)=$O(@SPEC(POS,F,"srcArrays",N,"ref")) Q:'I(N)  D
 . S ISTR=$P(ISTR,">",1,N),$P(ISTR,">",N)=SPEC(POS,F,"srcArrays",N,"path")_"#"_I(N)
 . I N<SPEC(POS,F,"srcArrays") D NXTNODE(N+1) Q  ; not last array level
 . D SET1VAL($G(@SPEC(POS,F,"srcRef")))
 Q
SET1VAL(VALUE) ; use indirection to set value
 I VALUE="" S VALUE=$G(SPEC(POS,"ifNull")) Q:VALUE=""
 S VALS(POS,ISTR)=$$COLLATE(VALUE,$G(SPEC(POS,"collate")))
 Q
COLLATE(VALUE,CTYPE) ; return value of field for collation
 ; Used by SET1VAL
 ; force times to always be a string rather than a numeric
 ; terminate inverse time with "=" so ":" can used to avoid endpoints when going backwards
 ; terminate strings with "!" so space can be used to include initial string
 ; ASCII order is " ","!",numerals,":","="
 I CTYPE=""  Q VALUE
 I CTYPE="P" Q VALUE
 I CTYPE="p" Q $$LOW^XLFSTR(VALUE)
 I CTYPE="V" Q $TR(VALUE,"0123456789","9876543210")_"="
 I CTYPE="S" Q VALUE_" "
 I CTYPE="s" Q $$LOW^XLFSTR(VALUE)_" "
 I CTYPE="T" Q VALUE_" "
 I CTYPE="N" Q +VALUE
 Q VALUE_" "  ; default to string
 ;
COMBINE(NAMED,COMBINED,SPEC) ; return all the combinations in NAMED as COMBINED
 ;.NAMED(sequence,instanceName)=value
 ; WORKING(pass#,instanceNameCombo,seq#)=value
 N PASS,INAME,LAST,WORKING,SEQ,FINAL
 S PASS=0 F  S PASS=$O(NAMED(PASS)) Q:'PASS  S FINAL=PASS D
 . S INAME="" F  S INAME=$O(NAMED(PASS,INAME)) Q:INAME=""  D
 . . ; handle first level (no previous level to bring forward)
 . . I PASS=1 S WORKING(1,INAME,1)=NAMED(1,INAME) Q
 . . ; otherwise iterate previous level and pull forward if appropriate
 . . S LAST="" F  S LAST=$O(WORKING(PASS-1,LAST)) Q:LAST=""  D
 . . . ; combine=0: pull forward all instances using last instance string
 . . . I SPEC(PASS,"combine")=0 D  Q
 . . . . S SEQ=0 F  S SEQ=$O(WORKING(PASS-1,LAST,SEQ)) Q:'SEQ  S WORKING(PASS,LAST,SEQ)=WORKING(PASS-1,LAST,SEQ)
 . . . . S WORKING(PASS,LAST,PASS)=NAMED(PASS,INAME)
 . . . ; combine=1: pull forward the same instance only
 . . . I SPEC(PASS,"combine")=1,(INAME=LAST) D  Q
 . . . . S SEQ=0 F  S SEQ=$O(WORKING(PASS-1,INAME,SEQ)) Q:'SEQ  S WORKING(PASS,INAME,SEQ)=WORKING(PASS-1,INAME,SEQ)
 . . . . S WORKING(PASS,INAME,PASS)=NAMED(PASS,INAME)
 . . . ; combine=2: pull forward all instances combined with this
 . . . I SPEC(PASS,"combine")=2 D  Q
 . . . . N NNAME S NNAME=LAST_"|"_INAME
 . . . . S SEQ=0 F  S SEQ=$O(WORKING(PASS-1,LAST,SEQ)) Q:'SEQ  S WORKING(PASS,NNAME,SEQ)=WORKING(PASS-1,LAST,SEQ)
 . . . . S WORKING(PASS,NNAME,PASS)=NAMED(PASS,INAME)
 M COMBINED=WORKING(FINAL)
 Q
