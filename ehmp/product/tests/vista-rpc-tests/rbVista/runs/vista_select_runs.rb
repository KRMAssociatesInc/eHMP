path = File.expand_path '..', __FILE__
$LOAD_PATH.unshift path unless $LOAD_PATH.include?(path)
path = File.expand_path '../../../../vista-rpc-tests/rbVista', __FILE__
$LOAD_PATH.unshift path unless $LOAD_PATH.include?(path)

require 'test/unit'

require 'rpc_parameter'
require 'vista_rpc.rb'
require 'vista_connection'

require 'vista_user'
# require 'vista_select.rb'

class VistaSelectRuns < Test::Unit::TestCase

  def setup
    @host = '10.2.2.102'
    @port = 9210
    @cxn = VistaConnection.new @host, @port
    @user = VistaUser.new
    p '-------------'
    p @cxn
    p @user
    p '-------------'
  end

def test_fms_run
    # query = VistaSelect.new
    # query.file = '410'
    # query.fields = '.01;1;24;23;22'
    # query.number = 200
    # query.from = '178'
    # query.part = '178'
    # query.index = 'AN'
    access_code = 'pu1234'
    verify_code = 'pu1234!!'
    context = 'XUPROGMODE'
    sensitivePatient = "20"

    @cxn.connect
    client = @user.login @cxn, access_code, verify_code, context
p client

    # @cxn.exec(command)
    
    # rs = query.find (@cxn)
    # @cxn.disconnect
    # assert_equal 56, rs.length
  end
  
  # def test_simple_run
   # query = DdrLister.new
   # query.file_number = '200'
   # query.file_name = 'Person'
   # query.fields = {
       # '.01' => 'Name',
       # '2' => 'Access Code',
       # '4' => 'Gender',
       # '5' => 'DOB',
       # '.141' => 'Room #',
       # '8' => 'Title',
       # '9' => 'SSN',
       # '11' => 'Verify Code',
       # '29' => 'Service'
   # }
   # query.number = 1
   # query.from = '546'
#   
   # expected = [
       # ['546','ZZPROGRAMMER,NINE',"@Jy$9BO'9iCm#:x*p:'E",'F','','','2','666948848',"tHffxTgZ)<4~.7`EUx}j",'1043']
   # ]
#   
   # @cxn.connect
   # greeting = @user.login @cxn, '1programmer', 'programmer1.', 'DVBA CAPRI GUI'
#   
   # rs = query.find (@cxn)
   # @cxn.disconnect
   # assert_equal expected, rs
   # assert_equal expected, query.records
  # end

  

end
