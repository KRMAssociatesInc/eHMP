$LOAD_PATH << './features/steps/'
require 'FindElementFactory.rb'
require 'WebDriverFactory.rb'

#  /**
#   * @author farid.zadeh
#   *
#   */
class CommonDriver
  def wait_until_page_loaded(timeout)
    web_driver = SeleniumCommand.driver
    wait = Selenium::WebDriver::Wait.new(:timeout => timeout)
    wait.until { web_driver.execute_script("return document.readyState").downcase.include? 'complete' }
  end

  def elements_size_steadied?
    current_size =  SeleniumCommand.driver.find_elements(:xpath, "//*").size
    if @old_all_elements_size == current_size && current_size > 0
      return true
    else
      @old_all_elements_size = current_size
      return false
    end
  end

  def a_element_displayed?
    elements = SeleniumCommand.driver.find_elements(:xpath, "//*")
    element_displayed = false
    element_displayed_size = 0 
    
    elements.each do |element|
      if element.displayed?
        element_displayed_size += 1
      end
      if element_displayed_size > 2 #= elements.size/2
        element_displayed = true
        break
      else
        element_displayed = false
      end
    end
    return element_displayed
  end

  def wait_until_a_element_displayed(timeout_sec)
    # @old_all_elements_size = 0
    # wait = Selenium::WebDriver::Wait.new(:timeout => timeout_sec) # seconds
    # # wait.until {elements_size_steadied?}
    # wait.until { a_element_displayed? }
  end

  def click_element(element)
    element.click
  end

  def select_element(locator, value)
    select = Selenium::WebDriver::Support::Select.new(@@web_driver.find_element(:tag_name, locator))
    select.deselect_all()
    select.select_by(:text, value)
  #ToDo:
  # select = driver.find_element(:tag_name, "select")
  # all_options = select.find_elements(:tag_name, "option")
  # all_options.each do |option|
  # puts "Value is: " + option.attribute("value")
  # option.click
  # end
  end

  def select_frame(locator_method, locator)
    # Arguments:
    # locator - an element locator identifying a frame or iframe
    # To select the parent frame, use "relative=parent" as a locator; to select the top frame, use "relative=top".
    # select the first frame with "index=0", or the third frame with "index=2"
    web_driver = SeleniumCommand.driver
    web_driver.switch_to().default_content

    # for relative is Not working now
    if locator_method.downcase == 'relative'
      if locator.downcase == 'top'
        web_driver.switch_to.frame("relative=top")
      elsif locator.downcase == 'parent'
        web_driver.switch_to.frame("relative=parent")
      end
    elsif locator_method.downcase == 'index'
      web_driver.switch_to.frame(index=locator.to_f)
    end
  end

  def switch_to_new_win_pop_up
    # ToDo
    wait_until_page_loaded()
    available_windows = @@web_driver.window_handles
    new_window = nil
    p available_windows
    available_windows.each do |window|
      p window
    # if @@WDparent == window
    # newWindow = window
    # end
    end

  # # // assertNotNull(newWindow);
  # if (newWindow != nil)
  # # // switch to new window
  # @@web_driver.switchTo().window(newWindow);
  # # // and then close the new window
  # # // wd.close();
  # else
  # # // switch to parent
  # GlobalVar.webDriver.switchTo().window(@@WDparent);
  # end
  end
# #   ****************new ruby code
# @driver = SeleniumCommand.driver
# # befor click
# main_window = @driver.window_handle
# # @driver.find_element(css: '.example a').click
# # after click
# windows = @driver.window_handles
# windows.each do |window|
# if main_window != window
# @new_window = window
# end
# end
# @driver.switch_to.window(main_window)
# @driver.title.should_not =~ /New Window/
# @driver.switch_to.window(@new_window)
# @driver.title.should =~ /New Window/
end
