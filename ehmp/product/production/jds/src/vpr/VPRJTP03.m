VPRJTP03 ;SLC/KCM -- Sample patient data for links/templates
 ;;1.0;JSON DATA STORE;;Sep 01, 2012
 ;
PTSTUB ;; patient stub, urn:va:patient:93EF:-7
 ;;{"facility":"Camp Master","uid":"urn:va:patient:93EF:-7:-7","localId":"-7","icn":"-777","ssn":"-77777777"}
 ;;zzzzz
DATA1 ;; sample entry #1
 ;;{"patient":"-7","facility":"Camp Master","uid":"urn:va:utesta:93EF:-7:1","localId":"a1","stampTime":"71",
 ;;"summary":"summary for uid utesta:1",
 ;;"authors":[{"provider":{"name":"Welby,Marcus","initials":"MW"}},{"provider":{"name":"John,Trapper","initials":"TJ"}}],
 ;;"dateTime":"20121229103022","qualifiedName":"Miracle Tonic",
 ;;"products":[{"ingredient":"Batwings","drugClass":"Herbal"},{"ingredient":"Dragon Hair","drugClass":"Herbal"}],
 ;;"content":"This is a also a longer field for content that should be filtered out.",
 ;;"dosages":[{"dose":"600ml","start":11,"stop":12},{"dose":"500ml","start":9,"stop":10},{"dose":"700ml","start":13,"stop":14}],
 ;;"fills":[{"fillDate":"201204210930","quantity":20,"mailed":false},{"fillDate":"201207201630","quantity":30,"mailed":true},{"fillDate":"201210201730","quantity":60,"mailed":true}]}
 ;;zzzzz
DATA2 ;; sample entry #2
 ;;{"patient":"-7","facility":"Camp Master","uid":"urn:va:utesta:93EF:-7:2","localId":"a2","stampTime":"72",
 ;;"summary":"summary for uid utesta:2",
 ;;"authors":[{"provider":{"name":"Welby,Marcus","initials":"MW"}},{"provider":{"name":"John,Trapper","initials":"TJ"}}],
 ;;"dateTime":"20111229103022","qualifiedName":"Miracle Tonic",
 ;;"dosages":[{"dose":"400ml","start":7,"stop":8},{"dose":"300ml","start":5,"stop":6}],
 ;;"products":[{"ingredient":"Batwings","drugClass":"Herbal"},{"ingredients":"Dragon Hair","drugClass":"Herbal"}],
 ;;"content":"This is a longer field for content that should be filtered out.",
 ;;"fills":[{"fillDate":"201110201730","quantity":30,"mailed":true},{"fillDate":"201107201630","quantity":30,"mailed":true},{"fillDate":"201104210930","quantity":30,"mailed":false}]}
 ;;zzzzz
DATA3 ;; sample entry #3 (different collection -- utestb)
 ;;{"patient":"-7","facility":"Camp Master","uid":"urn:va:utestb:93EF:-7:3","localId":"b3","stampTime":"73",
 ;;"summary":"summary for uid utestb:3",
 ;;"authors":[{"provider":{"name":"Welby,Marcus","initials":"MW"}},{"provider":{"name":"John,Trapper","initials":"TJ"}}],
 ;;"adminDateTime":"20101229103022","qualifiedName":"Miracle Tonic",
 ;;"dosages":[{"dose":"200ml","start":3,"stop":4},{"dose":"100ml","start":1,"stop":2}],
 ;;"content":"This is yet another longer field for content that should be filtered out.",
 ;;"products":[{"ingredient":"Batwings","drugClass":"Herbal"},{"ingredients":"Dragon Hair","drugClass":"Herbal"}],
 ;;"fills":[{"fillDate":"201010201730","quantity":20,"mailed":true},{"fillDate":"201007201630","quantity":20,"mailed":true},{"fillDate":"201004210930","quantity":10,"mailed":false}]}
 ;;zzzzz
DATA4 ;; sample entry for item that references others (collection utestc)
 ;;{"patient":"-7","facility":"Camp Master","uid":"urn:va:utestc:93EF:-7:23","localId":"c1","stampTime":"723",
 ;;"name":"testRels","text":"test relationship linkages","from":"urn:va:utesta:93EF:-7:2",
 ;;"items":[{"uid":"urn:va:utesta:93EF:-7:1"},{"uid":"urn:va:utestb:93EF:-7:3"}],
 ;;"subs":[{"type":"a","members":[{"uid":"urn:va:utesta:93EF:-7:1"},{"uid":"urn:va:utesta:93EF:-7:2"}]},{"type":"b","members":[{"uid":"urn:va:utestb:93EF:-7:3"}]}]
 ;;}
DATA5 ;; sample entry for item that references others (collection utestc)
 ;;{"patient":"-7","facility":"Camp Master","uid":"urn:va:utestc:93EF:-7:42","localId":"c2","stampTime":"742",
 ;;"name":"testRelsB","text":"test relationship linkages B","from":"urn:va:utesta:93EF:-7:1",
 ;;"items":[{"uid":"urn:va:utesta:93EF:-7:1"}],
 ;;"subs":[{"type":"a","members":[{"uid":"urn:va:utesta:93EF:-7:1"},{"uid":"urn:va:utesta:93EF:-7:2"}]},{"type":"b","members":[{"uid":"urn:va:utestb:93EF:-7:3"}]}]
 ;;}
 ;;zzzzz
 ;
SRV6 ;; sample entry #1
 ;;{"patient":"-7","facility":"Camp Other","uid":"urn:va:utesta:9999:-7:6","localId":"a6","stampTime":"76"}
 ;;zzzzz
SRV7 ;; sample entry #2
 ;;{"patient":"-7","facility":"Camp Master","uid":"urn:va:utesta:93EF:-7:7","localId":"a7","stampTime":"77"}
 ;;zzzzz
