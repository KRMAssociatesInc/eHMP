require 'test/unit'
require 'socket'
require '../vista_connection'

class VistaConnectionTest < Test::Unit::TestCase

  def setup
    @host = '10.2.2.102'
    @port = 9210
    @cxn = VistaConnection.new @host, @port
  end

  def test_my_ip_v6
    ip = @cxn.my_ip_v6
    assert_equal true, Addrinfo.tcp(ip, 0).ipv6?
  end

  def test_my_ip_v4
    ip = @cxn.my_ip_v4
    assert_equal true, Addrinfo.tcp(ip, 0).ipv4?
  end

  def test_connect_disconnect
    @cxn.connect
    assert_equal true, @cxn.is_connected?
    @cxn.disconnect
    assert_equal false, @cxn.is_connected?
  end
end