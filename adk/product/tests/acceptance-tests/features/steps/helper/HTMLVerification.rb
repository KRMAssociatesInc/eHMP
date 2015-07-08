path = File.expand_path '..', __FILE__
$LOAD_PATH.unshift path unless $LOAD_PATH.include?(path)
path = File.expand_path '../../../../shared-test-ruby', __FILE__
$LOAD_PATH.unshift path unless $LOAD_PATH.include?(path)
require "TestSupport.rb"
require "AccessHtmlElement.rb"

# Attempt to force an interface on any verifications performed through AccessBrowserV2
module HTMLVerification
  def pull_value(html_element, value)
    fail "You shouldn't reach this function"
  end

  def verify(html_element, value)
    fail "You shouldn't reach this function"
  end
end

class VerifyContainsText
  include HTMLVerification
  def pull_value(html_element, value)
    return html_element.text
  end
  
  def verify(html_element, value)
    #p "#{html_element.text} should contain #{value}"
    return html_element.text.include?(value)
  end
end

#
class VerifyText
  include HTMLVerification
  def pull_value(html_element, value)
    return html_element.text
  end

  def verify(html_element, value)
    return html_element.text.casecmp(value) == 0
  end
end

#
class VerifyValue
  include HTMLVerification
  def pull_value(html_element, value)
    html_element.attribute("value")
  end

  def verify(html_element, value)
    return html_element.attribute("value").casecmp(value) == 0
  end
end

#
class VerifyPlaceholder
  include HTMLVerification
  def pull_value(html_element, value)
    html_element.attribute("placeholder")
  end

  def verify(html_element, value)
    return html_element.attribute("placeholder").casecmp(value) == 0
  end
end

#
class InElementList
  include HTMLVerification
  def initialize(how_to_access)
    if how_to_access.class != AccessHtmlElement
      fail "must initialize with a AccessHtmlElement, was a #{how_to_access.class}"
    end
    @access_html_elements = how_to_access
  end

  def verify(html_element, value)
    driver = TestSupport.driver
    element_list = driver.find_elements(@access_html_elements.how, @access_html_elements.locator)
    p element_list

    element_list.each do | search_result|
      if search_result.text.casecmp(value) == 0
        return true
      end # if
    end # element_list.each
    return false
  end
end

#
class VerifyXpathCount
  include HTMLVerification
  def initialize(how_to_access)
    if how_to_access.class != AccessHtmlElement
      fail "must initialize with a AccessHtmlElement, was a #{how_to_access.class}"
    end
    @access_html_elements = how_to_access
  end

  def verify(html_element, value)
    xpath_count = perform_xpath_count(html_element)
    return xpath_count == value.to_i
  end

  def pull_value(html_element, value)
    xpath_count = perform_xpath_count(html_element)
    return "#{xpath_count}"
  end

  def perform_xpath_count(field)
    count = 0
    begin
      driver = TestSupport.driver
      count= driver.find_elements(@access_html_elements.how, @access_html_elements.locator).length
    rescue Exception => e
      p "Error: #{e}"
      count = 0
    end
    return count
  end
end
