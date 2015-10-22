class UDAF < AccessBrowserV2
  include Singleton
  def initialize
    super
    add_action(CucumberLabel.new("Lab Result - Text Filter"), ClickAction.new, AccessHtmlElement.new(:id, "grid-filter-button-applet-1"))
    add_action(CucumberLabel.new("Condition - Text Filter"), ClickAction.new, AccessHtmlElement.new(:id, "grid-filter-button-applet-3"))
    add_verify(CucumberLabel.new("hematocrit"), VerifyContainsText.new, AccessHtmlElement.new(:css, "#grid-filter-applet-1 > div.grid-filter > form > fieldset > div > div.udaf > span > span"))
    add_verify(CucumberLabel.new("anion"), VerifyContainsText.new, AccessHtmlElement.new(:css, "#grid-filter-applet-1 > div.grid-filter > form > fieldset > div > div.udaf > span:nth-child(2) > span"))
    add_verify(CucumberLabel.new("Granulocytes"), VerifyContainsText.new, AccessHtmlElement.new(:css, "#grid-filter-applet-1 > div.grid-filter > form > fieldset > div > div.udaf > span:nth-child(2) > span"))
    add_verify(CucumberLabel.new("carbon"), VerifyContainsText.new, AccessHtmlElement.new(:css, "#grid-filter-applet-1 > div.grid-filter > form > fieldset > div > div.udaf > span:nth-child(1) > span"))
    # add_verify(CucumberLabel.new("platelet+12077"), VerifyContainsText.new, AccessHtmlElement.new(:css, "#grid-filter-applet-2 > div.grid-filter > form > span.udaf > span:nth-child(2) > span"))
    add_action(CucumberLabel.new("Delete - UDAF - hematocrit"), ClickAction.new, AccessHtmlElement.new(:css, "#grid-filter-applet-1 > div.grid-filter > form > fieldset > div > div.udaf > span > span > a > i"))
    # add_action(CucumberLabel.new("Delete - UDAF - hematology"), ClickAction.new, AccessHtmlElement.new(:css, "#grid-filter-applet-2 > div.grid-filter > form > div > span.udaf > span:nth-child(2) > span > a > i"))
    add_action(CucumberLabel.new("Header"), ClickAction.new, AccessHtmlElement.new(:css, "#applet-1 > div > div > div.panel-heading.grid-applet-heading > span.panel-title.center-block.text-center > span"))
    add_action(CucumberLabel.new("New Workspce"), ClickAction.new, AccessHtmlElement.new(:css, "#nav-workspaceSelect > div > ul > li.user-defined-workspace-1-button > a"))
    # add_action(CucumberLabel.new("Condition - Remove All link"), ClickAction.new, AccessHtmlElement.new(:css, "#grid-filter-applet-3 > div.grid-filter > form > div > a"))
    add_action(CucumberLabel.new("Lab Result - Remove All link"), ClickAction.new, AccessHtmlElement.new(:css, "#grid-filter-applet-1 > div.grid-filter > form > fieldset > div > div.filter-wrapper > div.remove-all-div > a"))
    # add_action(CucumberLabel.new("Orders - Remove All link"), ClickAction.new, AccessHtmlElement.new(:css, "#grid-filter-applet-2 > div.grid-filter > form > div > a"))
    add_verify(CucumberLabel.new("UDAF - anion"), VerifyContainsText.new, AccessHtmlElement.new(:css, "#grid-filter-applet-1 > div.grid-filter > form > fieldset > div > div.udaf > span:nth-child(1) > span"))
    add_verify(CucumberLabel.new("UDAF - Granulocytes"), VerifyContainsText.new, AccessHtmlElement.new(:css, "#grid-filter-applet-1 > div.grid-filter > form > fieldset > div > div.udaf > span:nth-child(2) > span"))
    add_verify(CucumberLabel.new("Newly created UDS"), VerifyContainsText.new, AccessHtmlElement.new(:css, "#user-defined-workspace-1"))
    add_action(CucumberLabel.new("Carousel Next Page Button"), ClickAction.new, AccessHtmlElement.new(:xpath, "//*[@id='applets-carousel']/div[1]/div[3]/a/span[1]"))
    add_verify(CucumberLabel.new("Header Filter Title"), VerifyContainsText.new, AccessHtmlElement.new(:css, "#grid-filter-button-applet-1 > span > span.applet-filter-title"))
    add_action(CucumberLabel.new("Filter Name"), ClickAction.new, AccessHtmlElement.new(:css, "#grid-filter-applet-1 > div.grid-filter > form > fieldset > div > div.filter-wrapper > div.filter-name > span"))
    add_verify(CucumberLabel.new("Filter Name Text"), VerifyContainsText.new, AccessHtmlElement.new(:xpath, "//*[@id='grid-filter-applet-1']/div[2]/form/fieldset/div/div[1]/div[1]/span"))
    add_action(CucumberLabel.new("Filter Rename"), SendKeysAction.new, AccessHtmlElement.new(:css, "#grid-filter-applet-1 > div.grid-filter > form > fieldset > div > div.filter-wrapper > div.filter-name > input"))
    add_verify(CucumberLabel.new("Filter Title"), VerifyContainsText.new, AccessHtmlElement.new(:css, "#grid-filter-button-applet-1 > span > span.applet-filter-title.text.include? 'Filtered'"))
    add_action(CucumberLabel.new("Lauch duplicated UDS"), ClickAction.new, AccessHtmlElement.new(:css, "#user-defined-workspace-1-copy > div > div.col-xs-3 > div.col-xs-4.launch-screen"))
    add_verify(CucumberLabel.new("Filter Tooltip Message"), VerifyContainsText.new, AccessHtmlElement.new(:css, ".tooltip-inner"))
    add_action(CucumberLabel.new("Med Review expanded view"), ClickAction.new, AccessHtmlElement.new(:css, "#applet-1 > div > div.options-list > ul > li.viewType-optionsBox.col-xs-3.col-xs-offset-3 > div.options-box.expanded"))
    add_action(CucumberLabel.new("Med Review - Search"), ClickAction.new, AccessHtmlElement.new(:css, "#grid-filter-button-applet-1 > span"))
    # add_action(CucumberLabel.new("Meds Review Filter"), SendKeysAndEnterAction.new, AccessHtmlElement.new(:id, "input-filter-search"))
    add_action(CucumberLabel.new("Meds Review Filter"), SendKeysAndEnterAction.new, AccessHtmlElement.new(:css, "input[name='q-applet-1']"))
    add_verify(CucumberLabel.new("ANALGESICS"), VerifyContainsText.new, AccessHtmlElement.new(:css, "#grid-filter-applet-1 > div.grid-filter > form > fieldset > div > div.udaf > span > span"))
  end
