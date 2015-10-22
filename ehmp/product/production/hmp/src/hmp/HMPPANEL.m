HMPPANEL ;SLC/GRR -- Reminder List processing
 ;;2.0;ENTERPRISE HEALTH MANAGEMENT PLATFORM;**1**;Sep 01, 2011;Build 49
 ;
 ; External References          DBIA#
 ; -------------------          -----
 ;
 ; ------------ Get Panel(s) from VistA ------------
 ;
EN(HMP) ; -- find Panels to update
 K ^TMP($J,"HMPPANEL")
 N HMPPAN,HMPPAT,HMPI
 S HMP=$NA(^TMP($J,"HMP")),HMPC=0,HMPT=0
 F  S HMPC=$O(^HMPROSTR(HMPC)) Q:HMPC'>0  D
 . S HMPT=HMPT+1
 . S HMPPAN(HMPC)=^HMPROSTR(HMPC,0) D
 . N LIEN,PLNAME S LIEN=+$P(HMPPAN(HMPC),"^",2),PLNAME=$P(HMPPAN(HMPC),U,1)
 . ;agp need to determine what secure and over should be set to
 . S SECURE=0,OVER=1
 . D RUNLIST(.HMPPAN,LIEN,PLNAME,SECURE,OVER)
CREATE ; -- create panel(s) in XML
 N HMPVER S HMPVER="<results version='"_$P($T(HMPPANEL+1),";",3)_"'>"
 N HMPTTXT S HMPTTXT="<panels total='"_HMPT_"'>"
 D ADD(HMPVER),ADD(HMPTTXT)
 D PANEL
 S TEXT="</results>" D ADD(TEXT)
 Q
 ;
PANEL ;-- create panel XML
 S HMPC=0 F  S HMPC=$O(HMPPAN(HMPC)) Q:HMPC'>0  D
 .D ADD("<panel>")
 .N TEXT S TEXT="<panel name='"_$P(HMPPAN(HMPC),"^",2)_"' />" D ADD(TEXT)
 .S TEXT="<panelString code='"_$P(HMPPAN(HMPC),"^")_"' />" D ADD(TEXT)
 .D PATS
 .S TEXT="</panel>" D ADD(TEXT)
 S TEXT="</panels>" D ADD(TEXT)
 Q
 ;
CREATEPL(PLNAME,SECURE,OVER) ;
 N FDA,IENS,NAME,NUM,RESULT,UNIQUE
 S (NUM,RESULT,UNIQUE)=0
 ;if overwrite check to see if the list exist
 I OVER=1 S RESULT=$O(^PXRMXP(810.5,"B",PLNAME,""))
 I RESULT>0 Q RESULT
 S NAME=PLNAME
 ;if not overwrite find unique name
 I OVER=0 D
 .I $D(^PXRMXP(810.5,"B",NAME))=0 Q
 .F  Q:UNIQUE=1  D
 ..S NUM=NUM+1
 ..S NAME=PLNAME_" ("_NUM_")"
 ..I $D(^PXRMXP(810.5,"B",NAME))=0 S UNIQUE=1
 ;create stub in 810.5
 S IENS="+1,"
 S FDA(810.5,IENS,.01)=NAME
 S FDA(810.5,IENS,100)="L"
 S FDA(810.5,IENS,.07)=DUZ
 S FDA(810.5,IENS,.08)=$S(SECURE=0:"PUB",1:"PVT")
 D UPDATE^DIE("","FDA","","MSG")
 ;if error display message and quit
 I $D(MSG) D AWRITE^PXRMUTIL("MSG") Q 0
 S RESULT=$O(^PXRMXP(810.5,"B",NAME,""))
 Q RESULT
 ;
RUNLIST(HMPPAN,LIEN,PLNAME,SECURE,OVER) ;
 N PLIEN
 S PLIEN=$$CREATEPL(PLNAME,SECURE,OVER)
 S PATCREAT=$S(SECURE=1:"Y",1:0),PLISTPUG=1
 I PLIEN=0 Q
 D RUN^PXRMLCR(LIEN,PLIEN,"PXRMRULE",DT,DT,0,0)
 N HMPPAT S HMPPAT=0
 F  S HMPPAT=$O(^PXRMXP(810.5,PLIEN,30,HMPPAT)) Q:HMPPAT'>0  S HMPPAN(HMPC,HMPPAT)=$P($G(^PXRMXP(810.5,PLIEN,30,HMPPAT,0)),"^",1)
 Q
 ;
PATS ; -- create patient XML
 S TEXT="<patients>" D ADD(TEXT)
 S HMPPAT=0 F  S HMPPAT=$O(HMPPAN(HMPC,HMPPAT)) D  Q:HMPPAT'>0
 .I HMPPAT'>0 S TEXT="</patients>" D ADD(TEXT) Q
 .S TEXT="<patient code='"_HMPPAN(HMPC,HMPPAT)_"' />" D ADD(TEXT)
 ;
 ;
ADD(X) ; -- Add a line @HMP@(n)=X
 S HMPI=$G(HMPI)+1
 S @HMP@(HMPI)=X
 Q
 ;
NITELY ; -- Nightly run to update all Panels
 ; 
