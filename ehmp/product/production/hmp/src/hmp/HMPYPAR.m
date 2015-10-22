HMPYPAR ;SLC/KCM -- Modify Parameters
 ;;2.0;ENTERPRISE HEALTH MANAGEMENT PLATFORM;**1**;Sep 01, 2011;Build 49
 ;
PARLOOP ; Loop thru parameter
 N PAR,ENT,INST,IEN
 S PAR=$O(^XTV(8989.51,"B","HMP PARAMETERS",0))
 S ENT="" F  S ENT=$O(^XTV(8989.5,"AC",PAR,ENT)) Q:ENT=""  D
 . S INST="" F  S INST=$O(^XTV(8989.5,"AC",PAR,ENT,INST)) Q:INST=""  D
 . . S IEN=0 F  S IEN=$O(^XTV(8989.5,"AC",PAR,ENT,INST,IEN)) Q:IEN=""  D
 . . . I $P(^XTV(8989.5,IEN,0),":",6)'="HMP USER PREF" Q
 . . . D PULLPID(IEN)
 Q
PULLPID(IEN) ; Remove PID entries
 N JSON,WP,OBJ,ERR,I
 S I=0 F  S I=$O(^XTV(8989.5,IEN,2,I)) Q:'I  S JSON(I)=^XTV(8989.5,IEN,2,I,0)
 D DECODE^HMPJSON("JSON","OBJ","ERR")
 I $D(ERR) W !,"Error decoding ",IEN Q
 I '$D(OBJ("cpe.context.patient")) Q
 ;
 K OBJ("cpe.context.patient"),JSON
 D ENCODE^HMPJSON("OBJ","JSON","ERR")
 I $D(ERR) W !,"Error encoding ",IEN
 ;
 W !,"Updating ",^XTV(8989.5,IEN,0)
 S I=0 F  S I=$O(JSON(I)) Q:'I  S WP(I,0)=JSON(I)
 I $D(WP) D WP^DIE(8989.5,IEN_",",2,"","WP","ERR")
 I $D(DIERR) W !,"Save failed for WP: ",IEN,!
 D CLEAN^DILF
 Q
SHOWPAR ; Show values for parameters
 N PARAM,IEN
 S PARAM=$O(^XTV(8989.51,"B","HMP PARAMETERS",0))
 W !,"Param:",PARAM
 S IEN=0 F  S IEN=$O(^XTV(8989.5,IEN)) Q:'IEN  D
 . I $P(^XTV(8989.5,IEN,0),"^",2)'=PARAM Q
 . S INST=$P(^XTV(8989.5,IEN,0),"^",3)
 . I $P(INST,":",6)'="HMP USER PREF" Q
 . N JSON,OBJ,ERR,X
 . S I=0 F  S I=$O(^XTV(8989.5,IEN,2,I)) Q:'I  S JSON(I)=^XTV(8989.5,IEN,2,I,0)
 . D DECODE^HMPJSON("JSON","OBJ","ERR")
 . W !!,INST,"  ("_IEN_") --------------------"
 . S X="" F  S X=$O(OBJ(X)) Q:X=""  W !,X," = ",OBJ(X)
 Q
