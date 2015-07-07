# @description: All the HTML Elements the tests need to access / verify patient details displayed in the
# Transitory Patient area
class TransPatientBarHTMLElements < AccessBrowserV2
  include Singleton
  def initialize
    super
  end

  def build_header_xpath(text)
    return "//h4[contains(string(), '#{text}')]"
  end

  def build_table_contents_xpath(header, text)
    newxpath = "#{header}/following-sibling::table/descendant::td[contains(string(), '#{text}')]"
    return newxpath
  end
end
