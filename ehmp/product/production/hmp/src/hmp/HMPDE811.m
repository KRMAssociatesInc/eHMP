HMPDE811 ;Agilex/Hrubovcak - post-installation processing ;May 12, 2015@13:58:53
 ;;2.0;ENTERPRISE HEALTH MANAGEMENT PLATFORM;**1**;Sep 01, 2011;
 ;;Per VHA Directive 2004-038, this routine should not be modified.
 ;
 Q
 ;
POST ; make HMP DGPF ASSIGN FLAG protocol an ITEM
 ;
 N HMPDGIEN,HMPERR,HMPEXIT,HMPFDA,HMPIEN,HMPRTCL,HMPTRGT,J,PRTCLITM,V,X,Y
 ;
 D MES^XPDUTL($T(+0)_" post-init routine started "_$$HTE^XLFDT($H))
 S V=$$SVDATA D MES^XPDUTL("Old data saved in "_V)
 S HMPTRGT="HMP DGPF ASSIGN FLAG",HMPTRGT("IEN")=$O(^ORD(101,"B",HMPTRGT,0))
 I '(HMPTRGT("IEN")>0) D MES^XPDUTL(HMPTRGT_" protocol not found. It must be installed to proceed.") Q
 ;
 ; update protocols to action item
 D PRTCLUPD("DGPF ADD FLAG",HMPTRGT("IEN"))
 D PRTCLUPD("DGPF ASSIGN FLAG",HMPTRGT("IEN"))
 ;
 Q
 ;
PRTCLUPD(HMPRTCL,HMPIEN) ; update HMPRTCL with HMPIEN protocol as ITEM
 ;
 S HMPDGIEN=$O(^ORD(101,"B",HMPRTCL,0))
 ; protocol missing, write message and exit
 I '(HMPDGIEN>0) D MES^XPDUTL(HMPRTCL_" protocol not found.  No ITEM update performed.") Q
 D MES^XPDUTL("updating "_HMPRTCL)
 ; make protocol an extended action
 S HMPFDA(101,HMPDGIEN_",",4)="X"
 D UPDATE^DIE("","HMPFDA","","HMPERR")
 I $D(HMPERR) D  Q  ; something went wrong
 .D MES^XPDUTL("FileMan error when editing "_HMPRTCL_" protocol")
 .N V S V="HMPERR" F  S V=$Q(@V) Q:V=""  D MES^XPDUTL(V_" = "_@V)
 ;
 ; is protocol already an item?
 S J=$O(^ORD(101,HMPDGIEN,10,"B",HMPIEN,0))
 I J D MES^XPDUTL(HMPRTCL_" already an ITEM in IEN "_HMPIEN_".  No update needed.") Q
 ; add protocol as ITEM
 K HMPFDA,HMPERR,PRTCLITM
 S HMPFDA(101.01,"+1,"_HMPDGIEN_",",.01)=HMPIEN
 D UPDATE^DIE("","HMPFDA","PRTCLITM","HMPERR")
 I $D(HMPERR) D  Q  ; something went wrong
 .D MES^XPDUTL("FileMan error when adding ITEM to DGPF ASSIGN FLAG protocol")
 .N V S V="HMPERR" F  S V=$Q(@V) Q:V=""  D MES^XPDUTL(V_" = "_@V)
 ; new ITEM sub-file IEN will be in PRTCLITM(1)
 D MES^XPDUTL(HMPRTCL_" protocol update finished "_$$HTE^XLFDT($H))
 ;
 Q
 ;
SVDATA() ; extrinsic variable, save original FileMan data, returns storage node
 ;
 N FMERRCNT,HMPXTMP,HMPIEN,HMPLOGND,HMPLGRT,LN,NTRY,TXT,V,X,Y
 D DT^DICRW  ; kernel variables
 S HMPLOGND="HMP INSTALL LOG"  ; HMP log data stored here in ^XTMP
 S HMPLGRT=$NA(^XTMP(HMPLOGND,DT))  ; log root node
 S Y=$$NOW^XLFDT
 ; ^XTMP log data expires in 90 days
 S X=$G(@HMPLGRT@(0)) S:X="" @HMPLGRT@(0)=$$FMADD^XLFDT(DT,90)_U_Y_"^HMP installation "_$$FMTE^XLFDT(Y)
 ;
 S X=$G(@HMPLGRT@(0,"CNTR"))+1,^("CNTR")=X  ; counter for multiple installations per day
 S HMPXTMP=$NA(@HMPLGRT@(X))  ; XTMP storage node for this installation
 S @HMPXTMP@(0,"begun")=$$NOW^XLFDT  ; when?
 S @HMPXTMP@(0,"DUZ")=$G(DUZ)  ; who?
 S FMERRCNT=0  ; FileMan error counter
 ; save entries in FileMan items list
 F LN=1:1 S TXT=$P($T(FMITMS+LN),";;",2,99) Q:TXT=""  D
 .N FLNO,FMARRY,FMERR  ; file #, FileMan returned value and error message arrays
 .S FLNO=+$P(TXT,U),X=$P(TXT,U,2,99)  ; file number and target entry
 .Q:'(FLNO>1)!(X="")  ; file and entry required
 .S HMPIEN=$$FIND1^DIC(FLNO,"","",X,"","","FMERR")  ; lookup value in X is external format
 .I $D(FMERR) D  Q  ; log error message and quit
 ..S V="FMERR",FMERRCNT=FMERRCNT+1 F  S V=$Q(@V) Q:V=""  S @HMPXTMP@("FM LOOKUP ERROR",FMERRCNT,V)=@V
 .;
 .S:'(HMPIEN>0) FMERRCNT=FMERRCNT+1,@HMPXTMP@("FM ENTRY NOT FOUND",FMERRCNT)=TXT  ; entry
 .S:HMPIEN>0 @HMPXTMP@("ENTRY",FLNO,HMPIEN)="entry found"
 .K FMERR  ; just in case
 .D GETS^DIQ(FLNO,HMPIEN_",","**","EN","FMARRY","FMERR")  ; data including sub-files, ignore null values
 .I $D(FMERR) D  ; log error message
 ..S V="FMERR",FMERRCNT=FMERRCNT+1 F  S V=$Q(@V) Q:V=""  S @HMPXTMP@("FM DATA ERROR",FMERRCNT,V)=@V
 .; save the data
 .M @HMPXTMP@("ENTRY")=FMARRY
 ;
 S @HMPXTMP@(0,"ended")=$$NOW^XLFDT
 Q HMPXTMP  ; return ^XTMP storage location
 ;
FMITMS ; list of FileMan entries: "file # ^ .01 field value"
 ;;101^DGPF ASSIGN FLAG
 ;;101^DGPF ADD FLAG
 ;
