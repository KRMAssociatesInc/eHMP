HMPTIU ; CNP/JD,MBS - Various Document RPCs ;07/09/15  14:25
 ;;2.0;ENTERPRISE HEALTH MANAGEMENT PLATFORM;**1**;June 08, 2015;Build 2
 ;Per VA Directive 6402, this routine should not be modified.
 ;
 Q
 ;
 ; RPC: HMP SAVE NOTE STUB
STUB(RSLT,DATA) ;
 ;
 ;Output
 ; RSLT = Note IEN or a message indicating why the note was NOT created
 ;Input
 ; DATA("data") - input format - string
 ;   Piece 1: DFN - Patient IEN - ^DD(8925,.02
 ;   Piece 2: Document type - ^DD(8925,.01
 ;   Piece 3: Visit/episode date - ^DD(8925,.07
 ;   Piece 4: Hospital location - ^DD(8925,1205
 ;   Piece 5: Visit IEN - ^DD(8925,.03
 ;   Piece 6: Author/dictator - ^DD(8925,1202
 ;   Piece 7: Reference date - ^DD(8925,1301
 ;   Piece 8: Subject - ^DD(8925,1701
 ;   Piece 9: Visit string - location;date;service category
 ; DATA("text",n) - The nth line of the text of the note - Free text
 ;
 S RSLT="Error in routine HMPTIU: "
 N DFN,FILTER,HMP,INFO,OK,TEXT,TITLE,TIUX,VDT,VLOC,VISIT,VSIT,VSTR
 S U="^"
 S INFO=$G(DATA("data"))
 ;Assume input is presented as a string with DFN in piece1
 I '$G(INFO,U) S RSLT=RSLT_"Missing DFN" Q
 ; Set variables for the RPC
 S DFN=$P(INFO,U)
 I $D(^DPT(DFN))'>0 S RSLT=RSLT_"Invalid DFN - "_DFN Q
 S TITLE=$P(INFO,U,2)
 S VDT=$P(INFO,U,3)
 S VLOC=$P(INFO,U,4)
 S VSIT=$P(INFO,U,5)
 S VSTR=$P(INFO,U,9)
 ; Set the local array for the RPC
 S TIUX(.01)=TITLE
 S TIUX(1202)=$P(INFO,U,6)
 S TIUX(1205)=VLOC
 S TIUX(1301)=$P(INFO,U,7)
 S TIUX(1701)=$P(INFO,U,8)
 ; Build the "text" section of the local array if it exists
 I $D(DATA("text"))>0 D
 .N HMPA
 .S HMPA=0
 .F  S HMPA=$O(DATA("text",HMPA)) Q:HMPA']""  D
 ..S TIUX("TEXT",HMPA,0)=DATA("text",HMPA)
 ; Save document by Invoking the already existing RPC (TIU CREATE RECORD)
 D MAKE^TIUSRVP(.OK,DFN,TITLE,VDT,VLOC,VSIT,.TIUX,VSTR,1)
 I OK>0 D
 .; TIUX("HDR")="<page>^<of pages>"="1^1"
 .S TIUX("HDR")="1^1"
 .; Save document text by invoking the already existing RPC (TIU SET DOCUMENT TEXT)
 .I $D(TIUX("TEXT"))>0 D SETTEXT^TIUSRVPT(.TEXT,OK,.TIUX,0)
 S RSLT=OK
 Q
