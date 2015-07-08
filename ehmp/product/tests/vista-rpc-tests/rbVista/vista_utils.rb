class VistaUtils

  def self.str_pack(str, width)
    slth = str.length.to_s
    slth.rjust(width,"0")  + str
  end

  def self.prepend_count(str)
    str.length.chr + str
  end

  def self.is_integer?(str)
    Integer(str) != nil rescue false
  end

  def self.is_numeric?(str)
    Float(str) != nil rescue false
  end

  def self.adjust_for_search(str)
    if is_integer?(str)
      adjust_for_numeric_search(str)
    else
      adjust_for_string_search(str)
    end
  end

  private

  def self.adjust_for_numeric_search(str)
    (str.to_i - 1).to_s
  end

  def self.adjust_for_string_search(str)
    c = (str.getbyte(str.length-1) - 1).chr
    str.chop + c + '~'
  end
end