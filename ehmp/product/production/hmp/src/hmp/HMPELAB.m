HMPELAB ; SLC/JMC - Lab extract utilities ; 2/20/14 4:23pm
 ;;2.0;ENTERPRISE HEALTH MANAGEMENT PLATFORM;**1**;Sep 01, 1913;Build 49
SHWORPNL ; Ordering panels (ends in "panel")
 N X,COUNT,LABDAT
 S X=$NA(^LAB(60))
 F  S X=$Q(@X) Q:($QS(X,1)'=60)!($QS(X,2)'=+$QS(X,2))  D
 . I $QS(X,3)=0  D
 . . I $D(LABDAT),COUNT>0 S HMPCNT=HMPCNT+1 D ADD^HMPEF("LABDAT") K LABDAT
 . . S COUNT=0,LABDAT("name")=$P(@X,"^",1),LABDAT("uid")=$$SETUID^HMPUTILS("labpanel","",$QS(X,2))
 . I $QS(X,3)=2,$QS(X,4)>0  D
 . . S LABDAT("labs",$QS(X,4),"id")=@X,LABDAT("labs",$QS(X,4),"name")=$P(^LAB(60,+@X,0),"^",1),COUNT=COUNT+1
 I $D(LABDAT),COUNT>0 S HMPCNT=HMPCNT+1 D ADD^HMPEF("LABDAT") K LABDAT
 S HMPFINI=1
 Q
SHWCUMR2 ; All Cumulative Reports and the labs they point to (for UI pick on labs view)
 N X,LASTSUB,LASTLAB,LABDAT
 S LASTSUB=0,LASTLAB=0,X=$NA(^LAB(64.5,1,1))
 F  S X=$Q(@X) Q:($QS(X,4)="B")!($QS(X,3)'=1)!($QS(X,2)'=1)!($QS(X,1)'=64.5)  D
 . I $QS(X,5)=0  D
 . . I $D(LABDAT) S HMPCNT=HMPCNT+1 D ADD^HMPEF("LABDAT") K LABDAT
 . . S LASTSUB=0,LASTLAB=0,LABDAT("name")=$P(@X,"^",1)
 . I $QS(X,7)=0 S LASTSUB=LASTSUB+1,LASTLAB=0,LABDAT("uid")=$$SETUID^HMPUTILS("labgroup",,$QS(X,4)),LABDAT("groups",LASTSUB,"name")=$P(@X,"^",1)
 . I $QS(X,9)=0  D
 . . S LASTLAB=LASTLAB+1
 . . S LABDAT("groups",LASTSUB,"labs",LASTLAB,"name")=$P(^LAB(60,$P(@X,"^",1),0),"^",1)
 . . S LABDAT("groups",LASTSUB,"labs",LASTLAB,"id")=$P(@X,"^",1)
 I $D(LABDAT) S HMPCNT=HMPCNT+1 D ADD^HMPEF("LABDAT") K LABDAT
 S HMPFINI=1
 Q
LABPNL ; Lab ordering panels
 ; {name:panelName,uid:panelUid,labs:[{id:labIEN,name:labName},...]}
 N IEN
 F  S IEN=$O(^LAB(60,IEN)) Q:'IEN  D
 . N X0,LAB
 . S X0=$G(^LAB(60,IEN,0))
 . Q:"IB"'[$P(X0,U,3)       ; not for ordering
 . Q:'$O(^LAB(60,IEN,2,0))  ; not panel
 . S LAB("name")=$P(X0,U)
 . S LAB("uid")=$$SETUID^HMPUTILS("labpanel","",IEN)
 . ; recursively expand to individual tests
 . D ADD^HMPEF("LAB")
 I 'IEN S HMPFINI=1
 Q
LABGRP ; Lab groups on cumulative report
 ; {name:groupName,uid:groupUid,labs:[{name:labName,id:labIEN},...]}
 F  S IEN=$O(^LAB(60,IEN)) Q:'IEN  D
 . Q
 Q
