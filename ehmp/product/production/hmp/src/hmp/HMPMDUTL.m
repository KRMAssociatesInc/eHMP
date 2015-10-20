HMPMDUTL ;HINES OIFO/BLJ - FileMan JSON utilities for HMP;02 April 2013
 ;;2.0;ENTERPRISE HEALTH MANAGEMENT PLATFORM;**1**;Sep 01, 2011;Build 49
 ; Per VHA Directive 2004-038, this routine should not be modified.
 ;
EN Q  ; Only call via linetag.
TERM ; Retrieves list of terms
  ; NOTE: we're not gonna support paged retrieves with this unless we have to.  Do not count on
  ; them being there.
  ;
  ; Gets terminology.
  N TERMIENS,TERMCNT,X
  D LIST^DIC("704.101",,,,,,,,"I $P(^(0),U,5)=1")
  M TERMIENS=^TMP("DILIST",$J,2)
  S TERMCNT=$P($G(^TMP("DILIST",$J,0)),U,1)
  K ^TMP("DILIST",$J)
  ;
  F X=0:0 S X=$O(TERMIENS(X)) Q:'X  D
  . N RESULT
  . ; term
  . D ONETERM($G(TERMIENS(X)),"RESULT")
  . ;
  . D ADD^HMPEF("RESULT")
  . S HMPCNT=X,HMPLAST=X
  I 'X S HMPFINI=1
  Q
ONETERM(ID,TARGET) ; loads one term
  Q:+ID<1  ; Gotta be a valid integer/id
  N $ES,$ET,ERRMSG
  S ERRMSG=$$ERRMSG^HMPEF("CLiO Term",ID)
  S $ET="D ERRHDLR^HMPDERRH"
  N TERM,TRM,TERMTYPE
  ;
  D GETS^DIQ("704.101",ID_",","*","IE","TERM")
  N TRM S TRM=$NA(TERM(704.101,""_ID_","))
  S @TARGET@("id")=$G(@TRM@(.01,"E"))
  S @TARGET@("uid")="urn:va:clioterminology:"_$G(@TARGET@("id"))
  S @TARGET@("term")=$$SANITIZE($G(@TRM@(.02,"E")))
  S @TARGET@("abbreviation")=$$SANITIZE($G(@TRM@(.03,"E")))
  S @TARGET@("displayName")=$$SANITIZE($G(@TRM@(.04,"E")))
  ; Get Term Type
  S TERMTYPE=$$SANITIZE($G(@TRM@(.05,"I")))
  D TERMTYPE(TERMTYPE,.TARGET)
  ;
  S @TARGET@("dataType")=$$SANITIZE($G(@TRM@(.06,"I")))
  S @TARGET@("valueType")=$$SANITIZE($G(@TRM@(.07,"I")))
  S @TARGET@("active")=$$SANITIZE($G(@TRM@(.09,"E")))
  S @TARGET@("description")=$$SANITIZE($G(@TRM@(.1,"E")))
  S @TARGET@("helpText")=$$SANITIZE($G(@TRM@(.2,"E")))
  S @TARGET@("booleanValueTrue")=$$SANITIZE($G(@TRM@(.31,"E")))
  S @TARGET@("booleanValueFalse")=$$SANITIZE($G(@TRM@(.32,"E")))
  S @TARGET@("multiSelectPicklist")=$$SANITIZE($G(@TRM@(.33,"E")))
  S @TARGET@("VUID")="urn:va:vuid:"_$$SANITIZE($G(@TRM@(99.99,"E")))
  ; term -> child terms
  ;
  ; Note, for right now this is a little odd: the initial load is done off of DFN.  This load
  ; is done off of UID.  We'll probably change that to UID or IFN for both at some point.
  ;
  D TERMCHLD($G(@TRM@(.01,"E")),.TARGET)
  ;
  ; term -> unit pair
  D TERMUNIT($G(@TRM@(.01,"E")),.TARGET)
  ;
  ; term -> qualifier pair
  ;
  D TERMQUAL($G(@TRM@(.01,"E")),.TARGET,ID)
  ;
  ; term -> unit conversion - for right now, we're not going to pull term -> unit conversions.  We will need to do so at some point
  ; though.
  K TERMTYPE,TRM
  Q
  ;
