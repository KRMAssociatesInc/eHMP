require 'socket'
#require 'rpc_response'
#require 'vista_rpc'

module VistaRPC4r
  class RPCBrokerConnection
    # Header chunk types
    CHUNK_TYPE_HEADER = "1"
    CHUNK_TYPE_RPC = "2"
    CHUNK_TYPE_SECURITY = "3"
    CHUNK_TYPE_COMMAND = "4"
    CHUNK_TYPE_DATA = "5"
    XWB_HEADER = "[XWB]"
    # Header and protocol info
    VISTA_RPC_VERSION = "1"
    VISTA_RPC_TYPE_CMD = "0"
    VISTA_RPC_TYPE_RPC = "1"
    VISTA_RPC_LENV = 3
    VISTA_RPC_LENV_STR = "3"
    VISTA_RPC_RETURN_DATA = "0"
    VISTA_RPC_NO_RETURN_DATA = "1"
    END_MARKER = 4
    # Parameter types
    PARAM_LITERAL_MARKER = "0"
    PARAM_REFERENCE_MARKER = "1"
    PARAM_LIST_MARKER = "2"
    PARAM_GLOBAL_MARKER = "3"
    PARAM_EMPTY_MARKER = "4"
    
    public
    
    def initialize(host, port, access, verify, debug=FALSE)
      @sentConnect = false
      @signedOn = false
      @host=host
      @port=port
      @access=access
      @verify=verify
      if debug
        @loglevel=2
      else
        @loglevel=0
      end
      @token=nil
      @socket = nil
      @encryptedAV = nil
      @writeBuffer = String.new
      @duz = "0"
      @currentContext = nil
      @lastvistaerror = nil

    end
    
    def connect
      retVal = true
      if isConnected()
        warn " already connected, closing first"
        close
      end
      @socket = TCPSocket.open(@host, @port)    # Connect
      #            socket.setTcpNoDelay(true)
      tcpConnect = VistaRPC.new("TCPConnect", RPCResponse::SINGLE_VALUE, true)
      tcpConnect.params[0]= @socket.addr[4]  # local IP address
      tcpConnect.params[1]= "0" # callback port ?
      tcpConnect.params[2]= "OVID"
      connectResponse = execute(tcpConnect)
      if (connectResponse == nil || connectResponse.value == nil || connectResponse.value == "reject")
        raise "Handshake error" 
      end
      if (connectResponse.error_message != nil)
        raise "RPC Error: " + connectResponse.error_message 
      end
      @sentConnect = true
      
      signOn()
      retVal = logIn()
      return retVal
    end

    # close tries to gracefully end the VistA session.  If socket is already dead, will return nil
    def close()
      if isConnected()
        if @sentConnect
          @sentConnect = false  # set in connect()
          @signedOn=false  # set in signOn() inside connect()
          bye = VistaRPC.new("#BYE#", RPCResponse::SINGLE_VALUE, true)
          retval = execute(bye)
          @socket.close()
          @socket = nil
          @duz = "0"
          @lastvistaerror = nil
          @currentContext = nil
          return retval
        end
      end
    end

    # force the broker into the pre connect state.  Use if close returns nil
    def forceclose
      @sentConnect = false  # set in connect()
      @signedOn=false  # set in signOn() inside connect()
      @socket.close()
      @socket = nil
      @duz = "0"
      @currentContext = nil
      @lastvistaerror=nil
      return true
    end
    
    def isConnected()
      return @socket != nil
    end
    
    # execute differs from RPCBrokerConnection - We want the application to know about eof
    # execute will return nil if ioerror most likely unexpected EOFError
    def execute(rpc)
      @lastvistaerror = nil
      retVal = executeOnce(rpc)
      if (retVal == nil && @signedOn) 
        #maybe some reconnect logic
        if (rpc.name == "#BYE#")
          # We're disconnecting anyway
          return nil
        end
        # attempt to log back on
        #if (connect())
        #  if (@currentContext != nil) 
        #    tempcontext = @currentContext
        #    @currentContext = nil
        #    setContext(tempcontext)
        #  end
        #  retVal = executeOnce(rpc)
        #end
      end
      return retVal
    end

    # Call the RPC function
    #  rpcname = String containing name of RPC
    #  args = Array of arguments 0-based
    #  response type = one of the types in RPCResponse
    #  returns RPCResponse
    def call(rpcname, responsetype, args=nil)
      rpc = VistaRPC.new(rpcname, responsetype)
      if !args.nil?
        rpc.params = args
      end
      rpcresponse = execute(rpc)
      return rpcresponse
    end

    # Call the RPC function expecting to receive a string or SINGLE_VALUE
    #  rpcname = String containing name of RPC
    #  args = Array of arguments 0-based
    #  returns String
    def call_s(rpcname, args=nil)
      rpc = VistaRPC.new(rpcname, RPCResponse::SINGLE_VALUE)
      if !args.nil?
        rpc.params = args
      end
      rpcresponse = execute(rpc)
      if rpcresponse.nil?
        return nil
      end
      if !rpcresponse.error_message.nil?
        @lastvistaerror = rpcresponse.error_message
      end
      return rpcresponse.value
    end

    # Call the RPC function expecting to receive a array of string ARRAY
    #  rpcname = String containing name of RPC
    #  args = Array of arguments 0-based
    #  returns Array
    def call_a(rpcname, args=nil)
      rpc = VistaRPC.new(rpcname, RPCResponse::ARRAY)
      if !args.nil?
        rpc.params = args
      end
      rpcresponse = execute(rpc)
      if rpcresponse.nil?
        return nil
      end
      if !rpcresponse.error_message.nil?
        @lastvistaerror = rpcresponse.error_message
      end
      return rpcresponse.value
    end

    # if call_a or call_s return nil, you can check to see if there was a VistA error message
    def lastvistaerror
      return @lastvistaerror
    end
    
    def setContext(context)
      if (context == @currentContext)
        warn "context is already set to " + context + "..."
        return
      end
      if (@currentContext != nil) 
        warn "changing context from " + @currentContext + " to " + context
      end
      
      #puts "Setting context to: " + context
      xwbCreateContext = VistaRPC.new("XWB CREATE CONTEXT", RPCResponse::SINGLE_VALUE)
      encryptedContext = xwbCreateContext.encrypt(context)
      xwbCreateContext.params[0] = encryptedContext
      response = execute(xwbCreateContext)
      if (response == nil || response.error_message != nil)
        raise "XWB CREATE CONTEXT failed: " + response.error_message
      end
      @currentContext = context
      return response
    end
    
    
    def getDUZ
      return @duz
    end
    
    # set log level  0= off, 1= informational, 2=debug
    def loglevel(level)
      if level < 0 or level > 2
        return nil
      end
      @loglevel = level
      return @loglevel
    end
    
    private  
    
    def signOn() 
      signonResponse = execute(VistaRPC.new("XUS SIGNON SETUP", RPCResponse::ARRAY))
      if (signonResponse == nil || signonResponse.error_message != nil)
        raise "XUS SIGNON SETUP failed"
      end
      @signedOn = true
    end
    
    def logIn()
      xusAvCode = VistaRPC.new("XUS AV CODE", RPCResponse::ARRAY)
      @duz = "0"
      
      if (@encryptedAV == nil) 
        if (@token != nil)
          @encryptedAV = @token
        else 
          @encryptedAV = xusAvCode.encrypt(@access + ";" + @verify)
        end
        
      end
      xusAvCode.params[0]= @encryptedAV
      response = execute(xusAvCode)
      if (response == nil) 
        return false
      end
      hasErrors = (response.error_message != nil)
      answer = response.value
      if (!hasErrors) 
        if (answer.length == 0) 
          hasErrors = true
        else 
          hasErrors = answer[0]== "0"
        end
      end
      if (hasErrors) 
        brokerInfo = extractBrokerErrorInfo(response)
        warn("Access denied: " + brokerInfo)
        return false
      else
        @duz = answer[0]
      end
      return true
    end
    
    
    def extractBrokerErrorInfo(response)
      sb = String.new
      #    if (response != nil && response.getArray() != nil)
      #      response.getArray.each do |answer|
      #        if (answer != nil && answer.length > 0 && !answer.matches("^(\\d+)$"))
      #          if (sb.length() != 0) # sb is Stringbuilder
      #            sb.append(" : ")
      #            sb.append(answer)
      #          end
      #        end
      #      end
      #    end
      return sb
    end
    
  
    #    public String buildSubscript(String string) {
    #        return /* "\r" + */ string
    #    }
    
    def executeOnce(rpc)
      retVal = nil
      writeProtocol()
      writeCommand(rpc)
      writeParams(rpc)
      write(END_MARKER)
      if (flush())
        retVal = getResponse(rpc.type)
        if @loglevel ==2
          if retVal.nil?  # io error
            puts "<Response> IO Error </Response>"
          else
            puts "<Response> " + retVal.to_s + "</Response>"
          end
        end
      end
      return retVal
    end
    
    def write(data)
      @writeBuffer << data
    end
    
    def writeProtocol
      write(XWB_HEADER + VISTA_RPC_VERSION + VISTA_RPC_TYPE_RPC + VISTA_RPC_LENV_STR + VISTA_RPC_RETURN_DATA)
    end
    
    def writeCommand(rpc)  
      if (rpc.isCommand)
        write(CHUNK_TYPE_COMMAND)
      else
        write(CHUNK_TYPE_RPC)
        writeSPack(VISTA_RPC_VERSION)
      end
      writeSPack(rpc.name)
    end
    
    def writeSPack(value)
      write(value.length)  # integer
      write(value)
    end
    
    def writeLPack(string)
      len = sprintf("%03i", string.length)  # 0-padded 3 place string of integer
      #Integer.toString(string.length())
      #    while (len.length() < VISTA_RPC_LENV) {
      #        len = "0" + len
      #    }
      write(len)  # "003"
      write(string)
    end
    
    def writeParams(rpc)
      write(CHUNK_TYPE_DATA)
      
      params = rpc.params  # Hash integer => object
      if (!params.empty?)
        params.each do |param|
          if param.nil?
            writeEmptyParam()
          elsif param.class == String
            writeStringParam(param)
          elsif param.class == Array
            writeArrayParam(param)
          else
            writeEmptyParam()
          end
        end
      else
        writeEmptyParam()
      end
      #No end marker. Chunk 5 is assumed to be the last.
    end
    
    def writeArrayParam(paramarray)
      write(PARAM_LIST_MARKER)
      size = paramarray.size
      index = 0
      paramarray.each do |v|
        writeLPack(v[0])
        writeLPack(v[1])
        index += 1
        if index !=size # looks like don't write a 't' after the last entry
          write("t")
        end
      end
      write("f")  
    end
    
    def writeStringParam(string)
      write(PARAM_LITERAL_MARKER)
      writeLPack(string)
      write("f")
    end
    
    def writeEmptyParam() 
      write(PARAM_EMPTY_MARKER)
      write("f")
    end
    
    def flush()
      retVal = false
      if (isConnected() || connect()) 
        if @loglevel ==2
          puts "<Request>" + @writeBuffer + "</Request>"
        end
        @socket.write(@writeBuffer)
        @socket.flush
        @writeBuffer = String.new
        retVal = true
      end
      return retVal
    end
    
    # Get response will return a response object or nil
    # Response object could contain a vista generated security/other error
    # Nil means something went wrong with the connection, check the system error
    def getResponse(rpcType)
      hadError = Array.new  # for passing around boolean by reference
      hadError[0]=false

      # Check for VistA erros
      securityError = readSPack(hadError)
      if (hadError[0])
        return nil # had a io error
      end
      if (securityError.empty?)
        securityError = nil
      end
      otherError = readSPack(hadError)
      if (hadError[0])
        return nil  # had a io error
      end
      if (otherError.empty?)
        otherError = nil
      end
      
      retVal = nil
      if (rpcType == RPCResponse::SINGLE_VALUE or rpcType == RPCResponse::GLOBAL_INSTANCE)
        retVal = RPCResponse.new(readString(nil, hadError))
        if (hadError[0])
          return nil
        end
      elsif (rpcType == RPCResponse::GLOBAL_ARRAY or rpcType == RPCResponse::WORD_PROCESSING or rpcType == RPCResponse::ARRAY)
        retVal = RPCResponse.new(readArray(hadError))
        if (hadError[0]) 
          return nil
        end
      end
      
      if (retVal != nil && (otherError != nil || securityError != nil))
        if (otherError != nil && securityError != nil)
          retVal.error_message = otherError + "^" + securityError
        elsif (otherError != nil) 
          retVal.error_message = otherError
        else 
          retVal.error_message = securityError
        end
      end
      return retVal
    end
    
    # returns array of string
    def readArray(hadError)
      if (hadError != nil)
        hadError[0] = false
      end
      arrayList = Array.new
      endMarker = Array.new
      endMarker[0] = false
      while true
        newString = readString(endMarker, hadError)
        if (newString == nil)
          if (hadError != nil) 
            hadError[0] = true
          end
          break
        end
        if (endMarker[0])
          break
        end
        arrayList << newString
      end
      return arrayList
    end
    
    
    # readString uses array argument so can pass values back
    def readString(endMarker, hadError) # returns...string!
      if (endMarker != nil) 
        endMarker[0] = !isConnected()
      end
      if (hadError != nil) 
        hadError[0] = !isConnected()
      end
      if (!isConnected())
        return nil
      end
      buffer = String.new
      gotCR = false
      while true
        begin
          byte = @socket.readbyte  # read one byte
        rescue EOFError => emsg
          if (hadError != nil) 
            hadError[0] = true
          end
          if @loglevel ==2
            puts "EOFError"
          end
          return nil
        end      
        if (byte == END_MARKER)
          if (endMarker != nil) 
            endMarker[0] = true
          end
          break
        end
        if (gotCR && byte == 10)   # CR-LF
          break
        end
        if (byte == 13) 
          gotCR = true
        else 
          if (gotCR) 
            buffer << 13  # we got a CR without a LF, so keep it in.
            gotCR = false
          end
          buffer << byte
        end
      end
      
      retVal = buffer
      return retVal
    end
    
    def readSPack(hadError)
      if (hadError != nil) 
        hadError[0] = false
      end
      
      begin
        len = @socket.readbyte  # read one byte into a fixnum
      rescue EOFError => emsg
        if (hadError != nil) 
          hadError[0] = true
        end
        if @loglevel ==2
          puts "EOFError"
        end
        return nil
      end
        
      data = String.new
      begin
        data = @socket.read(len)
      rescue EOFError => emsg
        if (hadError != nil) 
          hadError[0] = true
        end
        if @loglevel ==2
          puts "EOFError"
        end
        return nil
      end 
       
      return data
    end
    
  end
end
