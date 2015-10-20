path = File.expand_path '..', __FILE__
$LOAD_PATH.unshift path unless $LOAD_PATH.include?(path)
path = File.expand_path '../../../../shared-test-ruby', __FILE__
$LOAD_PATH.unshift path unless $LOAD_PATH.include?(path)
require "TestSupport.rb"
require "AccessHtmlElement.rb"

# Attempt to force an interface on any actions performed through AccessBrowserV2
module HTMLAction
  def perform_action(_html_element, _value)
    fail "You shouldn't reach this function"
  end
end

#
class ClickAction
  include HTMLAction
  def perform_action(html_element, _value)
    html_element.click
  end
end

# clear the element of any existing keys then call send_keys
class SendKeysAction
  include HTMLAction
  def perform_action(html_element, value)
    html_element.clear
    html_element.send_keys(value)
  end
end

# Perform three consecutive actions.
# 1. Clear any existing value in the html element
# 2. Send provided keys to the html element
# 3. Send the 'return' key stroke
class SendKeysAndEnterAction
  include HTMLAction
  def perform_action(html_element, value)
    html_element.clear
    html_element.send_keys(value)

    html_element.send_keys [:enter]
  end
end

class SendKeysAndTabAction
  include HTMLAction
  def perform_action(html_element, value)
    html_element.send_keys(value)
    html_element.send_keys [:tab]
  end
end

class SendEnterAction
  include HTMLAction
  def perform_action(html_element, _value)
    html_element.send_keys [:enter]
  end
end

# Perform a select all action before entering text
class SelectAllSendKeysAndEnterActionNoClear
  include HTMLAction
  def perform_action(html_element, value)
    driver = TestSupport.driver
    html_element.send_keys [:end]
    html_element.send_keys [:shift, :home], :backspace
    html_element.send_keys(value)
    html_element.send_keys [:tab]
  end
end

# Perform action where element is clicked ( maybe to give it focus? ) before key strokes are sent
class ClickAndSendKeysAction
  include HTMLAction
  def perform_action(html_element, value)
    html_element.click
    html_element.send_keys(value)
  end
end

# Perform action where element is clicked ( maybe to give it focus? ) before key strokes are sent
class ClickAndSendKeysAndEnterAction
  include HTMLAction
  def perform_action(html_element, value)
    html_element.click
    html_element.send_keys(value)
    html_element.send_keys [:enter]
  end
end

class ClickClearAndSendKeysAction
  include HTMLAction
  def perform_action(html_element, value)
    html_element.click
    html_element.clear
    html_element.send_keys(value)
  end
end

# group of actions that must occur to accomplish a Combo Select, this is specific to the HMP UI
class ComboSelectAction
  include HTMLAction
  def perform_action(html_element, value)
    driver = TestSupport.driver
    html_element.click # input
    temp_xpath = "//option[contains(string(),'#{value}')]"
    # wait for a specific element to show up
    wait = Selenium::WebDriver::Wait.new(:timeout => 10) # seconds # wait until list opens
    wait.until { driver.find_element(:xpath => temp_xpath).displayed? } # wait until specific list element is shown
    html_element = driver.find_element(:xpath => temp_xpath) # find specific list element
    html_element.click # click specific list element
  end
end

class FocusInAction
  include HTMLAction
  def initialize(html_id)
    @id = html_id
  end
  
  def perform_action(_html_element, _value)
    driver = TestSupport.driver
    driver.execute_script("$('##{@id}').focusin();")
  end
end

