#require 'AccessBrowserV2.rb'
path = File.expand_path '..', __FILE__
$LOAD_PATH.unshift path unless $LOAD_PATH.include?(path)
path = File.expand_path '../../../../shared-test-ruby', __FILE__
$LOAD_PATH.unshift path unless $LOAD_PATH.include?(path)
path = File.expand_path '../helper', __FILE__
$LOAD_PATH.unshift path unless $LOAD_PATH.include?(path)

class Visit < AccessBrowserV2
  include Singleton
  def initialize
    super
    add_verify(CucumberLabel.new("Clinic Appointments"), VerifyContainsText.new, AccessHtmlElement.new(:css, "#visitModal ul.nav-tabs a[href='#appts']"))
    add_verify(CucumberLabel.new("Hospital Admissions"), VerifyContainsText.new, AccessHtmlElement.new(:css, "#visitModal ul.nav-tabs a[href='#admits']"))
    add_verify(CucumberLabel.new("New Visit"), VerifyContainsText.new, AccessHtmlElement.new(:css, "#visitModal ul.nav-tabs a[href='#new-visit']"))
    add_verify(CucumberLabel.new("Top Region"), VerifyContainsText.new, AccessHtmlElement.new(:id, "top-region"))
    add_action(CucumberLabel.new("Select Visit"), ClickAction.new, AccessHtmlElement.new(:id, "visitSelectBtn"))
    add_verify(CucumberLabel.new("Cancel_Visit"), VerifyContainsText.new, AccessHtmlElement.new(:xpath, "//*[@id='visitCancelBtn']"))
    #add_verify(CucumberLabel.new("Modal Title"), VerifyContainsText.new, AccessHtmlElement.new(:id, "mainModalLabel"))

    add_verify(CucumberLabel.new("Confirm"), VerifyContainsText.new, AccessHtmlElement.new(:xpath, "//*[@id='setVisitBtn']"))
    add_verify(CucumberLabel.new("Encounter Location"), VerifyContainsText.new, AccessHtmlElement.new(:id, "selectedInfo"))
    add_action(CucumberLabel.new("Hospital Admissions"), ClickAction.new, AccessHtmlElement.new(:id, "visit-tab-admits"))
    add_action(CucumberLabel.new("New Visit"), ClickAction.new, AccessHtmlElement.new(:id, "visit-tab-new"))
    #add_action(CucumberLabel.new("DIABETIC"), ClickAction.new, AccessHtmlElement.new(:id, ""))
    add_action(CucumberLabel.new("DIABETIC"), ClickAction.new, AccessHtmlElement.new(:css, '#location-typeahead-list li[data-name="DIABETIC"]')) #from the drop down list
    #add_action(CucumberLabel.new("Hypertension (ICD-9-CM 401.9)"), ClickAction.new, AccessHtmlElement.new(:css, '#problem-typeahead-list li[data-name="Hypertension (ICD-9-CM 401.9)"]'))
    #add_verify(CucumberLabel.new("DIABETIC"), VerifyContainsText.new, AccessHtmlElement.new(:id, "location"))
    add_verify(CucumberLabel.new("HistoricalVisitText"), VerifyContainsText.new, AccessHtmlElement.new(:css, ".col-sm-10>p"))
    add_verify(CucumberLabel.new("DateText"), VerifyContainsText.new, AccessHtmlElement.new(:id, "dp-visit"))
    add_action(CucumberLabel.new("Visit Location"), SendKeysAndEnterAction.new, AccessHtmlElement.new(:id, "location"))
    #add_action(CucumberLabel.new("Visit Location"), ClickAction.new, AccessHtmlElement.new(:id, "location"))
    #VisitInformation tab
    add_action(CucumberLabel.new("Visit Information"), ClickAction.new, AccessHtmlElement.new(:id, "setVisitContextBtn"))
    add_action(CucumberLabel.new("Care Team Information"), ClickAction.new, AccessHtmlElement.new(:xpath, "/html/body/div[2]/div/div[2]/div/div/div/div[4]/div[1]/div/div[1]"))
    add_verify(CucumberLabel.new("Change Visit"), VerifyContainsText.new, AccessHtmlElement.new(:id, "setVisitContextBtn"))
    #add_action(CucumberLabel.new("VisitInformation"), ClickAction.new, AccessHtmlElement.new(:css, ".col-md-6>h6"))
    add_action(CucumberLabel.new("Change Visit"), ClickAction.new, AccessHtmlElement.new(:id, "setVisitContextBtn"))
    add_action(CucumberLabel.new("Confirm"), ClickAction.new, AccessHtmlElement.new(:id, "setVisitBtn"))
    add_action(CucumberLabel.new("Clinic Appointments"), ClickAction.new, AccessHtmlElement.new(:css, "#visitModal ul.nav-tabs a[href='#appts']"))
    # Date and time
    add_verify(CucumberLabel.new("Datevalue"), VerifyContainsText.new, AccessHtmlElement.new(:id, "dp-visit"))
    add_verify(CucumberLabel.new("Timevalue"), VerifyContainsText.new, AccessHtmlElement.new(:id, "tp-visit"))
    #add_action(CucumberLabel.new("DatevalueClick"), ClickAction.new, AccessHtmlElement.new(:id, "dp-visit"))
    #add_action(CucumberLabel.new("Datevalue"), SendKeysAction.new, AccessHtmlElement.new(:id, "dp-visit"))
    add_action(CucumberLabel.new("DatevalueWrite"), ClickAndSendKeysAction.new, AccessHtmlElement.new(:id, "dp-visit"))  
    add_verify(CucumberLabel.new("ErrorText"), VerifyContainsText.new, AccessHtmlElement.new(:css, "#date-error")) 
    #RemoveProblem
    #Remove Problem
    add_action(CucumberLabel.new("Remove"), ClickAction.new, AccessHtmlElement.new(:id, "deleteBtn"))
    add_action(CucumberLabel.new("Cancel"), ClickAction.new, AccessHtmlElement.new(:id, "cancelBtn")) 
  end 
