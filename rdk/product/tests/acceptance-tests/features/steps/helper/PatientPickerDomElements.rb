path = File.expand_path '..', __FILE__
$LOAD_PATH.unshift path unless $LOAD_PATH.include?(path)
path = File.expand_path '../../../shared-test-ruby', __FILE__
$LOAD_PATH.unshift path unless $LOAD_PATH.include?(path)
require 'singleton'
require 'HTMLAction.rb'

# All the HTML Elements the tests need to access in order change the Patient selected from the patient list
class PatientPickerElements < AccessBrowserV2
  include Singleton
  def initialize
    super
    cprs_default = AccessHtmlElement.new(:xpath, "//span[contains(string(), 'CPRS Default')]/ancestor::a")
    add_action(CucumberLabel.new("CPRS Default"), ClickUntilPressed.new(cprs_default), cprs_default)
    add_action(CucumberLabel.new("Search Field"), SendKeysAction.new, AccessHtmlElement.new(:xpath, "//input[contains(@id, 'searchfield')]"))
    add_action(CucumberLabel.new("Confirm Change Button"), ClickAction.new, AccessHtmlElement.new(:xpath, "//a/descendant::span[contains(string(), 'Confirm')]"))
    add_action(CucumberLabel.new("Clinics"), ClickAction.new, AccessHtmlElement.new(:xpath, "//span[contains(string(), 'Clinics')]/ancestor::a"))
    add_action(CucumberLabel.new("Wards"), ClickAction.new, AccessHtmlElement.new(:xpath, "//span[contains(string(), 'Wards')]/ancestor::a"))
    add_action(CucumberLabel.new("All"), ClickAction.new, AccessHtmlElement.new(:xpath, "//div[contains(@id, 'patientpicker')]/descendant::span[contains(string(), 'All')]/ancestor::a"))

    count_action = AccessHtmlElement.new(:xpath, "//div[contains(@id, 'patientpicker')]/descendant::h5")
    add_verify(CucumberLabel.new("Patient List Length"), VerifyXpathCount.new(count_action), count_action)
  end

  def find_in_patient_list(patient)
    list_element_xpath = build_patient_list_item_xpath(patient)
    find_dom_element("xpath", list_element_xpath)
  end

  def select_patient_from_list(patient)
    list_element_xpath = build_patient_list_item_xpath(patient)
    begin
      html_element = find_dom_element("xpath", list_element_xpath)
      html_element.click
    rescue Exception => e
      puts e.message
    end
  end

  def confirm_patient_selection_change
    pp_element = @action_map["Confirm Change Button"]
    dom_pp_element = find_dom_element(pp_element[:searchOn], pp_element[:value])
    perform_action("Confirm Change Button") unless dom_pp_element.nil?
  end

  private

  # the xpath for each patient list item is dependent on expected results and so can not be loaded during initialization
  def build_patient_list_item_xpath(patient)
    list_element_xpath = "//h5[contains(string(), '#{patient}')]"
    return list_element_xpath
  end
end

# The "CPRS Default" button was exhibiting unexpected behavior
# The expected action was not occurring every time the button was clicked
# This class will click the button, if the button's class attribute does not report that the button is pressed,
# this class will click the button one extra time
class ClickUntilPressed
  include HTMLAction
  def initialize(how_to_access)
    if how_to_access.class != AccessHtmlElement
      fail "must initialize with a AccessHtmlElement, was a #{how_to_access.class}"
    end
    @access_html_elements = how_to_access
  end

  def perform_action(html_element, _value)
    driver = TestSupport.driver
    html_element.click
    check_class = driver.find_element(@access_html_elements.how, @access_html_elements.locator)
    class_string = check_class.attribute("class")
    html_element.click unless class_string.include? "x-btn-pressed"
  end
end
