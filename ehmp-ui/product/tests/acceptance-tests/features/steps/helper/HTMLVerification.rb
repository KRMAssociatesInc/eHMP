path = File.expand_path '..', __FILE__
$LOAD_PATH.unshift path unless $LOAD_PATH.include?(path)
path = File.expand_path '../../../../shared-test-ruby', __FILE__
$LOAD_PATH.unshift path unless $LOAD_PATH.include?(path)
require "TestSupport.rb"
require "AccessHtmlElement.rb"

# Attempt to force an interface on any verifications performed through AccessBrowserV2
module HTMLVerification
  def pull_value(_html_element, _value)
    fail "You shouldn't reach this function"
  end

  def verify(_html_element, _value)
    fail "You shouldn't reach this function"
  end

  def error_message
    return "no error message"
  end
end

class VerifyContainsText
  include HTMLVerification
  def initialize
    @error_message = 'no error message'
  end

  def pull_value(html_element, _value)
    return html_element.text
  end
  
  def verify(html_element, value)
    #p "#{html_element.text} should contain #{value}"
    @error_message = "Does element text contain substring: #{html_element.text} == #{value}?"
    return html_element.text.downcase.include?(value.downcase)
  end

  def error_message
    return @error_message
  end
end

#
class VerifyText
  include HTMLVerification
  def initialize
    @error_message = 'no error message'
  end

  def pull_value(html_element, _value)
    return html_element.text
  end

  def verify(html_element, value)
    #p "VerifyText: text #{html_element.text}  value #{value}"
    @error_message = "Does element text match: #{html_element.text} == #{value}?"
    return html_element.text.casecmp(value) == 0
  end

  def error_message
    return @error_message
  end
end

#
class VerifyValue
  include HTMLVerification
  def initialize
    @error_message = 'no error message'
  end

  def pull_value(html_element, _value)
    html_element.attribute("value")
  end

  def verify(html_element, value)
    @error_message = "Does element value match: #{html_element.attribute('value')} == #{value}?"
    return html_element.attribute("value").casecmp(value) == 0
  end

  def error_message
    return @error_message
  end
end

#
class VerifyPlaceholder
  include HTMLVerification
  def initialize
    @error_message = 'no error message'
  end

  def pull_value(html_element, _value)
    html_element.attribute("placeholder")
  end

  def verify(html_element, value)
    @error_message = "Does element placeholder match: #{html_element.attribute('placeholder')} == #{value}?"
    return html_element.attribute("placeholder").casecmp(value) == 0
  end

  def error_message
    return @error_message
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
    @error_message = 'no error message'
  end

  def verify(_html_element, value)
    driver = TestSupport.driver
    element_list = driver.find_elements(@access_html_elements.how, @access_html_elements.locator)
    element_list_text = []
    p element_list

    element_list.each do |search_result|
      element_list_text.push(search_result)
      if search_result.text.casecmp(value) == 0
        return true
      end # if
    end # element_list.each
    @error_message = "could not find #{search_result} in list #{element_list_text}"
    return false
  end

  def error_message
    return @error_message
  end
end

class VerifyContainsClass
  include HTMLVerification
  def initialize
    @error_message = 'no error message'
  end

  def pull_value(html_element, _value)
    html_element.attribute("class")
  end

  def verify(html_element, value)
    #p "Class: #{html_element.attribute("class")}"
    element_class_attribute = html_element.attribute("class")
    is_included = element_class_attribute.include? value
    p "html element class attribute: #{element_class_attribute} did not include #{value}" unless is_included
    @error_message = "html element class attribute: #{element_class_attribute} did not include #{value}"
    return is_included
  end

  def error_message
    return @error_message
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
    @error_message = 'no error message'
  end

  def verify(html_element, value)
    xpath_count = perform_xpath_count(html_element)
    are_equal = xpath_count == value.to_i
    #p "Compared #{xpath_count} to expected #{value}" #unless are_equal
    @error_message = "Compared #{xpath_count} to expected #{value}"
    return are_equal
  end

  def pull_value(html_element, _value)
    xpath_count = perform_xpath_count(html_element)
    return "#{xpath_count}"
  end

  def perform_xpath_count(_field)
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

  def error_message
    return @error_message
  end
end