end #ScreenEditor

def input_and_enter_into_control(container, modal_or_applet, control_name, input_text)
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
    input_element.submit

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

# Then(/^user clicks next page button on the carousel$/) do
#   con = UDAF.instance
#   expect(con.wait_until_action_element_visible("Carousel Next Page Button", DefaultLogin.wait_time)).to be_true
#   expect(con.perform_action("Carousel Next Page Button", "")).to be_true
# end

Then(/^user scrolls the window to bring applets to view$/) do 
  driver = TestSupport.driver
  # sleep 10
  element = driver.find_element(:css, "#applet-2 > div > div > div.panel-heading.grid-applet-heading > span.pull-right.right-button-region > div > span:nth-child(4) > span > span > button > span")
  element.location_once_scrolled_into_view
end

Then(/^user scrolls the window to bring condition applets to view$/) do 
  driver = TestSupport.driver
  element = driver.find_element(:css, "#applet-3 > div > div > div.panel-heading.grid-applet-heading > span.pull-left > span > span > button > span")
  element.location_once_scrolled_into_view
end

Then(/^user clicks on the control "(.*?)"$/) do |html_action_element|
  con = UDAF.instance
  con.wait_until_action_element_visible(html_action_element, 40)
  expect(con.perform_action(html_action_element)).to be_true, "Error when attempting to excercise #{html_action_element}"
end

When(/^the user enters text "(.*?)" in the "(.*?)" control (?:on|in) the "(.*?)"$/) do |input_text, control_name, parent_name|
  container_key = get_container_key(control_name, parent_name)
  input_and_enter_into_control(container_key.container, container_key.modal_or_applet, container_key.control_name, input_text)
end

