VPRJCU ;SLC/KCM -- Common Utilities for Patient and Non-Patient Stores
 ;;1.0;JSON DATA STORE;;Sep 01, 2012
 ;
EXPINST(S,INST) ; expand instance string into instance array
 N I,J,X,Y
 F I=1:1:$L(S,"|") S X=$P(S,"|",I) F J=1:1:$L(X,">") S Y=$P(X,">",J),INST($P(Y,"#"))=$P(Y,"#",2)
 Q
 ;
UNKARGS(ARGS,LIST) ; returns true if any argument is unknown
 N X,UNKNOWN
 S UNKNOWN=0,LIST=","_LIST_",start,limit,"
 S X="" F  S X=$O(ARGS(X)) Q:X=""  I LIST'[(","_X_",") D
 . S UNKNOWN=1
 . D SETERROR^VPRJRER(111,X)
 Q UNKNOWN
 ;
SPC(S,PIECE) ; return the piece delimited by 1..n spaces
 N I,X,T
 S S=$TR(S,$C(9)," "),T="",PIECE=$G(PIECE,1)
 F I=1:1 D  Q:$L(T)  Q:'$L(S)
 . S S=$$TRIM^XLFSTR(S,"L")
 . S X=$P(S," ") I PIECE=I S T=X Q
 . S S=$E(S,$L(X)+1,$L(S))
 Q T
 ;
SPLIT(X,LIST,D) ; split string into sorted array, trimming each element
 N I,Y
 S D=$G(D,",")
 F I=1:1:$L(X,D) S Y=$$TRIM^XLFSTR($P(X,D,I)) I $L(Y) S LIST(Y)=""
 Q
NSPLIT(X,LIST,D) ; split string into ordered array, trimming each element
 N I,Y,C
 S D=$G(D,","),C=0
 F I=1:1:$L(X,D) S Y=$$TRIM^XLFSTR($P(X,D,I)) I $L(Y) S C=C+1,LIST(C)=Y
 Q
LTRIM(SRC,IDX) ; trim whitespace from left advancing index
 ; .SRC: source string
 ; .IDX: index of starting character, gets set to first non-space character
 F  Q:IDX>$L(SRC)  Q:$A(SRC,IDX)>32  S IDX=IDX+1  ; trim left whitespace
 Q
NXTSTR(SRC,IDX,STR,QUOTE) ; procedure to parse next string and advance index
 ;  .SRC: the source string
 ;  .IDX: points to the quote that begins the string, will be set 1 past end
 ;  .STR: will contain the parsed string (with unescaped quotes)
 ; QUOTE: defaults to ", but may be any other character (like ')
 ; may set: ERROR
 N TIDX,DONE,END
 S DONE=0,IDX=IDX+1,TIDX=IDX,QUOTE=$G(QUOTE,"""")
 F  D  Q:DONE  Q:$G(HTTPERR)
 . S END=$F(SRC,QUOTE,TIDX) I END=0 D SETERROR^VPRJRER(106,"unexpected end") Q
 . I $E(SRC,END)'=QUOTE S DONE=1 Q
 . S TIDX=END+1 ; advance past second quote and try again
 S STR=$E(SRC,IDX,END-2)
 S IDX=END
 I STR[QUOTE N SPEC S SPEC(QUOTE_QUOTE)=QUOTE,STR=$$REPLACE^XLFSTR(STR,.SPEC)
 Q
NXTVAL(SRC,IDX,VAL,TOKENS) ; return next value
 ;   .SRC: the source string
 ;   .IDX: index of current starting character, gets set 1 past end of value
 ;   .VAL: will contain the parsed value
 ; TOKENS: is a string of terminating characters (the next value)
 ;         "." is a special case and looks for ".."
 D LTRIM(.SRC,.IDX)
 N END,DOTS,DONE
 S END=IDX,DOTS=0,DONE=0
 I TOKENS["." S DOTS=1,TOKENS=$TR(TOKENS,".","")
 F  D  Q:DONE
 . I END>$L(SRC) S DONE=1 Q
 . I TOKENS[$E(SRC,END) S DONE=1 Q
 . I DOTS,$E(SRC,END)=".",$E(SRC,END+1)="." S DONE=1 Q
 . S END=END+1
 S VAL=$$TRIM^XLFSTR($E(SRC,IDX,END-1)),IDX=END
 Q
