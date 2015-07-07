require 'socket'
require_relative './vista_rpc'
require_relative './vista_exception'
require_relative './rpc_parameter'

class VistaConnection

  def initialize(host, port)
    @host = host
    @port = port
    @is_connected = false
  end

  def connect
    my_ip = my_ip_v4
    my_hostname = Socket.gethostname
    @socket = TCPSocket.new @host, @port
    params = [
        RpcParameter.new(RpcParameter::LITERAL, my_ip),
        RpcParameter.new(RpcParameter::LITERAL, my_hostname)
    ]
    rpc = VistaRpc.prepare('HELLO', params)
    begin
      response = exec rpc
    rescue
      raise VistaException.new 'No VistA listener at ' + @host + ', port ' + @port + '?'
    end
    if response != 'accept'
      disconnect
      raise VistaException.new 'Connection not accepted: ' + response
    end
    @is_connected = true
  end

  def exec(rpc)
    send rpc
    recv
  end

  def send(rpc)
    @socket.send rpc, 0
  end
  private :send

  def recv
    # Header first...
    buf = @socket.recv(256)
    if buf.nil?
      raise VistaException.new 'Error receiving: no response'
    end

    # SECURITY error?
    if buf[0] != "\x00"
      buf = buf[1, buf[0].ord]
      raise VistaException.new 'VistA SECURITY error: ' + buf
    end

    # APPLICATION error?
    if buf[1] != "\x00"
      buf = buf[2, buf.length]
      raise VistaException.new 'VistA APPLICATION error: ' + buf
    end

    buf = buf[2, buf.length]

    # Is there more response?
    end_idx = buf.index(VistaRpc::EOT)

    # If not, trim the EOT off the end
    if end_idx
      buf = buf.chop
    end

    # Sometimes there's a trailing '\0'
    if buf[buf.length-1] == "\x00"
      buf = buf.chop
    end

    # Here's the response so far...
    response = buf

    # Add to it if there's more
    while end_idx.nil?
      buf = @socket.recv(256)
      if buf.nil?
        raise VistaException.new 'Error receiving: no EOT and no MORE'
      end

      # Is there more response?
      end_idx = buf.index(VistaRpc::EOT)

      # If not, trim the EOT off the end
      if end_idx
        buf = buf.chop
      end

      # Sometimes there's a trailing '\0'
      if buf[buf.length-1] == "\x00"
        buf = buf.chop
      end

      response += buf
    end

    # Was there an error?
    if response.start_with?('M  ERROR')
      raise VistaException.new response
    end

    # All done, trim end for occasional '\0'
    response
  end
  private :recv

  def my_ip_v6
    addr_list = Socket.ip_address_list
    addr_list.each do |addr|
      if addr.ipv6? && addr.ip_address != "::1"
        return addr.ip_address
      end
    end
    nil
  end

  def my_ip_v4
    addr_list = Socket.ip_address_list
    addr_list.each do |addr|
      if addr.ipv4? && addr.ip_address != "127.0.0.1"
        return addr.ip_address
      end
    end
  end

  def disconnect
    if @is_connected
      rpc = VistaRpc.prepare 'BYE'
      response = exec rpc
      @socket.close
      @is_connected = false
      if response != '#BYE#'
        raise VistaException.new('Bogus disconnect response: ' + response)
      end
    end
  end

  def is_connected?
    @is_connected
  end

end