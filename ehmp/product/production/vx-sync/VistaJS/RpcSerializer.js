'use strict';


var util = require('util');
var _ = require('underscore');
var _str = require('underscore.string');

var RpcCall = require('./RpcCall').RpcCall;

var PREFIX = '[XWB]';
var RPC_VERSION = '1.108';

var NUL = '\u0000';
var SOH = '\u0001';
var EOT = '\u0004';
var ENQ = '\u0005';


var CIPHER_PAD = [
    'wkEo-ZJt!dG)49K{nX1BS$vH<&:Myf*>Ae0jQW=;|#PsO`\'%+rmb[gpqN,l6/hFC@DcUa ]z~R}"V\\iIxu?872.(TYL5_3',
    'rKv`R;M/9BqAF%&tSs#Vh)dO1DZP> *fX\'u[.4lY=-mg_ci802N7LTG<]!CWo:3?{+,5Q}(@jaExn$~p\\IyHwzU"|k6Jeb',
    '\\pV(ZJk"WQmCn!Y,y@1d+~8s?[lNMxgHEt=uw|X:qSLjAI*}6zoF{T3#;ca)/h5%`P4$r]G\'9e2if_>UDKb7<v0&- RBO.',
    'depjt3g4W)qD0V~NJar\\B "?OYhcu[<Ms%Z`RIL_6:]AX-zG.#}$@vk7/5x&*m;(yb2Fn+l\'PwUof1K{9,|EQi>H=CT8S!',
    'NZW:1}K$byP;jk)7\'`x90B|cq@iSsEnu,(l-hf.&Y_?J#R]+voQXU8mrV[!p4tg~OMez CAaGFD6H53%L/dT2<*>"{\\wI=',
    'vCiJ<oZ9|phXVNn)m K`t/SI%]A5qOWe\\&?;jT~M!fz1l>[D_0xR32c*4.P"G{r7}E8wUgyudF+6-:B=$(sY,LkbHa#\'@Q',
    'hvMX,\'4Ty;[a8/{6l~F_V"}qLI\\!@x(D7bRmUH]W15J%N0BYPkrs&9:$)Zj>u|zwQ=ieC-oGA.#?tfdcO3gp`S+En K2*<',
    'jd!W5[];4\'<C$/&x|rZ(k{>?ghBzIFN}fAK"#`p_TqtD*1E37XGVs@0nmSe+Y6Qyo-aUu%i8c=H2vJ\\) R:MLb.9,wlO~P',
    '2ThtjEM+!=xXb)7,ZV{*ci3"8@_l-HS69L>]\\AUF/Q%:qD?1~m(yvO0e\'<#o$p4dnIzKP|`NrkaGg.ufCRB[; sJYwW}5&',
    'vB\\5/zl-9y:Pj|=(R\'7QJI *&CTX"p0]_3.idcuOefVU#omwNZ`$Fs?L+1Sk<,b)hM4A6[Y%aDrg@~KqEW8t>H};n!2xG{',
    'sFz0Bo@_HfnK>LR}qWXV+D6`Y28=4Cm~G/7-5A\\b9!a#rP.l&M$hc3ijQk;),TvUd<[:I"u1\'NZSOw]*gxtE{eJp|y (?%',
    'M@,D}|LJyGO8`$*ZqH .j>c~h<d=fimszv[#-53F!+a;NC\'6T91IV?(0x&/{B)w"]Q\\YUWprk4:ol%g2nE7teRKbAPuS_X',
    '.mjY#_0*H<B=Q+FML6]s;r2:e8R}[ic&KA 1w{)vV5d,$u"~xD/Pg?IyfthO@CzWp%!`N4Z\'3-(o|J9XUE7k\\TlqSb>anG',
    'xVa1\']_GU<X`|\\NgM?LS9{"jT%s$}y[nvtlefB2RKJW~(/cIDCPow4,>#zm+:5b@06O3Ap8=*7ZFY!H-uEQk; .q)i&rhd',
    'I]Jz7AG@QX."%3Lq>METUo{Pp_ |a6<0dYVSv8:b)~W9NK`(r\'4fs&wim\\kReC2hg=HOj$1B*/nxt,;c#y+![?lFuZ-5D}',
    'Rr(Ge6F Hx>q$m&C%M~Tn,:"o\'tX/*yP.{lZ!YkiVhuw_<KE5a[;}W0gjsz3]@7cI2\\QN?f#4p|vb1OUBD9)=-LJA+d`S8',
    'I~k>y|m};d)-7DZ"Fe/Y<B:xwojR,Vh]O0Sc[`$sg8GXE!1&Qrzp._W%TNK(=J 3i*2abuHA4C\'?Mv\\Pq{n#56LftUl@9+',
    '~A*>9 WidFN,1KsmwQ)GJM{I4:C%}#Ep(?HB/r;t.&U8o|l[\'Lg"2hRDyZ5`nbf]qjc0!zS-TkYO<_=76a\\X@$Pe3+xVvu',
    'yYgjf"5VdHc#uA,W1i+v\'6|@pr{n;DJ!8(btPGaQM.LT3oe?NB/&9>Z`-}02*%x<7lsqz4OS ~E$\\R]KI[:UwC_=h)kXmF',
    '5:iar.{YU7mBZR@-K|2 "+~`M%8sq4JhPo<_X\\Sg3WC;Tuxz,fvEQ1p9=w}FAI&j/keD0c?)LN6OHV]lGy\'$*>nd[(tb!#'
];