end

When(/^the user clicks button "(.*?)"$/) do |element|
  con = Visit.instance
  #con.wait_until_action_element_visible(element, 60)
  #expect(con.static_dom_element_exists?(element)).to be_true
  expect(con.perform_action(element)).to be_true
end
 
def verify_patient_visit_table_headers(access_browser_instance, table)
  con = Visit.instance
  driver = TestSupport.driver
  con.wait_until_action_element_visible("Top Region", 60)
  expect(con.static_dom_element_exists?("Top Region")).to be_true
  headers = driver.find_elements(:css, ".nav.nav-tabs>li>a") 
  expect(headers.length).to_not eq(0)
  expect(headers.length).to eq(table.rows.length)
  elements = access_browser_instance
  table.rows.each do |header_text|
    does_exist = elements.static_dom_element_exists? header_text[0]
    p "#{header_text[0]} was not found" unless does_exist
    expect(does_exist).to be_true
  end #table
end #verify_table_headers

Then(/^the visit context  modal contains headers$/) do |table|
  verify_patient_visit_table_headers(Visit.instance, table)
end

Then(/^the modal contains buttons "(.*?)" and "(.*?)"$/) do |btn1, _btn2|
  con = Visit.instance
  expect(con.perform_verification("Cancel_Visit", btn1)).to be_true
  #con.perform_verification("Confirm", btn2)
end

When(/^the user Clicks on "(.*?)"$/) do |arg1|
  Visit.instance.perform_action(arg1)
end

Then(/^the Visit Modal contains (\d+) rows$/) do |_arg1|
  pending # express the regexp above with the code you wish you had
end

Then(/^the Clinic Appointments contain rows$/) do |table|
  con = Visit.instance
  driver = TestSupport.driver
  tablearr = driver.find_elements(:css, "#appts .list-group>li") 
  p tablearr.length
  table.rows.each do |givenrow| 
    bflag = false
    tablearr.each do |field|
      #p field  #added newly
      localcol1 =  field.find_elements(:xpath, "span")[0].text.strip
      localcol2 =  field.find_elements(:xpath, "span")[1].text.strip
      #p localCol1.to_s + " - " + givenrow[0].to_s.strip + " - " + localCol2.to_s + " : " + givenrow[1].to_s.strip
      if localcol1 == givenrow[0].strip && localcol2 == givenrow[1].strip 
        bflag = true
        break
      end
    end
    if bflag == false
      p "not matched: " + givenrow[0].strip + " - "  + givenrow[1].strip 
    end

    expect(bflag).to be_true
  end #table
end

#header1 =driver.find_elements(:css,"#appts .list-group>li")
# puts header1.length
# puts"table contents"
# p "#{header1[0]}"
Then(/^Hospital admissions contain rows$/) do |table|
  con = Visit.instance
  driver = TestSupport.driver
  con.perform_action("Hospital Admissions")
  admit_arr = driver.find_elements(:css, "#admits .list-group-item") 
  p admit_arr.length
  #tablearr1= driver.find_elements(:css, "#admits .list-group>li")
  #p tablearr1.length
  p "after the added test - tab2"
  table.rows.each do |givenrow| 
    bflag = false
    admit_arr.each do |field|
      localcol1 =  field.find_elements(:xpath, "span")[0].text.strip
      localcol2 =  field.find_elements(:xpath, "span")[1].text.strip
      #p localCol1 + " - " + givenrow[0].strip + " - " + localCol2 + " : " + givenrow[1].strip
      if localcol1 == givenrow[0].strip && localcol2 == givenrow[1].strip
        bflag = true
        break
      end
    end
    if bflag == false 
      p "Not matched : " + givenrow[0].strip + " - "  + givenrow[1].strip
    end
    expect(bflag).to be_true
  end #table
