VPRJCD ;SLC/KCM -- Build meta data (general)
 ;;1.0;JSON DATA STORE;;Sep 01, 2012
 ;
BLDMETA(METATYPE,TAG,RTN) ; build meta data
 N I,X,METADATA,METACLTN,LINES
 S I=0 F  S I=I+1,X=$P($T(@TAG+I^@RTN),";;",2,99) D  Q:X="zzzzz"
 . I $E(X)]" ",$D(LINES) D                          ; -- new template name
 . . D BLDSPEC(METATYPE,.LINES,.METADATA,.METACLTN) ; build it
 . . K LINES                                        ; clean up for next template
 . . I $D(METADATA("errors","errors")) D SHOWERR(.METADATA) Q  ; bail if errors
 . . M ^VPRMETA($P(METATYPE,":"))=METADATA          ; save it
 . . M ^VPRMETA("collection")=METACLTN              ; map collections to it
 . S LINES=$G(LINES)+1,LINES(LINES)=X
 Q
BLDSPEC(METATYPE,LINES,METADATA,METACLTN) ; build specification
 ; METATYPE: index, link, or template
 ;.LINES(n): contains a set of lines to parse into a specification
 ;.METADATA: contains the spec to be merged into ^VPRMETA(metatype)
 ;.METACLTN: contains the collection names to be merged into ^VPRMETA("collection")
 ;
 ; CLTNS(name)=""          ;name of each collection
 ; FIELDS(0,seq#)=field    ;general field descriptor
 ; FIELDS(ctn,seq#)=field  ;override field descriptor for collection
 ; ATTR(name)=value        ;value for attribute
 ; MATCH(name)=""          ;name used for matching in MATCH type index  l
 ;
 K METADATA,METACLTN
 N I,X,SPECNAME,GROUP,LINE,CLTN,CLTNS,FIELD,FIELDS,ATTR,MATCH,STYLE,ERRORS
 S SPECNAME=$$TRIM^XLFSTR($P(LINES(1)," "))
 S STYLE=$P(METATYPE,":",2),METATYPE=$P(METATYPE,":")
 D ADDATTR("metatype",METATYPE),ADDATTR("style",STYLE),ADDATTR("name",SPECNAME)
 ; parse out collections, attributes, fields
 S (CLTNS,FIELDS)=0
 F LINE=2:1 Q:'$D(LINES(LINE))  S X=$$TRIM^XLFSTR(LINES(LINE)) D
 . S GROUP=$P(X,":"),X=$$TRIM^XLFSTR($P(X,":",2,99))
 . I GROUP="collections" D SPLIT^VPRJCU(X,.CLTNS) Q  ;all
 . I $E(GROUP,1,6)="fields" D  Q                     ;all
 . . F I=1:1:$L(X,",") S FIELD=$$TRIM^XLFSTR($P(X,",",I)) D
 . . . Q:FIELD="<none>"
 . . . I '$L($P(FIELD,"/")) D SETERR("Missing Field Name") Q
 . . . S CLTN=$P(GROUP,".",2) S:'$L(CLTN) CLTN=0
 . . . I METATYPE="template" S FIELDS(CLTN,$$GETTGT(FIELD))=FIELD I 1
 . . . E  S FIELDS(CLTN,I)=FIELD
 . I GROUP="directives" D  Q                         ;templates
 . . N DIR
 . . D SPLIT^VPRJCU(X,.DIR)
 . . S DIR="" F  S DIR=$O(DIR(DIR)) Q:DIR=""  D
 . . . I $$LOW^XLFSTR(DIR)="applyonsave" D ADDATTR("applyOn","S")
 . . . I $$LOW^XLFSTR(DIR)="applyonquery" D ADDATTR("applyOn","Q")
 . . . I $$LOW^XLFSTR(DIR)="exclude" D ADDATTR("exclude",1)
 . . . I $$LOW^XLFSTR(DIR)="include" D ADDATTR("exclude",0)
 . I $E(GROUP,1,3)="ref" D  Q                        ;links
 . . S CLTN=$P(GROUP,".",2) S:'$L(CLTN) CLTN=0
 . . S FIELDS(CLTN,1)=X
 . I GROUP="rev" D ADDATTR("rev",X) Q                ;links
 . I GROUP="setif" D ADDATTR("setif",X) Q            ;index
 . I GROUP="review" D ADDATTR("review",X) Q          ;index
 . I GROUP="sort" D ADDATTR("sort",X) Q              ;index
 . I GROUP="values" D  Q                             ;index
 . . F I=1:1:$L(X,",") S MATCH=$$TRIM^XLFSTR($P(X,",",I)) S:$L(MATCH) MATCH(MATCH)=""
 ;
 ; map collections to specification name
 I $D(CLTNS)<10 D SETERR("No collections specified for "_SPECNAME) Q
 S CLTN="" F  S CLTN=$O(CLTNS(CLTN)) Q:CLTN=""  S METACLTN(CLTN,METATYPE,SPECNAME)=""
 ;
 ; build SPEC based on METATYPE (index, link, template)
 N SPEC
 I METATYPE="index" D IDXSPEC^VPRJCD1(.CLTNS,.FIELDS,.ATTR,.SPEC)
 I METATYPE="link" D LINKSPEC^VPRJCD1(.CLTNS,.FIELDS,.ATTR,.SPEC)
 I METATYPE="template" D TLTSPEC^VPRJCD1(.CLTNS,.FIELDS,.ATTR,.SPEC)
 ; need errors on second node in case spec is named "errors"
 I $G(ERRORS) M METADATA("errors","errors")=ERRORS QUIT
 M METADATA(SPECNAME)=SPEC
 Q
FLDSPEC(FLD,SPEC,TYPE) ; convert field assignment descriptor to .SPEC
 ; defines ERRORS if parsing errors are encountered
 ;.SPEC("xxxArrays")=1                             ;array levels in path
 ;.SPEC("xxxArrays",1)=items                       ;name of array
 ;.SPEC("xxxArrays",1,"collect")=""                ;empty or collect delimiter
 ;.SPEC("xxxArrays",1,"dir")=1                     ;direction for $O, 0 for #
 ;.SPEC("xxxArrays",1,"max")=999999                ;max for $O
 ;.SPEC("xxxArrays",1,"path")=items                ;instance path
 ;.SPEC("xxxArrays",1,"ref")=OBJECT("items",I(n))  ;$O(@(REF(level))
 ;.SPEC("xxxArrayPath")=items                      ;concatenation of all arrays
 ;.SPEC("xxxMethod")=1                             ;method for assigning value
 ;.SPEC("xxxPath")=items[].name                    ;for reference info
 ;.SPEC("xxxPath",n)=items                         ;subscript names for full path
 ;.SPEC("xxxRef")=OBJECT("items",I(1),"name")      ;leaf level reference
 ;.SPEC("xxxTemplate")="summary"                   ;optional expanded value template
 ;
 N I,X,ISARY,ARYCNT,OREF,NODE,COLLECT,TMPLT
 S ARYCNT=0,COLLECT=""
 S OREF=$S(TYPE="tgt":"TARGET(",1:"OBJECT(")
 I TYPE="vpr" S TYPE="src",OREF="^VPRPT(PID,KEY,"
 I TYPE="data" S TYPE="src",OREF="^VPRJD(KEY,"
 S SPEC("merge")=0
 S TMPLT=$P(FLD,";",2),FLD=$P(FLD,";")
 F I=1:1:$L(FLD,".") D
 . S NODE=$P(FLD,".",I),ISARY=(NODE["["),X=$P(NODE,"[")
 . I X="*",(I=$L(FLD,".")) D  Q
 . . I $L(COLLECT) D SETERR("can't combine collect and merge: "_X) Q
 . . S SPEC("merge")=1
 . I '$$NAMEOK(X) D SETERR("bad name: "_X) Q
 . S SPEC(TYPE_"Path",I)=X
 . Q:'ISARY
 . I '$$ARYOK(NODE) D SETERR("bad array specifier") Q
 . S ARYCNT=ARYCNT+1
 . S SPEC(TYPE_"Arrays")=ARYCNT
 . S SPEC(TYPE_"Arrays",ARYCNT)=X
 . S SPEC(TYPE_"Arrays",ARYCNT,"path")=$$BLDIPATH($P(FLD,".",1,I))
 . S SPEC(TYPE_"Arrays",ARYCNT,"ref")=$$BLDREF($P(FLD,".",1,I),OREF)
 . ; for templates
 . I '$L(COLLECT) S COLLECT=$$ARYCLCT(NODE) ; once collect, stay collect
 . S SPEC(TYPE_"Arrays",ARYCNT,"collect")=COLLECT
 . S SPEC(TYPE_"Arrays",ARYCNT,"dir")=$$ARYDIR(NODE)
 . S SPEC(TYPE_"Arrays",ARYCNT,"max")=$$ARYMAX(NODE)
 I $$LASTARY(FLD,"#") S SPEC(TYPE_"InstancePath")=$P(FLD,".",1,$$LASTARY(FLD,"#"))
 S SPEC(TYPE_"ArrayPath")=$S(ARYCNT:$$BLDIPATH($P(FLD,".",1,$$LASTARY(FLD))),1:"")
 S SPEC(TYPE_"Path")=FLD
 S SPEC(TYPE_"Ref")=$$BLDREF(FLD,OREF)
 S SPEC(TYPE_"Method")=$$GETMTHD(FLD)
 I $L(TMPLT) S SPEC(TYPE_"Template")=TMPLT
 Q
BLDREF(FLD,VARNM) ; build a reference for use with indirection
 N I,OREF,ARYCNT,LASTARY
 S OREF="",ARYCNT=0,LASTARY=0
 S VARNM=$G(VARNM,"OBJECT(")
 F I=1:1:$L(FLD,".") I $P(FLD,".",I)["[" S LASTARY=LASTARY+1
 F I=1:1:$L(FLD,".") D
 . I $P(FLD,".",I)="*" Q  ; skip merge indicator
 . S OREF=OREF_$S(I=1:"",1:",")_""""_$P($P(FLD,".",I),"[")_""""
 . I $P(FLD,".",I)["[" S ARYCNT=ARYCNT+1 D
 . . I VARNM="TARGET(",(ARYCNT=LASTARY) S OREF=OREF_",J"
 . . E  S OREF=OREF_",I("_ARYCNT_")"
 Q VARNM_OREF_")"
 ;
BLDIPATH(FLD) ; build the instance path for nested arrays
 N INODE,NODE,IPATH
 S IPATH=""
 F INODE=1:1:$L(FLD,".") D
 . S NODE=$P(FLD,".",INODE)
 . S IPATH=IPATH_$S($L(IPATH):".",1:"")_$P(NODE,"[")
 Q IPATH
 ;
LASTARY(FLD,MOD) ; return the piece number of the last array
 N I,LAST
 S LAST=0,MOD=$G(MOD)
 F I=1:1:$L(FLD,".") I $P(FLD,".",I)[("["_MOD) S LAST=I
 Q LAST
 ;
ARYMOD(NODE) ; return array modifier for node
 N X
 S X=$P(NODE,"[",2),X=$E(X,1,$L(X)-1)
 Q X
 ;
ARYCLCT(NODE) ; return collection delimiter for node, if any
 N X
 S X=$$ARYMOD(NODE)
 I $E(X)="*" S X=$E(X,2,99) S:'$L(X) X="," Q X
 Q ""
 ;
ARYDIR(NODE) ; return $O direction for node, 0 for instance
 N X
 S X=$$ARYMOD(NODE)
 I X="#" Q 0
 I $E(X)="-" Q -1
 Q 1
 ;
ARYMAX(NODE) ; return max number of array items to return
 N X
 S X=$$ARYMOD(NODE)
 I $E(X)="-" S X=$E(X,2,$L(X))
 I X="#" Q 1
 S X=+X
 I X=0 Q 999999
 Q X
ARYOK(NODE) ; return true if valid array specifier
 N X
 S X=$$ARYMOD(NODE)
 I X="" Q 1       ;full array
 I X="#" Q 1      ;current instance
 I $E(X)="*" Q 1  ;collect
 I +X,(+X=X) Q 1  ;+n or -n elements
 Q 0
 ;
GETMTHD(FLD,INST) ; return "get value" method
 N I,X,FLDPAT
 S FLDPAT="",INST=$G(INST)
 F I=1:1:$L(FLD,".") S FLDPAT=FLDPAT_$S($P(FLD,".",I)["[":"A",1:"N")
 I FLDPAT="N" Q 0
 I FLDPAT="AN" Q 1
 I FLDPAT="AAN" Q 2
 I INST,(FLDPAT="A") Q 1
 I INST,(FLDPAT="AA") Q 2
 Q 99
 ;
VALSPEC(POS,CNT,SPEC) ; set up value spec based on position and array levels
 I 'CNT S SPEC("valRef")="VALS("_$S(+POS=POS:POS,1:""""_POS_"""")_")" Q
 N I,J,X
 F I=1:1:CNT D
 . S X="VALS("_$S(+POS=POS:POS,1:""""_POS_"""")_","  ; always +POS??
 . F J=1:1:I S X=X_$S(J=1:"",1:",")_"I("_J_")"
 . S X=X_")",SPEC("valArrays")=I,SPEC("valArrays",I)=X
 S SPEC("valRef")=SPEC("valArrays",CNT)
 Q
GETTGT(FLD) ; return the target name for a field spec
 N I,X,Y
 S X=$S(FLD["=":$P(FLD,"="),FLD[">":$P(FLD,">"),1:FLD)
 S X=$P(X,".*"),Y=""
 F I=1:1:$L(X,".") D
 . S Y=Y_$S($L(Y):".",1:"")_$P($P(X,".",I),"[")
 . I $P(X,".",I)["[" S Y=Y_"[]"
 Q Y
 ;
ADDATTR(NAME,VALUE) ; add attribute name and value
 ;expects ATTR, from BLDSPEC
 S ATTR(NAME)=$$TRIM^XLFSTR(VALUE)
 Q
NAMEOK(X) ; Return true if valid Java variable name
 N I,OK
 I '$L(X) Q 0
 S X=$$LOW^XLFSTR(X),OK=1
 F I=1:1:$L(X) I "abcdefghijklmnopqrstuvwxyz1234567890_$"'[$E(X,I) S OK=0
 Q OK
 ;
SHOWERR(METADATA) ; display error
 ; TODO: put something here to return error info if being called by service
 W !,"Errors encountered while creating meta-data"
 N I
 S I=0 F  S I=$O(METADATA("errors","errors",I)) Q:'I  D
 . W !,$J(I,3)
 . W ?5,$G(METADATA("errors","errors",I,"name"))_" "
 . W "("_$G(METADATA("errors","errors",I,"type"))_")"
 . W ?40,$G(METADATA("errors","errors",I))
 Q
SETERR(MSG) ; Record error parsing template info
 S ERRORS=$G(ERRORS)+1
 S ERRORS(ERRORS)=MSG
 S ERRORS(ERRORS,"name")=$G(ATTR("name"))
 S ERRORS(ERRORS,"type")=$G(ATTR("metatype"))
 Q
