class ScrnManager < AccessBrowserV2
  include Singleton
  def initialize
    super
    add_action(CucumberLabel.new("Screen Manager Header part 1"), ClickAction.new, AccessHtmlElement.new(:css, "#workspaceManager > div > div.col-xs-7 > div"))
    add_action(CucumberLabel.new("Screen Manager Header part 2"), ClickAction.new, AccessHtmlElement.new(:css, "#workspaceManager > div > div.col-xs-5 > div"))
    add_action(CucumberLabel.new("Coversheet fly-out menu"), ClickAction.new, AccessHtmlElement.new(:css, "#cover-sheet > div > div.col-xs-5 > div.col-xs-1 > i"))
    add_action(CucumberLabel.new("Coversheet launch button"), ClickAction.new, AccessHtmlElement.new(:css, "#cover-sheet > div > div.manageOptions.manager-open > ul > li.launch-worksheet"))
    add_action(CucumberLabel.new("add new screen button"), ClickAction.new, AccessHtmlElement.new(:css, "#mainOverlayRegion > div > div > div:nth-child(3) > div.col-xs-offset-6.col-xs-4 > button.btn.addScreen"))
    add_action(CucumberLabel.new("Coversheet launch button"), ClickAction.new, AccessHtmlElement.new(:css, "#cover-sheet > div > div.manageOptions.manager-open > ul > li.launch-worksheet"))
    add_action(CucumberLabel.new("workspace1 fly-out"), ClickAction.new, AccessHtmlElement.new(:css, "#user-defined-workspace-1 > div > div.col-xs-5 > div.col-xs-1 > i"))
    add_action(CucumberLabel.new("workspace1 launch"), ClickAction.new, AccessHtmlElement.new(:css, "#user-defined-workspace-1 > div > div.manageOptions.manager-open > ul > li.launch-worksheet"))
    add_action(CucumberLabel.new("Screen editor applets"), ClickAction.new, AccessHtmlElement.new(:css, "#applets-carousel > div:nth-child(2) > div.carousel-inner > div.item.active > div:nth-child(1)"))
    add_action(CucumberLabel.new("Delete workspace1"), ClickAction.new, AccessHtmlElement.new(:css, "#user-defined-workspace-1 > div > div.col-xs-5 > div:nth-child(4) > div"))
    add_action(CucumberLabel.new("Delete workspace2"), ClickAction.new, AccessHtmlElement.new(:css, "#user-defined-workspace-2 > div > div.col-xs-5 > div:nth-child(4) > div"))
    add_action(CucumberLabel.new("workspace1 title field"), ClickAction.new, AccessHtmlElement.new(:css, "#user-defined-workspace-1 > div > div.col-xs-7 > div.col-xs-5.editor-title > input"))
    add_action(CucumberLabel.new("workspace1 description field"), ClickAction.new, AccessHtmlElement.new(:css, "#user-defined-workspace-1 > div > div.col-xs-7 > div.col-xs-6 > input"))
    add_verify(CucumberLabel.new("workspace1 title"), VerifyText.new, AccessHtmlElement.new(:css, "#user-defined-workspace-1 > div > div.col-xs-7 > div.col-xs-5.editor-title > input"))
    add_verify(CucumberLabel.new("workspace1 description"), VerifyText.new, AccessHtmlElement.new(:css, "#user-defined-workspace-1 > div > div.col-xs-7 > div.col-xs-6 > input"))
    add_action(CucumberLabel.new("Done editing"), ClickAction.new, AccessHtmlElement.new(:id, "doneEditing"))
    add_verify(CucumberLabel.new("workspace1 Author"), VerifyText.new, AccessHtmlElement.new(:css, "#user-defined-workspace-1 > div > div.col-xs-5 > div.col-xs-5"))
    add_action(CucumberLabel.new("Overview Menu"), ClickAction.new, AccessHtmlElement.new(:css, "#navigation-navbar > ul > li.btn-group > button.btn.btn-default.dropdown-toggle"))
    add_action(CucumberLabel.new("workspace2 flyout"), ClickAction.new, AccessHtmlElement.new(:css, "#user-defined-workspace-2 > div > div.col-xs-5 > div.col-xs-1 > i"))
    add_action(CucumberLabel.new("workspace1 copy flyout"), ClickAction.new, AccessHtmlElement.new(:css, "#user-defined-workspace-1-copy > div > div.col-xs-5 > div.col-xs-1 > i"))
    add_action(CucumberLabel.new("Screen Editor Exit"), ClickAction.new, AccessHtmlElement.new(:id, "exitEditing"))
    add_action(CucumberLabel.new("Confirm Delete"), ClickAction.new, AccessHtmlElement.new(:css, "#workspace-delete"))
    add_action(CucumberLabel.new("Coversheet Duplicate"), ClickAction.new, AccessHtmlElement.new(:css, "#cover-sheet > div > div.manageOptions.manager-open > ul > li.duplicate-worksheet"))
    add_action(CucumberLabel.new("Coversheet Copy Flyout"), ClickAction.new, AccessHtmlElement.new(:css, "#coversheet-copy > div > div.col-xs-5 > div.col-xs-1 > i"))
    add_action(CucumberLabel.new("Coversheet Copy Launch"), ClickAction.new, AccessHtmlElement.new(:css, "#coversheet-copy > div > div.manageOptions.manager-open > ul > li.launch-worksheet"))
    add_action(CucumberLabel.new("Coversheet Copy Delete"), ClickAction.new, AccessHtmlElement.new(:css, "#coversheet-copy > div > div.manageOptions.manager-open > ul > li.delete-worksheet"))
    add_verify(CucumberLabel.new("workspace 2 title"), VerifyText.new, AccessHtmlElement.new(:css, "#user-defined-workspace-2 > div > div.col-xs-7 > div.col-xs-5.editor-title > input"))
    add_action(CucumberLabel.new("Workspace1 Duplicate"), ClickAction.new, AccessHtmlElement.new(:css, "#user-defined-workspace-1 > div > div.manageOptions.manager-open > ul > li.duplicate-worksheet"))
    add_action(CucumberLabel.new("workspace2 launch"), ClickAction.new, AccessHtmlElement.new(:css, "#user-defined-workspace-2 > div > div.manageOptions.manager-open > ul > li.launch-worksheet"))
    add_action(CucumberLabel.new("workspace1 copy launch"), ClickAction.new, AccessHtmlElement.new(:css, "#user-defined-workspace-1-copy > div > div.manageOptions.manager-open > ul > li.launch-worksheet"))
    add_action(CucumberLabel.new("workspace1 copy delete"), ClickAction.new, AccessHtmlElement.new(:css, "#user-defined-workspace-1-copy > div > div.manageOptions.manager-open > ul > li.delete-worksheet"))
    add_action(CucumberLabel.new("Dropdown Menu"), ClickAction.new, AccessHtmlElement.new(:css, "#nav-workspaceSelect button.btn.btn-default.dropdown-toggle"))
  end