end

#@US2215_NewVisitTab
When(/^the user clicks on "(.*?)" tab$/) do |arg1|
  con = Visit.instance
  expect(con.static_dom_element_exists?(arg1)).to be_true
  expect(con.perform_action(arg1)).to be_true
end

When(/^the user clicks on "(.*?)" text box$/) do |textboxname|
  con = Visit.instance
  driver = TestSupport.driver
  con.perform_action(textboxname)
end

Given(/^user type search text term and the page contains total items and search results$/) do |table|
  #p table.rows.length
  table.rows.each do |tablevalue|
    #p tablevalue[0]
    con = Visit.instance
    driver = TestSupport.driver
    #con.wait_until_action_element_visible("Visit Location", 60)
    #expect(con.static_dom_element_exists?("Visit Location")).to be_true
    con.perform_action("Visit Location", tablevalue[0])
    sleep 5
    seconds = driver.find_elements(:css, "#location-typeahead-list .list-group-item")
    #p seconds.length
    sleep 5
    expect(seconds.length.to_s).to eq(tablevalue[1])
  end
end

When(/^the user selects "(.*?)" from the results$/) do |result_item|
  con = Visit.instance
  driver = TestSupport.driver
  con.perform_action("Visit Location", "DIA")
  sleep 5
  #con.wait_until_action_element_visible("DIABETICRESULT", 60)
  #expect(con.static_dom_element_exists?("DIABETICRESULT")).to be_true
  #con.perform_action(result_item)
  con.wait_until_action_element_visible(result_item, 20)
  expect(con.static_dom_element_exists?(result_item)).to be_true
  con.perform_action(result_item, "")
end

Then(/^"(.*?)" should be populated in Encounter Location field$/) do |selected_item|
  con = Visit.instance
  expect(con.perform_verification("Encounter Location", selected_item)).to be_true
end

Then(/^the New Visit tab contains text "(.*?)"$/) do |label|
  con = Visit.instance
  expect(con.perform_verification("HistoricalVisitText", label)).to be_true
end

Then(/^DateTime of Visit should display today's Date and current Time$/) do
  con = Visit.instance
  currentdt = Time.now
  dt = currentdt.strftime("%Y-%m-%d %I:%M%P")
  puts "This is dt: #{dt}"
  dt.chop!
  datetime = dt.split(" ")
  date = datetime[0]
  d = date.split("-")
  displaydate =d[1]+"/"+d[2]+"/"+d[0]
  displaydate = displaydate.strip
  driver = TestSupport.driver
  date_ui= driver.find_element(:id, "dp-visit").attribute('value')
  date_ui = date_ui.strip
  expect(displaydate).to eq(date_ui)
  Time_ui= driver.find_element(:id, "tp-visit").attribute('value')
  Time_ui = Time_ui.strip
  #expect(Time_UI).to eq(datetime[1])
  #expect(con.perform_verification(x, displaydate)).to be_true
  #expect(con.perform_verification("Timevalue", datetime[1])).to be_true
end

Then(/^if user is provider then it displays in Encounter Provider field$/) do
  user = "USER,PANORAMA"
  con = Visit.instance
  driver = TestSupport.driver
  value = driver.find_element(:xpath, "//*[@id='provider']").attribute('value')
  puts "value is: #{value}"
  expect(value).to eq(user)
end

Given(/^user is logged into eHMP\-UI with non\-provider user$/) do
  TestSupport.navigate_to_url(DefaultLogin.ehmpui_url + "/#patient-search-screen")
  TestSupport.driver.manage.window.maximize
  wait_until_dom_has_signin_or_signout
  login_elements = LoginHTMLElements.instance
  if login_elements.static_dom_element_exists?("Signout")
    perform_signout_steps login_elements
  end
  #expect(login_elements.static_dom_element_exists?"Facility").to be_true
  #login_elements.wait_until_action_element_visible("Facility", 30)
  expect(login_elements.static_dom_element_exists?("Facility")).to be_true
  expect(login_elements.perform_action("Facility", DefaultLogin.default_facility_name)).to be_true
  expect(login_elements.perform_action("AccessCode", "bsl123")).to be_true
  expect(login_elements.perform_action("VerifyCode", "storm.11")).to be_true
  expect(login_elements.perform_action("SignIn", "")).to be_true
  login_elements.wait_until_element_present('Signout')
end

Then(/^if user is provider then it does not display in Encounter Provider field$/) do
  con = Visit.instance
  driver = TestSupport.driver
  value = driver.find_element(:xpath, "//*[@id='provider']").attribute('value')
  puts "value is: #{value}"
  expect(value).to eq("")
end


