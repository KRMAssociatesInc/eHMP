package com.vistacowboy.jVista;

import java.util.LinkedHashMap;
import java.util.Random;

/**
 * Created with IntelliJ IDEA.
 * User: Joe
 * Date: 11/25/12
 * Time: 2:27 PM
 */

public class RpcParameter
{
    public static final int LITERAL = 1;
    public static final int REFERENCE = 2;
    public static final int LIST = 3;
    public static final int WORDPROC = 4;
    public static final int ENCRYPTED = 10;

    public static final int COUNT_WIDTH = 3;
    private static final int LINES_IN_PAD = 20;

    private static final String[] CIPHER_PAD = {
            "wkEo-ZJt!dG)49K{nX1BS$vH<&:Myf*>Ae0jQW=;|#PsO`'%+rmb[gpqN,l6/hFC@DcUa ]z~R}\"V\\iIxu?872.(TYL5_3",
            "rKv`R;M/9BqAF%&tSs#Vh)dO1DZP> *fX'u[.4lY=-mg_ci802N7LTG<]!CWo:3?{+,5Q}(@jaExn$~p\\IyHwzU\"|k6Jeb",
            "\\pV(ZJk\"WQmCn!Y,y@1d+~8s?[lNMxgHEt=uw|X:qSLjAI*}6zoF{T3#;ca)/h5%`P4$r]G'9e2if_>UDKb7<v0&- RBO.",
            "depjt3g4W)qD0V~NJar\\B \"?OYhcu[<Ms%Z`RIL_6:]AX-zG.#}$@vk7/5x&*m;(yb2Fn+l'PwUof1K{9,|EQi>H=CT8S!",
            "NZW:1}K$byP;jk)7'`x90B|cq@iSsEnu,(l-hf.&Y_?J#R]+voQXU8mrV[!p4tg~OMez CAaGFD6H53%L/dT2<*>\"{\\wI=",
            "vCiJ<oZ9|phXVNn)m K`t/SI%]A5qOWe\\&?;jT~M!fz1l>[D_0xR32c*4.P\"G{r7}E8wUgyudF+6-:B=$(sY,LkbHa#'@Q",
            "hvMX,'4Ty;[a8/{6l~F_V\"}qLI\\!@x(D7bRmUH]W15J%N0BYPkrs&9:$)Zj>u|zwQ=ieC-oGA.#?tfdcO3gp`S+En K2*<",
            "jd!W5[];4'<C$/&x|rZ(k{>?ghBzIFN}fAK\"#`p_TqtD*1E37XGVs@0nmSe+Y6Qyo-aUu%i8c=H2vJ\\) R:MLb.9,wlO~P",
            "2ThtjEM+!=xXb)7,ZV{*ci3\"8@_l-HS69L>]\\AUF/Q%:qD?1~m(yvO0e'<#o$p4dnIzKP|`NrkaGg.ufCRB[; sJYwW}5&",
            "vB\\5/zl-9y:Pj|=(R'7QJI *&CTX\"p0]_3.idcuOefVU#omwNZ`$Fs?L+1Sk<,b)hM4A6[Y%aDrg@~KqEW8t>H};n!2xG{",
            "sFz0Bo@_HfnK>LR}qWXV+D6`Y28=4Cm~G/7-5A\\b9!a#rP.l&M$hc3ijQk;),TvUd<[:I\"u1'NZSOw]*gxtE{eJp|y (?%",
            "M@,D}|LJyGO8`$*ZqH .j>c~h<d=fimszv[#-53F!+a;NC'6T91IV?(0x&/{B)w\"]Q\\YUWprk4:ol%g2nE7teRKbAPuS_X",
            ".mjY#_0*H<B=Q+FML6]s;r2:e8R}[ic&KA 1w{)vV5d,$u\"~xD/Pg?IyfthO@CzWp%!`N4Z'3-(o|J9XUE7k\\TlqSb>anG",
            "xVa1']_GU<X`|\\NgM?LS9{\"jT%s$}y[nvtlefB2RKJW~(/cIDCPow4,>#zm+:5b@06O3Ap8=*7ZFY!H-uEQk; .q)i&rhd",
            "I]Jz7AG@QX.\"%3Lq>METUo{Pp_ |a6<0dYVSv8:b)~W9NK`(r'4fs&wim\\kReC2hg=HOj$1B*/nxt,;c#y+![?lFuZ-5D}",
            "Rr(Ge6F Hx>q$m&C%M~Tn,:\"o'tX/*yP.{lZ!YkiVhuw_<KE5a[;}W0gjsz3]@7cI2\\QN?f#4p|vb1OUBD9)=-LJA+d`S8",
            "I~k>y|m};d)-7DZ\"Fe/Y<B:xwojR,Vh]O0Sc[`$sg8GXE!1&Qrzp._W%TNK(=J 3i*2abuHA4C'?Mv\\Pq{n#56LftUl@9+",
            "~A*>9 WidFN,1KsmwQ)GJM{I4:C%}#Ep(?HB/r;t.&U8o|l['Lg\"2hRDyZ5`nbf]qjc0!zS-TkYO<_=76a\\X@$Pe3+xVvu",
            "yYgjf\"5VdHc#uA,W1i+v'6|@pr{n;DJ!8(btPGaQM.LT3oe?NB/&9>Z`-}02*%x<7lsqz4OS ~E$\\R]KI[:UwC_=h)kXmF",
            "5:iar.{YU7mBZR@-K|2 \"+~`M%8sq4JhPo<_X\\Sg3WC;Tuxz,fvEQ1p9=w}FAI&j/keD0c?)LN6OHV]lGy'$*>nd[(tb!#"
    };