end 

class ScreenManagerHeaders < AccessBrowserV2
  include Singleton
  def initialize
    super
    add_verify(CucumberLabel.new(""), VerifyText.new, AccessHtmlElement.new(:css, "#workspaceManager > div > div.col-xs-7 > div.col-xs-1"))
    add_verify(CucumberLabel.new("Title"), VerifyText.new, AccessHtmlElement.new(:css, "#workspaceManager > div > div.col-xs-7 > div.col-xs-5"))
    add_verify(CucumberLabel.new("Description"), VerifyText.new, AccessHtmlElement.new(:css, "#workspaceManager > div > div.col-xs-7 > div.col-xs-6"))
    add_verify(CucumberLabel.new("Author"), VerifyText.new, AccessHtmlElement.new(:css, "#workspaceManager > div > div.col-xs-5 > div.col-xs-5"))
    add_verify(CucumberLabel.new("Associated Conditions"), VerifyText.new, AccessHtmlElement.new(:css, "#workspaceManager > div > div.col-xs-5 > div.col-xs-4"))
    add_verify(CucumberLabel.new("Preview"), VerifyText.new, AccessHtmlElement.new(:css, "#workspaceManager > div > div.col-xs-5 > div.col-xs-2"))
    add_verify(CucumberLabel.new("Menu"), VerifyText.new, AccessHtmlElement.new(:css, "#workspaceManager > div > div.col-xs-5 > div.col-xs-1"))
  end
end 

class ModifiedDropDown < AccessBrowserV2
  include Singleton
  def initialize
    super
    add_verify(CucumberLabel.new("Coversheet"), ClickAction.new, AccessHtmlElement.new(:id, "cover-sheet"))
    add_verify(CucumberLabel.new("Timeline"), ClickAction.new, AccessHtmlElement.new(:id, "news-feed"))
    add_action(CucumberLabel.new("Meds Review"), ClickAction.new, AccessHtmlElement.new(:id, "medication-review"))
    add_action(CucumberLabel.new("Documents"), ClickAction.new, AccessHtmlElement.new(:id, "documents-list"))  
    add_action(CucumberLabel.new("Overview"), ClickAction.new, AccessHtmlElement.new(:id, "overview"))
    add_action(CucumberLabel.new("User Defined Workspace 2"), ClickAction.new, AccessHtmlElement.new(:id, "user-defined-workspace-2"))
  end
end

Then(/^the screen manager contains the following rows$/) do |_table|
  driver = TestSupport.driver
  con = ModifiedDropDown.instance
  con.wait_until_action_element_visible("Coversheet", 60)
  con.wait_until_action_element_visible("Timeline", 60)
  con.wait_until_action_element_visible("Meds Review", 60)
  con.wait_until_action_element_visible("Documents", 60)
  con.wait_until_action_element_visible("Overview", 60)
  con.wait_until_action_element_visible("Coversheet", 60)
  con.wait_until_action_element_visible("User Defined Workspace 2", 60)
end

