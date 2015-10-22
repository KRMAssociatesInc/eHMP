VPRJRER ;SLC/KCM -- Error Recording
 ;;1.0;JSON DATA STORE;;Sep 01, 2012
 ;
SETERROR(ERRCODE,MESSAGE) ; set error info into ^TMP("HTTPERR",$J)
 ; causes HTTPERR system variable to be set
 ; ERRCODE:  query errors are 100-199, update errors are 200-299, M errors are 500
 ; MESSAGE:  additional explanatory material
 N NEXTERR,ERRNAME,TOPMSG
 S HTTPERR=400,TOPMSG="Bad Request"
 ; query errors (100-199)
 I ERRCODE=101 S ERRNAME="Missing name of index"
 I ERRCODE=102 S ERRNAME="Invalid index name"
 I ERRCODE=103 S ERRNAME="Parameter error"
 I ERRCODE=104 S HTTPERR=404,TOPMSG="Not Found",ERRNAME="Bad key"
 I ERRCODE=105 S ERRNAME="Template error"
 I ERRCODE=106 S ERRNAME="Bad Filter Parameter"
 I ERRCODE=107 S ERRNAME="Unsupported Field Name"
 I ERRCODE=108 S ERRNAME="Bad Order Parameter"
 I ERRCODE=109 S ERRNAME="Order requires indexed array value"
 I ERRCODE=110 S ERRNAME="Order field unknown"
 I ERRCODE=111 S ERRNAME="Unrecognized parameter"
 I ERRCODE=112 S ERRNAME="Filter required"
 I ERRCODE=113 S ERRNAME="No reverse field name"
 ; update errors (200-299)
 I ERRCODE=201 S ERRNAME="Unknown collection" ; unused?
 I ERRCODE=202 S ERRNAME="Unable to decode JSON"
 I ERRCODE=203 S HTTPERR=404,TOPMSG="Not Found",ERRNAME="Unable to determine patient"
 I ERRCODE=204 S HTTPERR=404,TOPMSG="Not Found",ERRNAME="Unable to determine collection" ; unused?
 I ERRCODE=205 S ERRNAME="Patient mismatch with object"
 I ERRCODE=207 S ERRNAME="Missing UID"
 I ERRCODE=208 S HTTPERR=404,TOPMSG="Not Found",ERRNAME="Missing site identifier"
 I ERRCODE=209 S ERRNAME="Missing range or index" ; unused?
 I ERRCODE=210 S ERRNAME="Unknown UID format"
 I ERRCODE=211 S HTTPERR=404,TOPMSG="Not Found",ERRNAME="Missing patient identifiers"
 I ERRCODE=212 S ERRNAME="Mismatch of patient identifiers"
 I ERRCODE=213 S ERRNAME="Delete demographics only not allowed"
 I ERRCODE=214 S HTTPERR=404,ERRNAME="Patient ID not found in database"
 I ERRCODE=215 S ERRNAME="Missing collection name"
 I ERRCODE=216 S ERRNAME="Incomplete deletion of collection"
 I ERRCODE=217 S ERRNAME="JSON parsing error"
 I ERRCODE=218 S ERRNAME="Template encoding error"
 I ERRCODE=219 S ERRNAME="Template not found"
 ; Session Storage error codes
 I ERRCODE=220 S HTTPERR=404,TOPMSG="Not Found",ERRNAME="Missing session identifier"
 ; Metastamp/JPID error codes
 I ERRCODE=221 S ERRNAME="Missing Metastamp"
 I ERRCODE=222 S ERRNAME="Missing JPID"
 I ERRCODE=223 S ERRNAME="JPID Collision Detected"
 I ERRCODE=224 S HTTPERR=404,ERRNAME="JPID Not Found"
 I ERRCODE=225 S ERRNAME="Patient Demographics not on File"
 I ERRCODE=226 S ERRNAME="Missing PID"
 I ERRCODE=227 S HTTPERR=404,ERRNAME="Missing Source Id"
 I ERRCODE=228 S ERRNAME="Missing Stamp"
 I ERRCODE=229 S HTTPERR=404,ERRNAME="No data on file"
 I ERRCODE=230 S ERRNAME="Invalid Patient Identifier passed"
 I ERRCODE=241 S HTTPERR=404,ERRNAME="A Site must be specified"
 ; Job Storage error codes
 I ERRCODE=231 S HTTPERR=404,TOPMSG="Not Found",ERRNAME="Missing job patient identifier"
 I ERRCODE=232 S HTTPERR=404,TOPMSG="Not Found",ERRNAME="Missing rootJobId"
 I ERRCODE=233 S HTTPERR=404,TOPMSG="Not Found",ERRNAME="Missing jobId"
 I ERRCODE=234 S HTTPERR=404,TOPMSG="Not Found",ERRNAME="Missing job status"
 I ERRCODE=235 S HTTPERR=404,TOPMSG="Not Found",ERRNAME="Missing job timestamp"
 I ERRCODE=236 S ERRNAME="rootJobId,jobId pair is invalid"
 I ERRCODE=237 S HTTPERR=404,TOPMSG="Not Found",ERRNAME="Missing job type"
 ; More generic error codes
 I ERRCODE=251 S HTTPERR=404,TOPMSG="Not Found",ERRNAME="Missing Site Hash"
 ; HTTP errors
 I ERRCODE=400 S ERRNAME="Bad Request"
 I ERRCODE=404 S ERRNAME="Not Found"
 I ERRCODE=405 S ERRNAME="Method Not Allowed"
 ; system errors (500-599)
 I ERRCODE=501 S ERRNAME="M execution error"
 I ERRCODE=502 S ERRNAME="Unable to lock record"
 I '$L($G(ERRNAME)) S ERRNAME="Unknown error"
 ;
 I ERRCODE>500 S HTTPERR=500,TOPMSG="Internal Server Error"  ; M Server Error
 I ERRCODE<500,ERRCODE>400 S HTTPERR=ERRCODE,TOPMSG=ERRNAME  ; Other HTTP Errors
 S NEXTERR=$G(^TMP("HTTPERR",$J,0),0)+1,^TMP("HTTPERR",$J,0)=NEXTERR
 S ^TMP("HTTPERR",$J,1,"apiVersion")="1.0"
 S ^TMP("HTTPERR",$J,1,"error","code")=HTTPERR
 S ^TMP("HTTPERR",$J,1,"error","message")=TOPMSG
 S ^TMP("HTTPERR",$J,1,"error","request")=$G(HTTPREQ("method"))_" "_$G(HTTPREQ("path"))_" "_$G(HTTPREQ("query"))
 S ^TMP("HTTPERR",$J,1,"error","errors",NEXTERR,"reason")=ERRCODE
 S ^TMP("HTTPERR",$J,1,"error","errors",NEXTERR,"message")=ERRNAME
 I $L($G(MESSAGE)) S ^TMP("HTTPERR",$J,1,"error","errors",NEXTERR,"domain")=MESSAGE
 Q
