path = File.expand_path '../helper', __FILE__
$LOAD_PATH.unshift path unless $LOAD_PATH.include?(path)

require 'AccessBrowserV2.rb'
require 'date'

class UniversalContainer < AccessBrowserV2
  include Singleton

  def initialize
    super
    add_verify(CucumberLabel.new("Coversheet"), VerifyContainsText.new, AccessHtmlElement.new(:css, ".cover-sheet"))
    add_action(CucumberLabel.new("Control - modal - Close"), ClickAction.new, AccessHtmlElement.new(:css, "#modal-close-button"))
    add_action(CucumberLabel.new("Control - modal - Header_Close"), ClickAction.new, AccessHtmlElement.new(:css, "#modal-header button.close"))
    add_verify(CucumberLabel.new("Modal Title"), VerifyContainsText.new, AccessHtmlElement.new(:css, ".modal-title"))
    add_verify(CucumberLabel.new("Modal"), VerifyContainsText.new, AccessHtmlElement.new(:css, "#modal-body"))

    add_verify(CucumberLabel.new("Single Page View"), VerifyContainsText.new, AccessHtmlElement.new(:css, "#content-region #center"))
  end # initialize
end # UniversalContainer

Before do
  @uc = UniversalContainer.instance
end

module Constants
  # key - Gherkin applet actual title
  # value - appletid attribute found in html
  APPLET_IDS = {
    "Orders" => "orders",
    "Lab Results" => "lab_results_grid",
    "Active Medications" => "activeMeds",
    "Vitals" => "vitals"
  }
end # Constants

# ######################## functions ########################

def verify_element_displayed(container, map_key, display_state = "Displayed")
  wait = Selenium::WebDriver::Wait.new(:timeout => 60)

  if display_state.downcase == "displayed"
    wait.until { container.get_element(map_key).displayed? }
  else
    # if the element isn't in the DOM, then it's obviously not displayed
    unless container.get_elements(map_key).size == 0
      wait.until { !container.get_element(map_key).displayed? }
    end # unless
  end
end

def verify_element_present(container, map_key, display_state = "Displayed")
  wait = Selenium::WebDriver::Wait.new(:timeout => 60)

  if display_state == "Displayed"
    wait.until {
      elements = container.get_elements(map_key)
      expect(elements.size).to eq(1)
      coversheet_element = elements[0]
      expect(coversheet_element.displayed?).to be_true
    }
  else
    wait.until {
      elements = container.get_elements(map_key)
      expect(elements.size).to eq(0)
    }
  end # if
end

def verify_element_enabled(element, enabled_or_disabled)
  wait = Selenium::WebDriver::Wait.new(:timeout => 30)

  if enabled_or_disabled == "enabled"
    wait.until { element.attribute("disabled") == nil }
  else
    wait.until { element.attribute("disabled") == true.to_s }
  end

  disabled_attribute = element.attribute("disabled")
  #p "element's disabled attribute: #{disabled_attribute}"
end

def verify_elements_equal(expected_element, actual_element)
  # can pass in a Selenium Element or a string
  if actual_element.class == Selenium::WebDriver::Element
    actual_element = actual_element.text
  end

  #p "Expected: #{expected_element}    -- Actual: -- #{actual_element}"
  expect(actual_element).to eq(expected_element), "Text did not match: expected (#{expected_element}) and actual (#{actual_element})"
end

def verify_elements_not_equal(not_expected_element, actual_element)
  # can pass in a Selenium Element or a string
  if actual_element.class == Selenium::WebDriver::Element
    actual_element = actual_element.text
  end

  p "Not Expected: #{not_expected_element}    -- Actual: -- #{actual_element}"
  expect(actual_element).to_not eq(not_expected_element)
end

def verify_applet_exists(applet_id_attribute)
  driver = TestSupport.driver
  applets = driver.find_elements(:css, "[data-appletid=#{applet_id_attribute}]")

  expect(applets.size).to be_eql(1), "The number of found applets matching that id was #{applets.size}."
end

def input_into_control(container, modal_or_applet, control_name, input_text)
  attempts ||= 0

  control_key = "Control - #{modal_or_applet} - #{control_name}"
  #p "control_key is #{control_key}"
  wait = Selenium::WebDriver::Wait.new(:timeout => 15)
  wait.until { container.get_element(control_key) }

  input_element = container.get_element(control_key)

  # need to clear what is currently in the input
  # clear() seems to not work correctly with placeholders
  for i in 0...input_element.attribute("value").size
    input_element.send_keys(:backspace)
  end

  # if you just want to clear the input (empty input text)
  unless input_text.strip.empty?
    input_element.send_keys(input_text)

    # because of race conditions, sometimes the value doesn't get input correctly
    if input_element.attribute("value") != input_text
      fail
    end
  end # unless
