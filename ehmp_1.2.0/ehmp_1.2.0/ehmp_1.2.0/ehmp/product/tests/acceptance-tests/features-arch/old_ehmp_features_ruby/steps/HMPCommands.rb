require 'HtmlGenerator.rb'
require 'HMPAttributeParameters.rb'
require 'HMPAttributeParametersWithArgs.rb'

class HMPCommands
  def self.combo_select(method, locator, value)
    SeleniumCommand.click(method, locator)
    temp_xpath = "//li[contains(string(),'#{value}')]"
    method = 'xpath'
    SeleniumCommand.wait_until_element_present(method, temp_xpath, 60)
    SeleniumCommand.click(method, temp_xpath)
  end

  def self.call_html_attribute
    hmp_html = HMPAttributeParameters.new
    return hmp_html.all_page_html_attribute
  end

  def self.call_function_method_locator(field, action_name)
    @pages_attribute = call_html_attribute if @pages_attribute == nil
    action_name = action_name.downcase
    if action_name == 'action'
      pages_attribute = @pages_attribute[0]
    elsif action_name == 'verify'
      pages_attribute = @pages_attribute[1]
    end
    html_generator = HtmlGenerator.new
    function = html_generator.function(field, pages_attribute)
    method = html_generator.method(field, pages_attribute)
    locator = html_generator.locator(field, pages_attribute)
    return function, method, locator
  end

  def self.do_action(function_method_locator, value)
    function = function_method_locator[0]
    method = function_method_locator[1]
    locator = function_method_locator[2]
    function = function.downcase

    if function == "sendkeys"
      SeleniumCommand.send_keys(method, locator, value)

    elsif function == "comboselectandwait"
      SeleniumCommand.send_keys_and_wait(method, locator, value)

    elsif function == "comboselect"
      combo_select(method, locator, value)

    elsif function == "click"
      SeleniumCommand.click(method, locator)

    elsif function == "waituntilvisiblethenclick"
      SeleniumCommand.wait_until_visible_then_click(method, locator, value)

    elsif function == "clickandsendkeys"
      SeleniumCommand.click_and_send_keys(method, locator, value)

    elsif function == "sendkeysandwait"
      SeleniumCommand.send_keys_and_wait(method, locator, value)

    elsif function == "sendkeysandenter"
      SeleniumCommand.send_keys_and_enter(method, locator, value)

    elsif function == "type"
      SeleniumCommand.type(method, locator, value)

    elsif function == "text"
      return SeleniumCommand.text(method, locator)

    elsif function == "value"
      return SeleniumCommand.value(method, locator)

    elsif function == "attribute"
      return SeleniumCommand.attribute(method, locator, value)

    elsif function == "elementvisible?"
      return SeleniumCommand.element_visible?(method, locator)

    elsif function == "waituntilelementpresent"
      SeleniumCommand.wait_until_element_present(method, locator, value)
    elsif function == "findelements"
      return SeleniumCommand.find_elements(method, locator)
    elsif function == "findelementswhendisplayed?"
      return SeleniumCommand.find_elements_when_displayed?(method, locator)
    else
      fail "No function found for '#{function}! Check your script"
    end #if
  end

  def self.call_locator_with_arg(arg_of_lactor1 = '', arg_of_lactor2 = '')
    hmp_html = HMPAttributeParametersWithArgs.new
    hmp_html.all_page_html_attribute_with_args(arg_of_lactor1, arg_of_lactor2)
    @pages_attribute = call_html_attribute
  end

  def self.perform_verification(field, value = '')
    # @pages_attribute = call_html_attribute if @pages_attribute == nil
    function_method_locator = call_function_method_locator(field, 'verify') #@pages_attribute[1])
    do_action(function_method_locator, value)
  end

  def self.perform_action(field, value = '')
    # @pages_attribute = call_html_attribute if @pages_attribute == nil
    function_method_locator = call_function_method_locator(field, 'action') #@pages_attribute[0])
    do_action(function_method_locator, value)
  end
end #class