//var CIPHER_PAD = [
// 'VEB_0|=f3Y}m<5i$`W>znGA7P:O%H69[2r)jKh@uo\\wMb*Da !+T?q4-JI#d;8ypUQ]g"~\'&Cc.LNt/kX,e{vl1FRZs(xS',
// 'D/Jg><p]1W6Rtqr.QYo8TBEMK-aAIyO(xG7lPz;=d)N}2F!U ,e0~$fk"j[m*3s5@XnZShv+`b\'{u&_\\9%|wL4ic:V?H#C',
// '?lBUvZq\\fwk+u#:50`SOF9,dp&*G-M=;{8Ai6/N7]bQ1szC!(PxW_YV~)3Lm.EIXD2aT|hKj$rnR@["c g\'<>t%4oJHy}e',
// 'MH,t9K%TwA17-Bzy+XJU?<>4mo @=6:Ipfnx/Y}R8Q\\aN~{)VjEW;|Sq]rl[0uLFd`g5Z#e!3$b"P_.si&G(2\'Cvkc*ODh',
// 'vMy>"X?bSLCl)\'jhzHJk.fVc6#*[0OuP@\{,&r(`Es:K!7wi$5F; DoY=p%e<t}4TQA2_W9adR]gNBG1~nIZ+3x-Um|8q/',
// ':"XczmHx;oA%+vR$Mtr CBTU_w<uEK5f,SW*d8OaFGh]j\'{7-~Qp#yqP>09si|VY1J!/[lN23&L4`=.D6)ZIb\n?}(ek@g',
// 'j7Qh[YU.u6~xm<`vfe%_g-MRF(#iK=trl}C)>GEDN *$OdHzBA98aLJ|2WP:@ko0wy4I/S&,q\']5!13XcVs\?Zp"+{;Tbn',
// '\\UVZ;.&]%7fGq`*SA=Kv/-Xr1OBHiwhP5ukYo{2"}d |NsT,>!x6y~cz[C)pe8m9LaRI(MEFlt:Qg#D\'n$W04b@_+?j<3J',
// 'MgSvV"U\'dj5Yf6K*W)/:z$oi7GJ|t(1Ak=ZC,@]Q0?8DnbE[+L`{mq>;aOR}wcB4sF_e9rh2l\\x<. PyNpu%IT!&3#HX~-',
// 'rFkn4Z0cH7)`6Xq|yL #wmuW?Gf!2YES;.B_D=el}hN[M&x(*AasU9otd+{]g>TQjp<:v%5O"zI\\@$Rb~8i-3/\'V1,CJPK',
// '\'%u+W)mK41L#:A6!;7("tnyRlaOe09]3EFd ITf.`@P[Q{B$_iYhZo*kbc|HUgz=D>Svr8x,X~-<NsjM}C/&J?p2wV5qG',
// 'QCl_329e+DTp&\\?jNys V]k*M"X!$Y6[i@g>{RvF\'01(45LJZU,:-uAwtB;7|%fx.n`IhSE<OoW~=bdP#/KHzrc)8mG}aq',
// '!{w*PR[B9Oli~T, rFc"/?ast8=)-_Dgo<E#n4HYA%f\'N;0@S7pJ`kGIedM|+C2yjvL5b3K6\\Z]V(.h}umxz>XQ$qUW:1&',
// '}:SHZ|O~A-bcyJ4%\'5vM+ ;eo.$B)Vp\\,kTDz1sGL`]*=mg2nxYPd&lErN3[8qF0@u"a_>wQKI{f6C7?9RX(t#i/U<j!Wh',
// ',ry*|7<1keO:Wi C/zh4IZ>x!F[_("Dbu%Hl5Pg=]QG.LKcJ0&ont@+{;ATX6jMwBv?2#f`q\\}VYm\'8Es$NpU)dR~S9a3-',
// 'h,=/:pJ$@mlY-`bwQ)e3Xt8.RUSMV 2A;j[PN}TE9x~kL&<ns5q>_#c1%K+rIuFoa(zyDWdH]?\\GB0g*4f6"Z!\'v{7|OiC',
// '/$*b.ts0vOx_-o"l3MHI~}!E`eJimPd>Sn&wzFUh?Kf4)g5X<,8pD:9LA{a[k;\'|GyYQ=R2B\\#q+cru6N1W@(C TV]7Z%j',
// 'qEoC?YWNtV{Brg,I(i:e7Jd#6m!D8XT"n[$~1*ZcxL.Kh2s4%Q&ju\\5Gvazw+9pF@k`HA)=U3/< -}\'0b;|PfSRl_MO]y>',
// '`@X:!R[\\tY5OBcZPh$rM_a-"vgJG%|}oIH)wWQ*jDVxlp,\'+S zu(&7?>KCn4y1dE02q6b<;F=8]9NAmT{Li3f/esUk.~#',
// '\\Zr\';/SMsG76Lj$aBc[#k>u=_O@2J&X{Aft xV4~vz8Q}q)0K.NIpRnYwDhg+<"H-!(PF:m*]?,WCT|dE9o53%`liUey1b'
//];

