require 'test/unit'
require '../vista_rpc'
require '../rpc_parameter'
require '../vista_user'

class VistaUserTest < Test::Unit::TestCase

  def test_login
    host = '10.2.2.102'
    port = 9210
    cxn = VistaConnection.new host, port
    cxn.connect
    assert_equal true, cxn.is_connected?
    user = VistaUser.new
    access_code = 'pu1234'
    verify_code = 'pu1234!!'
    context = 'OR CPRS GUI CHART'
    greeting = user.login cxn, access_code, verify_code, context
    cxn.disconnect
    assert_equal access_code, user.access_code
    assert_equal verify_code, user.verify_code
    assert_equal context, user.context
    assert_equal '10000000226', user.duz
    assert_equal true, greeting.index('ZZPROGRAMMER').nil?
  end
end