    private int type;
    private String value;
    private LinkedHashMap<String, String> paramList;

    public RpcParameter(int type, String value) throws VistaException
    {
        if (type != LITERAL && type != ENCRYPTED && type != REFERENCE)
        {
            throw new VistaException("Invalid param type");
        }
        this.type = type == ENCRYPTED ? LITERAL : type;
        this.value = type == ENCRYPTED ? encrypt(value) : value;
    }

    public RpcParameter(int type, String value, int associator_index, int identifier_index) throws VistaException
    {
        if (type != ENCRYPTED)
        {
            throw new VistaException("Type must be ENCRYPTED when using encryption indexes");
        }
        if (associator_index < 0 || associator_index >= LINES_IN_PAD ||
            identifier_index < 0 || identifier_index >= LINES_IN_PAD)
        {
            throw new VistaException("Indexes must be from 0-19");
        }
        this.type = LITERAL;
        this.value = encrypt(value, associator_index, identifier_index);
    }

    public RpcParameter(int type, LinkedHashMap<String, String> paramList) throws VistaException
    {
        if (type != LIST)
        {
            throw new VistaException("Type must be LIST when value is LinkedHashMap");
        }
        this.type = type;
        this.paramList = paramList;
    }

    private String encrypt(String value)
    {
        Random rand = new Random();
        int MAX = 20;
        int associator_index = rand.nextInt(MAX);
        int identifier_index = rand.nextInt(MAX);
        while (associator_index == identifier_index)
            identifier_index = rand.nextInt(MAX);
        return encrypt(value, associator_index, identifier_index);
    }

    private String encrypt(String value, int associator_index, int identifier_index)
    {
        String encrypted_value = "";
        for (int i=0; i<value.length(); i++)
        {
            char ch = value.charAt(i);
            int pos = CIPHER_PAD[associator_index].indexOf(ch);
            encrypted_value += pos == -1 ? ch : CIPHER_PAD[identifier_index].charAt(pos);
        }
        return (char)(associator_index + 32) + encrypted_value + (char)(identifier_index + 32);
    }

    public int getType()
    {
        return this.type;
    }

    public String getValue()
    {
        return this.value;
    }

    public LinkedHashMap<String, String> getParamList()
    {
        return paramList;
    }

    public String paramList2String()
    {
        if (paramList.isEmpty())
        {
            return VistaUtils.strPack("", COUNT_WIDTH) + 'f';
        }
        String param_str = "";
        for (Object key : paramList.keySet())
        {
            String paramName = (String)key;
            String paramValue = (String)paramList.get(paramName);
            if (paramValue.isEmpty())
                paramValue = "\u0001";
            param_str += String.format("%s%st",
                    VistaUtils.strPack(paramName, RpcParameter.COUNT_WIDTH),
                    VistaUtils.strPack(paramValue, RpcParameter.COUNT_WIDTH));
        }
        return String.format("%sf", param_str.substring(0, param_str.length() - 1));
    }
}
