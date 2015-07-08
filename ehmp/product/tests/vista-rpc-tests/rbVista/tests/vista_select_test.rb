require 'test/unit'
require '../vista_rpc'
require '../rpc_parameter'
require '../vista_select'

class VistaSelectTest < Test::Unit::TestCase

  def setup
    @query = VistaSelect.new
  end

  def test_constructor
    assert_equal('@', @query.fields)
    assert_equal('IP', @query.flags)
    assert_equal('#', @query.index)
  end

  def test_set_iens
    e = assert_raise VistaException do
      @query.iens = 'a'
    end
    assert_match 'Invalid IENS', e.message

    e = assert_raise VistaException do
      @query.iens = '67,,'
    end
    assert_match 'Invalid IENS', e.message

    e = assert_raise VistaException do
      @query.iens = ',,67,'
    end
    assert_match 'Invalid IENS', e.message

    e = assert_raise VistaException do
      @query.iens = '67,,4,'
    end
    assert_match 'Invalid IENS', e.message

    @query.iens = '67'
    assert_equal ',67,', @query.iens

    @query.iens = ',67'
    assert_equal ',67,', @query.iens

    @query.iens = ',67,'
    assert_equal ',67,', @query.iens

    @query.iens = '67,44'
    assert_equal ',67,44,', @query.iens

    @query.iens = ',67,44'
    assert_equal ',67,44,', @query.iens

    @query.iens = '67,44,'
    assert_equal ',67,44,', @query.iens

    @query.iens = ',67,44'
    assert_equal ',67,44,', @query.iens
  end

  def test_set_fields
    @query.fields = ''
    assert_equal '@', @query.fields

    @query.fields = '@'
    assert_equal '@', @query.fields

    expected_fields = '@;.01;2;4;5;.141;8;9;11;29'

    @query.fields = '.01;2;4;5;.141;8;9;11;29'
    assert_equal expected_fields, @query.fields

    @query.fields = '@;.01;2;4;5;.141;8;9;11;29'
    assert_equal expected_fields, @query.fields
  end

  def test_set_flags
    @query.flags = nil
    assert_equal 'IP', @query.flags

    @query.flags = ''
    assert_equal 'IP', @query.flags

    e = assert_raise VistaException do
      @query.flags = 'I'
    end
    assert_match 'Current version does packed queries only', e.message

    @query.flags = "BIP"
    assert_match 'BIP', @query.flags
  end

  def test_prepare_param_list
    @query.file = 200
    @query.fields = '.01;2;4;5;.141;8;9;11;29'
    @query.number = 1
    @query.from = '546'

    expected = {
        '"FILE"'=>'200',
        '"FIELDS"'=>'@;.01;2;4;5;.141;8;9;11;29',
        '"FLAGS"'=>'IP',
        '"MAX"'=>'1',
        '"FROM"'=>'545',
        '"XREF"'=>'#'
    }
    @query.send(:prepare_param_list)
    assert_equal expected, @query.param_list
  end

  def test_prepare
    @query.file = '200'
    @query.fields = '.01;2;4;5;.141;8;9;11;29'
    @query.number = 1
    @query.from = '546'

    expected = "[XWB]11302\x051.108\x0ADDR LISTER52006\"FILE\"003200t008\"FIELDS\"026@;.01;2;4;5;.141;8;9;11;29t007\"FLAGS\"002IPt005\"MAX\"0011t006\"FROM\"003545t006\"XREF\"001#f\x04"

    actual = @query.send(:prepare)
    assert_equal expected, actual
    assert_equal expected, @query.rpc
  end

  def test_load
    response = "[Misc]\r\nMORE^546^546^\r\n[MAP]\r\nIEN^.01I^2I^4I^5I^.141I^8I^9I^11I^29I\r\n[BEGIN_diDATA]\r\n546^ZZPROGRAMMER,NINE^@Jy$9BO\'9iCm#:x*p:\'E^F^^^2^666948848^tHffxTgZ)<4~.7`EUx}j^1043\r\n[END_diDATA]"
    expected = [
        ['546','ZZPROGRAMMER,NINE',"@Jy$9BO'9iCm#:x*p:'E",'F','','','2','666948848',"tHffxTgZ)<4~.7`EUx}j",'1043']
    ]
    actual = @query.send(:load, response)
    assert_equal expected, actual
    assert_equal expected, @query.records
  end

end