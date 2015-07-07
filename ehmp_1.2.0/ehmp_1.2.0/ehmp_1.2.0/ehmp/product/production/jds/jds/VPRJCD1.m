VPRJCD1 ;SLC/KCM -- Build meta data (specific)
 ;;1.0;JSON DATA STORE;;Sep 01, 2012
 ;
IDXSPEC(CLTNS,FIELDS,ATTR,SPEC) ; Build SPEC for index type
 ;.CLTNS(CLTN): set of collections
 ;.FIELDS(0,SEQ): default field specifier in subscript order of index
 ;.FIELDS(CLTN,SEQ): field specifiers that override default per collection
 ;.ATTR: index attributes such as style and sort
 ;.SPEC("common","method")=attr,time,tally,etc.
 ;.SPEC("common","order")=default sort expression
 ;.SPEC("common","alias",SEQ)=default fields for index (names used for order, filter, etc.)
 ;.SPEC("common","collate",SEQ)=collation for each subscript in index
 ;.SPEC("common","levels")=number of subscripts in index
 ;.SPEC("collection",CLTN,"method")=attr,time,tally,etc.
 ;.SPEC("collection",CLTN,"review")=function to determine review data for this index
 ;.SPEC("collection",CLTN,"setif")=function to determine if index should be set
 ;.SPEC("collection",CLTN,POS,"method")=assignment method (see below)
 ;.SPEC("collection",CLTN,POS,"collate")=collation type for this field
 ;.SPEC("collection",CLTN,POS,"ifNull")=optional value to use if there is no value
 ;.SPEC("collection",CLTN,POS,"combine")=strategy to combine instances at this level
 ;.SPEC("collection",CLTN,POS,"srcXXX",...)=source field specification
 ;.SPEC("collection",CLTN,POS,"valXXX",...)=values array specification
 ;
 ; TODO: add support for MATCH and CODES (pass thru in ATTR?)
 ;
 N POS,CLTN,USED,FLDNUM,COMBINE
 I '$L($G(ATTR("style"))) D SETERR^VPRJCD("Index style missing") Q
 S SPEC("common","method")=ATTR("style")
 I $L($G(ATTR("sort"))),(ATTR("sort")'="<none>") S SPEC("common","order")=ATTR("sort")
 ;
 S SPEC("common","levels")=0
 S POS=0 F  S POS=$O(FIELDS(0,POS)) Q:'POS  D  Q:$G(ERRORS)
 . I FIELDS(0,POS)="<none>",(POS>1) D SETERR^VPRJCD("<none> must be only field name") Q
 . I FIELDS(0,POS)="<none>" Q
 . N COLLATE
 . S COLLATE=$$TRIM^XLFSTR($P(FIELDS(0,POS),"/",2))
 . I '$L(COLLATE) S COLLATE=$S(ATTR("style")="tally":"p",1:"s")
 . S SPEC("common","collate",POS)=COLLATE
 . S SPEC("common","alias",$P($P(FIELDS(0,POS),"/"),"|"))=POS
 . S SPEC("common","levels")=POS
 ;
 S CLTN="" F  S CLTN=$O(CLTNS(CLTN)) Q:CLTN=""  D  Q:$G(ERRORS)
 . S SPEC("collection",CLTN,"method")=ATTR("style")
 . S SPEC("collection",CLTN,"setif")=$G(ATTR("setif"))
 . S SPEC("collection",CLTN,"review")=$G(ATTR("review"))
 . S SPEC("collection",CLTN,"metatype")=$G(ATTR("metatype"))
 . S SPEC("collection",CLTN,"levels")=SPEC("common","levels")
 . S POS=0 F  S POS=$O(FIELDS(0,POS)) Q:'POS  D  Q:$G(ERRORS)
 . . Q:FIELDS(0,POS)="<none>"
 . . I $D(FIELDS(CLTN)),'$D(FIELDS(CLTN,POS)) D  QUIT
 . . . I ATTR("style")="time",(POS=2) Q  ; missing stop time allowed
 . . . ; otherwise error --
 . . . D SETERR^VPRJCD("All fields must be named for collection override.")
 . . N COLLATE,IFNULL,FIELD,FLDSPEC,VALSPEC
 . . S COLLATE=$$TRIM^XLFSTR($P(FIELDS(0,POS),"/",2))
 . . S IFNULL=$$TRIM^XLFSTR($P(FIELDS(0,POS),"/",3))
 . . I '$L(COLLATE) S COLLATE=$S(ATTR("style")="tally":"p",1:"s")
 . . S SPEC("collection",CLTN,POS,"collate")=SPEC("common","collate",POS)
 . . S SPEC("collection",CLTN,POS,"ifNull")=IFNULL
 . . S FIELD=$P($G(FIELDS(CLTN,POS)),"/") S:'$L(FIELD) FIELD=$P(FIELDS(0,POS),"/")
 . . I '$L(FIELD) D SETERR^VPRJCD("Bad field name.") Q
 . . F FLDNUM=1:1:$L(FIELD,"|") D  ; allow multiple fields in the same position
 . . . D FLDSPEC^VPRJCD($P(FIELD,"|",FLDNUM),.FLDSPEC,"src")
 . . . S SPEC("collection",CLTN,POS,"merge")=FLDSPEC("merge") K FLDSPEC("merge")
 . . . M SPEC("collection",CLTN,POS,FLDNUM)=FLDSPEC
 . . ;
 . . ; if multiple fields, everything will be based on the value of the LAST field
 . . ; move merge "up" a subscript -- kind of jury-rigged at the moment
 . . D VALSPEC^VPRJCD(POS,+$G(FLDSPEC("srcArrays")),.VALSPEC)
 . . M SPEC("collection",CLTN,POS)=VALSPEC
 . . ;
 . . ; default 0 means no arrays in this field spec
 . . ; if there were arrays, 1 means instance path previously used
 . . ;                       2 means new instance path
 . . S COMBINE=0                                           ;all fwd
 . . I $L(FLDSPEC("srcArrayPath")) D
 . . . I $D(USED(FLDSPEC("srcArrayPath"))) S COMBINE=1 I 1 ;same instance
 . . . E  S USED(FLDSPEC("srcArrayPath"))="",COMBINE=2     ;combine
 . . S SPEC("collection",CLTN,POS,"combine")=COMBINE
 Q
COMBINE(PATH,USED) ; Return method for combining with previous values
 ; 0: no change in instance, bring all preceding forward
 ; 1: bring only same instance forward
 ; 2: bring foward all instances and combine with this new one
 ; 3: bring foward same instance parent and combine with this one
 Q:'$L(PATH) 0
 Q:$D(USED(PATH)) 1
 ;
 N X,LEN,SAME
 S SAME=1
 S X="" F  S X=$O(USED(X)) Q:X=""  D  Q:'SAME
 . S LEN=$S($L(PATH)>$L(X):$L(X),1:$L(PATH))
 . S SAME=($E(PATH,1,LEN)=$E(X,1,LEN))
 S USED(PATH)=""
 Q $S(SAME:3,1:2)
 ;
LINKSPEC(CLTNS,FIELDS,ATTR,SPEC) ; build .SPEC info for link relationship
 ;.CLTNS(CLTN)="" ;set of collections
 ;.FIELDS(CLTN,1)=field specifier ;{target>}source{;template}
 ;.ATTR(name)=value ;attributes (like rev field name) for the relationship
 ;.SPEC("common","rel")=relName ; relation (link) name
 ;.SPEC("common","rev")=fldName ; name of field to add for reverse links
 ;.SPEC("collection",collection,1,1,"srcXXX",...)=source field specification
 ;.SPEC("collection",collection,1,"tgtXXX",...)=target field specification
 ;.SPEC("collection",collection,1,"valXXX",...)=values array specification
 ;
 ; note: 3rd subscript is "position", always 1 for links
 ;       subscript preceding "srcXXX" is field number, always 1 for links
 ;
 ; Assignment Methods:  0: x=a  1: x[].y=a[].b  2: x[].y[].z=a[].b[].c
 ;                     99: all others
 ;
 N CLTN,FIELD
 S SPEC("common","rel")=ATTR("name")
 I $L($G(ATTR("rev"))) D
 . S SPEC("common","rev")=$P(ATTR("rev"),";")
 . S SPEC("common","revTemplate")=$P(ATTR("rev"),";",2)
 S CLTN="" F  S CLTN=$O(CLTNS(CLTN)) Q:CLTN=""  D
 . S FIELD=$G(FIELDS(CLTN,1)) S:'$L(FIELD) FIELD=$G(FIELDS(0,1))
 . I '$L(FIELD) D SETERR^VPRJCD("Missing field ref for collection: "_CLTN) Q
 . ;
 . N SRCFLD,SRCSPEC,TGTFLD,TGTSPEC,VALSPEC,ERRORS
 . S TGTFLD=$P(FIELD,">"),SRCFLD=$P(FIELD,">",2)
 . I '$L(SRCFLD) S SRCFLD=TGTFLD
 . D FLDSPEC^VPRJCD(SRCFLD,.SRCSPEC,"src") Q:$G(ERRORS)
 . M SPEC("collection",CLTN,1,1)=SRCSPEC
 . D FLDSPEC^VPRJCD(TGTFLD,.TGTSPEC,"tgt") Q:$G(ERRORS)
 . ; override method from TGTSPEC since if it differs from SRCSPEC
 . I TGTSPEC("tgtMethod")'=SRCSPEC("srcMethod") S TGTSPEC("tgtMethod")=99
 . M SPEC("collection",CLTN,1)=TGTSPEC
 . D VALSPEC^VPRJCD(1,+$G(SRCSPEC("srcArrays")),.VALSPEC)
 . M SPEC("collection",CLTN,1)=VALSPEC
 . S SPEC("collection",CLTN,"metatype")=ATTR("metatype")
 Q
TLTSPEC(CLTNS,FIELDS,ATTR,SPEC) ; build .SPEC info for template
 ;.CLTNS(CLTN)=""                 ;set of collections
 ;.FIELDS(CLTN,#)=field specifier ;{target=}source, may include [qualifiers] and/or *
 ;.ATTR(name)=value               ;attributes (exclude, applyOn)
 ;.SPEC("common","applyOn")=S|Q   ; applyOnSave or applyOnQuery
 ;.SPEC("common","exclude")=1     ; true if this is an exclude template
 ;.SPEC("collection",collection,0,"applyOn")=Q for query, S for save
 ;.SPEC("collection",collection,0,"exclude")=1 if excluding fields
 ;.SPEC("collection",collection,0,"instance",srcFld,"srcXXX",...)=instance specification
 ;.SPEC("collection",collection,tgtFld,"srcXXX",...)=source field specification
 ;.SPEC("collection",collection,tgtFld,"tgtXXX",...)=target field specification
 ;.SPEC("collection",collection,tdtFld,"valXXX",...)=values array specification
 ;
 N CLTN
 S SPEC("common","applyOn")=$G(ATTR("applyOn"),"Q")
 S SPEC("common","exclude")=$G(ATTR("exclude"),0)
 S CLTN="" F  S CLTN=$O(CLTNS(CLTN)) Q:CLTN=""  D  Q:$G(ERRORS)
 . S SPEC("collection",CLTN,0,"applyOn")=SPEC("common","applyOn")
 . S SPEC("collection",CLTN,0,"exclude")=SPEC("common","exclude")
 . N FLD,ALLFLDS,INST
 . S FLD="" F  S FLD=$O(FIELDS(0,FLD)) Q:FLD=""  S ALLFLDS(FLD)=FIELDS(0,FLD)
 . S FLD="" F  S FLD=$O(FIELDS(CLTN,FLD)) Q:FLD=""  S ALLFLDS(FLD)=FIELDS(CLTN,FLD)
 . S FLD="" F  S FLD=$O(ALLFLDS(FLD)) Q:FLD=""  D
 . . N SRCFLD,SRCSPEC,TGTFLD,TGTSPEC,DELIM
 . . S DELIM=$S(ALLFLDS(FLD)[">"&(ALLFLDS(FLD)'["<none>"):">",1:"=")
 . . S TGTFLD=$P(ALLFLDS(FLD),DELIM)
 . . S SRCFLD=$P(ALLFLDS(FLD),DELIM,2)
 . . I '$L(SRCFLD) S SRCFLD=TGTFLD
 . . I SRCFLD="<none>" Q
 . . D FLDSPEC^VPRJCD(SRCFLD,.SRCSPEC,"src") Q:$G(ERRORS)
 . . D FLDSPEC^VPRJCD(TGTFLD,.TGTSPEC,"tgt") Q:$G(ERRORS)
 . . D CHKARYS(.SRCSPEC,.TGTSPEC) Q:$G(ERRORS)
 . . M SPEC("collection",CLTN,FLD)=SRCSPEC
 . . M SPEC("collection",CLTN,FLD)=TGTSPEC
 . . S SPEC("collection",CLTN,FLD,"addType")=$S(DELIM=">":2,1:+$G(SRCSPEC("merge")))
 . . S SPEC("collection",CLTN,FLD,"assign")=$$GETMTHD(SRCFLD,TGTFLD,DELIM)
 . . I SPEC("collection",CLTN,0,"exclude") D
 . . . I ",0,20,21,"'[(","_SPEC("collection",CLTN,FLD,"assign")_",") Q
 . . . I $P($P(TGTFLD,"[",2),"]")'="" Q
 . . . S SPEC("collection",CLTN,FLD,"assign")=80 ; top level delete
 . . I $L($G(SRCSPEC("srcInstancePath"))) S INST(SRCSPEC("srcInstancePath"))=""
 . ; after build spec for each field, do spec for any instance paths
 . S FLD="" F  S FLD=$O(INST(FLD)) Q:'$L(FLD)  D
 . . N INSTSPEC
 . . D FLDSPEC^VPRJCD(FLD,.INSTSPEC,"src") Q:$G(ERRORS)
 . . S INSTSPEC("srcMethod")=$$GETMTHD^VPRJCD(FLD,1) ; special case for instances
 . . M SPEC("collection",CLTN,0,"instance",INSTSPEC("srcArrayPath"))=INSTSPEC
 Q
CHKARYS(SRC,TGT) ; check array assignments and set error if necessary
 N TGTCNT,SRCCNT
 S TGTCNT=+$G(TGT("tgtArrays"))
 S SRCCNT=+$G(SRC("srcArrays"))
 I TGTCNT>SRCCNT D SETERR^VPRJCD("too many arrays in target: "_TGT("tgtPath")) Q
 I TGTCNT=0,(SRCCNT>0) D
 . N I S I=0
 . F  S I=$O(SRC("srcArrays",I)) Q:'I  D
 . . I SRC("srcArrays",I,"max")=1 Q
 . . I $L(SRC("srcArrays",I,"collect")) Q
 . . D SETERR^VPRJCD("can't assign array to single value: "_SRC("srcPath"))
 Q
GETMTHD(SRC,TGT,DELIM) ; return method based on source and target fields
 N SRCPAT,TGTPAT
 S SRCPAT=$$GETPTRN(SRC),TGTPAT=$$GETPTRN(TGT)
 I SRCPAT="N",(TGTPAT="N") Q $S($G(DELIM)=">":30,1:0)
 I SRCPAT="AN",(TGTPAT="AN") Q 1
 I SRCPAT="AAN",(TGTPAT="AAN") Q 2
 I SRCPAT="#N",(TGTPAT="N") Q 10
 I SRCPAT="#N",((TGTPAT="#N")!(TGTPAT="AN")) Q 11
 I SRCPAT="#M",((TGTPAT="N")!(TGTPAT="NM")) Q 12
 I SRCPAT="NM",((TGTPAT="N")!(TGTPAT="NM")) Q 20
 I SRCPAT="AM",((TGTPAT="A")!(TGTPAT="AM")) Q 21
 I SRCPAT="AAM",((TGTPAT="AA")!(TGTPAT="AAM")) Q 22
 I SRCPAT="AN",(TGTPAT="A"),($G(DELIM)=">") Q 31
 I SRCPAT="*N",(TGTPAT="N") Q 50
 Q 99
 ;
GETPTRN(FLD) ; return pattern for field
 N PATTERN,NAME,ARRAY,I
 S PATTERN=""
 F I=1:1:$L(FLD,".") D
 . S NAME=$P($P(FLD,".",I),"[")
 . S ARRAY=$P($P(FLD,".",I),"[",2)
 . I '$L(ARRAY) S PATTERN=PATTERN_$S(NAME="*":"M",1:"N") Q
 . I ARRAY="]" S PATTERN=PATTERN_"A" Q
 . I $E(ARRAY)="#" S PATTERN=PATTERN_"#" Q
 . I $E(ARRAY)="*" S PATTERN=PATTERN_"*" Q
 . I +ARRAY S PATTERN=PATTERN_"A" Q
 . S PATTERN=PATTERN_"?"
 Q PATTERN
 ;