class ScrnManagerElements < AccessBrowserV2
  include Singleton
  def initialize
    super
    @@count_elements = AccessHtmlElement.new(:xpath, ".//*[@id='list-group']/div/div")
    add_verify(CucumberLabel.new("workspace rows"), VerifyXpathCount.new(@@count_elements), @@count_elements)
    @@count_elements2 = AccessHtmlElement.new(:xpath, "//*[@id='content-region']/div/div/div")
    add_verify(CucumberLabel.new("coversheet check"), VerifyXpathCount.new(@@count_elements2), @@count_elements2)
  end
end

Then(/^there are (\d+) applets on the "(.*?)"$/) do |num, copy| 
  aa = ScrnManagerElements.instance
  expect(aa.wait_until_xpath_count(copy, num, 50)).to be_true
end

When(/the Workspace Manager Header contains (\d+) headers$/) do |num|
  screen = ScrnManager.instance
  driver = TestSupport.driver
  screen.wait_until_action_element_visible("Screen Manager Header part 1", 40)
  screen.wait_until_action_element_visible("Screen Manager Header part 2", 40)
  sm_head_part1 = driver.find_elements(:css, "#workspaceManager > div > div.col-xs-7 > div")
  sm_head_part2 = driver.find_elements(:css, "#workspaceManager > div > div.col-xs-5 > div")
  expect(sm_head_part1.length + sm_head_part2.length).to eq(num.to_i)
end

Then(/^the Workspace Manager has the following headers$/) do |table|
  driver = TestSupport.driver
  headers1 = driver.find_elements(:css, "#workspaceManager > div > div.col-xs-7 > div") 
  headers2 = driver.find_elements(:css, "#workspaceManager > div > div.col-xs-5 > div") 
  headers = headers1.length + headers2.length
  expect(headers).to_not eq(0)
  expect(headers).to eq(table.rows.length)
  elements = ScreenManagerHeaders.instance
  table.rows.each do |header_text|
    does_exist = elements.static_dom_element_exists? header_text[0]
    p "#{header_text[0]} was not found" unless does_exist
    expect(does_exist).to be_true
  end 
end 

Then(/^the flyout menu contains$/) do |table|
  driver = TestSupport.driver
  menu = driver.find_elements(:css, "#cover-sheet > div > div.manageOptions.manager-open > ul > li")
  items = menu.length 
  expect(items).to_not eq(0)
  expect(items).to eq(table.rows.length)
  elements = FlyoutMenu.instance
  table.rows.each do |header_text|
    does_exist = elements.static_dom_element_exists? header_text[0]
    p "#{header_text[0]} was not found" unless does_exist
    expect(does_exist).to be_true
  end 
end 

Then(/^the workspace 1 flyout menu contains$/) do |table|
  driver = TestSupport.driver
  menu = driver.find_elements(:css, "#user-defined-workspace-1 > div > div.manageOptions.manager-open > ul > li")
  items = menu.length 
  expect(items).to_not eq(0)
  expect(items).to eq(table.rows.length)
  elements = WorkspaceOneFlyoutMenu.instance
  table.rows.each do |header_text|
    does_exist = elements.static_dom_element_exists? header_text[0]
    p "#{header_text[0]} was not found" unless does_exist
    expect(does_exist).to be_true
  end 
end 

When(/^the user clicks "(.*?)" on the workspace manager$/) do |html_action_element|
  navigation = ScrnManager.instance
  navigation.wait_until_action_element_visible(html_action_element, 40)
  expect(navigation.perform_action(html_action_element)).to be_true, "Error when attempting to excercise #{html_action_element}"
end

Then(/^Screen editor is active$/) do
  browser_access = ScrnManager.instance  
  expect(browser_access.wait_until_element_present("Screen editor applets", 60)).to be_true  
end

Then(/^there are (\d+) "(.*?)"$/) do |num, applet| 
  aa = ScrnManagerElements.instance
  expect(aa.wait_until_xpath_count(applet, num, 50)).to be_true
end

When(/^the user enters "(.*?)" into the screen manager "(.*?)"$/) do |text, html_element|
  navigation = ScrnManager.instance
  navigation.wait_until_action_element_visible(html_element, DefaultLogin.wait_time)
  expect(navigation.perform_action(html_element, text)).to be_true, "Error when attempting to enter '#{text}' into #{html_element}"
end

Then(/^the workspace manager "(.*?)" contains "(.*?)"$/) do |field, text| 
  aa = ScrnManager.instance
  expect(aa.wait_until_action_element_visible(field, DefaultLogin.wait_time)).to be_true
  expect(aa.perform_verification(field, text)).to be_true
end

Then(/^drag and drop the conditions copy right by (\d+) and down by (\d+)$/) do |right_by, down_by|
  driver = TestSupport.driver
  applet_preview = driver.find_element(:css, "#bc2652653929 > div > div > div.panel-heading.grid-applet-heading > span.panel-title.center-block.text-center")
  driver.action.drag_and_drop_by(applet_preview, right_by, down_by).perform
end
