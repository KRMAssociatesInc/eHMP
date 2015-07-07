VPRJRCL ;SLC/KCM -- Control the HTTP listener
 ;;1.0;JSON DATA STORE;;Sep 01, 2012
 ;
GO(PORT) ; start up REST listener with defaults
 I $G(PORT) D SPORT(PORT)
 S PORT=$G(^VPRHTTP(0,"port"),9080)
 D SETUP^VPRJPMD             ; make sure meta data is in place
 J START^VPRJREQ(PORT)       ; start the listener
 ;BL HARD CODING MULTI BROKER FOR PERFORMANCE TESTING
 S PORT=9081
 J START^VPRJREQ(PORT)
 Q
STOP ; tell the listener to stop running
 I $E($G(^VPRHTTP(0,"listener")),1,4)'="stop" S ^VPRHTTP(0,"listener")="stopping"
 Q
STOPW ; tell the listener to stop running and wait until it stops
 ; this function is interactive
 N I,X
 W !,"Stopping HTTP listener on port "_$G(^VPRHTTP(0,"port"),9080)_"."
 D STOP
 F I=1:1:12 D  Q:X="stopped"
 . S X=^VPRHTTP(0,"listener")
 . I X="stopped" W X,! Q
 . W "."
 . H 1
 I X'="stopped" W "failed to stop.  Status: ",$$STATUS,!
 Q
SPORT(PORT) ; set the port that should be listened on
 Q:'$G(PORT)
 ;BL; eHMP change to handle multipe brokers
 ;S ^VPRHTTP(0,"port")=PORT
 S ^VPRHTTP(0,"port")=9080
 S ^VPRHTTP(1,"port")=9081
 Q
SLOG(LEVEL) ; set log level -  0:errors,1:headers&errors,2:raw,3:body&response
 ; ** called from VPRJREQ -- cannot be interactive **
 K ^VPRHTTP(0,"logging","path")
 S ^VPRHTTP(0,"logging")=$G(LEVEL,0)
 S ^VPRHTTP(0,"logging","start")=$S(LEVEL>0:$H,1:"")
 Q
CLEAR ; clear the logs
 K ^VPRHTTP("log")
 Q
LOG() ; return the current logging level
 Q $G(^VPRHTTP(0,"logging"),0)
 ;
PORT() ; return the HTTP port number
 Q $G(^VPRHTTP(0,"port"),9080)
 ;
STATUS() ; Return status of the HTTP listener
 ;Simple Exchange (happy path)
 ;GET /ping HTTP/1.1
 ;Host: JDSlocalhost
 ;
 ;HTTP/1.1 200 OK
 ;Content-Length: 20
 ;Content-Type: application/json
 ;Date: Wed, 15 Aug 2012 21:10:09 GMT
 ;
 ;{"status":"running"}
 ;
 I $E($G(^VPRHTTP(0,"listener")),1,4)="stop" Q ^VPRHTTP(0,"listener")
 ;
 N HTTPLOG,HTTPREQ,PORT,X
 S HTTPLOG=0,PORT=$G(^VPRHTTP(0,"port"),9080)
 O "|TCP|2":("127.0.0.1":PORT:"CT"):2 E  Q "not responding"
 U "|TCP|2"
 W "GET /ping HTTP/1.1"_$C(10,13)_"Host: JDSlocalhost"_$C(10,13,10,13),!
 F  S X=$$RDCRLF^VPRJREQ() Q:'$L(X)  D ADDHEAD^VPRJREQ(X)
 U "|TCP|2":(::"S")
 I $G(HTTPREQ("header","content-length"))>0 D RDLEN^VPRJREQ(HTTPREQ("header","content-length"),2)
 C "|TCP|2"
 S X=$P($G(HTTPREQ("body",1)),"""",4)
 I '$L(X) Q "unknown"
 Q X