// Don't use this, it's really just a namespace object
function RpcSerializer() {}

function strPack(string) {
    return _str.lpad(string.length, 3, '0') + string;
}

function prependCount(string) {
    return String.fromCharCode(string.length) + string;
}


function adjustForSearch(string) {
    if (/^[0-9]+$/.test(string)) {
        return Number(string - 1);
    }

    // string
    if (string.length === 0) {
        return '';
    }

    var result = string.substring(0, string.length - 1);
    var ch = string.charAt(string.length - 1);
    var asciiCode = ch.charCodeAt() - 1;
    ch = String.fromCharCode(asciiCode);
    result = result + ch + '~';
    return result;
}



RpcSerializer.literalParamString = function literalParamString(valueString) {
    return util.format('%s%sf', '0', strPack(valueString));
};

RpcSerializer.encryptedParamString = function encryptedParamString(valueString, assocIndex, idIndex) {
    if (assocIndex < 0 || assocIndex >= CIPHER_PAD.length ||
        idIndex < 0 || idIndex >= CIPHER_PAD.length) {
        throw new Error(util.format('Encryption Indexes must be from 0 to %s inclusive', (CIPHER_PAD.length - 1)));
    }

    if (_.isUndefined(assocIndex) || _.isNull(assocIndex) || _.isUndefined(idIndex) || _.isNull(idIndex)) {
        assocIndex = _.random(0, 9);
        idIndex = _.random(0, 9);

        while (assocIndex === idIndex) {
            idIndex = _.random(0, 9);
        }
    }

    var assocStr = CIPHER_PAD[assocIndex];
    var idStr = CIPHER_PAD[idIndex];

    var encryptedValue = Array.prototype.reduce.call(valueString, function(first, second) {
        var pos = assocStr.indexOf(second);
        return first + (pos === -1 ? second : idStr.charAt(pos));
    }, '');


    var encryptedString = String.fromCharCode(assocIndex + 32) + encryptedValue + String.fromCharCode(idIndex + 32);

    return RpcSerializer.literalParamString(encryptedString);
};

RpcSerializer.referenceParamString = function referenceParamString(valueString) {
    return util.format('%s%sf', '1', strPack(valueString));
};

RpcSerializer.listParamString = function listParamString(valueObject) {
    if (_.isEmpty(valueObject)) {
        return strPack('') + 'f';
    }

    var paramString = _.reduce(valueObject, function(memo, value, key) {
        if (_.isEmpty(value)) {
            value = SOH;
        }

        return memo + util.format('%s%st',
            strPack(key),
            strPack(value));
    }, '');

    return util.format('%s%sf', '2', paramString.substring(0, paramString.length - 1));
};


RpcSerializer.buildRpcGreetingString = function buildRpcGreetingString(ipAddress, hostname) {
    return util.format('%s10304\nTCPConnect50%sf0%sf0%sf%s',
        PREFIX,
        strPack(RpcSerializer.literalParamString(ipAddress)),
        strPack('0'),
        strPack(RpcSerializer.literalParamString(hostname)),
        EOT);
};

RpcSerializer.buildRpcSignOffString = function buildRpcSignOffString() {
    return util.format('%s10304%s#BYE#%s', PREFIX, ENQ, EOT);
};

/*
Variadic Function:
buildRpcString(rpcName, rpcParamList, ...)
buildRpcString(rpcName, [rpcParamList, ...])
buildRpcString(rpcCall)
*/
RpcSerializer.buildRpcString = function buildRpcString(rpcName, rpcParamList) {
    if(arguments.length === 0) {
        return;
    }

    if(RpcCall.isRpcCall(arguments[0])) {
        var rpcCall = arguments[0];
        return buildRpcString(rpcCall.rpcName, rpcCall.params);
    }

    if(rpcParamList && !_.isArray(rpcParamList)) {
        rpcParamList = _.rest(arguments);
    }

    var serializedStrings = _.reduce(rpcParamList, function(memo, param) {
        return memo + RpcSerializer[param.type + 'ParamString'](param.value, param.attributes.assocIndex, param.attributes.idIndex);
    }, '');

    return util.format('%s11302%s%s%s%s',
        PREFIX,
        prependCount(RPC_VERSION),
        prependCount(rpcName),
        '5' + (serializedStrings || '4f'),
        EOT);
};


module.exports.RpcSerializer = RpcSerializer;

module.exports._CIPHER_PAD = CIPHER_PAD;
module.exports._strPack = strPack;
module.exports._prependCount = prependCount;
module.exports._adjustForSearch = adjustForSearch;