rescue => e
  attempts += 1

  if attempts < 3
    p "Attemping retry of input."
    sleep 2
    retry
  else
    p "!! Error attempting input on - #{control_name} !!"
    raise e
  end # if/else
  #else # succesful begin
  #  p "Input - #{control_name}"
end

def wait_and_perform(container, map_key, sent_keys = :enter)
  # can pass the map_key with 'Control -' or without
  map_key.sub!(/Control - /, '')
  control_key = "Control - #{map_key}"

  attempts = 0

  begin
    wait = Selenium::WebDriver::Wait.new(:timeout => 30)
    wait.until { container.get_element(control_key) }
    wait.until { container.get_element(control_key).displayed? }
    container.perform_action_rethrow(control_key, sent_keys)
  rescue StandardError => e
    attempts += 1

    if attempts < 3
      p "Attemping retry of action."
      sleep 2
      retry
    else
      p "!! Error attempting action on - #{control_key} !!"
      raise e
    end # if/else
    #else # succesful begin
    #  p "Action - #{map_key}"
  end # begin/rescue
end

def navigate_in_ehmp(path = "")
  driver = TestSupport.driver  
  url = driver.current_url
  if path.strip.length == 0
    #p "navigating to base"
    TestSupport.navigate_to_url(DefaultLogin.ehmpui_url) 
  elsif !url.include? path
    #p "navigating to new url"
    TestSupport.navigate_to_url(DefaultLogin.ehmpui_url+"/"+path) 
  end  
  #p "current path #{driver.current_url}"
  TestSupport.wait_for_page_loaded
end

def get_applet_id(applet_name)
  # remove ' applet' if they choose to pass this in
  # the hash table does not contain them, assumes our keys are already applets
  key = applet_name.sub(/ [aA]pplet/, "")

  return Constants::APPLET_IDS[key]
end

def convert_to_date(string)
  return Date.strptime(string, "%m/%d/%Y")
end

def refresh_applet(applet_name)
  applet_id = get_applet_id(applet_name)

  TestSupport.driver.find_element(:css, "[data-appletid=#{applet_id}] .grid-refresh-button button").click
end

def get_container(key)
  container = nil

  case key.downcase
  when "coversheet"
    container = CoversheetContainer.instance
  when "lab results"
    container = LabResultsContainer.instance
  when "orders"
    container = OrdersContainer.instance
  when "text search"
    container = TextSearchContainer.instance
  when "documents"
    container = DocumentsDateFilter.instance
  when "med review"
    container = MedReviewDateFilter.instance
  when "newsfeed"
    container = NewsFeedDateFilter.instance
  when "immunization gist"
    container = ImmunizationGist.instance
  when "medications gist"
    container = MedicationGistContainer.instance
  when "allergies"
    container = AllergiesGist.instance
  when "documents gist"
    container = DocumentsGistContainer.instance
  when "encounters gist"
    container = EncountersGist.instance
  when "conditions gist"
    container = ConditionsGist.instance
  when "reports gist"
    container = ReportsGistContainer.instance
  when "overview"
    container = Overview.instance
  else
    fail "Container Error - #{key}: does not exist."
  end

  return container
end

def parse_parent_name(parent_name)
  response = OpenStruct.new

  match_data = /^(?<parent>.*?)(?:\s)?(?<modalApplet>[mM]odal|[aA]pplet)?$/.match(parent_name)

  response.parent_name = match_data["parent"]
  response.modal_or_applet = match_data["modalApplet"]

  return response
end

# returns a entity object for passing to functions what container and what object to manipulate
def get_container_key(control_name, parent_name)
  container_key = OpenStruct.new
  container_key.container = nil
  container_key.map_key = nil
  container_key.modal_or_applet = nil
  container_key.control_name = control_name

  parsed_name = parse_parent_name(parent_name)

  container_key.container = get_container(parsed_name.parent_name)

  container_key.modal_or_applet = parsed_name.modal_or_applet.nil? ? parsed_name.parent_name : parsed_name.modal_or_applet

  container_key.map_key = "#{container_key.modal_or_applet} - #{control_name}"

  return container_key
end

# ######################## When ########################

When(/^the user clicks the control "(.*?)" (?:on|in) the "(.*?)"$/) do |control_name, parent_name|
  container_key = get_container_key(control_name, parent_name)
  wait_and_perform(container_key.container, container_key.map_key)
end

