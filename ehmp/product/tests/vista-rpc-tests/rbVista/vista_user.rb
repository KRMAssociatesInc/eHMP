require_relative './vista_exception'
require_relative './rpc_parameter'
require_relative './vista_rpc'
require_relative './vista_connection'

class VistaUser

  attr_reader :access_code, :verify_code, :context, :duz

  def login(cxn, access_code, verify_code, context=nil)
    rpc = VistaRpc.prepare 'XUS SIGNON SETUP'
    response = cxn.exec rpc
    if response.nil?
      raise VistaException.new 'Unable to setup login'
    end
    param = [RpcParameter.new(RpcParameter::ENCRYPTED, access_code + ';' + verify_code)]
    rpc = VistaRpc.prepare 'XUS AV CODE', param
    response = cxn.exec rpc
    if response.nil?
      raise VistaException.new 'No response to login request'
    end

    greeting = load response
    @access_code = access_code
    @verify_code = verify_code

    unless context.nil?
      set_context cxn, context
    end

    greeting
  end

  def load(response)
    parts = response.split("\r\n")
    if parts[0] == '0'
      raise VistaException.new parts[3]
    end
    @duz = parts[0]
    if parts.length > 7
      parts[7]
    else
      'OK'
    end
  end
  private :load

  def set_context(cxn, context)
    param = [RpcParameter.new(RpcParameter::ENCRYPTED, context)]
    rpc = VistaRpc.prepare 'XWB CREATE CONTEXT', param
    response = cxn.exec rpc
    if response != '1'
      raise VistaException.new response
    end
    @context = context
  end
end