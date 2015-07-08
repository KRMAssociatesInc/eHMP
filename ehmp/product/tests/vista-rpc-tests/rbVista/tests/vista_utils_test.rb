require 'minitest/autorun'
require 'turn'
require '../vista_utils'

class VistaUtilsTest < Test::Unit::TestCase

  def test_str_pack
    expected = "0000000015something!5here"
    actual = VistaUtils.str_pack("something!5here", 10)
    assert_equal expected, actual
  end

  def test_prepend_count
    expected = "\nSomeString"
    actual = VistaUtils.prepend_count("SomeString")
    assert_equal expected, actual

    expected = "\x0ADDR LISTER"
    actual = VistaUtils.prepend_count("DDR LISTER")
    assert_equal expected, actual
  end

  def test_adjust_for_numeric_search
    expected = "244"
    actual = VistaUtils.adjust_for_numeric_search("245")
    assert_equal expected, actual
  end

  def test_adjust_for_string_search
    expected = "Snurc~"
    actual = VistaUtils.adjust_for_string_search("Snurd")
    assert_equal expected, actual
  end

  def test_is_integer?
    expected = false
    actual = VistaUtils.is_integer?(nil)
    assert_equal expected, actual

    expected = false
    actual = VistaUtils.is_integer?("")
    assert_equal expected, actual

    expected = true
    actual = VistaUtils.is_integer?("1234")
    assert_equal expected, actual

    expected = false
    actual = VistaUtils.is_integer?("123N")
    assert_equal expected, actual
  end

  def test_is_mumeric?
    expected = false
    actual = VistaUtils.is_numeric?(nil)
    assert_equal expected, actual

    expected = false
    actual = VistaUtils.is_numeric?("")
    assert_equal expected, actual

    expected = true
    actual = VistaUtils.is_numeric?("1234")
    assert_equal expected, actual

    expected = false
    actual = VistaUtils.is_numeric?("123N")
    assert_equal expected, actual

    expected = true
    actual = VistaUtils.is_numeric?("123.22")
    assert_equal expected, actual
  end

  def test_adjust_for_search
    expected = '244'
    actual = VistaUtils.adjust_for_search('245')
    assert_equal expected, actual

    expected = 'Snurc~'
    actual = VistaUtils.adjust_for_search('Snurd')
    assert_equal expected, actual
  end
end