require_relative 'vista_utils'

class VistaRpc

  PREFIX = '[XWB]'
  COUNT_WIDTH = 3
  RPC_VERSION = '1.108'
  EOT = "\x04"

  def self.prepare(rpc_name, params = nil)
    if rpc_name == 'HELLO'
      return connect_rpc(params)
    end
    if rpc_name == 'BYE'
      return disconnect_rpc
    end
    prepare_standard_rpc(rpc_name, prepare_param_string(params))
  end

  private

  def self.prepare_standard_rpc(rpc_name, param_string)
    PREFIX + '11302' + VistaUtils.prepend_count(RPC_VERSION) +
        VistaUtils.prepend_count(rpc_name) + param_string + EOT
  end

  def self.prepare_param_string(params)
    param_str = '5'
    unless params.nil?
      params.each do |param|
        if param.type == RpcParameter::LITERAL
          param_str += '0' + VistaUtils.str_pack(param.value, COUNT_WIDTH) + 'f'
        elsif param.type == RpcParameter::REFERENCE
          param_str += '1' + VistaUtils.str_pack(param.value, COUNT_WIDTH) + 'f'
        elsif param.type == RpcParameter::LIST
          param_str += '2' + param.list_to_string
        end
      end
    end
    if param_str == '5'
      param_str += '4f'
    end
    param_str
  end

  def self.connect_rpc(params)
    "[XWB]10304\x0ATCPConnect50" + VistaUtils.str_pack(params[0].value, COUNT_WIDTH) +
      "f0" + VistaUtils.str_pack('0', COUNT_WIDTH) +
      "f0" + VistaUtils.str_pack(params[1].value, COUNT_WIDTH) +
      "f" + EOT
  end

  def self.disconnect_rpc
    "[XWB]10304\x05#BYE#" + EOT
  end

end