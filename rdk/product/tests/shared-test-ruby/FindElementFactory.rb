# $LOAD_PATH << './features/steps/'
require 'WebDriverFactory.rb'
require 'CommonDriver.rb'
require 'SeleniumCommand.rb'

#  /**
#   * @author farid.zadeh
#   *
#   */
class FindElementFactory
  def initialize
    @web_driver = SeleniumCommand.driver
    element = nil
  end

  def by_class(locator)
    element = @web_driver.find_element(:class, locator)
    return element
  end

  def by_class_name(locator)
    element = @web_driver.find_element(:class_name, locator)
    return element
  end

  def by_id(locator)
    element = @web_driver.find_element(:id, locator)
    return element
  end

  def by_link_text(locator)
    element = @web_driver.find_element(:link_text, locator)
    return element
  end

  def by_partial_link_text(locator)
    element = @web_driver.find_element(:partial_link_text, locator)
    return element
  end

  def by_name(locator)
    element = @web_driver.find_element(:name, locator)
    return element
  end

  def by_tag_name(locator)
    element = @web_driver.find_element(:tag_name, locator)
    return element
  end

  def by_xpath(locator)
    element = @web_driver.find_element(:xpath, locator)
    return element
  end

  def by_css(locator)
    element = @web_driver.find_element(:css, locator)
    return element
  end

  def search_all(locator)
    if @web_driver.find_elements(:id, locator).any?
      return @web_driver.find_element(:id, locator)
    elsif @web_driver.find_elements(:link_text, locator).any?
      return @web_driver.find_element(:link_text, locator)
    elsif @web_driver.find_elements(:partial_link_text, locator).any?
      return @web_driver.find_element(:partial_link_text, locator)
    elsif @web_driver.find_elements(:name, locator).any?
      return @web_driver.find_element(:name, locator)
    elsif @web_driver.find_elements(:xpath, locator).any?
      return @web_driver.find_element(:xpath, locator)
    end
  end
end

class FindElementsFactory
  def initialize
    @web_driver = SeleniumCommand.driver
    element = nil
  end

  def by_class(locator)
    element = @web_driver.find_elements(:class, locator)
    return element
  end

  def by_class_name(locator)
    element = @web_driver.find_elements(:class_name, locator)
    return element
  end

  def by_id(locator)
    element = @web_driver.find_elements(:id, locator)
    return element
  end

  def by_link_text(locator)
    element = @web_driver.find_elements(:link_text, locator)
    return element
  end

  def by_partial_link_text(locator)
    element = @web_driver.find_elements(:partial_link_text, locator)
    return element
  end

  def by_name(locator)
    element = @web_driver.find_elements(:name, locator)
    return element
  end

  def by_tag_name(locator)
    element = @web_driver.find_elements(:tag_name, locator)
    return element
  end

  def by_xpath(locator)
    element = @web_driver.find_elements(:xpath, locator)
    return element
  end

  def by_css(locator)
    element = @web_driver.find_elements(:css, locator)
    return element
  end
end