When(/^the user inputs "(.*?)" in the "(.*?)" control (?:on|in) the "(.*?)"$/) do |input_text, control_name, parent_name|
  container_key = get_container_key(control_name, parent_name)
  input_into_control(container_key.container, container_key.modal_or_applet, container_key.control_name, input_text)
end

When(/^the user closes modal by clicking the "(.*?)" control$/) do |close_control|
  wait_and_perform(@uc, "Control - modal - #{close_control}")
end

When(/^the user clicks the refresh button in the "(.*?)" applet$/) do |applet_name|
  refresh_applet(applet_name)
end

def expand_applet(applet_key)
  access_browser = get_container(applet_key)
  if access_browser.static_dom_element_exists? 'Control - applet - Expand View'
    expect(access_browser.perform_action('Control - applet - Expand View')).to be_true
  end
  expect(access_browser.wait_until_element_present('Control - applet - Minimize View')).to be_true
end

Given(/^the user is viewing the expanded "(.*?)" applet$/) do |applet_key|
  expand_applet applet_key
end

When(/^the user expands the "(.*?)" applet$/) do |applet_key|
  expand_applet applet_key
end

# ######################## Then ########################

Then(/^the "(.*?)" should be "(.*?)" (?:on|in) the "(.*?)"$/) do |html_element, display_state, parent_name|
  sleep 0.5

  container_key = get_container_key(nil, parent_name)

  verify_element_displayed(container_key.container, "#{container_key.modal_or_applet} - #{html_element}", display_state)
end

Then(/^"(.*?)" pages of results should be displayed (?:on|in) the "(.*?)"$/) do |expected_pages, parent_name|
  driver = TestSupport.driver

  applet_name = parent_name.sub(/ applet/, "")
  applet_id = get_applet_id(applet_name)

  wait = Selenium::WebDriver::Wait.new(:timeout => 15)

  paginator_key = "[data-appletid=#{applet_id}] .backgrid-paginator ul li"

  begin
    # constant 2 is the number of arrows (next,prev)
    wait.until { (driver.find_elements(:css, paginator_key).size - 2) == expected_pages.to_i }
  rescue
    p "Number of actual pages found: #{(driver.find_elements(:css, paginator_key).size - 2)}"
    raise
  end
end

Then(/no results should be found (?:on|in) the "(.*?)"/) do |parent_name|
  applet_name = parent_name.sub(/ applet/, "")
  applet_id = get_applet_id(applet_name)

  wait = Selenium::WebDriver::Wait.new(:timeout => 15)

  wait.until { TestSupport.driver.find_elements(:css, "[data-appletid=#{applet_id}] tbody .empty") }
end

Then(/^the "(.*?)" applet is displayed$/) do |expected_applet_title|
  appletid = Constants::APPLET_IDS[expected_applet_title]
  verify_applet_exists(appletid)
end

Then(/^the "(.*?)" applet is finished loading$/) do |expected_applet_title|
  appletid = Constants::APPLET_IDS[expected_applet_title]

  driver = TestSupport.driver
  wait = Selenium::WebDriver::Wait.new(:timeout => 30)

  wait.until { driver.find_elements(:css, "[data-appletid=#{appletid}] .fa-spinner").size == 0 }
end

Then(/^the modal's title is "(.*?)"$/) do |expected_title|
  modal_title_key = "Modal Title"

  #@uc.wait_until_action_element_visible(modal_title_key, 15)

  #wait = Selenium::WebDriver::Wait.new(:timeout => 15)

  #wait.until {
  #  p "expected: #{expected_title}   -- actual: #{@uc.get_element(modal_title_key).text}"
  #  @uc.get_element(modal_title_key).text == expected_title
  #}
  expect(@uc.perform_verification(modal_title_key, expected_title)).to be_true
end

Then(/^the "(.*?)" single page view is displayed$/) do |_expected_single_page|
  singe_page_key = "Single Page View"
  @uc.wait_until_element_present(singe_page_key, 15)
  is_single_page = @uc.static_dom_element_exists?(singe_page_key)
  expect(is_single_page).to be_true
end

Then(/^the modal is displayed$/) do
  @uc.wait_until_action_element_visible("Modal", 15)
end

Then(/^the coversheet is displayed$/) do
  verify_element_displayed(@uc, "Coversheet")
end

Then(/^the "(.*?)" input should have the value "(.*?)" (?:on|in) the "(.*?)"$/) do |control_name, expected_value, parent_name|
  container_key = get_container_key(control_name, parent_name)

  current_value = container_key.container.get_element("Control - #{container_key.modal_or_applet} - #{control_name}").attribute("value")
  verify_elements_equal(expected_value, current_value)
end
