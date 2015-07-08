require 'test/unit'
require '../vista_rpc'
require '../rpc_parameter'

class VistaRpcTest < Test::Unit::TestCase

  def test_disconnect_rpc
    expected = "[XWB]10304\x05#BYE#\x04"
    actual = VistaRpc.prepare('BYE')
    assert_equal expected, actual
  end

  def test_connection_rpc
    expected = "[XWB]10304\x0ATCPConnect50013192.168.1.107f00010f0022LAPTOP2.v11.domain.extf\x04"
    params = [
        RpcParameter.new(RpcParameter::LITERAL, '192.168.1.107'),
        RpcParameter.new(RpcParameter::LITERAL, 'LAPTOP2.v11.domain.ext')
    ]
    actual = VistaRpc.prepare('HELLO', params)
    assert_equal expected, actual
  end

  def test_intro_message_rpc
    expected = "[XWB]11302\x051.108\x0DXUS INTRO MSG54f\x04"
    actual = VistaRpc.prepare('XUS INTRO MSG')
    assert_equal expected, actual
  end

  def test_setup_login_rpc
    expected = "[XWB]11302\x051.108\x10XUS SIGNON SETUP54f\x04"
    actual = VistaRpc.prepare('XUS SIGNON SETUP')
    assert_equal expected, actual
  end

  def test__login_rpc
    expected = "[XWB]11302\x051.108\x0BXUS AV CODE50017.r v11k3}!r&sAgP$f\x04"
    param = RpcParameter.new(RpcParameter::ENCRYPTED, 'ijr773;Akiba12.', [14,4])
    actual = VistaRpc.prepare('XUS AV CODE', [param])
    assert_equal expected, actual
  end

  def test_set_context_rpc
    expected = "[XWB]11302\x051.108\x12XWB CREATE CONTEXT50019(&y?#jy<?x:=?#68y].f\x04"
    param = RpcParameter.new(RpcParameter::ENCRYPTED, 'OR CPRS GUI CHART', [8,14])
    actual = VistaRpc.prepare('XWB CREATE CONTEXT', [param])
    assert_equal expected, actual
  end

  def test_get_variable_value_rpc
    arg = "$P($G(^DIC(3.1,1362,0)),U,1)"
    expected = "[XWB]11302\x051.108\x16XWB GET VARIABLE VALUE51028$P($G(^DIC(3.1,1362,0)),U,1)f\x04"
    param = RpcParameter.new(RpcParameter::REFERENCE, arg)
    actual = VistaRpc.prepare('XWB GET VARIABLE VALUE', [param])
    assert_equal expected, actual
  end

end