TERMTYPE(ID,TARGET) ;Loads term types.
  ;
  ; TARGET passed by reference.  
  ;
  ; Sanity checks first
  ; 
  Q:+ID<1  ; Gotta be a number, we're doing a direct IFN lookup.
  N TERMTYPE
  D GETS^DIQ("704.102",ID_",","*","E","TERMTYPE")
  N HMPNAME S HMPNAME=$T(TTFLDS+1)
  ;
  N HMPEPLAC S HMPEPLAC("""")="\"""
  S @TARGET@("termType",$P(HMPNAME,";",3))=ID
  S @TARGET@("termType",$P(HMPNAME,";",4))=$$SANITIZE($$REPLACE^XLFSTR(TERMTYPE("704.102",ID_",",.01,"E"),.HMPEPLAC))
  S @TARGET@("termType",$P(HMPNAME,";",5))=$$SANITIZE($$REPLACE^XLFSTR(TERMTYPE("704.102",ID_",",.02,"E"),.HMPEPLAC))
  S @TARGET@("termType",$P(HMPNAME,";",6))=$$SANITIZE($$REPLACE^XLFSTR(TERMTYPE("704.102",ID_",",.03,"E"),.HMPEPLAC))
  K TERMTYPE
  Q
TERMCHLD(ID,TARGET) ;Loads child terms for a term
  ;
  ;
  N MSGROOT S MSGROOT="TERMCHLD("""_ID_""")"
  D FIND^DIC("704.106",,".02E;.03I;.04I;.05E;.06E;.07E;.08E;.09E","M",ID,,,,,MSGROOT)
  ; Check to see if we actually have any children.
  I +$P(TERMCHLD(ID,"DILIST",0),U,1)<1 K @MSGROOT Q
  N X F X=0:0 S X=($O(TERMCHLD(ID,"DILIST","ID",X))) Q:'X  D
  . ; .01 is the Term ID
  . S @TARGET@("termChild",X,"childOrder")=$$SANITIZE($G(TERMCHLD(ID,"DILIST","ID",X,.02)))
  . ; .03 is the Child ID
  . N CHILD S CHILD=$NA(@TARGET@("termChild",X,"childTerm"))
  . D ONETERM($G(TERMCHLD(ID,"DILIST","ID",X,.03)),.CHILD)
  . S @TARGET@("termChild",X,"valueType")=$$SANITIZE($G(TERMCHLD(ID,"DILIST","ID",X,.05)))
  . S @TARGET@("termChild",X,"valueDelimiter")=$$SANITIZE($G(TERMCHLD(ID,"DILIST","ID",X,.06)))
  . S @TARGET@("termChild",X,"valueStart")=$$SANITIZE($G(TERMCHLD(ID,"DILIST","ID",X,.07)))
  . S @TARGET@("termChild",X,"valueStop")=$$SANITIZE($G(TERMCHLD(ID,"DILIST","ID",X,.08)))
  . S @TARGET@("termChild",X,"description")=$$SANITIZE($G(TERMCHLD(ID,"DILIST","ID",X,.09)))
  K @MSGROOT
  Q
TERMUNIT(ID,TARGET) ;Loads Units for a term.
 ;
 N MSGROOT S MSGROOT="TERMUNIT("""_ID_""")"
 D FIND^DIC("704.105",,".02I;.03E;.04E;.05E;.06E;.07E","M",ID,,,,,MSGROOT)
 ; Check to see if we actually have any children.
 I +$P(TERMUNIT(ID,"DILIST",0),U,1)<1 K @MSGROOT Q
 N X F X=0:0 S X=($O(TERMUNIT(ID,"DILIST","ID",X))) Q:'X  D
 . ; .01 is the Term ID
 . ; .02 is the Unit ID
 . N UNIT S UNIT=$NA(@TARGET@("units",X,"unitTerm"))
 . D ONETERM($G(TERMUNIT(ID,"DILIST","ID",X,.02)),.UNIT)
 . S @TARGET@("units",X,"minValue")=$$SANITIZE($G(TERMUNIT(ID,"DILIST","ID",X,.03)))
 . S @TARGET@("units",X,"maxValue")=$$SANITIZE($G(TERMUNIT(ID,"DILIST","ID",X,.04)))
 . S @TARGET@("units",X,"decPrecision")=$$SANITIZE($G(TERMUNIT(ID,"DILIST","ID",X,.05)))
 . S @TARGET@("units",X,"refLow")=$$SANITIZE($G(TERMUNIT(ID,"DILIST","ID",X,.06)))
 . S @TARGET@("units",X,"refHigh")=$$SANITIZE($G(TERMUNIT(ID,"DILIST","ID",X,.07)))
 K @MSGROOT
 Q
TERMQUAL(ID,TARGET,IFN) ;Loads Qualifiers for a term
 ;
 N MSGROOT S MSGROOT="TERMQUAL("""_ID_""")"
 D FIND^DIC("704.103",,".02E;.03I;.04E","M",ID,,,,,MSGROOT)
 ; Check to see if we actually have any qualifiers.
 I +$P(TERMQUAL(ID,"DILIST",0),U,1)<1 K @MSGROOT Q
 N X F X=0:0 S X=($O(TERMQUAL(ID,"DILIST","ID",X))) Q:'X  D
 . ; .01 is the Term ID
 . ; .03 is the Qualifier ID
 . N QUAL S QUAL=$NA(@TARGET@("qualifiers",X,"qualTerm"))
 . ; blj 28 Feb 2014: bandaid to prevent recursive calls if someone has messed up the structure of the TERM_QUALIFIER file.
 . I IFN'=$G(TERMQUAL(ID,"DILIST","ID",X,.03)) D ONETERM($G(TERMQUAL(ID,"DILIST","ID",X,.03)),.QUAL)
 . S @TARGET@("qualifiers",X,"qualOrder")=$$SANITIZE($G(TERMQUAL(ID,"DILIST","ID",X,.02)))
 . S @TARGET@("qualifiers",X,"ranking")=$$SANITIZE($G(TERMQUAL(ID,"DILIST","ID",X,.04)))
 K @MSGROOT
 Q
SANITIZE(VALUE) ; Makes sure values are formatted correctly.
 I +VALUE'=VALUE Q VALUE
 I VALUE?1".".N S VALUE="0"_VALUE
 I VALUE?1"-.".N S VALUE="-0"_$E(VALUE,2,$LENGTH(VALUE))
 Q VALUE
 ;
GENGUID() ;
 N X,AB
 S X="",AB=$R(4),AB=$S(AB=0:"8",AB=1:"9",AB=2:"A",1:"B")
 F  S X=X_$$BASE^XLFUTL($R(16),10,16) Q:$L(X)>31
 S X="{"_$E(X,1,8)_"-"_$E(X,9,12)_"-"_"4"_$E(X,14,16)_"-"_AB_$E(X,18,20)_"-"_$E(X,21,32)_"}"
 Q X
TRMFLDS ;Fields for terminology
  ;;.01;id
  ;;.02;term
  ;;.03;abbreviation
  ;;.04;displayName
  ;;.05;termType
  ;;.06;dataType
  ;;.07;valueType
  ;;.09;active
  ;;.1;description
  ;;.2;helpText;
  ;;.31;booleanValueTrue
  ;;.32;booleanValueFalse;
  ;;.33;multiSelectPicklist
  ;;99.99;VUID
  ;;***
TTFLDS ;Fields for Term Typea
  ;;id;type;xmlTag;VUID
