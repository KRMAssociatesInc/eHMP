# Store how to access an html element and what to use to access an html element
class AccessHtmlElement
  attr_accessor :how
  attr_accessor :locator
  def initialize(how, locator)
    if how.class != Symbol
      fail "must initialize Access_html_element with a symbol, was a #{how.class}"
    end
    @how = how
    @locator = locator
  end
end

# Store which attribute/function is used to verify data
class HtmlVerification
  attr_accessor :verification
  def initialize(verification)
    @verification = verification
  end
end

# Store the label for commonality between the feature files and the ruby files
class CucumberLabel
  attr_accessor :label
  def initialize(label)
    @label = label
  end
end