Then(/^user defined filter "(.*?)" is created$/) do |filter_element|
  con = UDAF.instance
  driver = TestSupport.driver
  wait = Selenium::WebDriver::Wait.new(:timeout => DefaultLogin.wait_time) 
  if filter_element == "Granulocytes"
    expect(con.wait_until_action_element_visible("Granulocytes", DefaultLogin.wait_time)).to be_true   
    expect(con.perform_verification("Granulocytes", filter_element)).to be_true
  elsif filter_element == "anion"
    expect(con.wait_until_action_element_visible("anion", DefaultLogin.wait_time)).to be_true   
    expect(con.perform_verification("anion", filter_element)).to be_true 
  elsif filter_element == "carbon"
    expect(con.wait_until_action_element_visible("carbon", DefaultLogin.wait_time)).to be_true   
    expect(con.perform_verification("carbon", filter_element)).to be_true                                        
  elsif filter_element == "hematocrit"
    expect(con.wait_until_action_element_visible("hematocrit", DefaultLogin.wait_time)).to be_true   
    expect(con.perform_verification("hematocrit", filter_element)).to be_true
  elsif filter_element == "ANALGESICS"
    expect(con.wait_until_action_element_visible("ANALGESICS", DefaultLogin.wait_time)).to be_true   
    expect(con.perform_verification("ANALGESICS", filter_element)).to be_true
  end
end

Then(/^the Conditions applet exoanded view contains rows$/) do |table|
  wait = Selenium::WebDriver::Wait.new(:timeout => DefaultLogin.wait_time)
  con = VerifyTableValue.new 
  driver = TestSupport.driver
  wait.until {  
    browser_elements_list = driver.find_elements(:css, "#data-grid-problems tbody tr")  
    con.perform_table_verification(browser_elements_list, "//table[@id='data-grid-problems']", table)
  }
end

Then(/^user refeshes the app$/) do 
  driver = TestSupport.driver
  driver.navigate.refresh
  sleep 10
end

def wait_until_udaf_is_not_displayed
  wait = Selenium::WebDriver::Wait.new(:timeout => DefaultLogin.wait_time) # seconds # wait until list opens
  # wait.until { !driver.find_element(:id, 'mainModal').displayed? }
  wait.until { element_is_not_present?(:id, 'mainModal') }
  wait.until { element_is_not_present?(:css, 'div.modal-backdrop.fade.in') }
end

Then(/^the element "(.*?)" is not displayed anymore$/) do |arg1|
  wait = Selenium::WebDriver::Wait.new(:timeout => DefaultTiming.default_wait_time)
  wait.until { !UDAF.instance.static_dom_element_exists? arg1  }
end 

Then(/^applet header displays filter name "(.*?)"$/) do |filter_text|
  screen = UDAF.instance
  screen.wait_until_action_element_visible("Header Filter Title", DefaultLogin.wait_time)
  # expect(screen.wait_until_action_element_visible("Header Title", title_text)).to be_true
  expect(screen.perform_verification("Header Filter Title", filter_text)).to be_true
end

Then(/^filter name field displays text "(.*?)"$/) do |filter_name|
  screen = UDAF.instance
  screen.wait_until_action_element_visible("Filter Name Text", DefaultLogin.wait_time)
  # expect(screen.wait_until_action_element_visible("Header Title", title_text)).to be_true
  expect(screen.perform_verification("Filter Name Text", filter_name)).to be_true
end

When(/^enters "(.*?)" to the filter name field$/) do |new_name|
  p "in"
  screen = UDAF.instance
  screen.wait_until_action_element_visible("Filter Rename", DefaultLogin.wait_time)
  input_element = screen.get_element("Filter Rename")

  for i in 0...input_element.attribute("value").size
    input_element.send_keys(:backspace)
  end
  expect(screen.perform_action("Filter Rename", new_name)).to be_true
  input_element.send_keys [:tab]
end

Then(/^a filter tooltip is displayed containing message "(.*?)"$/) do |tooltip_text|
  screen = UDAF.instance
  screen.wait_until_action_element_visible("Filter Tooltip Message", DefaultLogin.wait_time)
  # expect(screen.wait_until_action_element_visible("Header Title", title_text)).to be_true
  expect(screen.perform_verification("Filter Tooltip Message", tooltip_text)).to be_true
end

Then(/^the user enteres "(.*?)" in search box of the Meds Review Applet$/) do |search_text|
  aa = UDAF.instance
  expect(aa.wait_until_action_element_visible("Meds Review Filter", DefaultLogin.wait_time)).to be_true
  expect(aa.perform_action("Meds Review Filter", search_text)).to be_true
end
