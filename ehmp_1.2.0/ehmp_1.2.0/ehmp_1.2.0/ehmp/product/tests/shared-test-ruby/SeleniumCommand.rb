$LOAD_PATH << './features/steps/'
require 'FindElementFactory.rb'
require 'WebDriverFactory.rb'
require 'CommonDriver.rb'
require 'TableVerification.rb'


#  /**
#   * @author farid.zadeh
#   *
#   */
class SeleniumCommand
  def self.initialize
    @web_driver = nil
    @error_message = []
  end

  def self.open_browser
    web_driver_factory = WebDriverFactory.new
    begin
      @web_driver =  web_driver_factory.getback_web_driver()
    rescue Exception => e
      puts e.message
    end
    return @web_driver
  end

  def self.driver
    if @web_driver == nil
      @web_driver = open_browser
    end
    #  //if the browser down bring it up
    webdrive = @web_driver
    begin
      webdrivehandel = webdrive.window_handle()
    rescue Exception => e
      @web_driver = nil
      @web_driver = open_browser
    end
    return @web_driver
  end

  def self.navigate_to_url(url)
    temp_driver = driver
    temp_driver.navigate.to url
    # common_driver = CommonDriver.new
    wait_until_page_loaded()
    wait_until_a_element_displayed()
  end

  def self.find_element(method = "SEARCH_ID_NAME_XPATH_LINK", locator)
    @web_driver = driver
    find_element = FindElementFactory.new
    element =  nil
    method = method.upcase

    case method
    when 'ID'
      element = find_element.by_id(locator)
    when 'XPATH'
      element = find_element.by_xpath(locator)
    when 'LINK_TEXT'
      element = find_element.by_link_text(locator)
    when 'PARTIAL_LINK_TEXT'
      element = find_element.by_partial_link_text(locator)
    when 'NAME'
      element = find_element.by_name(locator)
    when 'CLASS'
      element = find_element.by_class(locator)
    when 'CLASS_NAME'
      element = find_element.by_class_name(locator)
    when 'TAG_NAME'
      element = find_element.by_tag_name(locator)
    when 'CSS'
      element = find_element.by_css(locator)
    when 'SEARCH_ID_NAME_XPATH_LINK'
      element = find_element.search_all(locator)
    else
    fail "**** No function found! Check your script ****"
    end
    return element
  end

  def self.find_elements(method, locator)
    @web_driver = driver
    find_element = FindElementsFactory.new
    element =  nil
    method = method.upcase

    case method
    when 'ID'
      element = find_element.by_id(locator)
    when 'XPATH'
      element = find_element.by_xpath(locator)
    when 'LINK_TEXT'
      element = find_element.by_link_text(locator)
    when 'PARTIAL_LINK_TEXT'
      element = find_element.by_partial_link_text(locator)
    when 'NAME'
      element = find_element.by_name(locator)
    when 'CLASS'
      element = find_element.by_class(locator)
    when 'CLASS_NAME'
      element = find_element.by_class_name(locator)
    when 'TAG_NAME'
      element = find_element.by_tag_name(locator)
    when 'CSS'
      element = find_element.by_css(locator)
    else
    fail "**** No function found! Check your script ****"
    end
    return element
  end

  def self.find_elements_when_displayed?(method, locator, timeout_sec = 30)
    wait = Selenium::WebDriver::Wait.new(:timeout => timeout_sec) # seconds
    selenium_command = SeleniumCommand.new
    wait.until { selenium_command.elements_displayed?(find_elements(method, locator)) }

    return find_elements(method, locator)
  end

  def elements_displayed?(elements)
    p 'elements_displayed?'
    p elements.size
    element_displayed = false
    element_displayed_size = 0

    elements.each do |element|
      if element.displayed?
        element_displayed_size += 1
      end
      if element_displayed_size == elements.size
        element_displayed = true
        break
      else
        element_displayed = false
      end
    end
    return element_displayed
  end

  def self.click(method = "SEARCH_ID_NAME_XPATH_LINK", locator)
    timeout_sec = 50
    wait = Selenium::WebDriver::Wait.new(:timeout => timeout_sec) # seconds
    wait.until { find_element(method, locator).displayed? }

    element = find_element(method, locator)
    element.click

    wait_until_page_loaded()
    sleep 1
  # wait_until_a_element_displayed()
  # // ToDo Check if new window open, run the step in the new window.
  # switch_to_new_win_pop_up()
  end

  def self.element_visible?(method = "SEARCH_ID_NAME_XPATH_LINK", locator)
    element = find_element(method, locator)
    return element.displayed?
  end

  def self.wait_until_visible_then_click(method = "SEARCH_ID_NAME_XPATH_LINK", locator, timeout_sec)
    wait = Selenium::WebDriver::Wait.new(:timeout => timeout_sec) # seconds
    wait.until { find_element(method, locator).displayed? }

    element = find_element(method, locator)
    element.click

  # wait_until_a_element_displayed()
  # // ToDo Check if new window open, run the step in the new window.
  # switch_to_new_win_pop_up()
  end

  def self.send_keys(method = "SEARCH_ID_NAME_XPATH_LINK", locator, value)
    element = find_element(method, locator)
    element.clear
    element.send_keys value
  end
  
  def self.send_keys_and_enter(method = "SEARCH_ID_NAME_XPATH_LINK", locator, value)
    element = find_element(method, locator)
    element.clear
    element.send_keys value
    element.send_keys :return
  end

  def self.type(method = "SEARCH_ID_NAME_XPATH_LINK", locator, value)
    element = find_element(method, locator)
    element.send_keys value
  end

  def self.send_keys_and_wait(method = "SEARCH_ID_NAME_XPATH_LINK", locator, value)
    element = find_element(method, locator)
    element.clear
    element.send_keys value
    wait_until_page_loaded()
    wait_until_a_element_displayed()
  end

  def self.attribute(method = "SEARCH_ID_NAME_XPATH_LINK", locator, attribute_name)
    element = find_element(method, locator)
    return element.attribute(attribute_name)
  end

  def self.click_and_send_keys(method = 'SEARCH_ID_NAME_XPATH_LINK', locator, value)
    common_driver = CommonDriver.new
    element = find_element(method, locator)
    common_driver.clickElement(element)
    element.send_keys value
  end

  def self.select_frame(frame_method, locator)
    # Arguments:
    # locator - an element locator identifying a frame or iframe
    # To select the parent frame, use "relative=parent" as a locator; to select the top frame, use "relative=top".
    # select the first frame with "index=0", or the third frame with "index=2" ('index', '2')

    common_driver = CommonDriver.new
    common_driver.select_frame(frame_method, locator)
    sleep 1
  # @web_driver.manage.timeouts.implicit_wait = 60
  end

  def  self.wait_until_element_present(method = "SEARCH_ID_NAME_XPATH_LINK" , locator, timeout_sec)
    wait = Selenium::WebDriver::Wait.new(:timeout => timeout_sec) # seconds
    wait.until { find_element(method, locator).displayed? }
  end

  def self.wait_until_page_loaded(timeout = 60)
    common_driver = CommonDriver.new
    common_driver.wait_until_page_loaded(timeout)
  end

  def self.page_title
    return driver.title
  end

  def self.text(method = "SEARCH_ID_NAME_XPATH_LINK", locator)
    ele = find_element(method, locator)
    return ele.text
  end

  def self.value(method = "SEARCH_ID_NAME_XPATH_LINK", locator)
    element = find_element(method, locator)
    return element.attribute('value')

  end

  def self.wait_until_a_element_displayed(timeout_sec = 80)
    common_driver = CommonDriver.new
    common_driver.wait_until_a_element_displayed(timeout_sec)
  end
  
  def self.perform_table_verification(table_method, table_rows_locator, table)
    table_verification = TableVerification.new
    table_verification.perform_table_verification(table_method, table_rows_locator, table)
  end

  def scroll_web_pages_to_top_of_element
    driver.execute_script("document.querySelector('.formButtons').scrollIntoView()")
  end

  def scroll_web_pages_to_bottom_of_element
    driver.execute_script("document.querySelector('.formButtons').scrollIntoView(false)")
  end
  
  

end #class
