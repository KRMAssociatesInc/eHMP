class RpcParameter

  attr_reader :type, :value

  LITERAL = 1
  REFERENCE = 2
  LIST = 3
  WORDPROC = 4
  ENCRYPTED = 10

  def initialize(type, value, encryption_indexes = nil)
    raise VistaException.new 'Invalid param type' if TYPES.index(type).nil?
    @type = (type == ENCRYPTED ? LITERAL : type)

    if type != ENCRYPTED
      @value = value
    elsif encryption_indexes.nil?
      @value = encrypt value
    else
      @value = encrypt value, validate_indexes(encryption_indexes)
    end
  end

  def list_to_string
    raise VistaException.new('Parameter value not a list') unless @type == LIST

    return VistaUtils.str_pack('', VistaRpc::COUNT_WIDTH) + 'f' if @value.nil?

    param_string = String.new
    @value.each do |param|
      param[1] = "\x01" if param[1].nil?
      param_string += VistaUtils.str_pack(param[0], VistaRpc::COUNT_WIDTH) +
          VistaUtils.str_pack(param[1], VistaRpc::COUNT_WIDTH) + 't'
    end
    param_string[0, param_string.length-1] + 'f'

  end

  def self.decrypt(str)
    associator_index = str[0].ord - 32
    identifier_index = str[str.length-1].ord - 32
    str = str[1,str.length-2]
    decrypted_string = String.new
    str.each_char do |c|
      pos = CIPHER_PAD[identifier_index].index(c)
      decrypted_string += CIPHER_PAD[associator_index][pos]
    end
    decrypted_string
  end

  private

  MAX_INDEX = 19

  TYPES = [LITERAL, REFERENCE, LIST, WORDPROC, ENCRYPTED]

  CIPHER_PAD = [
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
  ]

  def encrypt(str, encryption_indexes = nil)
    if encryption_indexes.nil?
      indexes = get_random_indexes
    else
      indexes = validate_indexes encryption_indexes
    end
    associator_index = indexes[0]
    identifier_index = indexes[1]

    encrypted_string = String.new
    str.each_char do |c|
      pos = CIPHER_PAD[associator_index].index(c)
      if pos.nil?
        encrypted_string += c
      else
        encrypted_string += CIPHER_PAD[identifier_index][pos]
      end
    end
    (associator_index + 32).chr + encrypted_string + (identifier_index + 32).chr
  end

  def get_random_indexes
    associator_index = rand(MAX_INDEX)
    identifier_index = rand(MAX_INDEX)
    while associator_index == identifier_index
      identifier_index = rand(MAX_INDEX)
    end
    [associator_index, identifier_index]
  end

  def validate_indexes(encryption_indexes)
    raise VistaException, "Encryption indexes cannot be equal" if encryption_indexes[0] == encryption_indexes[1]
    encryption_indexes.each do |index|
      raise VistaExeption.new 'Encryption indexes must be 0..19' if index < 0 || index > MAX_INDEX
    end
    encryption_indexes
  end

end