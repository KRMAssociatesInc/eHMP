require 'singleton'
path = File.expand_path '..', __FILE__
$LOAD_PATH.unshift path unless $LOAD_PATH.include?(path)
path = File.expand_path '../../../../shared-test-ruby', __FILE__
$LOAD_PATH.unshift path unless $LOAD_PATH.include?(path)

# All the HTML Elements the tests need to access in order to view patient's outpatient meds
class OutpatientMeds < AccessBrowserV2
  include Singleton
  def initialize
    super
  end

  def find_in_list(med)
    list_element_xpath = build_outpatient_list_item_xpath(med)
    found = dynamic_dom_element_exists?(:xpath, list_element_xpath)
    return found
  end

  private

  def build_outpatient_list_item_xpath(med)
    temp_path = "//td[contains(@class, 'x-grid-cell')]/descendant::div[contains(string(), '#{med}')]"
    return temp_path
  end
end
